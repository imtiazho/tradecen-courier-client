import { isRouteErrorResponse, useRouteError } from "react-router";

const ParcelDetailError = () => {
  const error = useRouteError();
  const status = isRouteErrorResponse(error) ? error.status : 500;
  const message =
    status === 401
      ? "Your session could not be verified. Please sign in again."
      : status === 403
        ? "You do not have permission to view this parcel."
        : status === 404
          ? "This parcel could not be found."
          : status === 503
            ? "The parcel service is unavailable. Check your connection and try again."
            : "The parcel could not be loaded. Please try again later.";

  return (
    <div className="rounded-tradecen bg-white p-8 text-center shadow-flat">
      <h2 className="text-xl font-black text-[#02312A]">Unable to load parcel</h2>
      <p className="mt-2 text-sm text-gray-600">{message}</p>
    </div>
  );
};

export default ParcelDetailError;
