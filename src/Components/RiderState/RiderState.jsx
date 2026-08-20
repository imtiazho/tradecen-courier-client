import { Bike, MapPin, Power } from "lucide-react";
import React, { useEffect, useState } from "react";
import {
  RiTruckLine,
  RiCheckboxCircleLine,
  RiCompass3Line,
  RiHandCoinLine,
  RiAlertLine,
  RiPhoneLine,
  RiMapPin2Line,
  RiMap2Line,
  RiQrScanLine,
  RiSignalTowerLine,
  RiCheckDoubleLine,
  RiStarFill,
  RiAwardLine,
  RiShieldUserLine,
  RiAlertFill,
  RiToolsFill,
  RiCustomerService2Fill,
  RiPhoneFill,
  RiGovernmentFill,
  RiMapPinRangeLine,
  RiCloseLine,
  RiNavigationFill,
  RiMap2Fill,
  RiMoneyDollarCircleLine,
  RiTimeLine,
  RiListCheck2,
  RiSettings3Line,
  RiArrowGoBackLine,
} from "react-icons/ri";
import { TbUserQuestion } from "react-icons/tb";
import { IoBagCheckOutline } from "react-icons/io5";
import { Link } from "react-router";
import useAuth from "../../Hooks/useAuth";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import LoadingModal from "../LoadingModal/LoadingModal";
import Swal from "sweetalert2";
import DynamicTitle from "../DynamicTitle/DynamicTitle";

