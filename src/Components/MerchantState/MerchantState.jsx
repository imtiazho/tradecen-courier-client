import React, { useState } from "react";
import {
  RiAddLine,
  RiCalendarLine,
  RiEditLine,
  RiExternalLinkLine,
  RiFilter2Line,
  RiInformationLine,
  RiMore2Fill,
  RiTruckLine,
} from "react-icons/ri";
import { TbCurrencyTaka } from "react-icons/tb";

import { Link } from "react-router";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import DynamicTitle from "../DynamicTitle/DynamicTitle";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import useAuth from "../../Hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import LoadingModal from "../LoadingModal/LoadingModal";

// Temp Disable
const alerts = [
  {
    type: "Damaged",
    id: "#SP11251C",
    time: "2 Hours ago",
    color: "bg-cyan-100 text-cyan-600",
  },
  {
    type: "Damaged",
    id: "#SP11251C",
    time: "2 Hours ago",
    color: "bg-red-100 text-red-500",
  },
  {
    type: "Damaged",
    id: "#SP11251C",
    time: "2 Hours ago",
    color: "bg-cyan-100 text-cyan-600",
  },
  {
    type: "Damaged",
    id: "#SP11251C",
    time: "2 Hours ago",
    color: "bg-gray-100 text-gray-500",
  },
];

