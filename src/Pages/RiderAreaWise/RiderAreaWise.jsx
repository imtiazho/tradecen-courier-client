import React from "react";
import useAuth from "../../Hooks/useAuth";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import LoadingModal from "../../Components/LoadingModal/LoadingModal";
import Swal from "sweetalert2";
import {
  MdPedalBike,
  MdDirectionsBike,
  MdCall,
  MdLocationOn,
  MdTask,
} from "react-icons/md";
import { HiOutlineIdentification } from "react-icons/hi";
import DynamicTitle from "../../Components/DynamicTitle/DynamicTitle";

const RiderAreaWise = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  // 1. First fetch Hub Manager Info to get the Hub Name / Area
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

  // 2. Fetch active riders based on Manager's Hub Area
  const {
    isLoading: ridersLoading,
    data: riders = [],
    refetch,
  } = useQuery({
    queryKey: ["ridersAreaWise", managerData?.hubName],
    queryFn: async () => {
      const res = await axiosSecure.get(`/riders?area=${managerData?.hubName}`);
      return res.data;
    },
    enabled: !!managerData?.hubName && !!user && !!user?.accessToken,
  });

  if (managerLoading || ridersLoading) {
    return <LoadingModal isLoading={true} />;
  }

  return (
    <div className="p-4 md:p-8 bg-[#ffffff] rounded-tradecen min-h-screen font-sans">
      <DynamicTitle title="Dashboard | Riders" />
      {/* Header Grid Context */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-[#002B36] tracking-wide">
            Zone Riders
          </h2>
          <p className="text-sm text-gray-500 mt-1 font-medium">
            Manage active distribution team and delivery logistics across{" "}
            {managerData?.hubName || "assigned"} zone.
          </p>
        </div>
        <div className="flex items-center gap-3 bg-[#CAEB66]/20 px-4 py-2 rounded-full border border-[#CAEB66]">
          <span className="text-[#002B36] font-bold text-sm uppercase tracking-wider">
            Team: {riders?.length || 0} Active
          </span>
        </div>
      </div>

      {/* Grid Architecture Container */}
      {riders?.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {riders.map((rider) => (
            <div
              key={rider._id}
              className="group bg-white border border-gray-100 hover:border-[#CAEB66]/40 rounded-2xl p-4 transition-all duration-300 flex flex-col justify-between relative overflow-hidden"
            >
              {/* Soft Glow */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#CAEB66]/10 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500"></div>

              <div className="relative z-10">
                {/* Header */}
                <div className="flex items-start gap-3 pb-4 border-b border-gray-100">
                  {/* Avatar */}
                  <div className="relative shrink-0">
                    <div className="w-14 h-14 rounded-xl overflow-hidden border border-gray-200 bg-gray-100">
                      <img
                        src={
                          rider.photoURL || "https://i.ibb.co/placeholder.jpg"
                        }
                        alt={rider.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <span
                      className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white ${
                        rider.workStatus === "available"
                          ? "bg-emerald-500"
                          : "bg-amber-400"
                      }`}
                    ></span>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h3 className="text-sm font-black text-[#002B36] uppercase truncate tracking-tight">
                          {rider.name}
                        </h3>

                        <p className="text-[11px] text-gray-400 truncate mt-0.5">
                          {rider.email}
                        </p>
                      </div>

                      <span
                        className={`text-[9px] font-black uppercase px-2 py-1 rounded-full tracking-wide whitespace-nowrap ${
                          rider.workStatus === "available"
                            ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                            : "bg-amber-50 text-amber-600 border border-amber-100"
                        }`}
                      >
                        {rider.workStatus}
                      </span>
                    </div>

                    {/* Area */}
                    <div className="flex items-center gap-1 mt-2 text-[11px] text-gray-500 font-semibold uppercase tracking-wide">
                      <MdLocationOn size={13} />
                      {rider.area}, {rider.district}
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {/* Load */}
                  <div className="bg-gray-50 rounded-xl p-2.5 border border-gray-100">
                    <div className="flex items-center gap-1 text-[9px] text-gray-400 font-bold uppercase tracking-wider mb-1">
                      <MdTask size={12} />
                      Load
                    </div>

                    <h4
                      className={`text-base font-black ${
                        rider.currentTasks >= 8
                          ? "text-red-500"
                          : "text-[#002B36]"
                      }`}
                    >
                      {rider.currentTasks || 0}
                      <span className="text-[10px] text-gray-400 font-bold">
                        {" "}
                        / 10
                      </span>
                    </h4>
                  </div>

                  {/* Vehicle */}
                  <div className="bg-[#CAEB66]/10 rounded-xl p-2.5 border border-[#CAEB66]/20">
                    <div className="flex items-center gap-1 text-[9px] text-gray-500 font-bold uppercase tracking-wider mb-1">
                      {rider.vehicle?.toLowerCase() === "bike" ? (
                        <MdDirectionsBike size={12} />
                      ) : (
                        <MdPedalBike size={12} />
                      )}
                      Vehicle
                    </div>

                    <h4 className="text-xs font-black text-[#002B36] uppercase truncate">
                      {rider.vehicle || "Cycle"}
                    </h4>
                  </div>
                </div>

                {/* NID */}
                <div className="mt-3 flex items-center justify-between bg-gray-50 rounded-xl px-3 py-2.5 border border-gray-100">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-gray-400">
                    <HiOutlineIdentification size={13} />
                    NID
                  </div>

                  <span className="font-mono text-[10px] font-bold text-gray-600 truncate max-w-[120px]">
                    {rider.nid || "Verified"}
                  </span>
                </div>
              </div>

              {/* Footer */}
              <div className="grid grid-cols-2 gap-2 mt-4 relative z-10">
                {/* Call */}
                <a
                  href={`tel:${rider.phone}`}
                  className="h-10 rounded-xl border border-gray-200 flex items-center justify-center gap-1.5 text-[11px] font-black uppercase tracking-wide text-gray-600 hover:bg-gray-50 hover:text-[#002B36] transition-all"
                >
                  <MdCall size={14} />
                  Call
                </a>

                {/* Track */}
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${
                    rider.currentLocation?.latitude || rider.latitude
                  },${rider.currentLocation?.longitude || rider.longitude}`}
                  target="_blank"
                  rel="noreferrer"
                  className="h-10 rounded-xl bg-[#002B36] hover:bg-black text-white flex items-center justify-center gap-1.5 text-[11px] font-black uppercase tracking-wide transition-all"
                >
                  <MdLocationOn size={14} className="text-[#CAEB66]" />
                  Track
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty Team Placeholder State */
        <div className="py-24 text-center bg-white rounded-[24px] border border-dashed border-gray-200 mt-2">
          <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100 text-xl">
            🚴‍♂️
          </div>
          <h4 className="text-[#002B36] font-black uppercase tracking-tight text-base mb-1">
            No Riders Registered in this Area
          </h4>
          <p className="text-gray-400 text-xs font-medium max-w-xs mx-auto">
            There are currently no delivery partners listed under the{" "}
            {managerData?.hubName || "current"} hub profile parameters.
          </p>
        </div>
      )}
    </div>
  );
};

export default RiderAreaWise;
