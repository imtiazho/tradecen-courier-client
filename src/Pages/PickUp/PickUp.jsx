import React from "react";
import useAuth from "../../Hooks/useAuth";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import LoadingModal from "../../Components/LoadingModal/LoadingModal";
import { MdOutlineDoubleArrow } from "react-icons/md";
import DynamicTitle from "../../Components/DynamicTitle/DynamicTitle";

const PickUp = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  // 1. Fetch Manager Data
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

  // 2. Fetch Pickup Parcels Data
  const {
    isLoading: pickUpsLoading,
    data: pickUpsData = [],
    refetch: refetchPickups,
  } = useQuery({
    queryKey: ["pickUpsData", managerData?.hubName], 
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/parcels/pickups/${managerData.hubName}`,
      );
      return Array.isArray(res.data) ? res.data : [];
    },
    
    enabled: !!managerData?.hubName && !!user && !!user?.accessToken,
  });

  // Action Handle: When Rider brings parcel to hub
  const handleConfirmPickupReceived = async (id) => {
    try {
      const res = await axiosSecure.patch(`/parcels/origin-hub/received/${id}`);
      if (res.data.success) {
        Swal.fire({
          title: "Success!",
          text: "Parcel received at hub and ready for sorting.",
          icon: "success",
          confirmButtonColor: "#002B36",
        });
        refetchPickups();
      }
    } catch (error) {
      Swal.fire("Error", "Failed to confirm pickup reception", "error");
    }
  };

  if (managerLoading || pickUpsLoading) {
    return <LoadingModal isLoading={true} />;
  }
  
  return (
    <div className="p-4 md:p-8 bg-[#ffffff] rounded-tradecen min-h-screen font-sans">
      <DynamicTitle title="Dashboard | Pickups" />
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-[#002B36] tracking-wide">
            Pickup Tasks
          </h2>
          <p className="text-sm text-gray-500 mt-1 font-medium">
            Track active rider pickups and confirm hub reception.
          </p>
        </div>
        <div className="flex items-center gap-3 bg-[#CAEB66]/20 px-4 py-2 rounded-full border border-[#CAEB66]">
          <div className="w-2 h-2 bg-[#002B36] rounded-full animate-pulse"></div>
          <span className="text-[#002B36] font-bold text-sm uppercase tracking-wider">
            {managerData?.hubName} Hub Operations
          </span>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="overflow-x-auto w-full">
        <table className="w-full text-left border-separate border-spacing-y-3">
          <thead>
            <tr className="text-[#ADB5BD] text-[11px] uppercase tracking-widest font-black">
              <th className="px-6 py-3">Tracking ID</th>
              <th className="px-6 py-3">Parcel Info</th>
              <th className="px-6 py-3">Assigned Rider</th>
              <th className="px-6 py-3">Route (Sender → Hub)</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3 text-right pr-12">Action</th>
            </tr>
          </thead>
          <tbody>
            {pickUpsData?.map((parcel) => (
              <tr
                key={parcel._id}
                className="bg-[#FFFFFF] hover:bg-[#F8F9FA]/60 transition-all group text-left"
              >
                {/* Tracking ID */}
                <td className="px-6 py-5 rounded-l-[16px]">
                  <span className="bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-lg font-mono font-black text-gray-500 text-xs tracking-tighter uppercase group-hover:bg-[#02312A]/5 group-hover:text-[#02312A] transition-all">
                    #{parcel.trackingID}
                  </span>
                </td>

                {/* Parcel Info */}
                <td className="px-6 py-5 text-xs text-[#02312A]">
                  <div className="flex flex-col items-start">
                    <span className="font-black text-sm text-[#02312A]">
                      {parcel.parcelName?.length > 18
                        ? parcel.parcelName.slice(0, 18) + "..."
                        : parcel.parcelName}
                    </span>
                    <span className="text-[#02312A] font-black bg-[#CAEB66]/10 border border-[#CAEB66]/20 px-1.5 py-0.5 rounded-md text-[9px] w-fit mt-1">
                      {parcel.parcelWeight} KG | {parcel.parcelType}
                    </span>
                  </div>
                </td>

                {/* Assigned Rider Info */}
                <td className="px-6 py-5 text-xs text-[#02312A]">
                  {parcel.pickupRider?.name ? (
                    <div className="flex flex-col items-start">
                      <p className="font-black text-[#02312A]">
                        {parcel.pickupRider.name}
                      </p>
                      <p className="text-[10px] text-gray-400 font-bold mt-0.5 tracking-wide">
                        {parcel.pickupRider.phone}
                      </p>
                    </div>
                  ) : (
                    <span className="text-red-400 font-bold italic text-[11px]">
                      Not Assigned
                    </span>
                  )}
                </td>

                {/* Route Details */}
                <td className="px-6 py-5 text-xs text-[#02312A]">
                  <div className="flex items-center gap-2 font-bold text-gray-500">
                    <span className="text-[#02312A] font-black">
                      {parcel.senderInfo?.area || "Sender"}
                    </span>
                    <MdOutlineDoubleArrow
                      className="text-[#CAEB66]"
                      size={14}
                    />
                    <span className="text-gray-400">
                      {managerData?.hubName} Hub
                    </span>
                  </div>
                </td>

                {/* Delivery Status */}
                <td className="px-6 py-5 text-xs text-[#02312A]">
                  <span
                    className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wide border inline-block w-fit ${
                      parcel.deliveryStatus === "assign-pickup-rider"
                        ? "bg-orange-50 text-orange-600 border-indigo-100 animate-pulse"
                        : " bg-indigo-50 text-indigo-600 border-orange-100"
                    }`}
                  >
                    {parcel.deliveryStatus === "assign-pickup-rider"
                      ? "Rider Picking Up"
                      : "Picked Up"}
                  </span>
                </td>

                {/* Actions */}
                <td className="px-6 py-5 rounded-r-[16px] pr-6">
                  <div className="flex justify-end pr-6 w-full">
                    <button
                      onClick={() => handleConfirmPickupReceived(parcel._id)}
                      className="w-full bg-[#CAEB66] text-[#02312A] border border-[#CAEB66]/20 px-3 py-2.5 rounded-md text-[10px] font-black uppercase tracking-wider hover:scale-[1.01] cursor-pointer transition-all"
                    >
                      Received at Hub
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Empty State */}
        {(!pickUpsData || pickUpsData.length === 0) && (
          <div className="py-20 text-center bg-white rounded-[24px] border border-dashed border-gray-100 mt-2">
            <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100 text-lg">
              🚴
            </div>
            <p className="text-gray-400 font-black uppercase tracking-widest text-xs">
              No active pickups right now
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PickUp;
