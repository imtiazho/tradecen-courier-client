import React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  FaStore,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaGlobe,
  FaCamera,
} from "react-icons/fa";
import Swal from "sweetalert2";
import LoadingModal from "../../Components/LoadingModal/LoadingModal";
import useAuth from "../../Hooks/useAuth";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import DynamicTitle from "../../Components/DynamicTitle/DynamicTitle";

const StoreSettings = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const {
    data: merchantData,
    isLoading,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["merchant-settings", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/merchant/${user?.email}`);
      return res.data;
    },
    enabled: !!user && !!user?.accessToken,

    // Set stateTime
    staleTime: 1000 * 60 * 5,
    placeholderData: (previousData) => previousData,
  });

  const handleUpdate = async (e) => {
    e.preventDefault();
    const form = e.target;

    const updatedInfo = {
      businessName: form.businessName.value,
      contact: form.contact.value,
      pickupPoint: form.pickupAddress.value,
    };

    try {
      const res = await axiosSecure.patch(
        `/merchant-update/${user?.email}`,
        updatedInfo,
      );
      if (res.data.success) {
        refetch();
        Swal.fire({
          title: "Success!",
          text: "Store information updated successfully.",
          icon: "success",
          confirmButtonColor: "#02312A",
        });
      }
    } catch (error) {
      console.error("Update failed", error);
    }
  };

  if (isLoading) {
    return <LoadingModal isLoading={true}></LoadingModal>;
  }

  return (
    <div className="p-6 md:p-10 bg-white rounded-tradecen shadow-flat min-h-screen">
      <DynamicTitle title="Dashboard | Store Settings" />
      {/* Header Section */}
      <div className="mb-10">
        <h2 className="text-3xl font-black text-secondary mb-2">
          Store Settings
        </h2>
        <p className="text-gray-500 text-sm">
          Manage your business identity and default pickup locations.
        </p>
      </div>

      <form onSubmit={handleUpdate} className="space-y-8">
        {/* 1. Store Logo Section */}
        <div className="flex items-center gap-6 p-6 bg-[#F8F9FA] rounded-tradecen border border-dashed border-gray-200">
          <div className="relative group">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center border-4 border-[#CAEB66] overflow-hidden shadow-inner">
              {merchantData?.photoURL ? (
                <img
                  src={merchantData.photoURL}
                  alt="Store Logo"
                  className="w-full h-full object-cover"
                />
              ) : (
                <FaStore size={40} className="text-gray-300" />
              )}
            </div>
            <button
              type="button"
              className="absolute bottom-0 right-0 p-2 bg-[#02312A] text-[#CAEB66] rounded-full hover:scale-110 transition-transform"
            >
              <FaCamera size={14} />
            </button>
          </div>
          <div>
            <h4 className="font-black text-[#02312A] uppercase tracking-tight text-xl">
              {merchantData?.businessName}
            </h4>
            <div className="flex items-center gap-2">
              <span className="bg-[#CAEB66] text-[#02312A] text-[9px] font-black px-2 py-0.5 rounded-full uppercase">
                {merchantData?.merchantType || "Standard"}
              </span>
              <span className="text-[10px] text-gray-400 font-bold uppercase">
                ID: {merchantData?._id?.slice(-8)}
              </span>
            </div>
          </div>
        </div>

        {/* 2. Main Information Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Store Name */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black uppercase text-gray-400 flex items-center gap-2">
              <FaStore className="text-[#CAEB66]" /> Business Name
            </label>
            <input
              type="text"
              name="businessName"
              defaultValue={merchantData?.businessName}
              className="bg-[#F8F9FA] p-4 rounded-xl text-xs font-bold text-[#02312A] focus:outline-none focus:ring-2 focus:ring-[#CAEB66] border border-transparent"
            />
          </div>

          {/* Official Phone */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black uppercase text-gray-400 flex items-center gap-2">
              <FaPhoneAlt className="text-[#CAEB66]" /> Official Phone
            </label>
            <input
              type="text"
              name="contact"
              defaultValue={merchantData?.contact}
              className="bg-[#F8F9FA] p-4 rounded-xl text-xs font-bold text-[#02312A] focus:outline-none focus:ring-2 focus:ring-[#CAEB66] border border-transparent"
            />
          </div>

          {/* Pickup Address */}
          <div className="flex flex-col gap-2 md:col-span-2">
            <label className="text-[10px] font-black uppercase text-gray-400 flex items-center gap-2">
              <FaMapMarkerAlt className="text-[#CAEB66]" /> Default Pickup
              Location
            </label>
            <textarea
              rows="3"
              name="pickupAddress"
              defaultValue={merchantData?.pickupPoint}
              className="bg-[#F8F9FA] p-4 rounded-xl text-xs font-bold text-[#02312A] focus:outline-none focus:ring-2 focus:ring-[#CAEB66] border border-transparent resize-none leading-relaxed"
            />
          </div>

          {/* Business Email (Read Only) */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black uppercase text-gray-400 flex items-center gap-2">
              <FaEnvelope className="text-[#CAEB66]" /> Business Email
            </label>
            <input
              type="email"
              readOnly
              value={merchantData?.email}
              className="bg-[#F8F9FA] p-4 rounded-xl text-xs font-bold text-gray-400 border border-transparent cursor-not-allowed"
            />
          </div>

          {/* Account Status Display */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black uppercase text-gray-400 flex items-center gap-2">
              Account Status
            </label>
            <div className="bg-[#F8F9FA] p-4 rounded-xl text-xs font-black text-green-600 border border-transparent flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              {merchantData?.accountStatus?.toUpperCase() || "ACTIVE"}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-6 border-t border-gray-100 flex justify-end">
          <button
            type="submit"
            className="bg-[#CAEB66] text-[#02312A] px-12 py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-transform shadow-lg shadow-[#CAEB66]/20 cursor-pointer"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default StoreSettings;