const RiderState = () => {
  const [localWorkStatus, setLocalWorkStatus] = useState(null);
  const [selectedMapLocation, setSelectedMapLocation] = useState(null);
  const [isOnline, setIsOnline] = useState(true);
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

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

    enabled: !!user && !!user?.accessToken,
  });

  const handlePickedUp = async (parcelId, trackingID) => {
    try {
      const res = await axiosSecure.patch("/riders/complete-pickup/update", {
        riderId: riderAllData.riderData._id,
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

  const handleDelivered = async (parcelId, trackingID) => {
    try {
      const res = await axiosSecure.patch("/riders/complete-delivered/update", {
        riderId: riderAllData.riderData._id,
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
        riderId: riderAllData?.riderData?._id,
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

  const handleReturnDelivered = async (parcelId, trackingID) => {
    try {
      const res = await axiosSecure.patch(
        "/riders/complete-return-delivered/update",
        {
          riderId: riderAllData?.riderData._id,
          parcelId,
          trackingID,
        },
      );

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
            riderId: riderAllData.riderData._id,
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

  useEffect(() => {
    if (
      localWorkStatus === null ||
      localWorkStatus === riderAllData?.riderData?.workStatus
    )
      return;

    const delayDebounceFn = setTimeout(async () => {
      try {
        await axiosSecure.patch(`/rider/status/${user.email}`, {
          workStatus: localWorkStatus,
        });

        refetch();
      } catch (error) {
        console.error("Status update failed", error);
        setLocalWorkStatus(riderAllData?.riderData?.workStatus);
      }
    }, 700);

    return () => clearTimeout(delayDebounceFn);
  }, [
    localWorkStatus,
    riderAllData?.riderData?.workStatus,
    user?.email,
    refetch,
    axiosSecure,
  ]);

  const toggleStatus = () => {
    setLocalWorkStatus((prev) =>
      prev === "available" ? "offline" : "available",
    );
  };

  const currentStatus = localWorkStatus || riderAllData?.riderData?.workStatus;
  const isSyncing =
    localWorkStatus !== null &&
    localWorkStatus !== riderAllData?.riderData?.workStatus;

  if (riderLoading) return <LoadingModal isLoading={true}></LoadingModal>;

  return (
    <div className="min-h-screen text-[#02312A] font-sans antialiased">
      <DynamicTitle title="Rider Dashboard" />
      <div className="space-y-4">
        {/* Name Card  */}
        <div className="relative overflow-hidden p-6 rounded-tradecen bg-gradient-to-br from-[#CAEB66] via-[#d4f273] to-[#b9da55] shadow-flat transition-all duration-300 group">
          <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-white/40 blur-[60px] pointer-events-none group-hover:scale-110 transition-all duration-500"></div>
          <div className="absolute -bottom-24 -left-24 w-48 h-48 rounded-full bg-[#02312A]/5 blur-[60px] pointer-events-none"></div>

          <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
            {/* 👤 LEFT SIDE: AVATAR AND IDENTITY DETAILS */}
            <div className="flex items-center gap-6 text-center md:text-left flex-col md:flex-row w-full md:w-auto">
              <div className="relative">
                <div
                  className={`p-1 rounded-2xl border-2 transition-colors duration-300 bg-white/30 backdrop-blur-sm ${
                    currentStatus === "available"
                      ? "border-[#02312A]"
                      : "border-rose-700/40"
                  }`}
                >
                  <img
                    src={riderAllData?.riderData?.photoURL}
                    className="w-20 h-20 md:w-24 md:h-24 rounded-xl object-cover shadow-sm"
                    alt="Rider Avatar"
                  />
                </div>

                <span className="absolute -bottom-1 -right-1 flex h-4 w-4 md:h-5 md:w-5">
                  {currentStatus === "available" && (
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#02312A] opacity-30"></span>
                  )}
                  <span
                    className={`relative inline-flex rounded-full border-2 border-[#CAEB66] h-full w-full shadow-sm ${
                      currentStatus === "available"
                        ? "bg-[#02312A]"
                        : "bg-rose-600"
                    }`}
                  ></span>
                </span>
              </div>

              <div className="space-y-1.5">
                <div className="flex flex-col md:flex-row items-center md:items-baseline gap-2.5">
                  <h1 className="text-xl md:text-2xl font-black text-[#02312A] tracking-tight capitalize">
                    {riderAllData?.riderData?.name}
                  </h1>
                  <span className="text-[9px] font-extrabold tracking-widest text-[#CAEB66] bg-[#02312A] px-2.5 py-0.5 rounded-md uppercase shadow-sm">
                    RIDER
                  </span>
                </div>

                <p className="text-[#02312A]/70 text-xs flex items-center justify-center md:justify-start gap-1.5 font-bold">
                  <MapPin className="w-3.5 h-3.5 text-[#02312A]" />
                  <span>
                    {riderAllData.riderData?.area},{" "}
                    {riderAllData.riderData?.district}
                  </span>
                </p>

                <div className="mt-3 flex gap-2 justify-center md:justify-start pt-1">
                  <span className="bg-[#02312A]/5 border border-[#02312A]/10 px-3 py-1 rounded-xl text-[11px] font-black text-[#02312A] flex items-center gap-1.5">
                    <Bike className="w-3.5 h-3.5 text-[#02312A]" />
                    {riderAllData?.riderData?.vehicle} Fleet
                  </span>
                  <span className="bg-[#02312A]/5 border border-[#02312A]/10 px-3 py-1 rounded-xl text-[11px] font-extrabold text-[#02312A]/70 uppercase tracking-wider">
                    ID: {riderAllData?.riderData?._id.slice(18, 24)}
                  </span>
                </div>
              </div>
            </div>

            {/* 🛰️ RIGHT SIDE: TELEMETRY & ONLINE/OFFLINE ACTION */}
            <div className="flex flex-col items-center md:items-end gap-3 w-full md:w-auto border-t border-[#02312A]/10 pt-5 md:pt-0 md:border-none">
              <div className="flex items-center gap-1.5">
                <RiSignalTowerLine
                  className={`text-xs ${
                    currentStatus === "available"
                      ? "text-[#02312A] animate-pulse"
                      : "text-rose-700"
                  } ${isSyncing ? "opacity-50 animate-bounce" : ""}`}
                />
                <span className="text-[10px] text-[#02312A]/70 uppercase tracking-widest font-black">
                  {isSyncing ? "Syncing Telemetry..." : "Telemetry Link"}
                </span>
              </div>

              <button
                onClick={toggleStatus}
                disabled={isSyncing}
                className={`w-full md:w-auto px-6 py-2.5 rounded-xl font-black text-xs tracking-wider transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-95 ${
                  isSyncing
                    ? "bg-amber-500 text-white animate-pulse shadow-none cursor-wait"
                    : currentStatus === "available"
                      ? "bg-[#02312A] text-[#CAEB66] hover:bg-[#03443a] hover:shadow-[0_4px_15px_rgba(2,49,42,0.2)]"
                      : "bg-rose-600 text-white hover:bg-rose-700 hover:shadow-[0_4px_15px_rgba(225,29,72,0.2)]"
                }`}
              >
                <Power
                  className={`w-3.5 h-3.5 stroke-[2.5] ${isSyncing ? "animate-spin" : ""}`}
                />{" "}
                {isSyncing
                  ? "UPDATING..."
                  : currentStatus === "available"
                    ? "GO OFFLINE"
                    : "GO ONLINE"}
              </button>
            </div>
          </div>
        </div>

        {/* CORE SUMMARY MATRICES */}
        <div className="grid grid-cols-4 gap-4">
          {[
            {
              label: "Assigned",
              val: riderAllData?.assignedParcels?.length,
              icon: <RiTruckLine />,
              col: "text-[#02312A]",
              link: "/dashboard/my-task",
            },
            {
              label: "Hold",
              val: riderAllData?.holdUpParcels?.length,
              icon: <IoBagCheckOutline />,
              col: "text-amber-500",
              link: "/dashboard/hold-parcels",
            },
            {
              label: "Delivered",
              val: riderAllData?.deliveredParcels?.length,
              icon: <RiCheckboxCircleLine />,
              col: "text-emerald-500",
              link: "/dashboard/delivered-parcels",
            },
            {
              label: "Collected Cash",
              val: `৳ ${riderAllData?.totalCollectedAmount}`,
              icon: <RiHandCoinLine />,
              col: "text-emerald-600",
              link: "/dashboard",
            },
          ].map((card, idx) => (
            <Link
              to={card.link}
              key={idx}
              className={`bg-white border border-gray-100 p-5 rounded-[12px] shadow-flat flex flex-col justify-between transition-all hover:border-[#CAEB66]`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  {card.label}
                </span>
                <div className={`text-base ${card?.col}`}>{card.icon}</div>
              </div>
              <h3 className="text-xl font-black mt-3">{card.val}</h3>
            </Link>
          ))}
        </div>

        <div className="bg-white rounded-tradecen shadow-flat overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex justify-between items-center">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-secondary text-base tracking-wide flex items-center gap-2">
                  <div className="w-[4px] h-5 bg-[#CAEB66] rounded-[15px]"></div>
                  Pick Up & Delivery Manifest
                </h3>
              </div>
              <p className="text-[11px] font-medium text-gray-400 mt-1">
                Quick access to your immediate pending dispatches
              </p>
            </div>

            <Link
              to="/dashboard/my-task"
              className="text-[10px] font-black uppercase text-gray-400 hover:text-[#02312A] tracking-widest transition-colors cursor-pointer"
            >
              See All
            </Link>
          </div>

          <div className="">
            {riderAllData?.assignedParcels?.length > 0 ? (
              riderAllData?.assignedParcels?.slice(0, 5).map((parcel) => (
                <div
                  key={parcel.parcelId}
                  className={`m-6 px-5 pt-8 pb-5 transition-all bg-[#FFFFFF] hover:bg-[#F8F9FA]/60 rounded-2xl relative border border-gray-100`}
                >
                  <span
                    className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-bl-xl rounded-tr-sm absolute top-0 right-0 ${
                      parcel.taskType === "delivery"
                        ? "bg-[#02312A]/10 text-[#02312A]"
                        : parcel.taskType === "return-delivery"
                          ? "bg-rose-500/10 text-rose-600"
                          : "bg-purple-500/10 text-purple-700"
                    }`}
                  >
                    {parcel.taskType === "return-delivery"
                      ? "Return"
                      : parcel.taskType}
                  </span>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    {/* Package Info */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-gray-400">
                          # {parcel.trackingID}
                        </span>
                      </div>
                      <h4 className="text-[12px] font-medium text-[#02312A] capitalize">
                        {parcel?.parcelName?.length >= 18
                          ? parcel.parcelName.slice(0, 18) + "..."
                          : parcel.parcelName}
                      </h4>
                      <p className="text-[10px] text-gray-500 flex items-center gap-1">
                        <RiMapPin2Line size={11} className="text-gray-400" />{" "}
                        {parcel.deliveryLocation}
                      </p>
                    </div>

                    {/* COD amount */}
                    <div className="">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                        COD to Collect
                      </p>
                      <h4 className="text-base font-black text-[#02312A]">
                        ৳ {parcel.codAmount}
                      </h4>
                    </div>

                    {/* Action Terminal Buttons */}
                    <div className="flex items-center gap-1.5 self-end sm:self-center">
                      <a
                        href={`tel:${parcel.consumerPhone || parcel.merchantPhone}`}
                        className="p-2.5 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-md transition-all cursor-pointer"
                      >
                        <RiPhoneLine size={15} />
                      </a>
                      <button
                        onClick={() =>
                          setSelectedMapLocation(
                            parcel.deliveryLocation || parcel.pickupLocation,
                          )
                        }
                        className="p-2.5 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-md transition-all cursor-pointer"
                      >
                        <RiMap2Line size={15} />
                      </button>

                      <div className="flex items-center gap-1.5 pl-1 w-full justify-start">
                        {parcel.taskType === "delivery" ? (
                          <div className="flex flex-col gap-1.5">
                            <div className="flex items-center gap-1.5 w-full">
                              <button
                                onClick={() =>
                                  handleDelivered(
                                    parcel.parcelId,
                                    parcel.trackingID,
                                  )
                                }
                                className="bg-primary text-secondary text-xs font-bold px-3.5 py-2 rounded-md transition-all cursor-pointer whitespace-nowrap"
                              >
                                Delivered
                              </button>
                              {parcel.isHold ? (
                                <span className="text-center bg-amber-50 text-amber-700 border border-amber-200 text-[11px] font-bold py-2 px-3.5 rounded-md whitespace-nowrap">
                                  On Hold
                                </span>
                              ) : (
                                <button
                                  onClick={() => handleHoldUp(parcel.parcelId)}
                                  className="text-center bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 border border-amber-500/20 text-[11px] font-bold py-2 px-4 rounded-md transition-all cursor-pointer whitespace-nowrap"
                                >
                                  Hold
                                </button>
                              )}
                            </div>

                            <button
                              onClick={() =>
                                handleReturnReq(
                                  parcel.parcelId,
                                  parcel.trackingID,
                                )
                              }
                              className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-[11px] font-black py-2 px-2 rounded-md transition-all cursor-pointer flex items-center justify-center gap-1 col-span-1 w-full"
                            >
                              <RiArrowGoBackLine size={11} />
                              To Return
                            </button>
                          </div>
                        ) : parcel.taskType === "return-delivery" ? (
                          <button
                            onClick={() =>
                              handleReturnDelivered(
                                parcel.parcelId,
                                parcel.trackingID,
                              )
                            }
                            className="inline-flex items-center justify-center gap-1.5 bg-emerald-50 hover:bg-emerald-100/80 text-emerald-600 border border-emerald-200 text-[11px] font-bold py-2 px-3 rounded-lg transition-all active:scale-[0.98] cursor-pointer whitespace-nowrap tracking-wide"
                          >
                            <RiArrowGoBackLine
                              size={11}
                              className="shrink-0 transform rotate-180"
                            />
                            <span>Handover to Merchant</span>
                          </button>
                        ) : (
                          <button
                            onClick={() =>
                              handlePickedUp(parcel.parcelId, parcel.trackingID)
                            }
                            className="bg-primary text-secondary text-xs font-bold px-3.5 py-2 rounded-md transition-all cursor-pointer whitespace-nowrap"
                          >
                            Picked
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="m-6 py-20 text-center bg-white rounded-tradecen border border-dashed border-gray-100 mt-6">
                <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100 text-lg">
                  📦
                </div>
                <p className="text-gray-400 font-black uppercase tracking-widest text-xs">
                  No parcels found
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-[#02312A] text-white p-5 rounded-tradecen shadow-flat space-y-3.5">
          {/* Header Title */}
          <h3 className="text-sm font-black tracking-wider text-[#CAEB66]">
            Shift Metrics Dock
          </h3>

          <div className="grid grid-cols-3 gap-3">
            {/* Metric 1: Conversion Rate */}
            <div className="p-3.5 bg-white/5 rounded-xl border border-white/5 flex flex-col justify-between">
              <span className="text-[10px] font-bold text-gray-400 block uppercase tracking-wide">
                Conversion Rate
              </span>
              <div className="flex items-center gap-1.5 mt-1.5 font-black text-sm text-white">
                <RiCheckboxCircleLine className="text-[#CAEB66]" />{" "}
                {Math.round(riderAllData?.conversionRate) || 0}%
              </div>
            </div>

            {/* Metric 2: Rider Rating */}
            <div className="p-3.5 bg-white/5 rounded-xl border border-white/5 flex flex-col justify-between">
              <span className="text-[10px] font-bold text-gray-400 block uppercase tracking-wide">
                Rider Rating
              </span>
              <div className="flex items-center gap-1.5 mt-1.5 font-black text-sm text-white">
                <RiStarFill className="text-amber-400" />{" "}
                {riderAllData?.riderData?.rating}
              </div>
            </div>

            {/* Load Handled  */}
            <div className="p-3.5 bg-white/5 rounded-xl border border-white/5 flex flex-col justify-between">
              <span className="text-[10px] font-bold text-gray-400 block uppercase tracking-wide">
                Load Handled
              </span>
              <div className="flex items-center gap-1.5 mt-1.5 font-black text-sm text-white">
                <RiSettings3Line className="text-sky-400" />{" "}
                {riderAllData?.loadHandled || 0} KG
              </div>
            </div>
          </div>

          {/* Todays work progress */}
          <div className="bg-[#CAEB66]/10 border border-[#CAEB66]/20 p-4 rounded-xl space-y-2.5">
            {/* Top Labels */}
            <div className="flex justify-between items-center text-xs font-bold text-white tracking-wide">
              <div className="flex flex-col">
                <span className="text-gray-300 font-medium">
                  Today's Progress
                </span>
                <span className="text-[10px] text-gray-400 mt-0.5">
                  {riderAllData?.todaysCompleteTotal || 0} /{" "}
                  {riderAllData?.todaysParcelCount || 0} Tasks Done
                </span>
              </div>

              <span className="font-black text-[#02312A] bg-[#CAEB66] text-[11px] px-2.5 py-1 rounded-md tracking-wider shadow-sm">
                {riderAllData?.todaysParcelCount > 0
                  ? Math.round(
                      (riderAllData?.todaysCompleteTotal /
                        riderAllData?.todaysParcelCount) *
                        100,
                    )
                  : 0}
                % Done
              </span>
            </div>

            <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden border border-white/5">
              <div
                className="bg-[#CAEB66] h-full rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(202,235,102,0.4)]"
                style={{
                  width: `${
                    riderAllData?.todaysParcelCount > 0
                      ? Math.min(
                          Math.round(
                            (riderAllData?.todaysCompleteTotal /
                              riderAllData?.todaysParcelCount) *
                              100,
                          ),
                          100,
                        )
                      : 0
                  }%`,
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* EMERGENCY SOS & RIDER SUPPORT DISPATCH CENTER (FULL WIDTH) */}
        <div className="w-full bg-white border border-rose-100 rounded-tradecen shadow-flat overflow-hidden mt-6 animate-pulse-subtle">
          {/* Header Section (Emergency Theme) */}
          <div className="p-5 border-b border-rose-50 flex justify-between items-center bg-rose-50/20">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-black tracking-tight text-rose-950">
                  Emergency SOS & Support Dispatch
                </h3>
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-600"></span>
                </span>
              </div>
              <p className="text-[11px] text-rose-700/70 font-medium">
                On-road crisis protocol. Instant connection to TradeCen helpdesk
              </p>
            </div>

            <span className="text-[10px] font-black text-white bg-rose-600 px-2.5 py-1 rounded-sm uppercase tracking-wider shadow-sm animate-bounce-slow">
              Critical Unit
            </span>
          </div>

          <div className="p-5 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              {/* Report Accident */}
              <button className="p-4 bg-rose-50 hover:bg-rose-100/70 border border-rose-100 rounded-[10px] flex items-center gap-3.5 text-left transition-all group hover:scale-[1.01] cursor-pointer">
                <div className="p-3 bg-rose-600 text-white rounded-sm shadow-md group-hover:bg-rose-700 transition-colors">
                  <RiAlertFill size={20} />
                </div>
                <div>
                  <h4 className="text-xs font-black text-rose-950">
                    Report Accident
                  </h4>
                  <p className="text-[10px] text-rose-700 font-medium mt-0.5">
                    Crash or personal injury
                  </p>
                </div>
              </button>

              {/* Vehicle Breakdown */}
              <button className="p-4 bg-amber-50/60 hover:bg-amber-100/50 border border-amber-100 rounded-[10px] flex items-center gap-3.5 text-left transition-all group hover:scale-[1.01] cursor-pointer">
                <div className="p-3 bg-amber-500 text-white rounded-sm shadow-md group-hover:bg-amber-600 transition-colors">
                  <RiToolsFill size={20} />
                </div>
                <div>
                  <h4 className="text-xs font-black text-amber-950">
                    Bike Breakdown
                  </h4>
                  <p className="text-[10px] text-amber-700 font-medium mt-0.5">
                    Engine or tire puncture
                  </p>
                </div>
              </button>

              {/* Customer Dispute */}
              <button className="p-4 bg-blue-50/60 hover:bg-blue-100/50 border border-blue-100 rounded-[10px] flex items-center gap-3.5 text-left transition-all group hover:scale-[1.01] cursor-pointer">
                <div className="p-3 bg-blue-600 text-white rounded-sm shadow-md group-hover:bg-blue-700 transition-colors">
                  <TbUserQuestion size={20} />
                </div>
                <div>
                  <h4 className="text-xs font-black text-blue-950">
                    Customer Issue
                  </h4>
                  <p className="text-[10px] text-blue-700 font-medium mt-0.5">
                    Refusal, harassment or cash gap
                  </p>
                </div>
              </button>
            </div>

            {/* 📞 COMMUNICATIONS TERMINAL (Quick Actions & Dialers) */}
            <div className="pt-2 border-t border-gray-100">
              {/* Right Part: Direct Hotline Dialers */}
              <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                {/* Hub Manager Phone */}
                <a
                  href="tel:+8801700000000"
                  className="w-full sm:w-auto text-center text-[11px] font-bold text-gray-600 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 border border-gray-100 px-3 py-2 rounded-sm transition-all flex items-center justify-center gap-1.5"
                >
                  <RiPhoneFill size={13} className="text-gray-400" /> Hub
                  Manager
                </a>

                {/* National Emergency 999 */}
                <a
                  href="tel:999"
                  className="w-full sm:w-auto text-center text-[11px] font-black text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-100 px-3 py-2 rounded-sm transition-all flex items-center justify-center gap-1.5"
                >
                  <RiGovernmentFill size={13} /> Police / Ambulance (999)
                </a>
              </div>
            </div>
          </div>
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
    </div>
  );
};

export default RiderState;
