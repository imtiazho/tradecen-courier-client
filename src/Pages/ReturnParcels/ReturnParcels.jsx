import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { MdOutlineDoubleArrow } from "react-icons/md";
import { FaBoxOpen, FaTruckLoading } from "react-icons/fa";
import DynamicTitle from "../../Components/DynamicTitle/DynamicTitle";
import useAuth from "../../Hooks/useAuth";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import LoadingModal from "../../Components/LoadingModal/LoadingModal";

const ReturnParcels = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [activeTab, setActiveTab] = useState("receive");

  const { isLoading: managerLoading, data: managerData = {}, refetch: refetchManager } = useQuery({
    queryKey: ["managerData", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/hub-managers?email=${user.email}`);
      return Array.isArray(res.data) && res.data.length > 0 ? res.data[0] : res.data;
    },
    enabled: !!user && !!user?.accessToken,
  });

  const returnReqs = managerData?.returnReq || [];
  
  const pendingReceiveTasks = returnReqs.filter(parcel => !parcel.isHubReceived);
  const dispatchTasks = returnReqs.filter(parcel => parcel.isHubReceived); 

  const currentTabTasks = activeTab === "receive" ? pendingReceiveTasks : dispatchTasks;


  const handleConfirmReturnReceived = async (parcelId) => {
    try {
      const res = await axiosSecure.patch(`/parcels/return-hub/received/${parcelId}`, {
        managerEmail: user?.email
      });
      
      if (res.data.success || res.data.modifiedCount > 0) {
        Swal.fire({
          title: "Returned Successfully!",
          text: "Parcel safely received at hub ledger and cleared from rider.",
          icon: "success",
          confirmButtonColor: "#002B36",
        });
        refetchManager();
      }
    } catch (error) {
      Swal.fire("Error", "Failed to process return reception", "error");
    }
  };

  const handleReturnDispatch = async (parcelId) => {
  try {
    const res = await axiosSecure.patch(`/hub/dispatch-return-to-origin/${parcelId}`, {
      managerEmail: user?.email
    });
    
    if (res.data.success) {
      Swal.fire({
        title: "Dispatched Successfully!",
        text: "Parcel has been successfully dispatched back to the origin warehouse.",
        icon: "success",
        confirmButtonColor: "#002B36",
      });
      refetchManager();
    }
  } catch (error) {
    console.error("Dispatch error:", error);
    Swal.fire({
      title: "Error",
      text: error.response?.data?.message || "Failed to dispatch return parcel.",
      icon: "error",
      confirmButtonColor: "#002B36",
    });
  }
};

  if (managerLoading) {
    return <LoadingModal isLoading={true} />;
  }

  return (
    <div className="p-4 md:p-8 bg-[#ffffff] rounded-tradecen min-h-screen font-sans">
      <DynamicTitle title={`Dashboard | ${activeTab === "receive" ? "Receive Returns" : "Dispatch Returns"}`} />

      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-[#002B36] tracking-wide">
            Return Shipments
          </h2>
          <p className="text-sm text-gray-500 mt-1 font-medium">
            Manage, audit, and accept canceled or undelivered parcels back to hub.
          </p>
        </div>
        <div className="flex items-center gap-3 bg-[#CAEB66]/20 px-4 py-2 rounded-full border border-[#CAEB66]">
          <div className="w-2 h-2 bg-[#002B36] rounded-full animate-pulse"></div>
          <span className="text-[#002B36] font-bold text-sm uppercase tracking-wider">
            {managerData?.hubName || "Hub"} Return Desk
          </span>
        </div>
      </div>

      {/* Tab Switcher Interface matching Rider Terminal */}
      <div className="flex gap-2 border border-gray-100 mb-8 bg-white/50 p-1.5 rounded-xl w-fit">
        <button
          onClick={() => setActiveTab("receive")}
          className={`flex-1 md:flex-none px-6 py-2.5 rounded-lg text-xs font-black tracking-wider uppercase transition-all duration-300 cursor-pointer ${
            activeTab === "receive"
              ? "bg-[#CAEB66] text-[#02312A] shadow-sm"
              : "text-gray-500 hover:text-gray-800"
          }`}
        >
          Receive Returns ({pendingReceiveTasks.length})
        </button>
        <button
          onClick={() => setActiveTab("dispatch")}
          className={`flex-1 md:flex-none px-6 py-2.5 rounded-lg text-xs font-black tracking-wider uppercase transition-all duration-300 cursor-pointer ${
            activeTab === "dispatch"
              ? "bg-[#CAEB66] text-[#02312A] shadow-sm"
              : "text-gray-500 hover:text-gray-800"
          }`}
        >
          Dispatch to Merchant ({dispatchTasks.length})
        </button>
      </div>

      {/* Main Table Container */}
      <div className="overflow-x-auto w-full">
        {currentTabTasks.length > 0 && (
          <table className="w-full text-left border-separate border-spacing-y-3">
            <thead>
              <tr className="text-[#ADB5BD] text-[11px] uppercase tracking-widest font-black">
                <th className="px-6 py-3">Tracking ID</th>
                <th className="px-6 py-3">Parcel Info</th>
                <th className="px-6 py-3">{activeTab === "receive" ? "Rider (Handing Over)" : "Merchant"}</th>
                <th className="px-6 py-3">Route Details</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right pr-12">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentTabTasks.map((parcel) => (
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
                          : parcel.parcelName || "Standard Parcel"}
                      </span>
                      <span className="text-[#02312A] font-black bg-[#CAEB66]/10 border border-[#CAEB66]/20 px-1.5 py-0.5 rounded-md text-[9px] w-fit mt-1">
                        COD: ৳{parcel.codAmount || 0}
                      </span>
                    </div>
                  </td>

                  {/* Dynamic Info Column */}
                  <td className="px-6 py-5 text-xs text-[#02312A]">
                    <div className="flex flex-col items-start">
                      <p className="font-black text-[#02312A]">
                        {activeTab === "receive" 
                          ? (parcel.deliveryRider.name || "Assigned Rider") 
                          : (parcel.senderInfo.name || "Merchant Owner")}
                      </p>
                      <p className="text-[10px] text-gray-400 font-bold mt-0.5 tracking-wide">
                        {activeTab === "receive" ? (parcel.deliveryRider.phone || "N/A") : (parcel.senderInfo.phone || "N/A")}
                      </p>
                    </div>
                  </td>

                  {/* Route Details */}
                  <td className="px-6 py-5 text-xs text-[#02312A]">
                    <div className="flex items-center gap-2 font-bold text-gray-500">
                      {activeTab === "receive" ? (
                        <>
                          <span className="text-gray-400">Rider</span>
                          <span className="text-[#02312A] font-black">
                            {parcel.riderEmail ? parcel.riderEmail.split("@")[0] : "Courier"}
                          </span>
                          <MdOutlineDoubleArrow className="text-[#CAEB66]" size={14} />
                          <span className="text-[#02312A] font-black">
                            {managerData?.hubName}
                          </span>
                        </>
                      ) : (
                        <>
                          <span className="text-[#02312A] font-black">
                            {managerData?.hubName}
                          </span>
                          <MdOutlineDoubleArrow className="text-[#CAEB66]" size={14} />
                          <span className="text-[#02312A] font-black">
                            {parcel.senderInfo.area}
                          </span>
                        </>
                      )}
                    </div>
                  </td>

                  {/* Delivery Status */}
                  <td className="px-6 py-5 text-xs text-[#02312A]">
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wide border inline-block w-fit ${
                      activeTab === "receive" 
                        ? "bg-amber-50 text-amber-600 border-amber-100 animate-pulse" 
                        : "bg-blue-50 text-blue-600 border-blue-100"
                    }`}>
                      {activeTab === "receive" ? "Return Pending" : "Ready to Dispatch"}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-5 rounded-r-[16px] pr-6">
                    <div className="flex justify-end pr-6 w-full">
                      {activeTab === "receive" ? (
                        <button
                          onClick={() => handleConfirmReturnReceived(parcel._id)}
                          className="w-full bg-[#CAEB66] text-[#02312A] border border-[#CAEB66]/20 px-3 py-2.5 rounded-md text-[10px] font-black uppercase tracking-wider hover:scale-[1.01] cursor-pointer transition-all shadow-sm"
                        >
                          Receive Return
                        </button>
                      ) : (
                        <button
                          onClick={() => handleReturnDispatch(parcel._id)}
                          className="w-full bg-[#CAEB66] text-[#02312A] border border-[#CAEB66]/20 px-3 py-2.5 rounded-md text-[10px] font-black uppercase tracking-wider hover:scale-[1.01] cursor-pointer transition-all shadow-sm"
                        >
                          Dispatch to Merchant
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Empty State UI matching active tabs */}
        {currentTabTasks.length === 0 && (
          <div className="py-20 text-center bg-white rounded-[24px] border border-dashed border-gray-100 mt-2">
            <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100 text-[#002B36]/30">
              {activeTab === "receive" ? <FaBoxOpen size={24} /> : <FaTruckLoading size={24} />}
            </div>
            <p className="text-gray-400 font-black uppercase tracking-widest text-xs">
              {activeTab === "receive" 
                ? "No pending return requests from riders" 
                : "No parcels available for merchant dispatch"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReturnParcels;