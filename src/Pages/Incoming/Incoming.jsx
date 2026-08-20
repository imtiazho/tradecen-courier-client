import React, { useState } from "react";
import useAuth from "../../Hooks/useAuth";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import LoadingModal from "../../Components/LoadingModal/LoadingModal";
import { MdPedalBike } from "react-icons/md";
import DynamicTitle from "../../Components/DynamicTitle/DynamicTitle";

const Incoming = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [selectedParcel, setSelectedParcel] = useState(null);

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
    isLoading: incomingLoading,
    data: incomingData = [],
    refetch: refetchParcels,
  } = useQuery({
    queryKey: ["inComingData", managerData?.hubName],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/parcels/incoming/${managerData?.hubName}`,
      );
      return res.data;
    },
    enabled: !!managerData?.hubName && !!user && !!user?.accessToken,
  });

  const { data: riders = [], refetch: refetchRiders } = useQuery({
    queryKey: ["availableRiders", managerData?.hubName],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/riders/available/${managerData?.hubName}`,
      );
      return res.data;
    },
    enabled: !!managerData?.hubName && !!user && !!user?.accessToken,
  });

  const handleAssignRider = async (rider) => {
    const assignInfo = {
      parcelId: selectedParcel._id,
      riderId: rider._id,
      riderName: rider.name,
      riderEmail: rider.email,
      riderPhone: rider.phone,
      trackingID: selectedParcel.trackingID,
    };

    try {
      const res = await axiosSecure.patch("/parcels/assign-rider", assignInfo);
      if (res.data.success) {
        document.getElementById("rider_modal").close();
        Swal.fire({
          title: "Success!",
          text: `Parcel assigned to ${rider.name} for pickup.`,
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
        refetchParcels();
        refetchRiders();
      }
    } catch (error) {
      document.getElementById("rider_modal").close();
      Swal.fire("Error", "Failed to assign rider", "error");
    }
  };

  const handleReceiveAtHub = async (id) => {
    try {
      const res = await axiosSecure.patch(`/parcels/dest-hub/received/${id}`);
      if (res.data.success) {
        Swal.fire({
          title: "Received!",
          text: "Parcel is now ready for local delivery.",
          icon: "success",
          confirmButtonColor: "#002B36",
        });
        refetchParcels();
      }
    } catch (error) {
      Swal.fire("Error", "Could not mark as received", "error");
    }
  };

  const handleReturnReceiveAtHub = async (id) => {
    try {
      const res = await axiosSecure.patch(
        `/parcels/return-origin-hub/received/${id}`,
      );

      if (res.data.success) {
        Swal.fire({
          title: "Return Received!",
          text: "Return parcel safely received at hub ledger and cleared from rider.",
          icon: "success",
          confirmButtonColor: "#002B36",
        });
        refetchParcels();
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.response?.data?.message || "Could not accept return parcel",
        icon: "error",
        confirmButtonColor: "#002B36",
      });
    }
  };

  if (managerLoading || incomingLoading) {
    return <LoadingModal isLoading={true} />;
  }

  return (
    <div className="p-4 md:p-8 bg-[#ffffff] rounded-tradecen min-h-screen font-sans">
      <DynamicTitle title="Dashboard | Incoming" />
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-[#002B36] tracking-wide">
            Incoming Parcels
          </h2>
          <p className="text-sm text-gray-500 mt-1 font-medium">
            Manage and track all parcels entering the hub.
          </p>
        </div>
        <div className="flex items-center gap-3 bg-[#CAEB66]/20 px-4 py-2 rounded-full border border-[#CAEB66]">
          <div className="w-2 h-2 bg-[#002B36] rounded-full animate-pulse"></div>
          <span className="text-[#002B36] font-bold text-sm uppercase tracking-wider">
            {managerData?.hubName} Hub Control
          </span>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="overflow-x-auto w-full">
        <table className="w-full text-left border-separate border-spacing-y-3">
          <thead>
            <tr className="text-[#ADB5BD] text-[11px] uppercase tracking-widest font-black">
              <th className="px-6 py-3">Tracking ID</th>
              <th className="px-6 py-3">Details</th>
              <th className="px-6 py-3">Sender</th>
              <th className="px-6 py-3">Specs</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3 text-right pr-12">Action</th>
            </tr>
          </thead>
          <tbody>
            {(Array.isArray(incomingData) ? incomingData : [])?.map(
              (parcel) => (
                <tr
                  key={parcel._id}
                  className="bg-[#FFFFFF] hover:bg-[#F8F9FA]/60 transition-all group text-left"
                >
                  <td className="px-6 py-5 rounded-l-[16px]">
                    <span className="bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-lg font-mono font-black text-gray-500 text-xs tracking-tighter uppercase group-hover:bg-[#02312A]/5 group-hover:text-[#02312A] transition-all">
                      #{parcel.trackingID}
                    </span>
                  </td>

                  <td className="px-6 py-5 text-xs text-[#02312A]">
                    <div className="flex flex-col items-start">
                      <span className="font-black text-sm text-[#02312A]">
                        {parcel.parcelName.length > 18
                          ? parcel.parcelName.slice(0, 18) + "..."
                          : parcel.parcelName}
                      </span>
                      <span className="text-[9px] uppercase font-black text-gray-400 mt-0.5 tracking-wider">
                        Dest: {parcel.receiverInfo?.area}
                      </span>
                    </div>
                  </td>

                  {/* Sender */}
                  <td className="px-6 py-5 text-xs text-[#02312A]">
                    <p className="font-black text-[#02312A]">
                      {parcel.senderInfo?.name}
                    </p>
                    <p className="text-[10px] text-gray-400 font-bold mt-0.5 tracking-wide">
                      {parcel.senderInfo?.phone}
                    </p>
                  </td>

                  <td className="px-6 py-5 text-xs text-[#02312A]">
                    <div className="flex flex-col items-start gap-1">
                      <span className="text-[#02312A] font-black bg-[#CAEB66]/10 border border-[#CAEB66]/20 px-1.5 py-0.5 rounded-md text-[9px] w-fit">
                        {parcel.parcelType}
                      </span>
                      <span className="text-xs font-black text-[#02312A]">
                        {parcel.parcelWeight}{" "}
                        <span className="text-[9px] text-gray-400 font-bold">
                          KG
                        </span>
                      </span>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-5 text-xs text-[#02312A]">
                    <span
                      className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wide border inline-block w-fit ${
                        parcel.deliveryStatus === "parcel-created"
                          ? "bg-orange-50 text-orange-600 border-orange-100"
                          : parcel.deliveryStatus === "assign-pickup-rider"
                            ? "bg-indigo-50 text-indigo-600 border-indigo-100"
                            : "bg-emerald-50 text-emerald-600 border-emerald-100"
                      }`}
                    >
                      {parcel.deliveryStatus === "parcel-created"
                        ? "Waiting Pickup"
                        : parcel.deliveryStatus === "assign-pickup-rider"
                          ? "Rider On Way"
                          : "In Transit"}
                    </span>
                  </td>
                          
                  <td className="px-6 py-5 rounded-r-[16px] pr-6">
                    <div className="flex justify-end pr-6 w-full">
                      {parcel.isReturnRequested === true ? (
                        <button
                          onClick={() => handleReturnReceiveAtHub(parcel._id)}
                          className="w-full max-w-[130px] bg-red-500 text-white border border-red-600 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider hover:bg-red-600 active:scale-95 cursor-pointer transition-all shadow-sm"
                        >
                          Receive Return
                        </button>
                      ) : managerData?.hubName === parcel.senderInfo?.area ? (
                        <button
                          disabled={parcel.deliveryStatus !== "parcel-created"}
                          className={`w-full max-w-[130px] py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all shadow-sm ${
                            parcel.deliveryStatus === "parcel-created"
                              ? "bg-[#CAEB66] text-[#02312A] border border-[#CAEB66]/20 hover:scale-[1.02] active:scale-95 cursor-pointer"
                              : "bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed font-medium rounded-[10px] transition-all duration-200 opacity-75 shadow-none"
                          }`}
                          onClick={() => {
                            setSelectedParcel(parcel);
                            document.getElementById("rider_modal").showModal();
                          }}
                        >
                          {parcel.deliveryStatus === "parcel-created"
                            ? "Assign Rider"
                            : "Assigned"}
                        </button>
                      ) : (
                        <button
                          onClick={() => handleReceiveAtHub(parcel._id)}
                          className="w-full max-w-[130px] bg-[#CAEB66] text-[#02312A] border border-[#CAEB66]/20 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider hover:scale-[1.02] active:scale-95 cursor-pointer transition-all"
                        >
                          Confirm Receive
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ),
            )}
          </tbody>
        </table>

        {(!incomingData || incomingData.length === 0) && (
          <div className="py-20 text-center bg-white rounded-[24px] border border-dashed border-gray-100 mt-2">
            <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100 text-lg">
              📦
            </div>
            <p className="text-gray-400 font-black uppercase tracking-widest text-xs">
              No incoming parcels found
            </p>
          </div>
        )}
      </div>

      {/* --- RIDER ASSIGN MODAL (Refined Design) --- */}
      <dialog
        id="rider_modal"
        className="modal modal-bottom sm:modal-middle backdrop-blur-sm"
      >
        <div className="modal-box p-0 rounded-tradecen border-none shadow-2xl overflow-hidden max-w-lg">
          <div className="bg-primary p-6 text-center relative">
            <form method="dialog">
              <button className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4 text-secondary hover:bg-black/20">
                ✕
              </button>
            </form>
            <div className="w-16 h-16 bg-secondary rounded-2xl mx-auto flex items-center justify-center text-2xl mb-3 shadow-lg transform rotate-3">
              <MdPedalBike size={30} className="text-white" />
            </div>
            <h3 className="font-black text-secondary text-xl uppercase tracking-tight">
              Assign Pickup
            </h3>
            <p className="text-[#CAEB66] text-xs font-bold opacity-80 uppercase tracking-widest mt-1">
              {selectedParcel?.trackingID}
            </p>
          </div>

          <div className="p-6 space-y-3 bg-white">
            <p className="text-[10px] uppercase font-black text-gray-400 mb-2">
              Available Riders ({riders.length})
            </p>
            {riders?.length > 0 ? (
              riders.map((rider) => (
                <div
                  key={rider._id}
                  className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl hover:bg-[#CAEB66]/10 transition-all border border-transparent hover:border-[#CAEB66]"
                >
                  <div>
                    <p className="font-black text-[#002B36] text-sm uppercase tracking-tighter">
                      {rider.name}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="w-2 h-2 rounded-full bg-green-500"></span>
                      <p className="text-[10px] text-gray-500 font-bold uppercase">
                        Load:{" "}
                        <span
                          className={
                            rider.currentTasks >= 8
                              ? "text-red-500"
                              : "text-[#002B36]"
                          }
                        >
                          {rider.currentTasks}/10
                        </span>
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleAssignRider(rider)}
                    className="bg-[#002B36] text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all active:scale-95 cursor-pointer"
                  >
                    Select
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center py-6">
                <p className="text-xs font-bold text-red-400 uppercase italic">
                  All riders are busy!
                </p>
              </div>
            )}
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default Incoming;
