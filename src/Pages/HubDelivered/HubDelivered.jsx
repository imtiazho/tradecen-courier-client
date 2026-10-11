import { useQuery } from "@tanstack/react-query";
import React from "react";
import useAuth from "../../Hooks/useAuth";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import LoadingModal from "../../Components/LoadingModal/LoadingModal";
import { MdCall } from "react-icons/md";
import { FiCopy } from "react-icons/fi";
import toast from "react-hot-toast";

const HubDelivered = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  // 1. Fetch Hub Manager Profile
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

  // 2. Fetch Delivered Parcels Data
  const { isLoading: deliveredParcelsLoading, data: deliveredData = [] } =
    useQuery({
      queryKey: ["deliveredData", managerData?.hubName],
      queryFn: async () => {
        const res = await axiosSecure.get(
          `/parcels/hub-delivered/${managerData?.hubName}`,
        );
        return Array.isArray(res.data) ? res.data : [];
      },
      enabled: !!managerData?.hubName,
    });

  const handleCopyTracking = (id) => {
    navigator.clipboard.writeText(id);
    toast.success(`Copied: #${id}`, {
      style: {
        background: "#002B36",
        color: "#fff",
        fontSize: "12px",
        borderRadius: "8px",
      },
    });
  };

  if (managerLoading || deliveredParcelsLoading) {
    return <LoadingModal isLoading={true} />;
  }

  return (
    <div className="p-3 md:p-6 bg-[#ffffff] rounded-tradecen min-h-screen font-sans">
      {/* Dynamic Header Layout */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-[#02312A] tracking-wide">
            Delivered Parcels
          </h2>
          <p className="text-sm text-gray-500 mt-1 font-medium">
            Successful distribution history logs.
          </p>
        </div>
        <div className="bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
          <span className="text-emerald-700 font-bold text-xs tracking-wide">
            {deliveredData?.length || 0} Delivered
          </span>
        </div>
      </div>

      <div className="overflow-x-auto w-full rounded-tradecen shadow-flat">
        <table className="w-full text-left border-collapse min-w-[750px]">
          <thead>
            <tr className="text-[#ADB5BD] text-[11px] uppercase tracking-widest font-black">
              <th className="px-4 py-4">Tracking / Status</th>
              <th className="px-4 py-4">Parcel Name</th>
              <th className="px-4 py-4">Recipient</th>
              <th className="px-4 py-4">Rider</th>
              <th className="px-4 py-4 text-right pr-6">Financial (COD)</th>
            </tr>
          </thead>
          <tbody>
            {deliveredData?.map((parcel) => (
              <tr
                key={parcel._id}
                className="bg-[#FFFFFF] hover:bg-[#F8F9FA]/60 transition-all"
              >
                <td className="px-4 py-4 whitespace-nowrap rounded-l-[16px]">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono font-bold text-gray-700 text-[13px]">
                      #{parcel.trackingID}
                    </span>
                    <button
                      onClick={() => handleCopyTracking(parcel.trackingID)}
                      className="text-gray-400 hover:text-gray-700 p-0.5 cursor-pointer transition-colors"
                    >
                      <FiCopy size={12} />
                    </button>
                  </div>
                  <span className="mt-1 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-emerald-50 text-emerald-600 border border-emerald-100/40">
                    ✓ Delivered
                  </span>
                </td>

                <td className="px-4 py-4 max-w-[180px]">
                  <span
                    className="font-bold text-gray-900 block text-[14px] truncate"
                    title={parcel.parcelName}
                  >
                    {parcel.parcelName}
                  </span>
                  <span className="text-[11px] text-gray-400 font-semibold block mt-0.5 uppercase tracking-tight">
                    {parcel.parcelWeight} KG • {parcel.parcelType}
                  </span>
                </td>

                <td className="px-4 py-4 max-w-[200px]">
                  <span className="font-bold text-gray-800 block text-[13px] truncate">
                    {parcel.receiverInfo?.name}
                  </span>
                  <span className="text-[11px] text-gray-400 font-medium block truncate mt-0.5">
                    {parcel.receiverInfo?.area || parcel.receiverInfo?.address}
                  </span>
                </td>

                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <div>
                      <span className="font-bold text-gray-800 block uppercase text-[12px] tracking-tight">
                        {parcel.deliveryRider?.name || "Rider"}
                      </span>
                      <span className="text-[11px] font-mono text-gray-400 block mt-0.5">
                        {parcel.deliveryRider?.phone}
                      </span>
                    </div>
                    {parcel.deliveryRider?.phone && (
                      <a
                        href={`tel:${parcel.deliveryRider.phone}`}
                        className="p-1.5 rounded-md bg-gray-50 border border-gray-100 text-gray-500 hover:text-[#002B36] hover:bg-gray-100 transition-all cursor-pointer"
                      >
                        <MdCall size={12} />
                      </a>
                    )}
                  </div>
                </td>

                {/* 5. Aligned Financials - Amount scaled to text-base (16px) */}
                <td className="px-4 py-4 text-right pr-6 whitespace-nowrap rounded-r-[16px]">
                  <span className="font-mono font-black text-[#002B36] text-base block">
                    ৳{parcel.codAmount?.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider block mt-0.5">
                    {parcel.revMethod || "COD"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Empty State UI */}
        {(!deliveredData || deliveredData.length === 0) && (
          <div className="py-16 text-center bg-white rounded-xl">
            <p className="text-gray-400 font-bold uppercase tracking-wider text-[11px]">
              No archived records found
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HubDelivered;
