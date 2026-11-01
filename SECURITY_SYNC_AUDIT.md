# TradeCen Courier frontend/backend security synchronization audit

**Audit date:** 2026-11-01  
**Scope:** Frontend source under `src/` compared with the sibling `tradecen-courier-server` routes, middleware and controllers. Read-only audit; no frontend files were changed. The report itself is new.

## Executive summary

Several core merchant flows match the backend routes, and merchant parcel queries/deletion now have Firebase, merchant-role, owner and parcel-owner checks in the server. The frontend still has authentication synchronization defects: its Axios interceptor uses a potentially stale `accessToken`, reads the Axios error status from the wrong property, and logs users out for ordinary `403` authorization failures. A route loader bypasses the secure Axios client. Profile editing currently only sends `displayName`, which is compatible, but its form must remain constrained to editable fields.

The highest payment risk is that checkout and verification endpoints in the inspected backend are intentionally unauthenticated. Checkout correctly derives amount from the stored parcel; verification checks Stripe session paid state and metadata. The frontend nevertheless treats any fulfilled verification response as success, including `{success:false}` for an unpaid session, and reports success from the redirect page without checking `success`. Do not interpret the redirect itself as proof of payment.

This sibling backend is not uniformly hardened: `riders.js` has many handlers with no Firebase middleware (some have middleware commented out), and payout/hub finance route protection is partial. Such gaps cannot be repaired by frontend token handling and are classified as backend contract/security gaps below.

## API contract inventory

In this section, “secure client” means `useAxiosSecure()` (base URL `http://localhost:5000`, Authorization header intended). Response structures come from actual server handlers; error shapes are inconsistent among routes.

