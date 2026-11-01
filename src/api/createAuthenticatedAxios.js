const INVALID_SESSION_CODES = new Set([
  "auth/user-disabled",
  "auth/user-token-expired",
  "auth/invalid-user-token",
  "auth/invalid-id-token",
]);

const hasAuthorizationHeader = (headers) => {
  if (!headers) return false;
  if (typeof headers.has === "function") return headers.has("Authorization");
  return Object.keys(headers).some((key) => key.toLowerCase() === "authorization");
};

const setAuthorizationHeader = (config, token) => {
  config.headers = config.headers || {};
  if (typeof config.headers.set === "function") {
    config.headers.set("Authorization", `Bearer ${token}`);
  } else {
    config.headers.Authorization = `Bearer ${token}`;
  }
};

export function createAuthenticatedAxios({ axios, auth, signOut, baseURL, onInvalidSession }) {
  const client = axios.create({ baseURL });
  let refreshPromise = null;
  let signOutPromise = null;

  const signOutForInvalidSession = async () => {
    if (!auth.currentUser) return;
    if (!signOutPromise) {
      signOutPromise = Promise.resolve(signOut(auth))
        .catch(() => undefined)
        .finally(() => {
          signOutPromise = null;
        });
    }
    await signOutPromise;
    onInvalidSession?.();
  };

  client.interceptors.request.use(async (config) => {
    if (config.skipFirebaseAuth) return config;
    const currentUser = auth.currentUser;
    if (!currentUser) return config;

    config._firebaseUid = currentUser.uid;
    if (config._firebaseManagedAuth === undefined) {
      config._firebaseManagedAuth = !hasAuthorizationHeader(config.headers);
    }
    if (!config._firebaseManagedAuth || config._firebaseRefreshed) return config;

    const token = await currentUser.getIdToken();
    if (token) setAuthorizationHeader(config, token);
    return config;
  });

  client.interceptors.response.use(
    (response) => response,
    async (error) => {
      const config = error.config;
      if (error.response?.status !== 401 || !config || config.skipFirebaseAuth || config._firebaseManagedAuth === false) {
        return Promise.reject(error);
      }

      if (config._authRetry) {
        if (config._firebaseRefreshed) await signOutForInvalidSession();
        return Promise.reject(error);
      }

      const currentUser = auth.currentUser;
      if (!currentUser || currentUser.uid !== config._firebaseUid) {
        return Promise.reject(error);
      }

      config._authRetry = true;
      try {
        if (!refreshPromise) {
          refreshPromise = currentUser.getIdToken(true).finally(() => {
            refreshPromise = null;
          });
        }
        const refreshedToken = await refreshPromise;
        if (!refreshedToken) throw new Error("Firebase returned no refreshed token");
        config._firebaseRefreshed = true;
        setAuthorizationHeader(config, refreshedToken);
        return client.request(config);
      } catch (refreshError) {
        const code = refreshError?.code;
        if (code && INVALID_SESSION_CODES.has(code)) {
          await signOutForInvalidSession();
        }
        return Promise.reject(error);
      }
    },
  );

  return client;
}
