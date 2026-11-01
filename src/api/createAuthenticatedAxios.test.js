import test from "node:test";
import assert from "node:assert/strict";
import axios from "axios";
import { createAuthenticatedAxios } from "./createAuthenticatedAxios.js";

const makeAuth = (getIdToken = async () => "id-token") => {
  const user = { uid: "u1", email: "merchant@example.test", getIdToken };
  const auth = { currentUser: user };
  let signOutCount = 0;
  return { auth, user, signOut: async () => { signOutCount += 1; auth.currentUser = null; }, get signOutCount() { return signOutCount; } };
};

const makeClient = (state) => createAuthenticatedAxios({
  axios,
  auth: state.auth,
  signOut: state.signOut,
  baseURL: "http://api.test",
});

test("adds a fresh Firebase ID token when an authenticated request is made", async () => {
  const state = makeAuth(async () => "fresh-token");
  const client = makeClient(state);
  client.defaults.adapter = async (config) => ({ status: 200, data: config.headers.get("Authorization"), config });
  const response = await client.get("/protected");
  assert.equal(response.data, "Bearer fresh-token");
  assert.equal(state.signOutCount, 0);
});

test("supports public requests with no user or explicit auth opt-out", async () => {
  const state = makeAuth();
  state.auth.currentUser = null;
  const client = makeClient(state);
  client.defaults.adapter = async (config) => ({ status: 200, data: config.headers.get("Authorization") || null, config });
  assert.equal((await client.get("/public")).data, null);
  state.auth.currentUser = state.user;
  assert.equal((await client.get("/public", { skipFirebaseAuth: true })).data, null);
});

test("preserves a caller-supplied Authorization header", async () => {
  const state = makeAuth(async () => "unused-token");
  const client = makeClient(state);
  client.defaults.adapter = async (config) => ({ status: 200, data: config.headers.get("Authorization"), config });
  assert.equal((await client.get("/provided", { headers: { Authorization: "Bearer supplied" } })).data, "Bearer supplied");
});

test("refreshes an expired token and retries a 401 only once", async () => {
  let regularCalls = 0;
  let forcedCalls = 0;
  const state = makeAuth(async (force) => {
    if (force) { forcedCalls += 1; return "refreshed-token"; }
    regularCalls += 1;
    return "expired-token";
  });
  const client = makeClient(state);
  let adapterCalls = 0;
  client.defaults.adapter = async (config) => {
    adapterCalls += 1;
    if (config.headers.get("Authorization") === "Bearer expired-token") {
      throw Object.assign(new Error("unauthorized"), { config, response: { status: 401, config } });
    }
    return { status: 200, data: config.headers.get("Authorization"), config };
  };
  const response = await client.get("/protected");
  assert.equal(response.data, "Bearer refreshed-token");
  assert.equal(regularCalls, 1);
  assert.equal(forcedCalls, 1);
  assert.equal(adapterCalls, 2);
  assert.equal(state.signOutCount, 0);
});

test("does not sign out on 403, 404, 500, or network failure", async (t) => {
  for (const failure of [
    { response: { status: 403 } },
    { response: { status: 404 } },
    { response: { status: 500 } },
    {},
  ]) {
    await t.test(failure.response?.status || "network", async () => {
      const state = makeAuth();
      const client = makeClient(state);
      client.defaults.adapter = async (config) => { throw Object.assign(new Error("request failed"), { config, ...failure }); };
      await assert.rejects(client.get("/request"));
      assert.equal(state.signOutCount, 0);
    });
  }
});

test("coalesces concurrent 401 refreshes", async () => {
  let forcedCalls = 0;
  const state = makeAuth(async (force) => {
    if (force) {
      forcedCalls += 1;
      await new Promise((resolve) => setTimeout(resolve, 10));
      return "shared-refreshed-token";
    }
    return "expired-token";
  });
  const client = makeClient(state);
  client.defaults.adapter = async (config) => {
    if (config.headers.get("Authorization") === "Bearer expired-token") {
      throw Object.assign(new Error("unauthorized"), { config, response: { status: 401, config } });
    }
    return { status: 200, data: "ok", config };
  };
  await Promise.all([client.get("/one"), client.get("/two"), client.get("/three")]);
  assert.equal(forcedCalls, 1);
  assert.equal(state.signOutCount, 0);
});

test("signs out only after a refreshed token is rejected with 401", async () => {
  const state = makeAuth(async (force) => force ? "still-rejected" : "expired-token");
  const client = makeClient(state);
  client.defaults.adapter = async (config) => {
    throw Object.assign(new Error("unauthorized"), { config, response: { status: 401, config } });
  };
  await assert.rejects(client.get("/protected"));
  assert.equal(state.signOutCount, 1);
});

test("signs out when Firebase confirms the user token is invalid", async () => {
  const state = makeAuth(async (force) => {
    if (force) throw Object.assign(new Error("invalid user token"), { code: "auth/invalid-user-token" });
    return "expired-token";
  });
  const client = makeClient(state);
  client.defaults.adapter = async (config) => {
    throw Object.assign(new Error("unauthorized"), { config, response: { status: 401, config } });
  };
  await assert.rejects(client.get("/protected"));
  assert.equal(state.signOutCount, 1);
});

test("does not sign out when forced refresh fails because Firebase is temporarily unavailable", async () => {
  const state = makeAuth(async (force) => {
    if (force) throw Object.assign(new Error("temporary network failure"), { code: "auth/network-request-failed" });
    return "expired-token";
  });
  const client = makeClient(state);
  client.defaults.adapter = async (config) => {
    throw Object.assign(new Error("unauthorized"), { config, response: { status: 401, config } });
  };
  await assert.rejects(client.get("/protected"));
  assert.equal(state.signOutCount, 0);
  assert.ok(state.auth.currentUser);
});

test("installs one request and one response interceptor per shared client", () => {
  const client = makeClient(makeAuth());
  assert.equal(client.interceptors.request.handlers.filter(Boolean).length, 1);
  assert.equal(client.interceptors.response.handlers.filter(Boolean).length, 1);
});
