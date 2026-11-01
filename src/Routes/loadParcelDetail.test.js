import test from "node:test";
import assert from "node:assert/strict";
import axios from "axios";
import { createAuthenticatedAxios } from "../api/createAuthenticatedAxios.js";
import { loadParcelDetail } from "./loadParcelDetail.js";

const makeAuth = (user) => ({
  currentUser: user,
  authStateReady: async () => undefined,
});

test("waits for Firebase initialization and loads an authorized merchant parcel", async () => {
  const parcel = { _id: "parcel-1", trackingID: "TC-123", senderInfo: { email: "merchant@example.test" } };
  let initialized = false;
  const auth = {
    currentUser: { uid: "merchant", email: "merchant@example.test", getIdToken: async () => "merchant-token" },
    authStateReady: async () => { await new Promise((resolve) => setTimeout(resolve, 5)); initialized = true; },
  };
  const client = createAuthenticatedAxios({ axios, auth, signOut: async () => {}, baseURL: "http://api.test" });
  client.defaults.adapter = async (config) => {
    assert.equal(initialized, true);
    assert.equal(config.url, "/parcel/parcel-1");
    assert.equal(config.headers.get("Authorization"), "Bearer merchant-token");
    return { status: 200, data: parcel, config };
  };

  assert.deepEqual(await loadParcelDetail({ parcelId: "parcel-1", auth, apiClient: client }), parcel);
});

test("redirects to login after Firebase initializes without a user", async () => {
  let initialized = false;
  const auth = { currentUser: null, authStateReady: async () => { initialized = true; } };
  const apiClient = { get: async () => assert.fail("must not request without a user") };
  await assert.rejects(loadParcelDetail({ parcelId: "parcel-1", auth, apiClient }), (error) => {
    assert.equal(initialized, true);
    assert.equal(error.status, 302);
    assert.equal(error.headers.get("Location"), "/auth/login");
    return true;
  });
});

test("renders a 403 route error for a different merchant without signing out", async () => {
  const auth = makeAuth({ uid: "other-merchant", email: "other@example.test", getIdToken: async () => "other-token" });
  let signOutCount = 0;
  const client = createAuthenticatedAxios({ axios, auth, signOut: async () => { signOutCount += 1; }, baseURL: "http://api.test" });
  client.defaults.adapter = async (config) => {
    assert.equal(config.headers.get("Authorization"), "Bearer other-token");
    throw Object.assign(new Error("Forbidden"), { config, response: { status: 403, data: { message: "Forbidden" }, config } });
  };
  await assert.rejects(loadParcelDetail({ parcelId: "parcel-1", auth, apiClient: client }), (error) => error.status === 403);
  assert.equal(signOutCount, 0);
  assert.ok(auth.currentUser);
});

test("maps a null parcel response to not found", async () => {
  const auth = makeAuth({ uid: "merchant", email: "merchant@example.test", getIdToken: async () => "token" });
  await assert.rejects(loadParcelDetail({
    parcelId: "missing",
    auth,
    apiClient: { get: async () => ({ data: null }) },
  }), (error) => error.status === 404);
});

test("preserves backend 401 and 404 and provides 500/network route states", async (t) => {
  const auth = makeAuth({ uid: "merchant", email: "merchant@example.test", getIdToken: async () => "token" });
  const cases = [
    [401, 401],
    [403, 403],
    [404, 404],
    [500, 500],
    [null, 503],
  ];
  for (const [backendStatus, routeStatus] of cases) {
    await t.test(`${backendStatus ?? "network"} becomes route status ${routeStatus}`, async () => {
      const apiClient = { get: async () => {
        throw Object.assign(new Error("request failed"), backendStatus ? { response: { status: backendStatus } } : {});
      } };
      await assert.rejects(loadParcelDetail({ parcelId: "parcel-1", auth, apiClient }), (error) => error.status === routeStatus);
    });
  }
});
