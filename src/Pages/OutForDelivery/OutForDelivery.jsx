import { useQuery } from "@tanstack/react-query";
import React from "react";
import useAuth from "../../Hooks/useAuth";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import LoadingModal from "../../Components/LoadingModal/LoadingModal";
import { MdCall, MdLocalMall, MdAccountCircle, MdMoped } from "react-icons/md";
import { FiCopy } from "react-icons/fi";
import toast from "react-hot-toast";

const OutForDelivery = () => {
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
    enabled: !!user?.email,
  });

  const {
    isLoading: outForDeliveryLoading,
    data: outForDeliveryData = [],
    refetch: outForDeliveryRefetch,
  } = useQuery({
    queryKey: ["outForDeliveryData", managerData?.hubName],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/parcels/out-for-delivery/${managerData?.hubName}`,
      );
      return Array.isArray(res.data) ? res.data : [];
    },
    enabled: !!managerData?.hubName,
  });

  const handleCopyTracking = (id) => {
    navigator.clipboard.writeText(id);
    toast.success(`Tracking ID: #${id} copied!`, {
      style: {
        border: "1px solid #002B36",
        padding: "12px 16px",
        color: "#002B36",
        fontWeight: "bold",
        fontSize: "12px",
        borderRadius: "12px",
      },
      iconTheme: {
        primary: "#002B36",
        secondary: "#CAEB66",
      },
    });
  };

  if (managerLoading || outForDeliveryLoading) {
    return <LoadingModal isLoading={true} />;
  }

  return (
    <div className="p-4 md:p-8 bg-[#ffffff] rounded-tradecen min-h-screen font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-secondary tracking-wide">
            Out For Delivery
          </h2>
          <p className="text-sm text-gray-500 mt-1 font-medium">
            Monitoring active custom-field field shipments currently dispatched
            with delivery riders.
          </p>
        </div>
        <div className="flex items-center gap-3 bg-indigo-50 px-4 py-2 rounded-full border border-indigo-100">
          <div className="w-2 h-2 bg-indigo-500 rounded-full animate-ping"></div>
          <span className="text-green-700 font-bold text-sm uppercase tracking-wide">
            Live Field Load: {outForDeliveryData?.length || 0} Parcels
          </span>
        </div>
      </div>

      {/* Main Table Blueprint System */}
      <div className="overflow-x-auto w-full">
        <table className="w-full text-left border-separate border-spacing-y-3">
          <thead>
            <tr className="text-[#ADB5BD] text-[11px] uppercase tracking-widest font-black">
              <th className="px-6 py-3">Tracking Details</th>
              <th className="px-6 py-3">Parcel Info</th>
              <th className="px-6 py-3">Recipient / End Point</th>
              <th className="px-6 py-3">Assigned Rider</th>
              <th className="px-6 py-3">Financial (COD)</th>
              <th className="px-6 py-3 text-center">Live Status</th>
            </tr>
          </thead>
          <tbody>
            {outForDeliveryData?.map((parcel) => (
              <tr
                key={parcel._id}
                className="bg-[#FFFFFF] hover:bg-[#F8F9FA]/60 transition-all group text-left border border-gray-50"
              >
                {/* 1. Tracking ID Cell */}
                <td className="px-6 py-5 rounded-l-[16px] text-left">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-lg font-mono font-black text-gray-500 text-xs tracking-tighter uppercase group-hover:bg-[#02312A]/5 group-hover:text-[#02312A] transition-all">
                      #{parcel.trackingID}
                    </span>
                    <button
                      onClick={() => handleCopyTracking(parcel.trackingID)}
                      className="text-gray-400 hover:text-[#002B36] transition-colors p-1 cursor-pointer"
                      title="Copy Tracking ID"
                    >
                      <FiCopy size={12} />
                    </button>
                  </div>
                  <span className="text-[9px] uppercase font-bold text-gray-400 mt-1 block tracking-wider">
                    Scanned: {new Date(parcel.createdAt).toLocaleDateString()}
                  </span>
                </td>

                {/* 2. Parcel Specifications */}
                <td className="px-6 py-5 text-xs text-[#02312A]">
                  <div className="flex flex-col items-start">
                    <span className="font-black text-sm text-[#02312A] flex items-center gap-1 mb-1">
                      <MdLocalMall className="text-gray-400" size={14} />
                      {parcel.parcelName?.length > 18
                        ? parcel.parcelName.slice(0, 18) + "..."
                        : parcel.parcelName}
                    </span>
                    <div className="mt-1 text-[9px] uppercase font-black tracking-wide text-gray-400">
                      <span>Weight: {parcel.parcelWeight} KG</span>
                      {/* <span>•</span>
                      <span className="text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100/50">
                        {parcel.parcelType}
                      </span> */}
                    </div>
                  </div>
                </td>

                {/* 3. Recipient Info Box */}
                <td className="px-6 py-5 text-xs text-[#02312A]">
                  <div className="flex flex-col items-start">
                    <p className="font-black text-[#02312A] flex items-center gap-1 mb-1">
                      <MdAccountCircle className="text-gray-400" size={14} />
                      {parcel.receiverInfo?.name}
                    </p>
                    <p className="text-[10px] text-gray-400 font-bold mt-0.5 max-w-[180px] truncate">
                      {parcel.receiverInfo?.address},{" "}
                      {parcel.receiverInfo?.area}
                    </p>
                  </div>
                </td>

                {/* 4. Dispatched Rider Tracking & Call Layer */}
                <td className="px-6 py-5 text-xs text-[#02312A]">
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col items-start">
                      <p className="font-black text-[#002B36] flex items-center gap-1 mb-1 uppercase tracking-tight">
                        <MdMoped className="text-indigo-500" size={14} />
                        {parcel.deliveryRider?.name || "Unassigned"}
                      </p>
                      <p className="text-[10px] text-gray-400 font-medium mt-0.5">
                        {parcel.deliveryRider?.phone}
                      </p>
                    </div>
                    {/* Direct Quick Dialer Protocol */}
                    {parcel.deliveryRider?.phone && (
                      <a
                        href={`tel:${parcel.deliveryRider.phone}`}
                        className="p-2 rounded-xl bg-gray-50 border border-gray-100 text-[#002B36] hover:bg-[#CAEB66]/20 hover:border-[#CAEB66] transition-all cursor-pointer"
                        title="Call Rider"
                      >
                        <MdCall size={12} />
                      </a>
                    )}
                  </div>
                </td>

                {/* 5. Financial Transaction Blocks */}
                <td className="px-6 py-5 text-xs text-[#02312A]">
                  <div className="flex flex-col items-start">
                    <p className="font-mono font-black text-sm text-[#002B36] mb-1">
                      ৳{parcel.codAmount?.toLocaleString()}
                    </p>
                    <span className="text-[9px] uppercase font-black text-gray-400 tracking-tight mt-0.5">
                      Method: {parcel.revMethod || "COD"}
                    </span>
                  </div>
                </td>

                {/* 6. Active Custom Status Text representation */}
                <td className="px-6 py-5 rounded-r-[16px] text-center">
                  <span className="px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-wide border bg-indigo-50 text-indigo-600 border-indigo-100 animate-pulse inline-block">
                    🛵 In Rider's Bag
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Empty Inventory State Layout */}
        {(!outForDeliveryData || outForDeliveryData.length === 0) && (
          <div className="py-20 text-center bg-white rounded-[24px] border border-dashed border-gray-100 mt-2">
            <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100 text-lg">
              📦
            </div>
            <p className="text-gray-400 font-black uppercase tracking-widest text-xs">
              No parcels are currently out for delivery
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OutForDelivery;
