import test from "node:test";
import assert from "node:assert/strict";
import { loadDbProfile } from "./loadDbProfile.js";

const currentUser = { uid: "user-1", email: "person@example.test" };

for (const [label, status] of [["403", 403], ["404", 404], ["500", 500], ["network failure", null]]) {
  test(`successful Firebase login followed by profile ${label} preserves authentication`, async () => {
    const auth = { currentUser };
    const values = [];
    const client = { get: async () => { throw Object.assign(new Error("profile unavailable"), status ? { response: { status } } : {}); } };
    const profile = await loadDbProfile({ client, currentUser, auth, setDbUser: (value) => values.push(value) });
    assert.equal(profile, null);
    assert.equal(auth.currentUser, currentUser);
    assert.deepEqual(values, [null]);
  });
}

test("successful Firebase login followed by profile success stores the database profile", async () => {
  const profile = { email: currentUser.email, role: "merchant" };
  const values = [];
  const result = await loadDbProfile({
    client: { get: async () => ({ data: profile }) },
    currentUser,
    auth: { currentUser },
    setDbUser: (value) => values.push(value),
  });
  assert.equal(result, profile);
  assert.deepEqual(values, [profile]);
});

test("failed profile loading can be retried successfully", async () => {
  let attempt = 0;
  const values = [];
  const client = { get: async () => {
    attempt += 1;
    if (attempt === 1) throw new Error("temporary backend failure");
    return { data: { role: "merchant" } };
  } };
  const context = { client, currentUser, auth: { currentUser }, setDbUser: (value) => values.push(value) };
  assert.equal(await loadDbProfile(context), null);
  assert.deepEqual(await loadDbProfile(context), { role: "merchant" });
  assert.equal(attempt, 2);
  assert.deepEqual(values, [null, { role: "merchant" }]);
});

test("does not apply a stale profile response after Firebase user changes", async () => {
  const values = [];
  await loadDbProfile({
    client: { get: async () => ({ data: { role: "merchant" } }) },
    currentUser,
    auth: { currentUser: { uid: "different-user" } },
    setDbUser: (value) => values.push(value),
  });
  assert.deepEqual(values, []);
});
