import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import {
  FaBarcode,
  FaUserCircle,
  FaPhoneAlt,
  FaBoxOpen,
  FaMapMarkerAlt,
  FaClock,
  FaCheckCircle,
} from "react-icons/fa";
import useAuth from "../../Hooks/useAuth";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import LoadingModal from "../../Components/LoadingModal/LoadingModal";
import {
  RiArrowGoBackLine,
  RiCloseLine,
  RiMap2Fill,
  RiMap2Line,
  RiNavigationFill,
} from "react-icons/ri";
import DynamicTitle from "../../Components/DynamicTitle/DynamicTitle";

const MyTaskRider = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [activeTab, setActiveTab] = useState("pickup");
  const [selectedMapLocation, setSelectedMapLocation] = useState(null);

  const {
    data: riderData = {},
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["riderTasks", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/riders?email=${user?.email}`);
      return res.data[0];
    },
  });
  
  const handlePickedUp = async (parcelId, trackingID) => {
    try {
      const res = await axiosSecure.patch("/riders/complete-pickup/update", {
        riderId: riderData._id,
        parcelId,
        trackingID,
      });

      if (res.data.success) {
        Swal.fire("Success", "Parcel picked up and status updated!", "success");
        refetch();
      }
    } catch (error) {
      Swal.fire("Error", "Something went wrong!", "error");
    }
  };

  const handleReturnReq = async (parcelId, trackingID) => {
    const confirmResult = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to request a return for this parcel to the hub?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#02312A",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Request Return",
    });

    if (!confirmResult.isConfirmed) return;

    try {
      const res = await axiosSecure.patch("/riders/return-req/update", {
        riderId: riderData._id,
        parcelId,
        trackingID,
      });

      if (res.data.success) {
        Swal.fire({
          title: "Return Requested",
          text: "Return request submitted! Please hand over the parcel to the hub manager.",
          icon: "success",
          confirmButtonColor: "#02312A",
        });
        refetch();
      }
    } catch (error) {
      Swal.fire({
        title: "Request Failed",
        text: "Something went wrong while processing the return request!",
        icon: "error",
        confirmButtonColor: "#02312A",
      });
    }
  };

  const handleDelivered = async (parcelId, trackingID) => {
    try {
      const res = await axiosSecure.patch("/riders/complete-delivered/update", {
        riderId: riderData._id,
        parcelId,
        trackingID,
      });

      if (res.data.success) {
        Swal.fire("Success", "Parcel Delivered and status updated!", "success");
        refetch();
      }
    } catch (error) {
      Swal.fire("Error", "Something went wrong!", "error");
    }
  };

  const handleReturnDelivered = async (parcelId, trackingID) => {
    try {
      const res = await axiosSecure.patch("/riders/complete-return-delivered/update", {
        riderId: riderData._id,
        parcelId,
        trackingID,
      });

      if (res.data.success) {
        Swal.fire("Success", "Parcel Delivered and status updated!", "success");
        refetch();
      }
    } catch (error) {
      Swal.fire("Error", "Something went wrong!", "error");
    }
  };

  const handleHoldUp = async (parcelId) => {
    Swal.fire({
      title:
        "<span class='text-[#02312A] font-black text-xl tracking-tight'>Are you sure?</span>",
      html: "<p class='text-gray-500 text-sm font-medium'>You want to put this parcel on Hold.</p>",
      icon: "warning",
      iconColor: "#02312A",
      showCancelButton: true,
      buttonsStyling: false,
      customClass: {
        popup: "rounded-2xl border border-gray-100 p-6 shadow-xl bg-white",
        confirmButton:
          "px-6 py-2.5 bg-[#CAEB66] text-[#02312A] border border-gray-200 font-black text-xs tracking-wider rounded-[7px] transition-all uppercase mx-2 cursor-pointer",
        cancelButton:
          "px-6 py-2.5 bg-gray-150 text-[#02312A]/80 border border-gray-200 font-black text-xs tracking-wider rounded-[7px] transition-all uppercase mx-2 cursor-pointer",
      },
      confirmButtonText: "Yes, Hold it!",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await axiosSecure.patch("/riders/hold-parcel/update", {
            riderId: riderData._id,
            parcelId,
          });

          if (res.data.success) {
            Swal.fire({
              title:
                "<span class='text-[#02312A] font-black text-xl tracking-tight'>Pipeline Shifted!</span>",
              html: "<p class='text-gray-500 text-sm font-medium'>Parcel status successfully shifted to hold.</p>",
              icon: "success",
              iconColor: "#CAEB66",
              buttonsStyling: false,
              customClass: {
                popup:
                  "rounded-2xl border border-gray-100 p-6 shadow-xl bg-white",
                confirmButton:
                  "px-6 py-2.5 bg-[#02312A] text-[#CAEB66] font-black text-xs tracking-wider rounded-xl hover:bg-[#03443a] transition-all uppercase cursor-pointer",
              },
              confirmButtonText: "Acknowledged",
            });

            refetch();
          }
        } catch (error) {
          Swal.fire({
            title:
              "<span class='text-rose-700 font-black text-xl tracking-tight'>Execution Failed</span>",
            html: "<p class='text-gray-500 text-sm font-medium'>Could not hold the parcel. Please try again.</p>",
            icon: "error",
            iconColor: "#f43f5e",
            buttonsStyling: false,
            customClass: {
              popup:
                "rounded-2xl border border-gray-100 p-6 shadow-xl bg-white",
              confirmButton:
                "px-6 py-2.5 bg-rose-600 text-white font-black text-xs tracking-wider rounded-xl hover:bg-rose-700 transition-all uppercase shadow-md cursor-pointer",
            },
            confirmButtonText: "Try Again",
          });
        }
      }
    });
  };

  if (isLoading) return <LoadingModal isLoading={true}></LoadingModal>;

  const activeTasks = riderData?.activeTasks || [];
  const pickupTasks = activeTasks.filter((task) => task.taskType === "pickup");
  const deliveryTasks = activeTasks.filter(
    (task) => task.taskType === "delivery",
  );
  const returnDeliveryTasks = activeTasks.filter(
    (task) => task.taskType === "return-delivery",
  );

  // const currentTabTasks = activeTab === "pickup" ? pickupTasks : deliveryTasks;
  const currentTabTasks =
    activeTab === "pickup"
      ? pickupTasks
      : activeTab === "delivery"
        ? deliveryTasks
        : returnDeliveryTasks;

  return (
    <div className="py-8 px-6 md:px-12 bg-[#ffffff] rounded-tradecen shadow-flat min-h-screen font-sans">
      <DynamicTitle title="Dashboard | My Task" />
      <div>
        <div className="mb-10 ">
          <h2 className="text-3xl font-black text-secondary mb-2 flex items-center gap-3">
            Rider Terminal
          </h2>
          <p className="text-gray-500 text-sm">
            Manage and track your active pipeline tasks in real-time.
          </p>
        </div>

        <div className="flex gap-2 border border-gray-100 mb-8 bg-white/50 p-1.5 rounded-xl w-fit">
          <button
            onClick={() => setActiveTab("pickup")}
            className={`flex-1 md:flex-none px-6 py-2.5 rounded-lg text-xs font-black tracking-wider uppercase transition-all duration-300 cursor-pointer ${
              activeTab === "pickup"
                ? "bg-[#CAEB66] text-[#02312A] shadow-sm"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            Pickups ({pickupTasks.length})
          </button>
          <button
            onClick={() => setActiveTab("delivery")}
            className={`flex-1 md:flex-none px-6 py-2.5 rounded-lg text-xs font-black tracking-wider uppercase transition-all duration-300 cursor-pointer ${
              activeTab === "delivery"
                ? "bg-[#CAEB66] text-[#02312A] shadow-sm"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            Deliveries ({deliveryTasks.length})
          </button>
          <button
            onClick={() => setActiveTab("return-delivery")}
            className={`flex-1 md:flex-none px-6 py-2.5 rounded-lg text-xs font-black tracking-wider uppercase transition-all duration-300 cursor-pointer ${
              activeTab === "return-delivery"
                ? "bg-[#CAEB66] text-[#02312A] shadow-sm"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            Return Deliveries ({returnDeliveryTasks.length})
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-separate border-spacing-y-3.5">
          <thead>
            <tr className="text-[#ADB5BD] text-[11px] uppercase tracking-widest font-black">
              <th className="px-6 py-2">Tracking & Parcel</th>
              <th className="px-6 py-2">Client Info</th>
              <th className="px-6 py-2">Location</th>
              <th className="px-6 py-2">COD Amount</th>
              <th className="px-6 py-2 text-center">Actions Terminal</th>
            </tr>
          </thead>
          <tbody>
            {currentTabTasks.map((task) => (
              <tr
                key={task.parcelId}
                className="bg-[#FFFFFF] hover:bg-[#F8F9FA]/80 border border-gray-100 transition-all rounded-xl group shadow-[0_2px_8px_rgba(0,0,0,0.01)]"
              >
                {/* COLUMN 1: TRACKING & NAME */}
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

                {/* COLUMN 2: CLIENT INFO */}
                <td className="px-6 py-4 text-xs text-[#02312A]">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-[#02312A]/3 text-[#02312A] rounded-xl flex items-center justify-center  transition-all">
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

                {/* COLUMN 3: LOCATION DETAILS */}
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

                {/* COLUMN 4: COD AMOUNT */}
                <td className="px-6 py-4 text-sm font-black text-[#02312A]">
                  <div className="flex flex-col">
                    <span className="text-sm font-black text-[#02312A]">
                      ৳ {task.codAmount || 0}
                    </span>
                  </div>
                </td>

                {/* COLUMN 5: LIVE ACTIONS INTERFACE */}
                <td className="px-6 py-4 rounded-r-xl max-w-[240px]">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      {/* 📞 Quick Call */}
                      <a
                        href={`tel:${task.merchantPhone || task.consumerPhone}`}
                        className="flex-1 py-2 flex justify-center bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-md transition-all cursor-pointer border border-gray-100"
                        title="Call Client"
                      >
                        <FaPhoneAlt size={12} />
                      </a>

                      {/* 🗺️ Live Navigation Map */}
                      <button
                        onClick={() =>
                          setSelectedMapLocation(
                            task.deliveryLocation || task.pickupLocation,
                          )
                        }
                        className="flex-1 py-2 flex justify-center bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-md transition-all cursor-pointer border border-gray-100"
                        title="View Map"
                      >
                        <RiMap2Line size={14} />
                      </button>

                      {activeTab === "delivery" && (
                        <div className="flex-1 flex">
                          {task.isHold ? (
                            <span className="w-full text-center bg-amber-50 text-amber-700 border border-amber-200 text-[11px] font-bold py-1.5 rounded-md">
                              On Hold
                            </span>
                          ) : (
                            <button
                              onClick={() => handleHoldUp(task.parcelId)}
                              className="w-full text-center bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 border border-amber-500/20 text-[11px] font-bold py-1.5 rounded-md transition-all cursor-pointer"
                            >
                              Hold
                            </button>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      {/* Action Button: Picked / Delivered */}
                      {activeTab !== "return-delivery" && (
                        <button
                          onClick={() =>
                            activeTab === "pickup"
                              ? handlePickedUp(task.parcelId, task.trackingID)
                              : handleDelivered(task.parcelId, task.trackingID)
                          }
                          className="bg-primary text-secondary text-[11px] font-black py-2 px-2 rounded-md transition-all cursor-pointer flex items-center justify-center gap-1 shadow-sm"
                        >
                          <FaCheckCircle size={11} />
                          {activeTab === "pickup" ? "Pick" : "Mark Deliver"}
                        </button>
                      )}

                      {/* Return Request Button */}
                      {activeTab === "delivery" && (
                        <button
                          onClick={() =>
                            handleReturnReq(task.parcelId, task.trackingID)
                          }
                          className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-[11px] font-black py-2 px-2 rounded-md transition-all cursor-pointer flex items-center justify-center gap-1"
                        >
                          <RiArrowGoBackLine size={11} />
                          To Return
                        </button>
                      )}

                      {activeTab === "return-delivery" && (
                        <button
                          onClick={() =>
                            handleReturnDelivered(
                              task.parcelId,
                              task.trackingID,
                            )
                          }
                          className="inline-flex items-center justify-center gap-1.5 bg-emerald-50 hover:bg-emerald-100/80 text-emerald-600 border border-emerald-200 text-[11px] font-bold py-2 px-3 rounded-lg transition-all active:scale-[0.98] cursor-pointer whitespace-nowrap tracking-wide col-span-2"
                        >
                          <RiArrowGoBackLine
                            size={11}
                            className="shrink-0 transform rotate-180"
                          />
                          <span>Handover to Merchant</span>
                        </button>
                      )}
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* EMPTY STATE LOGIC */}
        {currentTabTasks.length === 0 && (
          <div className="py-20 text-center bg-white rounded-2xl border border-dashed border-gray-200 mt-2">
            <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100 text-[#02312A]/30">
              <FaBoxOpen size={26} />
            </div>
            <h3 className="text-[#02312A] font-black text-lg tracking-tight">
              No active {activeTab}s queued
            </h3>
            <p className="text-gray-400 text-xs font-bold max-w-[320px] mx-auto mt-1.5 leading-relaxed">
              All caught up! When new {activeTab} orders are assigned by the
              TradeCen hub manager, they'll dispatch here live.
            </p>
          </div>
        )}
      </div>

      {/* Map  */}
      {selectedMapLocation && (
        <div className="fixed right-4 bottom-4 z-50 w-[92%] sm:w-[500px] bg-white border-2 border-[#02312A]/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-fade-in">
          {/* 🗺️ Header / Radar Track Bar */}
          <div className="px-4 py-3 bg-[#02312A] text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-[#CAEB66]/10 rounded-lg">
                <RiMap2Fill size={15} className="text-[#CAEB66]" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-[11px] font-black tracking-wider text-[#CAEB66] uppercase">
                  Rider Radar:
                </span>
                <span className="text-xs font-bold text-gray-200 max-w-[220px] sm:max-w-[280px] truncate">
                  {selectedMapLocation}
                </span>
              </div>
            </div>

            {/* Minimize Action */}
            <button
              onClick={() => setSelectedMapLocation(null)}
              className="p-1 hover:bg-white/10 text-gray-300 hover:text-white rounded-md transition-all cursor-pointer"
              title="Close View"
            >
              <RiCloseLine size={18} />
            </button>
          </div>

          {/* 🌐 WIDE LIVE MAP IFRAME CONTAINER */}
          <div className="w-full h-[260px] bg-gray-100 relative border-b border-gray-100">
            <iframe
              title="TradeCen Cockpit Navigation"
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

          {/* 🚀 Split Action Footer */}
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

export default MyTaskRider;
