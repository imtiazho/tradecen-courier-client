import { redirect } from "react-router";

const routeError = (status, message) =>
  new Response(message, { status, statusText: message });

export async function loadParcelDetail({ parcelId, auth, apiClient }) {
  await auth.authStateReady();
  if (!auth.currentUser) throw redirect("/auth/login");

  try {
    const response = await apiClient.get(`/parcel/${encodeURIComponent(parcelId)}`);
    if (response.data == null) {
      throw routeError(404, "Parcel not found");
    }
    return response.data;
  } catch (error) {
    if (error instanceof Response) throw error;

    const status = error.response?.status;
    if (status === 401 || status === 403 || status === 404) {
      throw routeError(status, error.response?.data?.message || "Parcel request failed");
    }
    if (status >= 500) {
      throw routeError(500, "Parcel service error");
    }
    if (status) {
      throw routeError(status, "Parcel request failed");
    }
    throw routeError(503, "Parcel service unavailable");
  }
}
