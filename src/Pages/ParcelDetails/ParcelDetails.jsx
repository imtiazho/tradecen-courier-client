import React from "react";
import {
  FaUser,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaBoxOpen,
  FaTruck,
  FaMoneyBillWave,
  FaBarcode,
  FaCalendarAlt,
  FaCheckCircle,
  FaExclamationCircle,
  FaShieldAlt,
  FaPhone,
} from "react-icons/fa";
import { IoMdBarcode } from "react-icons/io";
import { useLoaderData } from "react-router";

const ParcelDetails = () => {
  const parcel = useLoaderData();

  return (
    <div className="text-[#02312A]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-tradecen shadow-flat mb-6">
        <div>
          <div className="flex items-center gap-2 text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">
            <FaBarcode /> Tracking ID
          </div>
          <h2 className="text-2xl font-black text-[#02312A] tracking-tight flex items-center gap-3">
            {parcel.trackingID}
            <span
              className={`text-[10px] uppercase font-black tracking-widest px-3 py-1.5 rounded-full ${
                parcel.deliveryStatus === "delivered"
                  ? "bg-green-50 text-green-600 border border-green-200"
                  : "bg-amber-50 text-amber-600 border border-amber-200"
              }`}
            >
              {parcel.deliveryStatus}
            </span>
          </h2>
        </div>

        <div className="text-left md:text-right">
          <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1 flex items-center md:justify-end gap-1">
            <FaCalendarAlt /> Created On
          </p>
          <p className="text-sm font-black text-[#02312A]">
            {new Date(parcel.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Sender Info */}
            <div className="bg-white p-6 rounded-tradecen shadow-flat relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-[#CAEB66]"></div>
              <h3 className="text-xs font-black uppercase tracking-widest text-[#02312A]/60 mb-4 flex items-center gap-2">
                <FaUser className="text-[#02312A]" /> Sender Details
              </h3>
              <h4 className="text-base font-black mb-3 text-[#02312A]">
                {parcel.senderInfo.name}
              </h4>
              <div className="space-y-2 text-xs font-medium text-gray-500">
                <p className="flex items-center gap-2">
                  <FaPhoneAlt className="text-gray-400" />{" "}
                  {parcel.senderInfo.phone}
                </p>
                <p className="flex items-center gap-2">
                  <FaEnvelope className="text-gray-400" />{" "}
                  {parcel.senderInfo.email}
                </p>
                <p className="flex items-center gap-2 items-start">
                  <FaMapMarkerAlt className="text-gray-400 mt-0.5 shrink-0" />{" "}
                  {parcel.senderInfo.address}
                </p>
              </div>
            </div>

            {/* Receiver Info */}
            <div className="bg-white p-6 rounded-tradecen shadow-flat relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-[#02312A]"></div>
              <h3 className="text-xs font-black uppercase tracking-widest text-[#02312A]/60 mb-4 flex items-center gap-2">
                <FaUser className="text-[#02312A]" /> Receiver Details
              </h3>
              <h4 className="text-base font-black mb-3 text-[#02312A]">
                {parcel.receiverInfo.name}
              </h4>
              <div className="space-y-2 text-xs font-medium text-gray-500">
                <p className="flex items-center gap-2">
                  <FaPhoneAlt className="text-gray-400" />{" "}
                  {parcel.receiverInfo.phone}
                </p>
                <p className="flex items-center gap-2 items-start">
                  <FaMapMarkerAlt className="text-gray-400 mt-0.5 shrink-0" />{" "}
                  {parcel.receiverInfo.address}, {parcel.receiverInfo.area},{" "}
                  {parcel.receiverInfo.district}
                </p>
                <span className="inline-block mt-2 text-[10px] bg-gray-100 text-[#02312A] px-2 py-1 rounded-md font-black uppercase tracking-wider">
                  Zone: {parcel.receiverInfo.district}
                </span>
              </div>
            </div>
          </div>

          {/* PARCEL SPECIFICATIONS & RIDERS */}
          <div className="bg-white p-6 md:p-8 rounded-tradecen shadow-flat space-y-6">
            <h3 className="text-sm font-black uppercase tracking-wider border-b border-gray-100 pb-3 flex items-center gap-2">
              <FaBoxOpen size={16} /> Parcel Specification
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-[#F8F9FA] p-4 rounded-2xl">
                <p className="text-[10px] font-black uppercase text-gray-400">
                  Item Name
                </p>
                <p className="text-xs font-black mt-1">{parcel.parcelName}</p>
              </div>
              <div className="bg-[#F8F9FA] p-4 rounded-2xl">
                <p className="text-[10px] font-black uppercase text-gray-400">
                  Category
                </p>
                <p className="text-xs font-black mt-1 text-blue-600">
                  {parcel.parcelType}
                </p>
              </div>
              <div className="bg-[#F8F9FA] p-4 rounded-2xl">
                <p className="text-[10px] font-black uppercase text-gray-400">
                  Weight
                </p>
                <p className="text-xs font-black mt-1">
                  {parcel.parcelWeight} KG
                </p>
              </div>
              <div className="bg-[#F8F9FA] p-4 rounded-2xl">
                <p className="text-[10px] font-black uppercase text-gray-400">
                  Last Scan
                </p>
                <p className="text-[11px] font-black mt-1 text-purple-600 capitalize">
                  {parcel.currentLocation.replace("-", " ") || "N/A"}
                </p>
              </div>
            </div>

            {/* RIDER SETTLEMENTS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl border border-dashed border-gray-200 flex items-center gap-3">
                <div className="p-2 bg-gray-100 text-gray-600 rounded-xl">
                  <FaTruck size={14} />
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase text-gray-400">
                    Pickup Rider
                  </p>
                  <p className="text-xs font-black capitalize">
                    {parcel.pickupRider?.name || "Not Assigned"}
                  </p>
                  <p className="text-xs font-medium flex items-center gap-1">
                    <FaPhone size={10} />
                    {parcel.pickupRider?.phone || "N/A"}
                  </p>
                </div>
              </div>
              <div className="p-4 rounded-2xl border border-dashed border-gray-200 flex items-center gap-3">
                <div className="p-2 bg-gray-100 text-gray-600 rounded-xl">
                  <FaTruck size={14} />
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase text-gray-400">
                    Delivery Rider
                  </p>
                  <p className="text-xs font-black capitalize">
                    {parcel.deliveryRider?.name || "Not Assigned"}
                  </p>
                  <p className="text-xs font-medium flex items-center gap-1">
                    <FaPhone size={10} />
                    {parcel.deliveryRider?.phone || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* FINANCES LEDGER CARD */}
          <div className="bg-[#02312A] text-white p-6 md:p-8 rounded-tradecen shadow-flat relative overflow-hidden">
            <div className="absolute -right-6 -bottom-6 text-white/5 transform -rotate-12">
              <FaMoneyBillWave size={150} />
            </div>

            <h3 className="text-xs font-black uppercase tracking-widest text-[#CAEB66] mb-6 flex items-center gap-2">
              <FaMoneyBillWave /> Financial Settlement
            </h3>

            <div className="space-y-5 border-b border-white/10 pb-5">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-gray-300">
                  Total COD Amount
                </span>
                <span className="text-xl font-black text-[#CAEB66]">
                  ৳ {parcel.codAmount}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-gray-300">Charge</span>
                <span className="text-sm font-black text-red-400">
                  ৳ {parcel.deliveryCharge}
                </span>
              </div>
            </div>

            <div className="pt-5 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-black uppercase tracking-wider text-gray-300">
                  Merchant Payable
                </span>
                <span className="text-xl font-black text-white">
                  {parcel.deliveryStatus === "delivered"
                    ? parcel.deliveryChargeStatus === "unpaid"
                      ? `৳ ${parcel.codAmount - parcel.deliveryCharge}`
                      : `৳ ${parcel.codAmount}`
                    : `৳ 0`}
                </span>
              </div>

              {/* Status Pills inside Dark Card */}
              <div className="grid grid-cols-2 gap-2 pt-2">
                <div className="bg-white/5 p-2.5 rounded-xl border border-white/10 text-center">
                  <p className="text-[8px] font-black uppercase text-gray-400">
                    Delivery Billing
                  </p>
                  <p
                    className={`text-[10px] font-black uppercase mt-0.5 ${parcel.deliveryChargeStatus === "paid" ? "text-[#CAEB66]" : "text-red-400"}`}
                  >
                    {parcel.deliveryChargeStatus}
                  </p>
                </div>
                <div className="bg-white/5 p-2.5 rounded-xl border border-white/10 text-center">
                  <p className="text-[8px] font-black uppercase text-gray-400">
                    Payout Status
                  </p>
                  <p
                    className={`text-[10px] font-black uppercase mt-0.5 ${parcel.merchantRevenueStatus ? "text-green-400" : "text-amber-400"}`}
                  >
                    {parcel.merchantRevenueStatus === null
                      ? "N / A"
                      : parcel.merchantRevenueStatus === "pending"
                        ? "Pending"
                        : "Settled"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* SECURITY & GATEWAY OTP */}
          <div className="bg-white p-5 rounded-tradecen border border-gray-50 shadow-flat flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
                <FaShieldAlt size={18} />
              </div>
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider">
                  Secure Delivery OTP
                </h4>
                <p className="text-[11px] font-bold text-gray-400 mt-0.5">
                  Required during handover
                </p>
              </div>
            </div>
            <div className="bg-[#02312A] text-[#CAEB66] font-black px-4 py-2 rounded-xl text-sm tracking-widest shadow-inner flex items-center gap-2">
              <IoMdBarcode />

              {parcel.security.deliveryOTP}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParcelDetails;
