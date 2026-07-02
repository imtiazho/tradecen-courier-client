import React, { useState } from "react";
import useAuth from "../../Hooks/useAuth";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import LoadingModal from "../../Components/LoadingModal/LoadingModal";
import Swal from "sweetalert2";

import {
  FaBarcode,
  FaClock,
  FaUserCircle,
  FaMapMarkerAlt,
  FaBoxOpen,
  FaPhoneAlt,
  FaUndoAlt,
} from "react-icons/fa";
import {
  RiMap2Line,
  RiMap2Fill,
  RiCloseLine,
  RiNavigationFill,
} from "react-icons/ri";

const RiderReturnReq = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [selectedMapLocation, setSelectedMapLocation] = useState(null);

  // Rider er shob data query kora hocche holds page er motoi
  const {
    isLoading: riderLoading,
    data: riderAllData = {},
    refetch,
  } = useQuery({
    queryKey: ["riderAllData", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/rider/${user.email}`);
      return Array.isArray(res.data) && res.data.length > 0
        ? res.data[0]
        : res.data;
    },
    enabled: !!user?.email,
  });

  // Return parcels er collection fetch kora hocche line 38 e
  const returnParcels = riderAllData?.returnParcels || [];

  // Return complete handle korar function
  const handleReturnComplete = async (parcelId, trackingID) => {
    try {
      const res = await axiosSecure.patch("/riders/return-complete/update", {
        riderId: riderAllData?.riderData._id,
        parcelId,
        trackingID,
      });

      if (res.data.success) {
        Swal.fire("Success", "Parcel successfully returned to hub!", "success");
        refetch();
      }
    } catch (error) {
      Swal.fire("Error", "Failed to update return status!", "error");
    }
  };

  if (riderLoading) return <LoadingModal isLoading={true}></LoadingModal>;

  return (
    <div className="py-8 px-6 md:px-12 bg-[#ffffff] rounded-tradecen shadow-flat min-h-screen font-sans">
      <div>
        <div className="mb-10">
          <h2 className="text-3xl font-black text-[#02312A] mb-2 flex items-center gap-3">
            Rider Return Ledger
          </h2>
          <p className="text-gray-500 text-sm">
            Manage and process shipments requests marked for return to the merchant or hub.
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-separate border-spacing-y-3.5">
          <thead>
            <tr className="text-[#ADB5BD] text-[11px] uppercase tracking-widest font-black">
              <th className="px-6 py-2">Tracking & Parcel</th>
              <th className="px-6 py-2">Client Info</th>
              <th className="px-6 py-2">Return Destination</th>
              <th className="px-6 py-2">COD Amount</th>
              <th className="px-6 py-2 text-center">Actions Terminal</th>
            </tr>
          </thead>
          <tbody>
            {returnParcels.map((task) => (
              <tr
                key={task.parcelId}
                className="bg-[#FFFFFF] hover:bg-[#F8F9FA]/80 border border-gray-100 transition-all rounded-xl group shadow-[0_2px_8px_rgba(0,0,0,0.01)]"
              >
                <td className="px-6 py-4 rounded-l-xl text-xs text-[#02312A]">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <FaBarcode className="text-[#02312A]/40 text-xs" />
                      <span className="font-mono font-black text-gray-400 tracking-tight uppercase text-[11px]">
                        {task.trackingID}
                      </span>
                    </div>
                    <p className="font-bold text-sm text-[#02312A] line-clamp-1 capitalize">
                      {task.parcelName || "Standard Shipment"}
                    </p>
                    <div className="flex items-center gap-1 text-[10px] text-gray-400 font-bold">
                      <FaClock size={10} />
                      <span>
                        {task.assignedAt
                          ? new Date(task.assignedAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "Just Now"}
                      </span>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4 text-xs text-[#02312A]">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-[#02312A]/3 text-[#02312A] rounded-xl flex items-center justify-center transition-all">
                      <FaUserCircle size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-[#02312A]">
                        {task.merchantName ||
                          task.consumerName ||
                          "Walk-in Client"}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4 text-xs text-[#02312A] max-w-[220px]">
                  <div className="flex items-center gap-1.5">
                    <FaMapMarkerAlt
                      className="text-[#02312A] mt-0.5 shrink-0"
                      size={13}
                    />
                    <p className="text-xs text-gray-600 font-medium leading-tight line-clamp-2">
                      {task.pickupLocation ||
                        task.deliveryLocation ||
                        "Hub Office"}
                    </p>
                  </div>
                </td>

                <td className="px-6 py-4 text-sm font-black text-[#02312A]">
                  <span className="text-sm font-black text-[#02312A]">
                    ৳ {task.codAmount || 0}
                  </span>
                </td>

                <td className="px-6 py-4 rounded-r-xl">
                  <div className="flex items-center justify-center gap-2">
                    <a
                      href={`tel:${task.merchantPhone || task.consumerPhone}`}
                      className="p-2.5 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-md transition-all cursor-pointer"
                      title="Call Client"
                    >
                      <FaPhoneAlt size={12} />
                    </a>

                    <button
                      onClick={() =>
                        setSelectedMapLocation(
                          task.pickupLocation || task.deliveryLocation,
                        )
                      }
                      className="p-2.5 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-md transition-all cursor-pointer"
                    >
                      <RiMap2Line size={15} />
                    </button>

                    <button
                      onClick={() =>
                        handleReturnComplete(task.parcelId, task.trackingID)
                      }
                      className="bg-red-500 hover:bg-red-600 text-white text-xs font-bold px-3.5 py-2 rounded-md transition-all cursor-pointer flex items-center gap-2 shadow-sm"
                    >
                      <FaUndoAlt size={11} />
                      Complete Return
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {returnParcels.length === 0 && (
          <div className="py-20 text-center bg-white rounded-2xl border border-dashed border-gray-200 mt-2">
            <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100 text-[#02312A]/30">
              <FaBoxOpen size={26} />
            </div>
            <h3 className="text-[#02312A] font-black text-lg tracking-tight">
              Return ledger is completely empty
            </h3>
            <p className="text-gray-400 text-xs font-bold max-w-[320px] mx-auto mt-1.5 leading-relaxed">
              No return tasks assigned. All shipments are safely delivered or currently on course.
            </p>
          </div>
        )}
      </div>

      {/* Map Segment */}
      {selectedMapLocation && (
        <div className="fixed right-4 bottom-4 z-50 w-[92%] sm:w-[500px] bg-white border-2 border-[#02312A]/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-fade-in">
          <div className="px-4 py-3 bg-[#02312A] text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-[#CAEB66]/10 rounded-lg">
                <RiMap2Fill size={15} className="text-[#CAEB66]" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-[11px] font-black tracking-wider text-[#CAEB66] uppercase">
                  Return Location:
                </span>
                <span className="text-xs font-bold text-gray-200 max-w-[220px] sm:max-w-[280px] truncate">
                  {selectedMapLocation}
                </span>
              </div>
            </div>

            <button
              onClick={() => setSelectedMapLocation(null)}
              className="p-1 hover:bg-white/10 text-gray-300 hover:text-white rounded-md transition-all cursor-pointer"
            >
              <RiCloseLine size={18} />
            </button>
          </div>

          <div className="w-full h-[260px] bg-gray-100 relative border-b border-gray-100">
            <iframe
              title="TradeCen Return Navigation"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://maps.google.com/maps?q=${encodeURIComponent(
                selectedMapLocation + ", Dhaka, Bangladesh",
              )}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
            ></iframe>
          </div>

          <div className="p-2.5 bg-gray-50 flex items-center justify-between gap-3">
            <div className="text-[10px] text-gray-400 font-bold pl-1.5 uppercase tracking-wide hidden sm:block">
              TradeCen Routing Engine v1.0
            </div>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                selectedMapLocation + ", Dhaka, Bangladesh",
              )}`}
              target="_blank"
              rel="noreferrer"
              className="ml-auto bg-white hover:bg-gray-100 text-[#02312A] border border-gray-200 font-black text-[10px] px-4 py-2 rounded-lg tracking-wider uppercase shadow-sm transition-all flex items-center gap-1.5"
            >
              <RiNavigationFill size={11} className="text-[#02312A]" /> Launch
              External Navigation
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default RiderReturnReq;