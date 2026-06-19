import React from "react";
import { FaTruckLoading, FaMapMarkerAlt, FaUserTie } from "react-icons/fa";
import useAuth from "../../Hooks/useAuth";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import LoadingModal from "../../Components/LoadingModal/LoadingModal";
import Swal from "sweetalert2";

const DisPatch = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const { isLoading: managerLoading, data: managerData = {} } = useQuery({
    queryKey: ["managerData", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/users/hub-managers?email=${user.email}`,
      );
      return Array.isArray(res.data) && res.data.length > 0
        ? res.data[0]
        : res.data;
    },
    enabled: !!user && !!user?.accessToken,
  });
  const {
    isLoading: inHouseLoading,
    data: inHouse = [],
    refetch,
  } = useQuery({
    queryKey: ["inHouseData", managerData?.hubName],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/warehouse/sorting-house/${managerData?.hubName}`,
      );
      return res.data;
    },

    enabled: !!managerData?.hubName && !!user && !!user?.accessToken,
  });

  const handleSendToDestination = async (id) => {
    try {
      const res = await axiosSecure.patch(`/parcels/dispatch/${id}`);

      if (res.data.success) {
        Swal.fire({
          title: "Dispatched!",
          text: "Parcel is now in-transit.",
          icon: "success",
          confirmButtonColor: "#002B36",
        });
        refetch();
      }
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Failed to update status", "error");
    }
  };

  if (inHouseLoading || managerLoading)
    return <LoadingModal isLoading={true}></LoadingModal>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="text-gray-400 text-[11px] uppercase tracking-widest font-black">
            <th className="px-6 py-3">Parcel Details</th>
            <th className="px-6 py-3">Route (Origin-Dest)</th>
            <th className="px-6 py-3">Weight & COD</th>
            <th className="px-6 py-3 text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          {inHouse?.dispatchList?.map((parcel) => (
            <tr key={parcel._id} className="bg-white group hover:bg-[#F8F9FA]/60 transition-bg duration-300">
              {/* Parcel Details */}
              <td className="px-6 py-4 rounded-l-2xl">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-[#002B36] bg-[#CAEB66] px-2 py-1 rounded-full w-fit mb-1">
                    {parcel.trackingID}
                  </span>
                  <span className="text-sm font-black text-slate-800 truncate max-w-[180px]">
                    {parcel.parcelName}
                  </span>
                  <span className="text-[11px] text-gray-400 flex items-center gap-1 mt-1">
                    <FaUserTie className="text-[10px]" />{" "}
                    {parcel.senderInfo.name}
                  </span>
                </div>
              </td>

              {/* Route Information */}
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                    <div className="w-0.5 h-6 border-l border-dashed border-gray-300"></div>
                    <div className="w-2 h-2 rounded-full bg-[#CAEB66]"></div>
                  </div>
                  <div className="flex flex-col text-[11px] font-bold text-slate-600 space-y-2.5">
                    <span>{parcel.senderInfo.area} (Origin)</span>
                    <span>{parcel.receiverInfo.area} (Dest)</span>
                  </div>
                </div>
              </td>

              {/* Weight & COD */}
              <td className="px-6 py-4">
                <div className="text-[11px] font-medium text-gray-500">
                  <p>
                    Weight:{" "}
                    <span className="text-slate-800 font-black">
                      {parcel.parcelWeight}kg
                    </span>
                  </p>
                  <p className="mt-1">
                    COD:{" "}
                    <span className="text-slate-800 font-black">
                      {parcel.codAmount} BDT
                    </span>
                  </p>
                </div>
              </td>

              {/* Action Button */}
              <td className="px-6 py-4 rounded-r-2xl text-center">
                <button
                  onClick={() => handleSendToDestination(parcel._id)}
                  className="inline-flex items-center gap-2 text-[#002B36] bg-[#CAEB66] px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wide cursor-pointer"
                >
                  <FaTruckLoading className="text-sm" />
                  Send to {parcel.receiverInfo.area}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {inHouse?.dispatchList?.length === 0 && (
        <div className="py-20 text-center bg-white rounded-[24px] border border-dashed border-gray-100 mt-2">
          <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100 text-lg">
            📦
          </div>
          <p className="text-gray-400 font-black uppercase tracking-widest text-xs">
            No parcels ready for dispatch!
          </p>
        </div>
      )}
    </div>
  );
};

export default DisPatch;
