import React from "react";
import {
  RiAlarmWarningLine,
  RiArrowGoBackLine,
  RiCheckboxCircleLine,
  RiFocus2Line,
  RiMapPin2Line,
  RiTimeLine,
  RiTruckLine,
  RiUserReceivedLine,
  RiWallet3Line,
  RiQrScanLine,
  RiNotification3Line,
} from "react-icons/ri";
import useAuth from "../../Hooks/useAuth";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import LoadingModal from "../../Components/LoadingModal/LoadingModal";
import { LucideWarehouse } from "lucide-react";
import { Link } from "react-router";
import { BiLineChart } from "react-icons/bi";
import Swal from "sweetalert2";
import DynamicTitle from "../../Components/DynamicTitle/DynamicTitle";

const HubmanagerDashboard = () => {
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
    enabled: !!user && !!user?.accessToken,
  });

  const { isLoading: incomingLoading, data: incomingData = [] } = useQuery({
    queryKey: ["inComingData", managerData?.hubName],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/parcels/incoming/${managerData?.hubName}`,
      );
      return res.data;
    },
    enabled: !!managerData?.hubName && !!user && !!user?.accessToken,
  });

  const { isLoading: inHouseLoading, data: inHouseData = [] } = useQuery({
    queryKey: ["inHouseData", managerData?.hubName],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/warehouse/sorting-house/${managerData?.hubName}`,
      );
      return res.data;
    },
    enabled: !!managerData?.hubName && !!user && !!user?.accessToken,
  });

  const { isLoading: outForDeliveryLoading, data: outForDeliveryData = [] } =
    useQuery({
      queryKey: ["outForDeliveryData", managerData?.hubName],
      queryFn: async () => {
        const res = await axiosSecure.get(
          `/parcels/out-for-delivery/${managerData?.hubName}`,
        );
        return res.data;
      },
      enabled: !!managerData?.hubName && !!user && !!user?.accessToken,
    });

  const { isLoading: hubDeliveredDataLoading, data: hubDeliveredData = [] } =
    useQuery({
      queryKey: ["hubDeliveredData", managerData?.hubName],
      queryFn: async () => {
        const res = await axiosSecure.get(
          `/parcels/hub-delivered/${managerData?.hubName}`,
        );
        return Array.isArray(res.data) ? res.data : [];
      },
      enabled: !!managerData?.hubName && !!user && !!user?.accessToken,
    });

  const {
    isLoading: handCashDataLoading,
    data: handCashData = {},
    refetch: handCashRefetch,
  } = useQuery({
    queryKey: ["hubHandCash", managerData?.hubName],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/hub-hand-cash/${managerData?.hubName}`,
      );
      return res.data || {};
    },
    enabled: !!managerData?.hubName && !!user && !!user?.accessToken,
  });

  const {
    isLoading: hqPayableProfitDataLoading,
    data: hqPayableProfitData = {},
    refetch: hqPayableProfitDataRefetch,
  } = useQuery({
    queryKey: ["hqPayableProfitData", managerData?.hubName],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/hub-profit-metrics/${managerData?.hubName}`,
      );
      return res.data || {};
    },
    enabled: !!managerData?.hubName && !!user && !!user?.accessToken,
  });

  const { isLoading: agingStatusDataLoading, data: agingStatusData = {} } =
    useQuery({
      queryKey: ["agingStatusData", managerData?.hubName],
      queryFn: async () => {
        const res = await axiosSecure.get(
          `/hub-aging-status/${managerData?.hubName}`,
        );
        return res.data || {};
      },
      enabled: !!managerData?.hubName && !!user && !!user?.accessToken,
    });
    console.log(agingStatusData);
  const {
    isLoading: ridersLoading,
    data: riders = [],
    refetch,
  } = useQuery({
    queryKey: ["ridersAreaWise", managerData?.hubName],
    queryFn: async () => {
      const res = await axiosSecure.get(`/riders?area=${managerData?.hubName}`);
      return Array.isArray(res.data) ? res.data : [];
    },
    enabled: !!managerData?.hubName && !!user && !!user?.accessToken,
  });

  const {
    isLoading: hubEffDataLoading,
    data: hubEffData = {},
    refetch: hubEffDataRefetch,
  } = useQuery({
    queryKey: ["hubEffData", managerData?.hubName],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/hub-efficiency-flow/${managerData?.hubName}`,
      );
      return res.data ? res.data : {};
    },
    enabled: !!managerData?.hubName && !!user && !!user?.accessToken,
  });

  const handleDepositToHQ = async () => {
    const parcelIds = handCashData?.parcels?.map((parcel) => parcel._id);

    const { value: trxID } = await Swal.fire({
      title: "Enter bKash TrxID",
      input: "text",
      inputPlaceholder: "e.g. BK2026M789X",
      showCancelButton: true,
      confirmButtonColor: "#CAEB66",
      cancelButtonColor: "#d33",

      confirmButtonText:
        '<span style="color: #02312A; font-weight: bold;">Confirm Deposit</span>',

      inputValidator: (value) => {
        if (!value) return "You must enter a Transaction ID!";
      },
    });

    if (!trxID) return;

    const reqInfo = {
      depositedAmount: handCashData?.totalHandCash || 0,
      parcelIds: parcelIds,
      paymentMethod: "Bkash",
      submittedBy: `Hub Manager ${managerData?.hubName}`,
      transactionDetails: {
        slipNo: trxID,
        note: "Weekly deposit from Raipur Hub",
      },
    };
    try {
      const response = await axiosSecure.post(
        `/deposit-HQ/${handCashData?.hubName}`,
        reqInfo,
      );

      if (response.data.success) {
        handCashRefetch();
        hqPayableProfitDataRefetch();

        Swal.fire({
          icon: "success",
          title:
            '<span style="color: #02312A; font-weight: 900;">Request Submitted!</span>',
          html: `<p style="color: #4A5568; font-size: 14px; font-weight: 600;">
              Deposit request of <span style="color: #02312A; font-weight: 900;">৳${reqInfo.depositedAmount}</span> 
              for ${reqInfo.parcelIds.length} parcels has been sent to HQ Pending Ledger.
             </p>`,
          iconColor: "#02312A",
          confirmButtonColor: "#CAEB66",
          confirmButtonText:
            '<span style="color: #02312A; font-weight: bold;">Great, Got It!</span>',
          background: "#FFFFFF",
          customClass: {
            popup: "rounded-[20px]",
          },
        });
      }
    } catch (error) {
      const errMsg =
        error.response?.data?.message ||
        "Connection timeout or internal failure.";

      Swal.fire({
        icon: "error",
        title:
          '<span style="color: #E53E3E; font-weight: 900;">Submission Failed</span>',
        html: `<p style="color: #4A5568; font-size: 14px; font-weight: 600;">${errMsg}</p>`,
        iconColor: "#E53E3E",
        confirmButtonColor: "#02312A",
        confirmButtonText:
          '<span style="color: #CAEB66; font-weight: bold;">Try Again</span>',
        background: "#FFFFFF",
        customClass: {
          popup: "rounded-[20px]",
        },
      });
    }
  };
  
  const stats = [
    {
      label: "Incoming",
      count: incomingData?.length,
      icon: <RiUserReceivedLine />,
      color: "text-blue-600",
      bg: "bg-blue-50",
      path: "/dashboard/incoming",
    },
    {
      label: "In House",
      count: inHouseData?.total,
      icon: <LucideWarehouse />,
      color: "text-purple-600",
      bg: "bg-purple-50",
      path: "/dashboard/dispatch-delivery",
    },
    {
      label: "Out for Delivery",
      count: outForDeliveryData?.length,
      icon: <RiTruckLine />,
      color: "text-orange-600",
      bg: "bg-orange-50",
      path: "/dashboard/out-for-delivery",
    },
    {
      label: "Completed",
      count: hubDeliveredData?.length,
      icon: <RiCheckboxCircleLine />,
      color: "text-green-600",
      bg: "bg-green-50",
      path: "/dashboard/hub-delivered",
    },
  ];

  if (
    managerLoading ||
    incomingLoading ||
    inHouseLoading ||
    outForDeliveryLoading ||
    hubDeliveredDataLoading ||
    ridersLoading ||
    agingStatusDataLoading ||
    hubEffDataLoading
  ) {
    return <LoadingModal isLoading={true}></LoadingModal>;
  }
  return (
    <div className="px-8 bg-[#ffffff] rounded-tradecen shadow-flat py-5 space-y-8 min-h-screen font-sans">
      <DynamicTitle title="Hub Dashboard" />
      {/* HEADER SECTION */}
      <div className="flex justify-between items-end">
        <div>
          <span className="text-[10px] font-black uppercase tracking-[2px] text-gray-400">
            Hub Terminal {managerData?.district}
          </span>
          <h1 className="text-3xl font-black text-secondary mt-1">
            {managerData?.hubName} Hub
          </h1>
        </div>
        <div className="flex gap-3">
          <button className="p-3 bg-white border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-all">
            <RiNotification3Line size={20} />
          </button>
          <button className="bg-secondary text-[#CAEB66] px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 hover:opacity-90 transition-all">
            <RiQrScanLine size={18} /> Quick Scan
          </button>
        </div>
      </div>

      {/* COUNTER STATS GRID (Full Width Row) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <Link
            to={stat?.path}
            key={i}
            className="bg-white p-6 rounded-tradecen border border-gray-100 hover:border-[#CAEB66] shadow-flat transition-all"
          >
            <div
              className={`${stat.bg} ${stat.color} w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-4`}
            >
              {stat.icon}
            </div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">
              {stat.label}
            </p>
            <h2 className="text-2xl font-black text-slate-800 mt-1">
              {stat.count}
            </h2>
          </Link>
        ))}
      </div>

      {/* FINANCIAL VAULT HUB (Full Width Twin Cards Row) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* CARD 1: Total Hand Cash */}
        <div className="bg-secondary p-8 rounded-tradecen text-white shadow-flat relative overflow-hidden border border-white/5 w-full">
          <div className="relative flex flex-col h-full justify-between">
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></span>
                  <p className="text-[10px] font-black text-white/40 uppercase tracking-[2px]">
                    Total Hand Cash
                  </p>
                </div>
                {handCashData.totalParcelCount > 0 && (
                  <span className="text-[9px] font-black bg-amber-400/10 text-amber-400 px-2 py-0.5 rounded-md border border-amber-400/20 uppercase tracking-wider">
                    {handCashData.totalParcelCount}{" "}
                    {handCashData.totalParcelCount === 1 ? "Parcel" : "Parcels"}
                  </span>
                )}
              </div>
              <h2 className="text-4xl font-black mt-3 text-white font-mono">
                ৳ {handCashData.totalHandCash?.toLocaleString("en-IN") || 0}
              </h2>
              <p className="text-[11px] text-white/30 mt-1 font-medium">
                {handCashData.totalHandCash > 0
                  ? `Live box cash generated from ${handCashData.totalParcelCount} delivered operations.`
                  : "Safe & clear! No pending cash in the vault right now."}
              </p>
            </div>
            <div>
              <div className="h-[1px] w-full bg-white/10 my-6"></div>
              <div className="text-center text-[10px] text-white/40 font-bold uppercase tracking-wider py-1.5 bg-white/5 rounded-xl border border-white/5 flex items-center justify-center gap-1.5">
                <span
                  className={`w-1.5 h-1.5 rounded-full ${handCashData.totalHandCash > 0 ? "bg-emerald-500" : "bg-white/20"}`}
                ></span>
                {handCashData.totalHandCash > 0
                  ? "Active Asset Managed"
                  : "Vault Empty & Secured"}
              </div>
            </div>
          </div>
          <RiWallet3Line className="absolute -bottom-4 -right-4 text-white/5 size-32 rotate-12" />
        </div>

        {/* CARD 2: HQ Payable Cash */}
        <div className="bg-[#022A24] p-8 rounded-tradecen text-white shadow-flat relative overflow-hidden border border-[#CAEB66]/10">
          <div className="relative flex flex-col h-full justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-[#CAEB66] rounded-full"></span>
                <p className="text-[10px] font-black text-[#CAEB66]/60 uppercase tracking-[2px]">
                  HQ Payable Cash (Earnings)
                </p>
              </div>
              <h2 className="text-4xl font-black mt-3 text-[#CAEB66] font-mono">
                ৳{" "}
                {hqPayableProfitData?.hqPayableProfit?.toLocaleString(
                  "en-IN",
                ) || 0}
              </h2>
              <p className="text-[11px] text-[#CAEB66]/40 mt-1 font-medium">
                Pure accumulated delivery charges owed to HQ.
              </p>
            </div>
            <div>
              <div className="h-[1px] w-full bg-white/5 my-6"></div>
              <button
                onClick={handleDepositToHQ}
                className="w-full py-4 bg-[#CAEB66] text-[#002B36] rounded-2xl text-[11px] font-black uppercase tracking-wider hover:scale-[1.02] active:scale-[0.99] transition-all cursor-pointer shadow-md shadow-[#CAEB66]/5"
              >
                Deposit Profits to HQ
              </button>
            </div>
          </div>
          <BiLineChart className="absolute -bottom-4 -right-4 text-[#CAEB66]/5 size-32 rotate-6" />
        </div>
      </div>

      {/* FULL-WIDTH ROW FOR INCOMING SHIPMENTS */}
      <div className="w-full">
        <div className="bg-white p-8 rounded-tradecen border border-gray-100 shadow-flat">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-black text-secondary text-base tracking-wide flex items-center gap-1">
              <div className="w-[6px] h-5 bg-[#CAEB66] rounded-[20px]"></div>
              Incoming Shipments
            </h3>
            <Link
              to="/dashboard/incoming"
              className="text-[10px] font-black uppercase text-gray-400 hover:text-[#02312A] tracking-widest transition-colors cursor-pointer"
            >
              See All ({incomingData?.length || 0})
            </Link>
          </div>

          {/* Dynamic height handling without crushing side layouts */}
          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
            {(Array.isArray(incomingData) ? incomingData : [])?.map(
              (parcel) => (
                <div
                  key={parcel._id}
                  className="flex flex-col lg:flex-row items-start lg:items-center justify-between p-5 bg-white border border-gray-100/70 hover:border-[#02312A]/10 hover:shadow-sm rounded-[16px] transition-all duration-300 gap-5 group relative overflow-hidden"
                >
                  {/* Left Side: Identifiers & Core Logic */}
                  <div className="flex flex-1 items-start gap-4 min-w-0 w-full">
                    {/* Primary Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <h4 className="text-sm font-black text-[#02312A] tracking-wide truncate group-hover:text-[#02312A]/90">
                          {parcel.parcelName}
                        </h4>
                      </div>

                      {/* Meta Specs Grid (UX Cleaner) */}
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-2.5 text-[10px] text-gray-400 font-bold uppercase tracking-wide">
                        <div className="flex items-center gap-1">
                          <span>Merchant:</span>
                          <span className="text-slate-700 font-black normal-case">
                            {parcel.senderInfo?.name || "Unknown"}
                          </span>
                        </div>

                        <div className="w-1 h-1 bg-gray-300 rounded-full shrink-0"></div>

                        <div className="flex items-center gap-1">
                          <span>Weight:</span>
                          <span className="text-slate-700 font-black lowercase">
                            {parcel.parcelWeight || 0}kg
                          </span>
                        </div>

                        <div className="w-1 h-1 bg-gray-300 rounded-full shrink-0"></div>

                        <span className="text-[#02312A] font-black bg-[#CAEB66] px-2 py-0.5 rounded-md text-[9px] border border-[#02312A]/5">
                          {parcel.parcelType || "Document"}
                        </span>

                        <div className="w-1 h-1 bg-gray-300 rounded-full shrink-0"></div>

                        {/* Route Badge */}
                        {parcel.serviceCenters && (
                          <span className="text-[9px] font-black bg-[#02312A]/5 text-[#02312A] border border-[#02312A]/10 px-2 py-0.5 rounded-md uppercase tracking-wider">
                            {parcel.serviceCenters.origin} &rarr;{" "}
                            {parcel.serviceCenters.destination}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Side: Financial Status & Timeline */}
                  <div className="w-full lg:w-auto flex lg:flex-col sm:flex-row flex-col justify-between items-start lg:items-end gap-3 lg:gap-1.5 border-t lg:border-t-0 border-gray-100 pt-4 lg:pt-0 shrink-0">
                    {/* COD Section (If Applicable) */}
                    {parcel.revMethod === "COD" ? (
                      <div className="lg:text-right">
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                          Collect Amount
                        </p>
                        <p className="text-sm font-black text-amber-600 mt-0.5">
                          ৳{parcel.codAmount}
                        </p>
                      </div>
                    ) : (
                      <div className="lg:text-right">
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                          Payment Method
                        </p>
                        <p className="text-[10px] font-black text-slate-700 uppercase tracking-wider mt-0.5">
                          {parcel.revMethod || "Prepaid"}
                        </p>
                      </div>
                    )}

                    {/* Booking Time */}
                    <div className="lg:text-right">
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                        Booked At
                      </p>
                      <p className="text-[10px] font-black text-slate-500 mt-0.5">
                        {parcel.createdAt
                          ? new Date(parcel.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "Just Now"}
                      </p>
                    </div>
                  </div>
                </div>
              ),
            )}

            {(!incomingData || incomingData.length === 0) && (
              <div className="py-12 text-center border border-dashed border-gray-100 rounded-[20px]">
                <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">
                  No incoming shipments for today
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* LOWER GRID: Action shortcuts, Aging status, and Riders grouped together side by side */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Quick Actions Column */}
        <div className="flex flex-col gap-4">
          <Link
            to="/dashboard/return-parcels"
            className="bg-white p-6 shadow-flat h-full rounded-tradecen border border-orange-100 flex items-center justify-between group hover:border-orange-300 transition-all cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="bg-orange-50 p-3 rounded-2xl text-orange-500">
                <RiArrowGoBackLine size={24} />
              </div>
              <div>
                <h4 className="font-bold text-slate-800">Return Requests</h4>
                <p className="text-[10px] text-gray-400 uppercase font-black">
                  0 Items Pending
                </p>
              </div>
            </div>
            <div className="text-orange-200 group-hover:text-orange-500 transition-colors">
              ➔
            </div>
          </Link>

          <Link
            to="/dashboard/incoming"
            className="bg-white p-6 shadow-flat h-full rounded-tradecen border border-blue-100 flex items-center justify-between group hover:border-blue-300 transition-all cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="bg-blue-50 p-3 rounded-2xl text-blue-500">
                <RiFocus2Line size={24} />
              </div>
              <div>
                <h4 className="font-bold text-slate-800">New Pickups</h4>
                <p className="text-[10px] text-gray-400 uppercase font-black">
                  {incomingData?.length} Requests Nearby
                </p>
              </div>
            </div>
            <div className="text-blue-200 group-hover:text-blue-500 transition-colors">
              ➔
            </div>
          </Link>
        </div>

        {/* Aging Status Column */}
        <div className="bg-white p-6 rounded-tradecen border border-gray-100 shadow-flat flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-4">
            <RiTimeLine className="text-blue-500" />
            <h3 className="font-black text-slate-800 text-sm">Aging Status</h3>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="text-center p-3 bg-green-50 rounded-[15px] border border-green-100">
              <span className="text-[9px] font-black text-green-600 block">
                24H
              </span>
              <span className="text-lg font-black text-green-800">
                {agingStatusData?.age24H}
              </span>
            </div>
            <div className="text-center p-3 bg-yellow-50 rounded-[15px] border border-yellow-100">
              <span className="text-[9px] font-black text-yellow-600 block">
                48H
              </span>
              <span className="text-lg font-black text-yellow-800">
                {agingStatusData?.age48H}
              </span>
            </div>
            <div className="text-center p-3 bg-red-50 rounded-[15px] border border-red-100">
              <span className="text-[9px] font-black text-red-600 block">
                72H+
              </span>
              <span className="text-lg font-black text-red-800">
                {agingStatusData?.age72HPlus}
              </span>
            </div>
          </div>
        </div>

        {/* On-Duty Riders Column */}
        <div className="bg-white p-6 rounded-tradecen border border-gray-100 shadow-flat">
          <h3 className="font-black text-slate-800 mb-4 text-sm">
            On-Duty Riders
          </h3>
          <div className="space-y-4">
            {riders.map((rider, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-50 rounded-2xl border border-gray-100 flex items-center justify-center font-bold text-xs uppercase">
                    {rider?.name[0]}
                  </div>
                  <div>
                    <p className="text-[13px] font-black text-secondary mb-1">
                      {" "}
                      {rider?.name}{" "}
                    </p>
                    <p
                      className={`text-[8px] w-fit font-black uppercase tracking-wider ${
                        rider?.workStatus === "available"
                          ? "text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200"
                          : "text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200"
                      }`}
                    >
                      {rider?.workStatus}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-black text-xs text-slate-800">
                    {rider?.currentTasks}
                  </p>
                  <p className="text-[8px] uppercase font-bold text-gray-300">
                    Jobs
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* BOTTOM SECTION: Full Width Efficiency Flow */}
      <div className="bg-white p-8 rounded-tradecen border border-gray-100 shadow-flat">
        {/* Top Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="font-black text-[#02312A] text-sm tracking-tight flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#CAEB66] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#CAEB66]"></span>
              </span>
              Hub Efficiency Flow
            </h3>
            <p className="text-[10px] font-bold text-gray-400 mt-0.5 uppercase tracking-wider">
              Live Logistics Metrics ({hubEffData.totalActive} Active)
            </p>
          </div>
          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-md">
            TradeCen Engine v1.0
          </p>
        </div>

        {/* Stacked Progress Bar */}
        <div className="h-3.5 w-full bg-gray-100/70 rounded-full overflow-hidden flex shadow-inner">
          {/* Sorting Segment */}
          <div
            title={`In House / Sorting — ${hubEffData.sorting}%`}
            className="h-full bg-amber-500 border-r border-white/40 transition-all duration-500 hover:opacity-90 cursor-pointer"
            style={{ width: `${hubEffData.sorting}%` }}
          ></div>

          {/* Transit Segment */}
          <div
            title={`Out For Delivery — ${hubEffData.outDelivery}%`}
            className="h-full bg-blue-600 border-r border-white/40 transition-all duration-500 hover:opacity-90 cursor-pointer"
            style={{ width: `${hubEffData.outDelivery}%` }}
          ></div>

          {/* Delivered Segment */}
          <div
            title={`Successfully Delivered — ${hubEffData.delivered}%`}
            className="h-full bg-[#CAEB66] transition-all duration-500 hover:opacity-90 cursor-pointer"
            style={{ width: `${hubEffData.delivered}%` }}
          ></div>
        </div>

        {/* Bottom Labels & Percentages */}
        <div className="grid grid-cols-3 gap-2 mt-6 pt-4 border-t border-gray-50">
          {/* Sorting */}
          <div>
            <div className="flex items-center gap-1.5 text-gray-400">
              <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0"></span>
              <span className="text-[9px] font-black uppercase tracking-wider truncate">
                Sorting
              </span>
            </div>
            <p className="text-sm font-black text-[#02312A] mt-0.5">
              {hubEffData.sorting}%
            </p>
          </div>

          {/* Transit */}
          <div>
            <div className="flex items-center gap-1.5 text-gray-400">
              <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0"></span>
              <span className="text-[9px] font-black uppercase tracking-wider truncate">
                Out for Delivery
              </span>
            </div>
            <p className="text-sm font-black text-[#02312A] mt-0.5">
              {hubEffData.outDelivery}%
            </p>
          </div>

          {/* Delivered */}
          <div>
            <div className="flex items-center gap-1.5 text-gray-400">
              <span className="w-2 h-2 rounded-full bg-[#CAEB66] shrink-0"></span>
              <span className="text-[9px] font-black uppercase tracking-wider truncate">
                Delivered
              </span>
            </div>
            <p className="text-sm font-black text-[#02312A] mt-0.5">
              {hubEffData.delivered}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HubmanagerDashboard;
