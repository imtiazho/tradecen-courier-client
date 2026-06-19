import React, { useState } from "react";
import useAuth from "../../Hooks/useAuth";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import {
  FaMapMarkerAlt,
  FaShippingFast,
  FaBiking,
  FaBoxOpen,
  FaPhoneAlt,
} from "react-icons/fa";
import { FaCopy } from "react-icons/fa6";
import { MdPedalBike } from "react-icons/md";
import { toast } from "react-hot-toast";

const DeliveryParcelLocal = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const [selectedParcel, setSelectedParcel] = useState(null);

  const { data: managerData = {} } = useQuery({
    queryKey: ["managerData", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/users/hub-managers?email=${user.email}`,
      );
      return Array.isArray(res.data) ? res.data[0] : res.data;
    },
    enabled: !!user?.email && !!user?.accessToken,
  });

  const {
    isLoading: inHouseLoading,
    data: inHouse = {},
    refetch,
  } = useQuery({
    queryKey: ["inComingData", managerData?.hubName],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/warehouse/sorting-house/${managerData?.hubName}`,
      );
      return res.data;
    },
    enabled: !!managerData?.hubName && !!user && !!user?.accessToken,
  });

  const { data: riders = [], refetch: refetchRiders } = useQuery({
    queryKey: ["hubRiders", managerData?.hubName],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/riders/available/${managerData?.hubName}`,
      );
      return res.data;
    },
    enabled: !!managerData?.hubName && !!user && !!user?.accessToken,
  });

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);

    toast.success("Phone number copied!", {
      duration: 2000,
      style: {
        border: "1px solid rgba(202, 235, 102, 0.2)",
        padding: "12px 20px",
        color: "#02312A",
        background: "#FFFFFF",
        borderRadius: "14px",
        fontSize: "12px",
        fontWeight: "900",
        textTransform: "uppercase",
        letterSpacing: "0.05em",
      },
      iconTheme: {
        primary: "#CAEB66",
        secondary: "#02312A",
      },
    });
  };

  const handleReceiveFromTransit = async (id) => {
    try {
      const res = await axiosSecure.patch(`/parcels/hub/received/${id}`);
      if (res.data.success) {
        Swal.fire({
          title: "Received!",
          text: "Parcel is now in your hub inventory.",
          icon: "success",
          confirmButtonColor: "#02312A",
        });
        refetch();
      }
    } catch (error) {
      Swal.fire("Error", "Could not confirm reception", "error");
    }
  };

  const handleAssignDelivery = async (rider) => {
    try {
      const assignmentData = {
        parcelId: selectedParcel._id,
        riderId: rider._id,
        riderName: rider.name,
        riderEmail: rider.email,
        riderPhone: rider.phone,
        trackingID: selectedParcel.trackingID,
      };

      const res = await axiosSecure.patch(
        "/parcels/assign-delivery",
        assignmentData,
      );

      if (res.data.success) {
        document.getElementById("delivery_rider_modal").close();
        Swal.fire({
          title: "Rider Assigned!",
          text: `${rider.name} is now responsible for this delivery.`,
          icon: "success",
          confirmButtonColor: "#02312A",
          timer: 1500,
          showConfirmButton: false,
        });

        refetch();
        refetchRiders();
      }
    } catch (error) {
      document.getElementById("delivery_rider_modal").close();
      Swal.fire({
        title: "Error",
        text:
          error.response?.data?.message ||
          "Something went wrong during assignment",
        icon: "error",
      });
    }
  };

  return (
    <div className="overflow-x-auto w-full">
      <table className="w-full text-left border-separate border-spacing-y-3">
        <thead>
          <tr className="text-[#ADB5BD] text-[11px] uppercase tracking-widest font-black">
            <th className="px-6 py-3">Parcel Info</th>
            <th className="px-6 py-3">Customer Location</th>
            <th className="px-6 py-3">Specs & Billing</th>
            <th className="px-6 py-3 text-right pr-12">Operation</th>
          </tr>
        </thead>
        <tbody>
          {(inHouse.deliveryList || []).map((parcel) => (
            <tr
              key={parcel._id}
              className="bg-[#FFFFFF] hover:bg-[#F8F9FA]/60 transition-all group text-left"
            >
              {/* Parcel Info */}
              <td className="px-6 py-5 rounded-l-[16px]">
                <div className="flex flex-col items-start">
                  <span className="text-[10px] font-black text-[#02312A] bg-[#CAEB66]/20 border border-[#CAEB66]/30 px-2.5 py-0.5 rounded-md font-mono tracking-tighter uppercase mb-1.5">
                    #{parcel.trackingID}
                  </span>
                  <span className="text-sm font-black text-[#02312A]">
                    {parcel.receiverInfo?.name}
                  </span>
                  <div
                    className="flex items-center gap-1.5 mt-1 text-gray-400 group/phone cursor-pointer"
                    onClick={() => handleCopy(parcel.receiverInfo?.phone)}
                  >
                    <FaPhoneAlt size={9} />
                    <span className="text-[10px] font-bold text-gray-500 hover:text-[#02312A] transition-colors">
                      {parcel.receiverInfo?.phone}
                    </span>
                    <FaCopy
                      size={8}
                      className="opacity-0 group-hover/phone:opacity-100 text-gray-400 transition-opacity"
                    />
                  </div>
                </div>
              </td>

              {/* Customer Location */}
              <td className="px-6 py-5 text-xs text-[#02312A]">
                <div className="flex flex-col max-w-xs">
                  <div className="flex items-start gap-1.5 text-gray-500 font-bold">
                    <FaMapMarkerAlt
                      className="text-[#CAEB66] mt-0.5 shrink-0"
                      size={12}
                    />
                    <span className="text-slate-700 line-clamp-1">
                      {parcel.receiverInfo?.address}
                    </span>
                  </div>
                  <span className="text-[9px] uppercase font-black text-gray-400 mt-1 pl-5 tracking-wider">
                    Area: {parcel.receiverInfo?.area || "N/A"} •{" "}
                    {parcel.receiverInfo?.district}
                  </span>
                </div>
              </td>

              {/* Specs & Billing */}
              <td className="px-6 py-5 text-xs text-[#02312A]">
                <div className="flex flex-col items-start gap-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-black text-[#02312A]">
                      {parcel.parcelWeight}{" "}
                      <span className="text-[9px] text-gray-400 font-bold">
                        KG
                      </span>
                    </span>
                    <span className="text-[9px] font-bold bg-gray-50 border border-gray-100 text-gray-500 px-1.5 py-0.2 rounded-md uppercase">
                      {parcel.parcelType === "Non-Document" ? "Package" : "Doc"}
                    </span>
                  </div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">
                    Collect:{" "}
                    <span
                      className={
                        parcel.revMethod === "COD"
                          ? "text-amber-600 font-black"
                          : "text-[#02312A] font-black"
                      }
                    >
                      {parcel.revMethod === "COD"
                        ? `৳${parcel.codAmount}`
                        : "Prepaid"}
                    </span>
                  </p>
                </div>
              </td>

              {/* Operation Button */}
              <td className="px-6 py-5 rounded-r-[16px] pr-6">
                <div className="flex justify-end pr-6 w-full">
                  {parcel.deliveryStatus === "in-transit" ? (
                    <button
                      onClick={() => handleReceiveFromTransit(parcel._id)}
                      className="w-full max-w-[150px] bg-amber-500 text-white px-4 py-2.5 rounded-xl text-[10px] font-black uppercase flex items-center justify-center gap-2 hover:bg-amber-600 transition-all shadow-sm active:scale-95 cursor-pointer"
                    >
                      <FaBoxOpen size={12} /> Receive at Hub
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setSelectedParcel(parcel);
                        document
                          .getElementById("delivery_rider_modal")
                          .showModal();
                      }}
                      className="w-full max-w-[150px] bg-[#CAEB66] text-[#02312A] border border-[#CAEB66]/20 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase hover:shadow-md hover:scale-[1.02] active:scale-95 cursor-pointer transition-all tracking-wider text-center"
                    >
                      Assign Delivery
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Empty State */}
      {(!inHouse.deliveryList || inHouse.deliveryList.length === 0) && (
        <div className="py-20 text-center bg-white rounded-[24px] border border-dashed border-gray-100 mt-2">
          <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100 text-lg">
            📦
          </div>
          <p className="text-gray-400 font-black uppercase tracking-widest text-xs">
            No parcels available in house
          </p>
        </div>
      )}

      {/* --- RIDER ASSIGN MODAL (DaisyUI Dialog Setup) --- */}
      <dialog
        id="delivery_rider_modal"
        className="modal modal-bottom sm:modal-middle backdrop-blur-sm"
      >
        <div className="modal-box p-0 rounded-tradecen border-none shadow-tradecen overflow-hidden max-w-lg bg-white">
          {/* Modal Header */}
          <div className="bg-primary p-6 text-center relative">
            <form method="dialog">
              <button className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4 text-secondary hover:bg-secondary hover:text-primary">
                ✕
              </button>
            </form>
            <div className="w-16 h-16 bg-secondary rounded-2xl mx-auto flex items-center justify-center text-2xl mb-3 shadow-lg transform rotate-3">
              <MdPedalBike size={30} className="text-primary" />
            </div>
            <h3 className="font-black text-secondary text-xl uppercase tracking-tight flex items-center justify-center gap-2">
              <FaShippingFast size={20} /> Assign Delivery Task
            </h3>
            <p className="text-gray-300 text-xs font-bold uppercase tracking-widest mt-1 text-secondary">
              Target ID:{" "}
              <span className="text-secondary">
                #{selectedParcel?.trackingID}
              </span>
            </p>
            <p className="text-[10px] text-[#CAEB66]/70 uppercase font-black tracking-wider mt-0.5">
              Destination: {selectedParcel?.receiverInfo?.area || "N/A"}
            </p>
          </div>

          {/* Modal Body */}
          <div className="p-6 space-y-3 bg-white">
            <div className="flex justify-between items-center mb-1">
              <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest">
                Available Delivery Agents ({riders.length})
              </p>
            </div>

            <div className="grid grid-cols-1 gap-2.5 max-h-64 overflow-y-auto pr-1 custom-scrollbar">
              {riders?.length > 0 ? (
                riders.map((rider) => {
                  const isOverloaded = (rider.currentTasks || 0) >= 3;
                  return (
                    <div
                      key={rider._id}
                      className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl hover:bg-[#CAEB66]/10 transition-all border border-transparent hover:border-[#CAEB66]"
                    >
                      <div>
                        <p className="font-black text-[#02312A] text-sm uppercase tracking-tighter">
                          {rider.name}
                        </p>
                        <p className="text-[10px] text-gray-400 font-bold tracking-wide">
                          {rider.phone}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span
                            className={`w-2 h-2 rounded-full ${isOverloaded ? "bg-rose-500" : "bg-emerald-500"}`}
                          ></span>
                          <p className="text-[10px] text-gray-500 font-bold uppercase">
                            Load:{" "}
                            <span
                              className={
                                isOverloaded
                                  ? "text-rose-600 font-black"
                                  : "text-[#02312A] font-black"
                              }
                            >
                              {rider.currentTasks || 0} active
                            </span>
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleAssignDelivery(rider)}
                        className="bg-[#02312A] text-[#CAEB66] px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all active:scale-95 cursor-pointer border border-[#02312A]"
                      >
                        Select
                      </button>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-6">
                  <p className="text-xs font-bold text-rose-500 uppercase italic tracking-wide">
                    All delivery agents are offline or busy!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default DeliveryParcelLocal;