| Frontend request(s) | Request contract / auth | Backend response and compatibility |
|---|---|---|
| `POST /users` from signup and Google login; body includes email/name/photo/role/onboarding/date | JSON; backend requires Firebase bearer token and owner email. Server discards client `role` and `isOnboarded`, derives email and role from verified token. | Mongo `insertOne` result or `{message:"User already exists"}`. Compatible as to route/body; callers inconsistently require `insertedId` and Google flow ignores errors/response. Signup should omit protected fields anyway. |
| `POST /merchants` | JSON merchant form includes display name, email, photo, business/location/contact fields and `role`; Firebase token + owner required. Server removes role and uses decoded email, then promotes database user. | Insert result or `{message:...}`. Compatible; omit client `role`. No approval rule should be inferred. |
| `GET /user/:email`, `GET /user/:email/role` | No body; Firebase token + owner. `AuthProvider` calls direct Axios with `currentUser.accessToken`; `useRole` uses secure client. | User profile projection or `{role}`; 404 JSON / generic 500. Route match compatible, but direct fetch token can be stale/absent. |
| `PATCH /users/update/:email` | JSON editable profile fields; Firebase + owner. Server strips `role`, `isOnboarded`, and `email`. | Mongo update result (`matchedCount`, `modifiedCount`). Profile page currently sends `{displayName}`; compatible. Do not add protected fields. |
| `PATCH /users/verify-status/:email` | Current frontend sends `{isVerified:true}`; Firebase + owner. Server ignores body and sets `isOnboarded:true`. | Mongo update result. Endpoint works, but naming/body and displayed status semantics do not align: frontend calls this email verification but UI reports “Verified” based on onboarding. |
| `GET /merchant/:email`, `PATCH /merchant-update/:email` | Firebase + merchant role + owner. Store settings currently PATCHes a form object; server strips email and role. | GET merchant document; PATCH success message or 404 if no modified row. Compatible if body only contains editable merchant attributes. Cache must be refreshed after update. |
| `GET /parcels?email&skip&limit[&filter&status]` | Firebase + merchant role + owner. Server uses query email and returns `{count,data}`. | Compatible; query key includes email/page. Deletion should not include caller email as authorization; backend uses verified owner. |
| `POST /parcels` | Parcel JSON; Firebase + merchant role + owner + `senderInfo.email` must equal token email. | Mongo insert result. SendParcel currently builds sender info from signed-in identity; confirm `senderInfo.email` is present and matches exactly. Server computes/accepts parcel data beyond security ownership; no server price conclusion for parcel creation made here. |
| `GET /parcels/unpaid/:email`, `DELETE /parcel/:id` | Firebase + merchant role + owner; unpaid returns `{success,totalDue,count,data}`. Delete also verifies parcel sender ownership. | Compatible paths. Delete accepts no body; frontend’s extra `?email=` is ignored. UI uses `refetch()` instead of invalidating the matching query key. |
| `GET /parcel/:parcelID` via route loader at `router.jsx:199` | Backend requires Firebase + merchant role and verifies parcel owner. Loader uses raw `fetch` with no bearer token. | Incompatible: protected request is unauthenticated and will fail. Must use auth-aware request after user state is available. |
| `GET /tracking/:id` | Public in backend, no token; returns `{success,result}` or `{success,source,result}`. | Compatible if consumer reads `result`; inspect consumer for its data shape. Errors are HTTP 500 JSON. |
| `POST /send-otp`, `/verify-otp`, `/reset-password` | Public JSON APIs. Send `{email}`; verify `{email,otp}` where OTP is six digits; reset `{email,newPassword}` after backend-side verified-OTP state. Backend cooldown 60s, TTL 5min, max 5 bad attempts, one-time verified state. | Success `{success:true,message}`; failures use HTTP statuses 400/404/429/500 and `{error}`. Payloads and happy-path handling align. Resend has no UI cooldown/countdown, no duplicate-submit lock; verify only disables submit while loading and not resend. Request email UI is safe, but raw email is displayed (not an OTP secret). |
| `POST /payment-checkout` | Current body sends parcel ID, client charge, sender email, parcel name, tracking ID. Backend only requires valid `parcelId`, fetches parcel/charge/customer data itself; no Firebase auth middleware. | `{url}`; server-calculated price makes the extra client fields unnecessary/ignored. Frontend should send only `{parcelId}`. |
| `PATCH /verify-payment?session_id=...` | Backend retrieves Stripe session and verifies payment status, currency, amount, customer and tracking metadata; no Firebase auth middleware. | Created/existing payment returns transaction fields (created includes `success:true`; existing response may omit it); unpaid returns `{success:false}` with HTTP 200; mismatch/error gives non-2xx JSON. Success page treats *any* 2xx as success and fires confetti, so unpaid response is incorrectly shown as captured. Repeated calls are DB-idempotent by transaction ID but frontend may submit repeatedly (effect can rerun). |
| Other dashboard requests | Frontend has many calls for riders, hub parcels/finance, payouts, merchants, and admins. Route paths/methods are present across `routes/*.js`; examples include `GET/PATCH /rider/:email`, `GET /riders?...`, `PATCH /riders/*/update`, hub parcel `GET /parcels/{incoming,pickups,...}` and status mutations, payout summary/request/approval, and hub finance. | Query/body structures vary and handlers often return arrays, `{success,...}`, or Mongo results. Security middleware is incomplete in the inspected backend: multiple `riders.js` routes have no `verifyFireBaseToken`, `payouts.js` protects only selected routes, `hub-finance.js` includes public handlers. Before claiming “all protected routes,” review server route middleware and route-by-route permissions. Frontend Authorization cannot compensate for a missing backend check. |

### Auth behavior verified from implementation

- `useAxiosSecure.jsx` attaches `user.accessToken` as Bearer, but Firebase `User.accessToken` is a cached property; call `await user.getIdToken()` when constructing each request so Firebase can refresh an expired token. Do this in one shared interceptor, not in every component.
- Axios failures expose status at `err.response?.status`; current `err.status` check misses 401/403. The handler also treats 403 as expired session, forcing logout for a valid signed-in user lacking a role. Only 401 should trigger reauthentication; 403 should show an authorization error.
- `AuthProvider` loads profile with standalone Axios, not the secure client, and obtains token from `currentUser.accessToken`. `onAuthStateChanged` sets user and waits profile request, but login handlers navigate immediately and user/profile synchronization relies on the auth callback. Logout clears user/dbUser only when callback runs.
- The shared Axios instance has per-hook interceptor registration/ejection. Multiple hook consumers can temporarily install multiple interceptors; consolidate to one stable client/interceptor or otherwise guarantee exactly one active auth interceptor.
- `router.jsx` has a direct protected parcel `fetch` without token. Other static warehouse fetches are public assets and need no token.