const MerchantState = () => {
  // Data Loading
  const { user } = useAuth();
  const [timeFrame, setTimeFrame] = useState("this-week");
  const [weekFrame, setWeekFrame] = useState("this-week");
  const axiosSecure = useAxiosSecure();
  const [totalParcels, setTotalParcels] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const limit = 10;
  const { isLoading: statusLoading, data: stats = {} } = useQuery({
    queryKey: ["statistics", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/parcels/stats/${user.email}`);
      return res.data;
    },
    enabled: !!user && !!user?.accessToken,
  });

  // merchant
  const { isLoading: chartLoading, data: chartData = {} } = useQuery({
    queryKey: ["revenueStats", user?.email, timeFrame],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/revenue/stats/${user?.email}?filter=${timeFrame}`,
      );
      return res.data;
    },
    enabled: !!user && !!user?.accessToken,
  });

  // merchant
  const { isLoading: shippingLoading, data: shippingData = {} } = useQuery({
    queryKey: ["shippingData", user?.email, weekFrame, currentPage],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/parcels?email=${user.email}&limit=${limit}&skip=${limit * currentPage}&filter=${weekFrame}`,
      );
      setTotalParcels(res.data.count);
      setTotalPages(Math.ceil(res.data.count / limit));
      return res.data.data;
    },
    enabled: !!user && !!user?.accessToken,
  });

  const { isLoading: lateInvoicesLoading, data: lateInvoicesData = [] } =
    useQuery({
      queryKey: ["lateInvoicesData", user?.email],
      queryFn: async () => {
        const res = await axiosSecure.get(`/late-invoices/${user.email}`);
        return res.data;
      },
      enabled: !!user && !!user?.accessToken,
    });

  const [isOpenGraph, setIsOpenGraph] = useState(false);
  const [isOpenShipping, setIsOpenShipping] = useState(false);
  const [selectedGraphMonth, setSelectedGraphMonth] = useState("this-week");
  const [selectedShipping, setSelectedShipping] = useState("this-week");

  const options = ["this-week", "last-week", "last-month"];

  const statistic = [
    {
      to: "unpaid-parcel",
      label: "To Pay",
      value: stats.toPay,
      color: "text-gray-400",
    },
    {
      to: "ready-pickup",
      label: "Ready Pick UP",
      value: stats.readyPickUp,
      color: "text-[#CAEB66]",
    },
    {
      to: "in-transit",
      label: "In Transit",
      value: stats.inTransit,
      color: "text-blue-400",
    },
    {
      to: "ready-deliver",
      label: "Ready to Deliver",
      value: stats.readyDeliver,
      color: "text-orange-400",
    },
    {
      to: "delivered",
      label: "Delivered",
      value: stats.delivered,
      color: "text-green-500",
    },
  ];

  if (shippingLoading || chartLoading || statusLoading)
    return <LoadingModal isLoading={true}></LoadingModal>;

  return (
    <div className="space-y-6 font-sans">
      <DynamicTitle title="Merchant Dashboard" />
      {/* --- Header Section --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-secondary tracking-[.6px]">
            Dashboard Overview
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            You can access all your data and information from anywhere.
          </p>
        </div>
      </div>

      {/* --- Stats Cards --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {statistic.map((stat, idx) => (
          <Link
            to={stat.to}
            key={idx}
            className="bg-white p-5 rounded-[12px] border border-gray-50 shadow-flat flex items-center gap-4  transition-transform duration-300 hover:border-[#CAEB66]"
          >
            <div
              className={`w-12 h-12 rounded-2xl bg-[#F8F9FA] flex items-center justify-center ${stat.color}`}
            >
              <RiTruckLine size={24} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.4px]">
                {stat.label}
              </p>
              <h4 className="text-xl font-black text-[#002B36]">
                {stat.value}
              </h4>
            </div>
          </Link>
        ))}
      </div>

      {/* --- Overall Statistics Graph (Recharts) --- */}
      <div className="bg-white p-6 rounded-[20px] border shadow-flat  border-gray-50 w-full">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-black text-secondary text-base tracking-wide flex items-center gap-1">
            <div className="w-[6px] h-5 bg-[#CAEB66] rounded-[20px]"></div>
            Overall Statistics
          </h3>
          <div className="flex items-center gap-3">
            <div className="relative inline-block w-40">
              <div
                onClick={() => setIsOpenGraph(!isOpenGraph)}
                className="flex items-center justify-between px-4 py-3 rounded-[25px] border border-gray-300 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <RiCalendarLine className="text-gray-400" size={16} />
                  <span className="text-xs font-bold text-[#002B36] capitalize">
                    {selectedGraphMonth.split("-").join(" ")}
                  </span>
                </div>
                <span
                  className={`text-[10px] text-gray-400 transition-transform duration-300 ${isOpenGraph ? "rotate-180" : ""}`}
                >
                  ▼
                </span>
              </div>

              {/* Dropdown Menu */}
              {isOpenGraph && (
                <div className="absolute top-[110%] left-0 w-full bg-white border border-gray-50 rounded-xl shadow-2xl py-2 z-50 overflow-hidden animate-in fade-in zoom-in duration-200">
                  {options.map((option) => (
                    <div
                      key={option}
                      onClick={() => {
                        setSelectedGraphMonth(option);
                        setIsOpenGraph(false);
                        setTimeFrame(option);
                      }}
                      className={`px-4 py-2 text-xs font-bold transition-colors cursor-pointer capitalize
                ${
                  selectedGraphMonth === option
                    ? "bg-[#CAEB66] text-[#002B36]"
                    : "text-gray-500 hover:bg-[#F8F9FA] hover:text-[#002B36]"
                }`}
                    >
                      {option.split("-").join(" ")}
                    </div>
                  ))}
                </div>
              )}

              {/* Background click to close */}
              {isOpenGraph && (
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsOpenGraph(false)}
                ></div>
              )}
            </div>
            <button className="p-3 rounded-[25px]  hover:text-[#002B36] transition-colors border border-gray-300">
              <RiMore2Fill className="text-gray-500" size={20} />
            </button>
          </div>
        </div>

        {/* Recharts Area Chart */}
        <div className="h-[370px] w-full">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 10, right: 30, left: -15, bottom: 30 }}
              >
                <defs>
                  <linearGradient id="zapGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#CAEB66" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="#CAEB66" stopOpacity={0} />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  strokeDasharray="4 4"
                  vertical={true}
                  horizontal={true}
                  stroke="#E9ECEF"
                />

                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#ADB5BD", fontSize: 12, fontWeight: 600 }}
                  dy={15}
                  interval="preserveStartEnd"
                  minTickGap={30}
                />

                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#ADB5BD", fontSize: 12, fontWeight: 600 }}
                  tickFormatter={(value) => {
                    if (value >= 1000) {
                      return `${value / 1000}k`;
                    }
                    return value;
                  }}
                />

                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white p-3 shadow-lg rounded-xl border border-gray-50">
                          <p className="text-[10px] font-bold text-gray-400 mb-1">
                            {payload[0].payload.name}
                          </p>
                          <p className="text-sm font-black text-[#002B36] flex items-center gap-2">
                            <span className="w-2 h-2 bg-[#CAEB66] rounded-full"></span>
                            ৳{payload[0].value.toLocaleString()}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />

                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#CAEB66"
                  strokeWidth={4}
                  fillOpacity={1}
                  fill="url(#zapGradient)"
                  animationDuration={1500}
                  dot={false}
                  activeDot={{
                    r: 6,
                    fill: "#CAEB66",
                    stroke: "white",
                    strokeWidth: 3,
                    boxShadow: "0 0 10px rgba(0,0,0,0.2)",
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center text-gray-400">
              No revenue data available for this week.
            </div>
          )}
        </div>
      </div>

      {/* --- Shipping Reports Table --- */}
      <div className="bg-white p-8 rounded-[20px] shadow-flat border border-gray-50 w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h3 className="font-bold text-[#002B36] text-lg">Shipping Reports</h3>
          <div className="flex items-center gap-3">
            <div className="relative inline-block w-40">
              <div
                onClick={() => setIsOpenShipping(!isOpenShipping)}
                className="flex items-center justify-between px-4 py-3 rounded-[25px] border border-gray-300 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <RiCalendarLine className="text-gray-400" size={16} />
                  <span className="text-xs font-bold text-[#002B36] capitalize">
                    {selectedShipping.split("-").join(" ")}
                  </span>
                </div>
                <span
                  className={`text-[10px] text-gray-400 transition-transform duration-300 ${isOpenShipping ? "rotate-180" : ""}`}
                >
                  ▼
                </span>
              </div>

              {/* Dropdown Menu */}
              {isOpenShipping && (
                <div className="absolute top-[110%] left-0 w-full bg-white border border-gray-50 rounded-xl shadow-2xl py-2 z-50 overflow-hidden animate-in fade-in zoom-in duration-200 capitalize">
                  {options.map((option) => (
                    <div
                      key={option}
                      onClick={() => {
                        setSelectedShipping(option);
                        setIsOpenShipping(false);
                        setWeekFrame(option);
                      }}
                      className={`px-4 py-2 text-xs font-bold transition-colors cursor-pointer
                ${
                  selectedShipping === option
                    ? "bg-[#CAEB66] text-[#002B36]"
                    : "text-gray-500 hover:bg-[#F8F9FA] hover:text-[#002B36]"
                }`}
                    >
                      {option.split("-").join(" ")}
                    </div>
                  ))}
                </div>
              )}

              {/* Background click to close */}
              {isOpenShipping && (
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsOpenShipping(false)}
                ></div>
              )}
            </div>
            <button className="p-3 rounded-[25px] hover:text-[#002B36] transition-colors border border-gray-300">
              <RiFilter2Line className="text-gray-500" size={20} />
            </button>
            <button className="p-3 rounded-[25px] hover:text-[#002B36] transition-colors border border-gray-300">
              <RiMore2Fill className="text-gray-500" size={20} />
            </button>
          </div>
        </div>

        {/* Table Area */}
        <div className="overflow-x-auto border border-gray-100 p-2 rounded-[20px]">
          <table className="w-full border-separate border-spacing-y-3">
            <thead>
              <tr className="text-[#2d2d2d] text-left">
                <th className="pb-4 pl-4 font-bold text-[11px] uppercase tracking-wider">
                  ID
                </th>
                <th className="pb-4 font-bold text-[11px] uppercase tracking-wider">
                  Client
                </th>
                <th className="pb-4 font-bold text-[11px] uppercase tracking-wider">
                  Date
                </th>
                <th className="pb-4 font-bold text-[11px] uppercase tracking-wider">
                  Weight
                </th>
                <th className="pb-4 font-bold text-[11px] uppercase tracking-wider">
                  Price
                </th>
                <th className="pb-4 font-bold text-[11px] uppercase tracking-wider">
                  Status
                </th>
                <th className="pb-4 pr-4 text-right font-bold text-[11px] uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {shippingData.length > 0 ? (
                shippingData.map((item, idx) => (
                  <tr key={idx} className="group transition-all rounded-xl">
                    <td className="py-5 pl-5 rounded-l-[20px] bg-[#F8F9FA]/60 border-y border-l border-transparent group-hover:border-gray-100 font-bold text-gray-500 text-xs">
                      {item?.trackingID}
                    </td>
                    <td className="py-5 bg-[#F8F9FA]/60 border-y border-transparent group-hover:border-gray-100 text-xs font-semibold text-gray-500">
                      {item?.receiverInfo?.name}
                    </td>
                    <td className="py-5 bg-[#F8F9FA]/60  border-y border-transparent group-hover:border-gray-100 text-xs text-gray-500 font-medium">
                      {new Date(item?.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="py-5 bg-[#F8F9FA]/60 border-y border-transparent group-hover:border-gray-100 text-xs font-bold text-gray-500">
                      {item?.parcelWeight} KG
                    </td>
                    <td className="py-5 bg-[#F8F9FA]/60 border-y border-transparent group-hover:border-gray-100 text-xs font-black text-gray-500">
                      ৳ {item?.codAmount}
                    </td>
                    <td className="py-5 bg-[#F8F9FA]/60 border-y border-transparent group-hover:border-gray-100">
                      {(() => {
                        const statusConfig = {
                          "parcel-created": "bg-gray-100 text-gray-600",
                          "assign-pickup-rider":
                            "bg-purple-100 text-purple-600",
                          "reached-origin-warehouse":
                            "bg-indigo-100 text-indigo-600",
                          "in-transit": "bg-blue-100 text-blue-600",
                          "reached-destination-warehouse":
                            "bg-cyan-100 text-cyan-600",
                          "assign-delivery-rider":
                            "bg-orange-100 text-orange-600",
                          delivered: "bg-green-100 text-green-600",
                          returned: "bg-red-100 text-red-600", // In future
                        };

                        const currentStatus =
                          item?.deliveryStatus || "parcel-created";
                        const colorClass =
                          statusConfig[currentStatus] ||
                          "bg-gray-100 text-gray-500";

                        return (
                          <span
                            className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${colorClass}`}
                          >
                            {currentStatus.split("-").join(" ")}
                          </span>
                        );
                      })()}
                    </td>
                    <td className="py-5 pr-5 rounded-r-[20px] bg-[#F8F9FA]/60 border-y border-r border-transparent group-hover:border-gray-100 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button className="flex items-center gap-1 text-[11px] font-bold text-gray-500 hover:text-[#002B36] cursor-pointer">
                          <RiEditLine size={16} /> Edit
                        </button>
                        <button className="text-gray-500 hover:text-[#002B36] cursor-pointer">
                          <RiMore2Fill size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-20 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-400 gap-2">
                      <span className="text-3xl">📄</span>
                      <p className="text-xs font-bold uppercase tracking-widest">
                        No late shipping data available
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Placeholder */}
        <div className="mt-8 grid grid-cols-3 items-center justify-center">
          <div className="flex justify-start">
            {currentPage > 0 && (
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-400 hover:text-[#002B36] transition-all flex items-center gap-2 cursor-pointer"
              >
                ← Previous
              </button>
            )}
          </div>
          <div className="flex gap-2 justify-center">
            {[...Array(totalPages).keys()].map((n, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(n)}
                className={`w-8 h-8 rounded-lg text-xs font-bold transition-all cursor-pointer ${n === currentPage ? "bg-[#CAEB66] text-[#002B36]" : "text-gray-400 hover:bg-gray-50"}`}
              >
                {n + 1}
              </button>
            ))}
          </div>
          <div className="flex justify-end">
            {currentPage < totalPages - 1 && (
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-400 hover:text-[#002B36] transition-all flex items-center gap-2 cursor-pointer"
              >
                Next →
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Late Invoices and Damage report  */}
      <div className="grid grid-cols-1 gap-6">
        <div className="bg-white p-6 rounded-[20px] border border-gray-50 shadow-[1px_1px_1px_1px_rgba(0,0,0,0.01)] w-full h-full">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-[#002B36] text-lg tracking-wide">
              Late Invoices
            </h3>
            <div className="flex items-center gap-2">
              <button className="bg-[#CAEB66] text-[#002B36] px-5 py-2.5 rounded-full text-xs font-bold transition-all">
                View All Invoices
              </button>
              <button className="p-3 rounded-[25px] hover:text-[#002B36] transition-colors border border-gray-300">
                <RiFilter2Line size={18} />
              </button>
              <button className="p-3 rounded-[25px] hover:text-[#002B36] transition-colors border border-gray-300">
                <RiMore2Fill size={18} />
              </button>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-gray-50">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[#ADB5BD] text-[11px] uppercase font-bold border-b border-gray-50">
                  <th className="py-4 px-4">No</th>
                  <th className="py-4 px-4">Price</th>
                  <th className="py-4 px-4">Date</th>
                  <th className="py-4 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {lateInvoicesData.length > 0 ? (
                  lateInvoicesData?.map((inv, i) => (
                    <tr
                      key={i}
                      className={i % 2 === 1 ? "bg-[#F8F9FA]/50" : "bg-white"}
                    >
                      <td className="py-4 px-4 text-xs font-bold text-[#002B36]">
                        {inv.trackingID}
                      </td>
                      <td className="py-4 px-4 text-xs font-bold text-[#002B36] flex items-center">
                        <TbCurrencyTaka className="text-[16px]" />
                        {inv.deliveryCharge}
                      </td>
                      <td className="py-4 px-4 text-xs text-[#ADB5BD] font-medium">
                        {new Date(inv.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>
                      <td className="py-4 px-4 text-center">
                        <button className="text-gray-400 hover:text-[#002B36]">
                          <RiMore2Fill size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-20 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-400 gap-2">
                        <span className="text-3xl">📄</span>
                        <p className="text-xs font-bold uppercase tracking-widest">
                          No late invoices data available
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* <div className="bg-white p-6 rounded-[25px] border border-gray-50 shadow-[1px_1px_1px_1px_rgba(0,0,0,0.01)] w-full h-full">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-[#002B36] text-lg tracking-wide">
              Shipment Alerts
            </h3>
            <button className="bg-[#CAEB66] text-[#002B36] px-5 py-2.5 rounded-full text-xs font-bold">
              View All Invoices
            </button>
          </div>

          <div className="bg-[#F8F9FA] rounded-2xl p-6 flex items-center justify-around mb-6 border border-gray-50">
            <div className="text-center">
              <p className="text-2xl font-black text-[#002B36]">2</p>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">
                Damaged
              </p>
            </div>
            <div className="h-10 w-[1px] bg-gray-200"></div>
            <div className="text-center">
              <p className="text-2xl font-black text-[#002B36]">10</p>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">
                Weather Delays
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {alerts.map((alert, i) => (
              <div
                key={i}
                className="flex items-center justify-between group p-1"
              >
                <div className="flex items-center gap-4">
                  <div className={`p-2.5 rounded-full ${alert.color}`}>
                    <RiInformationLine size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#002B36] leading-tight">
                      {alert.type}
                    </h4>
                    <p className="text-[11px] text-gray-400 font-medium">
                      Shipment{" "}
                      <span className="font-bold text-gray-500">
                        {alert.id}
                      </span>{" "}
                      • {alert.time}
                    </p>
                  </div>
                </div>
                <button className="text-gray-300 group-hover:text-[#002B36] transition-colors cursor-pointer">
                  <RiExternalLinkLine size={18} />
                </button>
              </div>
            ))}
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default MerchantState;
