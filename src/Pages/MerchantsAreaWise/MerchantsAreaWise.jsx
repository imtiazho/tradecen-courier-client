import React from "react";
import useAuth from "../../Hooks/useAuth";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import LoadingModal from "../../Components/LoadingModal/LoadingModal";
import {
  MdStore,
  MdLocationOn,
  MdCall,
  MdMailOutline,
  MdLocalMall,
} from "react-icons/md";
import { FiCopy } from "react-icons/fi";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import DynamicTitle from "../../Components/DynamicTitle/DynamicTitle";

const MerchantsAreaWise = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  // 1. Fetch Hub Manager profile to extract active location parameter
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

  // 2. Fetch Area Wise Merchants based on dynamic path parameter
  const { isLoading: merchantsLoading, data: merchants = [] } = useQuery({
    queryKey: ["areaMerchants", managerData?.hubName],
    queryFn: async () => {
      // Dynamic endpoint integration passing hubName safely
      const res = await axiosSecure.get(
        `/area-merchant/${managerData?.hubName}`,
      );
      return Array.isArray(res.data) ? res.data : [];
    },
    enabled: !!managerData?.hubName && !!user && !!user?.accessToken,
  });

  // Action Helper: Copy Pickup Address to Clipboard for riders dispatching
  const handleCopyAddress = (address, business) => {
    navigator.clipboard.writeText(address);
    toast.success(`${business}'s address copied!`, {
      style: {
        background: "#FFFFFF",
        padding: "10px 14px",
        color: "#002B36",
        fontSize: "12px",
        fontWeight: "600",
        textTransform: "uppercase",
        letterSpacing: "0.5px",
        fontFamily: "sans-serif",
        borderRadius: "10px",
        boxShadow: "0px 4px 12px rgba(0, 43, 54, 0.05)",
      },
      iconTheme: {
        primary: "#CAEB66",
        secondary: "#002B36",
      },
    });
  };

  if (managerLoading || merchantsLoading) {
    return <LoadingModal isLoading={true} />;
  }

  return (
    <div className="p-4 md:p-8 bg-[#ffffff] rounded-tradecen min-h-screen font-sans">
      <DynamicTitle title="Dashboard | Merchants" />
      {/* Header Operational Analytics Card */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-[#002B36] tracking-wide">
            Merchants
          </h2>
          <p className="text-sm text-gray-500 mt-1 font-medium">
            Manage active B2B partners, business hubs, and pipeline logistics in{" "}
            {managerData?.hubName || "current"} zone.
          </p>
        </div>
        <div className="flex items-center gap-3 bg-[#CAEB66]/20 px-4 py-2 rounded-full border border-[#CAEB66]">
          <span className="text-[#002B36] font-bold text-sm uppercase tracking-wider">
            Merchants: {merchants?.length || 0}
          </span>
        </div>
      </div>

      {/* Grid Architecture Blueprint */}
      {merchants?.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {merchants.map((merchant) => (
            <div
              key={merchant._id}
              className="bg-[#FFFFFF] border border-gray-100 rounded-tradecen p-6 shadow-flat transition-all duration-300 relative group flex flex-col justify-between overflow-hidden"
            >
              {/* Brand Top Block */}
              <div>
                <div className="flex items-start justify-between gap-3 border-b border-gray-100 pb-4 mb-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-12 h-12 rounded-2xl bg-[#FFF9F2] border border-[#FFE7CC] flex items-center justify-center text-xl overflow-hidden shadow-inner flex-shrink-0 transition-transform">
                      {merchant.photoURL ? (
                        <img
                          src={merchant.photoURL}
                          alt={merchant.businessName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <MdStore className="text-[#002B36]" size={20} />
                      )}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm font-black text-[#002B36] uppercase tracking-tight truncate">
                        {merchant.businessName || "No Brand Name"}
                      </h4>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide truncate mt-0.5">
                        Pro: {merchant.displayName}
                      </p>
                    </div>
                  </div>

                  {/* Merchant Account Tier Tag */}
                  <span className="text-[8px] font-black uppercase px-2 py-1 rounded-md bg-[#002B36] text-white tracking-wider shrink-0">
                    {merchant.merchantType || "Standard"}
                  </span>
                </div>

                {/* Logistics Profile Specification */}
                <div className="space-y-3 mb-5">
                  {/* Total Successful Deliveries */}
                  <div className="flex items-center justify-between text-xs bg-gray-50 p-2.5 rounded-xl border border-gray-100/80">
                    <span className="text-gray-400 font-black text-[10px] uppercase tracking-wider flex items-center gap-1.5">
                      <MdLocalMall size={14} className="text-gray-400" />{" "}
                      Deliveries
                    </span>
                    <span className="font-black text-[#002B36] uppercase text-[9px] bg-white px-2 py-1 rounded border border-gray-100">
                      {merchant.totalSuccessfulDeliveries || 0} Successful
                    </span>
                  </div>

                  {/* Contact Info Text Frame */}
                  <div className="flex items-center justify-between text-xs px-1">
                    <span className="text-gray-400 font-black text-[10px] uppercase tracking-wider flex items-center gap-1.5">
                      <MdMailOutline size={14} className="text-gray-400" />{" "}
                      Contact Email
                    </span>
                    <span className="font-mono text-gray-700 text-right truncate max-w-[160px] text-[11px]">
                      {merchant.email}
                    </span>
                  </div>

                  {/* Operational Pickup Address Module */}
                  <div className="flex flex-col bg-[#FFFBF7] p-3 rounded-xl border border-[#FFE7CC]/60 mt-3 relative group/address">
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-[9px] text-[#A3703C] font-black uppercase tracking-wider flex items-center gap-1">
                        <MdLocationOn size={12} className="text-[#A3703C]" />{" "}
                        Warehouse / Pickup Point
                      </span>
                      <button
                        onClick={() =>
                          handleCopyAddress(
                            merchant.pickupPoint,
                            merchant.businessName,
                          )
                        }
                        className="text-gray-400 hover:text-[#002B36] transition-colors p-1 bg-white hover:bg-gray-50 border border-gray-100 rounded-md shadow-sm"
                        title="Copy Address"
                      >
                        <FiCopy size={10} />
                      </button>
                    </div>
                    <p className="text-xs text-[#002B36] font-bold leading-relaxed line-clamp-2">
                      {merchant.pickupPoint || "Not Configured"}
                    </p>
                    <div className="mt-2 pt-2 border-t border-[#FFE7CC]/40 flex items-center justify-between">
                      <span className="text-[8px] uppercase font-black text-gray-400 tracking-tight">
                        Zone: {merchant.area}, {merchant.district}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Functional Card Footer Action Hub */}
              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-100">
                {/* Protocol 1: Direct Phone Dialer */}
                <a
                  href={`tel:${merchant.contact}`}
                  className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:text-[#002B36] hover:bg-gray-50 hover:border-gray-300 transition-all text-[10px] font-black uppercase tracking-wider text-center cursor-pointer"
                >
                  <MdCall
                    size={13}
                    className="text-gray-400 group-hover:text-[#002B36]"
                  />
                  Call Merchant
                </a>

                {/* Protocol 2: Email Client Shortcut */}
                <a
                  href={`mailto:${merchant.email}?subject=TradeCen Logistics Hub Query`}
                  className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[#002B36] text-white hover:bg-[#001F28] transition-all text-[10px] font-black uppercase tracking-wider text-center cursor-pointer shadow-md shadow-[#002B36]/5"
                >
                  <MdMailOutline size={13} className="text-[#CAEB66]" />
                  Send Email
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty Merchant Directory Placeholder State */
        <div className="py-24 text-center bg-white rounded-[24px] border border-dashed border-gray-200 mt-2">
          <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100 text-xl">
            🏬
          </div>
          <h4 className="text-[#002B36] font-black uppercase tracking-tight text-base mb-1">
            No Active Merchants in this Hub
          </h4>
          <p className="text-gray-400 text-xs font-medium max-w-xs mx-auto">
            There are currently no B2B distribution store profiles registered or
            mapped under the {managerData?.hubName || "active"} area desk.
          </p>
        </div>
      )}
    </div>
  );
};

export default MerchantsAreaWise;