## Findings by severity

### Critical

1. **Payment redirect can display unpaid payment as successful** — `src/Pages/PaymentSuccess/PaymentSuccess.jsx`. Any HTTP 200 sets `paymentInfo` and triggers confetti, but backend returns HTTP 200 `{success:false}` when Stripe session is unpaid. Require a verified success shape (and account for existing-payment response, which lacks `success`) before rendering success; show pending/failed state otherwise. Guard against duplicate verification and prevent repeated effects from issuing multiple calls. Backend transaction idempotency helps, but the frontend must not imply payment success from navigation or arbitrary 2xx.
2. **Protected parcel detail loader omits Firebase token** — `src/Routes/router.jsx:199`. Server route `/parcel/:parcelID` requires Firebase, merchant role, and parcel ownership. Raw `fetch` cannot satisfy contract; protected parcel detail load fails or handles auth inconsistently.
3. **Server route-level protection remains incomplete for rider/finance/payout APIs** — observed in sibling backend `src/routes/riders.js`, `payouts.js`, and `hub-finance.js`. Several frontend requests call these APIs with a token, but several handlers have no middleware at all. Token transmission is not enforcement. Close backend gaps before treating this security synchronization as complete.

### High

4. **Expired Firebase token not reliably refreshed** — `src/Hooks/useAxiosSecure.jsx` and `src/Context/AuthProvider.jsx`. Requests use cached `accessToken`; user profile fetch bypasses shared client. Use `getIdToken()` centrally and route profile loading through the same path.
5. **401/403 response handler is ineffective and overbroad** — `useAxiosSecure.jsx`: reads `err.status`, so Axios errors usually bypass it; if corrected as-is, logging out on 403 would also eject users denied by role/ownership. Check `err.response.status`, refresh/retry at most once for 401 if needed, and treat 403 as authorization failure.
6. **Checkout request transmits unnecessary client-controlled price/customer fields** — `src/Pages/UnpaidParcels/UnpaidParcels.jsx`. Backend currently ignores these and computes from stored parcel; narrow body to `{parcelId}` to match trusted source of truth and avoid a future accidental reliance.
7. **Profile/form protected-field boundary** — `ProfilePage.jsx` currently submits only `displayName`, which is good. Keep email, role and onboarding status out of editable form values and payload. Merchant registration currently includes `role:"merchant"`; backend strips/overrides it correctly but frontend should omit it.

### Medium

8. **OTP resend does not implement visible cooldown or prevent duplicate sends** — `OTPVerify.jsx`; backend returns 429 during 60-second cooldown. Add timer/disabled state based on successful request, handle the actual error body/status, and lock resend while pending. `ForgetPassword.jsx` forgets to return after empty-email alert (native `required` mitigates normal form submission, but explicit guard should stop the request).
9. **OTP and reset error paths are status/body-dependent but failures are generalized** — `OTPVerify.jsx`, `ResetPassword.jsx`, `ForgetPassword.jsx`. They do parse `{error}` in some branches but do not check `response.ok`; malformed/non-JSON 500 responses throw into generic error. Present backend `error` messages (including cooldown/attempt-limit/expired) safely, without ever logging/rendering OTP values.
10. **Merchant profile React Query/cache synchronization is incomplete** — `StoreSettings.jsx` calls `refetch()` after update instead of invalidating or updating the shared merchant key; auth context `dbUser` may also be stale after role/profile changes. Backend invalidates its own cache, not React Query. Refresh merchant query and relevant auth DB profile when mutation succeeds.
11. **Mutation refreshes mostly use local `refetch()` and omit error paths** — parcel creation/deletion, rider/hub status actions, and payout flows. Existing query keys generally include user/email/hub identifiers, but local refetches miss related lists/stats (e.g. parcel list and unpaid totals after delete or payment). Invalidate only affected keys after a successful mutation; preserve unrelated stale-time behavior.
12. **Error responses are inconsistent** — backend handlers return `{message}`, `{error}`, `{success:false}`, raw Mongo results, and sometimes generic `Internal Server Error`; several frontend callsites only inspect one structure or lack catch/loading state (notably checkout, payment success, some registration/login paths). Normalize UI handling around HTTP status plus optional `message`/`error`, while avoiding server detail disclosure.
13. **Verification naming/response semantics diverge** — `VerifyEmail.jsx` sends `{isVerified:true}` but backend ignores this field and sets `isOnboarded`. The frontend then updates no local `dbUser` and renders onboarding status as email verification. Confirm the intended product meaning; avoid presenting merchant/user onboarding as Firebase email verification without an explicit backend contract.

