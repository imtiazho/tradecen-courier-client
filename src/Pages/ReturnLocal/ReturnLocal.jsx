import React, { useState } from "react";
import useAuth from "../../Hooks/useAuth";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import {
  FaMapMarkerAlt,
  FaUndoAlt,
  FaBiking,
  FaBoxOpen,
  FaPhoneAlt,
  FaUserTie,
} from "react-icons/fa";
import { FaCopy } from "react-icons/fa6";
import { MdPedalBike } from "react-icons/md";
import { toast } from "react-hot-toast";

const ReturnLocal = () => {
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
    isLoading: returnListLoading,
    data: returnWarehouse = {},
    refetch,
  } = useQuery({
    queryKey: ["returnWarehouseData", managerData?.hubName],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/warehouse/return-house/${managerData?.hubName}`,
      );
      return res.data;
    },
    enabled: !!managerData?.hubName && !!user && !!user?.accessToken,
  });
  
  console.log(returnWarehouse);
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
    toast.success("Merchant phone copied!", {
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

  const handleAssignReturnDelivery = async (rider) => {
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
        "/parcels/assign-return-delivery", 
        assignmentData,
      );

      if (res.data.success) {
        document.getElementById("merchant_return_modal").close();
        Swal.fire({
          title: "Return Rider Assigned!",
          text: `${rider.name} is on the way to return this parcel to the merchant.`,
          icon: "success",
          confirmButtonColor: "#02312A",
          timer: 1500,
          showConfirmButton: false,
        });

        refetch();
        refetchRiders();
      }
    } catch (error) {
      document.getElementById("merchant_return_modal").close();
      Swal.fire({
        title: "Assignment Failed",
        text:
          error.response?.data?.message ||
          "Something went wrong during assignment",
        icon: "error",
        confirmButtonColor: "#02312A",
      });
    }
  };

  return (
    <div className="overflow-x-auto w-full">
      <table className="w-full text-left border-separate border-spacing-y-3">
        <thead>
          <tr className="text-[#ADB5BD] text-[11px] uppercase tracking-widest font-black">
            <th className="px-6 py-3">Return Parcel Info</th>
            <th className="px-6 py-3">Merchant Details</th>
            <th className="px-6 py-3">Specs</th>
            <th className="px-6 py-3 text-right pr-12">Operation</th>
          </tr>
        </thead>
        <tbody>
  {(returnWarehouse.returnList || []).map((parcel) => (
    <tr
      key={parcel._id}
      className="bg-[#FFFFFF] hover:bg-[#FDFDFD] transition-all group border-b border-[#F8F9FA]"
    >
      {/* ১. Parcel Tracking & Info */}
      <td className="pl-6 pr-4 py-5 align-middle w-[25%]">
        <div className="flex flex-col items-start gap-1">
          <span className="text-[9px] font-bold text-rose-500 bg-rose-50/60 border border-rose-100/70 px-2 py-0.5 rounded font-mono tracking-wide uppercase">
            #{parcel.trackingID}
          </span>
          <span className="text-[13px] font-semibold text-[#0F172A] flex items-center gap-2 tracking-tight mt-0.5">
            <FaBoxOpen className="text-[#94A3B8]" size={13} />{" "}
            {parcel.parcelName || "Package Item"}
          </span>
        </div>
      </td>

      {/* ২. Merchant / Sender Details */}
      <td className="px-4 py-5 align-middle w-[35%]">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-1.5 font-bold text-[13px] text-[#0F172A]">
            <FaUserTie className="text-[#94A3B8] shrink-0" size={12} />
            <span>{parcel.senderInfo?.name}</span>
          </div>
          <div
            className="flex items-center gap-1.5 text-gray-400 group/phone cursor-pointer w-fit mt-0.5"
            onClick={() => handleCopy(parcel.senderInfo?.phone)}
          >
            <FaPhoneAlt size={9} className="text-[#94A3B8]" />
            <span className="text-[11px] font-medium text-[#64748B] hover:text-[#0F172A] transition-colors">
              {parcel.senderInfo?.phone}
            </span>
            <FaCopy
              size={8}
              className="opacity-0 group-hover/phone:opacity-100 text-[#94A3B8] transition-opacity ml-0.5"
            />
          </div>
          <span className="text-[9px] uppercase font-bold text-[#94A3B8] tracking-widest flex items-center gap-1 mt-1">
            <FaMapMarkerAlt size={10} className="text-rose-400" /> 
            Origin: <span className="text-[#64748B] font-medium">{parcel.senderInfo?.area || "N/A"}</span>
          </span>
        </div>
      </td>

      {/* ৩. Specs (Weight & Type) */}
      <td className="px-4 py-5 align-middle w-[20%]">
        <div className="flex flex-col items-start gap-1">
          <div className="flex items-center gap-1.5">
            <span className="text-[13px] font-bold text-[#0F172A]">
              {parcel.parcelWeight}{" "}
              <span className="text-[9px] text-[#94A3B8] font-semibold">KG</span>
            </span>
            <span className="text-[9px] font-medium bg-[#FFF5F5] border border-[#FFE3E3] text-rose-500 px-1.5 py-0.2 rounded uppercase tracking-wider">
              Return
            </span>
          </div>
          <p className="text-[10px] font-medium text-[#94A3B8] uppercase tracking-wider">
            Type:{" "}
            <span className="text-[#475569] font-semibold">
              {parcel.parcelType}
            </span>
          </p>
        </div>
      </td>

      {/* ৪. Classic Operation Button */}
      <td className="pr-6 pl-4 py-5 align-middle text-right w-[20%]">
        <div className="flex justify-end items-center w-full">
          <button
            onClick={() => {
              setSelectedParcel(parcel);
              document
                .getElementById("merchant_return_modal")
                .showModal();
            }}
            className="inline-flex items-center justify-center gap-2 bg-[#FF2E63] hover:bg-[#E01E4F] text-white px-4 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-widest whitespace-nowrap shadow-sm active:scale-[0.98] cursor-pointer transition-all"
          >
            <FaUndoAlt size={9} className="shrink-0" />
            <span>Assign Rider</span>
          </button>
        </div>
      </td>
    </tr>
  ))}
</tbody>
      </table>

      {/* Empty State */}
      {(!returnWarehouse.returnList ||
        returnWarehouse.returnList.length === 0) && (
        <div className="py-20 text-center bg-white rounded-[24px] border border-dashed border-gray-100 mt-2">
          <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100 text-lg">
            🔄
          </div>
          <p className="text-gray-400 font-black uppercase tracking-widest text-xs">
            No return parcels waiting for assignment
          </p>
        </div>
      )}

      {/* --- RETURN RIDER ASSIGN MODAL --- */}
      <dialog
        id="merchant_return_modal"
        className="modal modal-bottom sm:modal-middle backdrop-blur-sm"
      >
        <div className="modal-box p-0 rounded-tradecen border-none shadow-2xl overflow-hidden max-w-lg bg-white">
          {/* Modal Header */}
          <div className="bg-primary p-6 text-center relative">
            <form method="dialog">
              <button className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4 text-secondary hover:bg-secondary hover:text-primary">
                ✕
              </button>
            </form>
            <div className="w-16 h-16 bg-secondary rounded-2xl mx-auto flex items-center justify-center text-2xl mb-3 shadow-lg transform rotate-3">
              <MdPedalBike size={30} className="text-white" />
            </div>
            <h3 className="font-black text-secondary text-xl uppercase tracking-tight flex items-center justify-center gap-2">
              <FaUndoAlt size={16} /> Assign Merchant Return Task
            </h3>
            <p className="text-gray-300 text-xs font-bold uppercase tracking-widest mt-1 text-secondary">
              Return ID:{" "}
              <span className="text-secondary font-mono font-black">
                #{selectedParcel?.trackingID}
              </span>
            </p>
            <p className="text-[10px] text-gray-500 uppercase font-black tracking-wider mt-0.5">
              Merchant: {selectedParcel?.senderInfo?.name || "N/A"} (
              {selectedParcel?.senderInfo?.area})
            </p>
          </div>

          {/* Modal Body / Rider List */}
          <div className="p-6 space-y-3 bg-white">
            <div className="flex justify-between items-center mb-1">
              <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest">
                Available Return Agents ({riders.length})
              </p>
            </div>

            <div className="grid grid-cols-1 gap-2.5 max-h-64 overflow-y-auto pr-1 custom-scrollbar">
              {riders?.length > 0 ? (
                riders.map((rider) => {
                  const isOverloaded = (rider.currentTasks || 0) >= 8;
                  return (
                    <div
                      key={rider._id}
                      className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl hover:bg-rose-500/10 transition-all border border-transparent hover:border-rose-400"
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
                        onClick={() => handleAssignReturnDelivery(rider)}
                        className="bg-rose-500 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-600 transition-all active:scale-95 cursor-pointer border border-rose-500"
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

export default ReturnLocal;