### Low

14. **Extra email query parameter on parcel deletion** — `AllParcelsMerchant.jsx` sends `?email=` although ownership is established from token and DB parcel. It is ignored server-side and should be removed for contract clarity.
15. **API host is hardcoded to localhost** — secure client and direct requests use `http://localhost:5000`, preventing deployment from honoring environment-specific API origin and causing production contract failures. Use a Vite environment base URL consistently.

## React Query/state synchronization

- Merchant list and unpaid parcel keys include user email; all merchant parcels include email and page. Hub views generally key by manager hub. These are sensible scopes.
- `StoreSettings` and many mutation pages manually call `refetch()`. This refreshes only the current observer and does not cover other affected cached views such as merchant stats, unpaid totals, or payment state. Invalidate targeted keys for affected records after confirmed mutation success.
- Payment verification is outside React Query and has no in-flight guard; component effect can re-run and repeat the verification request. Server idempotency prevents duplicate payment records by transaction ID, but response semantics differ for first and subsequent calls.
- Auth context’s `dbUser` is a separate state cache with no standard invalidation after role/profile changes. Merchant registration calls `fetchDbUser`; profile edit only merges local data. Promote/update operations elsewhere can leave stale role state until a full auth callback/reload.
- Do not broadly alter stale times or cache defaults: fixes should target only related keys and current `dbUser` refresh points.

## Files to modify in a follow-up fix

- `src/Hooks/useAxiosSecure.jsx` — Firebase `getIdToken()`, correct Axios status access, distinguish 401 from 403, one centralized interceptor lifecycle, deployment base URL.
- `src/Context/AuthProvider.jsx` — use shared authenticated profile request/token refresh; clear and reload DB profile coherently on sign-in/out.
- `src/Routes/router.jsx` — authenticated parcel loader for `/parcel/:parcelID`.
- `src/Pages/PaymentSuccess/PaymentSuccess.jsx` — verify response result before success UI; loading/error/unpaid states and duplicate-call guard.
- `src/Pages/UnpaidParcels/UnpaidParcels.jsx` — checkout body `{parcelId}`, loading/error/duplicate-submit handling, targeted query invalidation after delete/payment completion.
- `src/Pages/ForgetPassword/ForgetPassword.jsx`, `src/Pages/ForgetPassword/OTPVerify.jsx`, `src/Pages/ForgetPassword/ResetPassword.jsx` — cooldown, in-flight guards, response status handling, empty-email early return.
- `src/Pages/ProfilePage/ProfilePage.jsx`, `src/Pages/StoreSettings/StoreSettings.jsx`, `src/Pages/MerchantRegistration/MerchantRegistration.jsx` — constrain payload fields, refresh dbUser/merchant query after success.
- `src/Pages/AllParcelsMerchant/AllParcelsMerchant.jsx` and other mutation components identified by `refetch()` — remove redundant email query and invalidate only related keys.
- `src/Pages/VerifyEmail/VerifyEmail.jsx` — align UI text/state with `/users/verify-status/:email` contract.
- Multiple rider, hub finance, payout and dashboard components — frontend error handling and targeted cache invalidation after server-side route middleware is confirmed/hardened.

## Recommendation

First align auth transport and the protected parcel loader, then correct payment result gating and trim checkout data. Add OTP cooldown/duplicate guards and targeted query/context refreshes. Separately complete a route-by-route backend middleware review for rider, payout and finance handlers; frontend changes alone cannot close those backend authorization gaps. No source files were modified during this audit.
