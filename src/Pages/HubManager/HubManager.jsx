import React, { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import {
  RiUserAddLine,
  RiMailLine,
  RiMapPinUserLine,
  RiDeleteBin6Line,
  RiCloseLine,
  RiMapPin2Line,
  RiShieldCheckLine,
  RiBuildingLine,
  RiTimeLine,
} from "react-icons/ri";
import { useQuery } from "@tanstack/react-query";
import { useLoaderData } from "react-router";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import Swal from "sweetalert2";
import { MdDomainAdd } from "react-icons/md";
import useAuth from "../../Hooks/useAuth";
import LoadingModal from "../../Components/LoadingModal/LoadingModal";
import DynamicTitle from "../../Components/DynamicTitle/DynamicTitle";

const HubManager = () => {
  const { user, fetchDbUser } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const areaAndLocation = useLoaderData() || [];
  const clearRegions = [...new Set(areaAndLocation.map((rg) => rg.region))];

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors },
  } = useForm();

  const selectedRegion = useWatch({ control, name: "region" });
  const selectedDistrict = useWatch({ control, name: "district" });

  useEffect(() => {
    setValue("district", "");
    setValue("hubName", "");
  }, [selectedRegion, setValue]);

  useEffect(() => {
    setValue("hubName", "");
  }, [selectedDistrict, setValue]);

  const getDistricts = (region) => {
    if (!region) return [];
    return areaAndLocation
      .filter((item) => item.region === region)
      .map((d) => d.district);
  };

  const getHubs = (district) => {
    if (!district) return [];
    const findDistrict = areaAndLocation.find(
      (item) => item.district === district,
    );
    return findDistrict?.covered_area || [];
  };

  const {
    data: managers = [],
    refetch: refetchManagers,
    isLoading: loadingManagers,
  } = useQuery({
    queryKey: ["users", "hub-managers"],
    queryFn: async () => {
      const res = await axiosSecure.get("/users/hub-managers");
      return res.data;
    },
  });

  const {
    data: normalUsers = [],
    refetch: refetchNormalUsers,
    isLoading: normalUserLoading,
  } = useQuery({
    queryKey: ["users", "normal-users"],
    queryFn: async () => {
      const res = await axiosSecure.get("/users?role=user");
      return res.data;
    },
  });

  const onSubmit = async (data) => {
    try {
      const res = await axiosSecure.patch("/users/make-hub-manager", data);

      if (res.data.success) {
        Swal.fire({
          title: "Success!",
          text: "New Hub Manager assigned successfully.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });

        setIsModalOpen(false);
        reset();

        refetchManagers();
        refetchNormalUsers();
        fetchDbUser(user);
      }
    } catch (error) {
      Swal.fire("Error!", "Failed to assign role", "error");
    }
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Remove Manager?",
      text: "This manager role will be removed permanently.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#d1d5db",
      confirmButtonText: "Yes, Remove",
    }).then(async (result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "SYSTEM DEACTIVATED",
          text: "This operation is currently suspended by Developer.",
          icon: "info",
          timer: 2500,
          showConfirmButton: false,
          customClass: {
            popup: "rounded-[24px] border border-gray-100",
            title:
              "font-black text-[#002B36] uppercase tracking-tight text-base",
            htmlContainer: "font-bold text-gray-400 text-xs",
          },
        });
        // try {
        //   const res = await axiosSecure.delete(`/users/${id}`);
        //   if (res.data.deletedCount > 0) {
        //     Swal.fire({
        //       title: "Removed!",
        //       text: "Manager has been removed.",
        //       icon: "success",
        //       timer: 2000,
        //       showConfirmButton: false,
        //     });
        //     refetchManagers();
        //   }
        // } catch (error) {
        //   Swal.fire("Error", "Failed to delete manager", "error");
        // }
      }
    });
  };

  if (normalUserLoading || loadingManagers)
    return <LoadingModal isLoading={true}></LoadingModal>;

  return (
    <div className="min-h-screen bg-[#ffffff] rounded-tradecen p-4 md:p-8">
      <DynamicTitle title="Dashboard | Hubs Management" />
      {/* ========================= */}
      {/* PAGE HEADER */}
      {/* ========================= */}
      <div className="relative overflow-hidden mb-6">
        <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          {/* LEFT */}
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h2 className="text-3xl font-extrabold text-[#002B36] tracking-wide">
                Hub Operations
              </h2>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1 flex items-center gap-1.5 mt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#CAEB66]"></span>
                Gateway monitoring, terminal routing, and regional ledger
                auditing.
              </p>
            </div>
          </div>

          {/* RIGHT STATS */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-3 bg-[#CAEB66]/20 px-4 py-2 rounded-full border border-[#CAEB66]">
              <div className="w-2 h-2 bg-[#002B36] rounded-full animate-pulse"></div>
              <span className="text-[#002B36] font-bold text-sm uppercase tracking-wider">
                {managers?.length} Active Hubs
              </span>
            </div>

            {/* BTN */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="h-fit px-6 py-3 rounded-3xl bg-[#CAEB66] active:scale-95 transition-all text-[#002B36] text-xs font-black uppercase tracking-[3px] flex items-center gap-2 cursor-pointer"
            >
              <MdDomainAdd size={18} />
              Create Hub
            </button>
          </div>
        </div>
      </div>

      {/* ========================= */}
      {/* HUB GRID */}
      {/* ========================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-5">
        {managers.map((manager) => (
          <div
            key={manager._id}
            className="group bg-white border border-gray-100 hover:border-[#CAEB66]/40 rounded-tradecen p-5 relative overflow-hidden transition-all duration-300 shadow-flat"
          >
            <div className="relative">
              <div className="flex items-start justify-between gap-4">
                {/* LEFT */}
                <div className="flex gap-3 items-center min-w-0">
                  {/* HUB ICON */}
                  <div className="w-12 h-12 rounded-xl bg-[#CAEB66]/15 border border-[#CAEB66]/20 flex items-center justify-center shrink-0">
                    <RiBuildingLine size={22} className="text-[#002B36]" />
                  </div>

                  {/* HUB INFO */}
                  <div className="min-w-0">
                    {/* HUB NAME */}
                    <h2 className="text-xl font-black text-[#002B36] leading-none truncate">
                      {manager.hubName || "N/A"}
                    </h2>

                    <p className="text-[10px] uppercase font-black tracking-[2px] text-gray-400 mt-[7px]">
                      Distribution Hub
                    </p>
                  </div>
                </div>

                {/* DELETE */}
                <button
                  onClick={() => handleDelete(manager._id)}
                  className="w-10 h-10 rounded-xl border border-gray-100 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all flex items-center justify-center shrink-0 cursor-pointer"
                >
                  <RiDeleteBin6Line size={18} />
                </button>
              </div>

              <div className="mt-5 bg-gray-50 border border-gray-100 rounded-xl p-4">
                <div className="flex items-center gap-4">
                  {/* AVATAR */}
                  <div className="w-14 h-14 rounded-2xl overflow-hidden border border-gray-200 bg-white shrink-0">
                    {manager.photoURL ? (
                      <img
                        src={manager.photoURL}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <RiMapPinUserLine size={22} className="text-gray-300" />
                      </div>
                    )}
                  </div>

                  {/* INFO */}
                  <div className="min-w-0">
                    <p className="text-[10px] uppercase tracking-[3px] text-gray-400 font-black mb-1">
                      Assigned Manager
                    </p>

                    <h3 className="text-base font-black text-[#002B36] truncate">
                      {manager.displayName || manager.name}
                    </h3>

                    <div className="flex items-center gap-1.5 mt-1 text-gray-400">
                      <RiMailLine size={13} />

                      <p className="text-[11px] truncate font-medium">
                        {manager.email}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* ========================= */}
              {/* LOCATION INFO */}
              {/* ========================= */}
              <div className="grid grid-cols-2 gap-3 mt-4">
                {/* REGION */}
                <div className="rounded-xl border border-gray-100 bg-white p-4">
                  <div className="flex items-center gap-1 text-[10px] uppercase font-black text-gray-400 tracking-wide mb-2">
                    <RiMapPin2Line size={13} />
                    Region
                  </div>

                  <h4 className="text-sm font-black text-[#002B36] truncate">
                    {manager.region || "N/A"}
                  </h4>
                </div>

                {/* DISTRICT */}
                <div className="rounded-xl border border-gray-100 bg-white p-4">
                  <div className="flex items-center gap-1 text-[10px] uppercase font-black text-gray-400 tracking-wide mb-2">
                    <RiShieldCheckLine size={13} />
                    District
                  </div>

                  <h4 className="text-sm font-black text-[#002B36] truncate">
                    {manager.district || "N/A"}
                  </h4>
                </div>
              </div>

              {/* ========================= */}
              {/* FOOTER */}
              {/* ========================= */}
              <div className="flex items-center justify-between mt-5 pt-4 border-t border-dashed border-gray-100">
                <div className="flex items-center gap-1.5 text-gray-400">
                  <RiTimeLine size={14} />

                  <span className="text-[10px] font-bold uppercase tracking-wide">
                    Assigned{" "}
                    {manager.assignedAt
                      ? new Date(manager.assignedAt).toLocaleDateString([], {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })
                      : "Recently"}
                  </span>
                </div>

                <div className="text-[10px] font-black uppercase tracking-[3px] text-[#002B36]">
                  TradeCen
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ========================= */}
      {/* MODAL */}
      {/* ========================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl rounded-[36px] p-7 relative border border-gray-100 animate-fadeIn">
            {/* Glow */}
            <div className="absolute top-0 right-0 w-52 h-52 bg-[#CAEB66]/10 blur-3xl rounded-full"></div>

            {/* CLOSE */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 w-11 h-11 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-all flex items-center justify-center cursor-pointer z-10"
            >
              <RiCloseLine size={22} className="text-gray-500" />
            </button>

            <div className="relative">
              {/* HEADER */}
              <div className="mb-7">
                <div className="w-16 h-16 rounded-3xl bg-[#CAEB66]/15 border border-[#CAEB66]/20 flex items-center justify-center mb-5">
                  <MdDomainAdd size={28} className="text-[#002B36]" />
                </div>

                <h2 className="text-3xl font-black text-[#002B36] tracking-tight">
                  Assign Hub Manager
                </h2>

                <p className="text-xs uppercase tracking-[3px] text-gray-400 font-bold mt-2">
                  Configure Hub Access & Operations
                </p>
              </div>

              {/* FORM */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* USER */}
                <div>
                  <label className="text-[10px] font-black uppercase tracking-[2px] text-gray-400 ml-2">
                    Select User
                  </label>

                  <select
                    {...register("email", {
                      required: "User selection is required",
                    })}
                    className="w-full mt-1 h-13 px-5 rounded-xl bg-gray-50 border border-gray-100 text-sm font-bold text-[#002B36] focus:outline-none focus:ring-2 focus:ring-[#CAEB66]"
                  >
                    <option value="">Choose user</option>

                    {normalUsers.map((user) => (
                      <option key={user._id} value={user.email}>
                        {user.displayName || user.name} ({user.email})
                      </option>
                    ))}
                  </select>

                  {errors.email && (
                    <p className="text-red-500 text-[10px] mt-1 ml-2">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* REGION & DISTRICT */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* REGION */}
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-[2px] text-gray-400 ml-2">
                      Region
                    </label>

                    <select
                      {...register("region", {
                        required: "Region is required",
                      })}
                      className="w-full mt-1 h-13 px-5 rounded-xl bg-gray-50 border border-gray-100 text-sm font-bold text-[#002B36] focus:outline-none focus:ring-2 focus:ring-[#CAEB66]"
                    >
                      <option value="">Select Region</option>

                      {clearRegions.map((region, i) => (
                        <option key={i} value={region}>
                          {region}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* DISTRICT */}
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-[2px] text-gray-400 ml-2">
                      District
                    </label>

                    <select
                      {...register("district", {
                        required: "District is required",
                      })}
                      disabled={!selectedRegion}
                      className="w-full mt-1 h-13 px-5 rounded-xl bg-gray-50 border border-gray-100 text-sm font-bold text-[#002B36] focus:outline-none focus:ring-2 focus:ring-[#CAEB66] disabled:opacity-50"
                    >
                      <option value="">Select District</option>

                      {getDistricts(selectedRegion).map((district, i) => (
                        <option key={i} value={district}>
                          {district}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* HUB */}
                <div>
                  <label className="text-[10px] font-black uppercase tracking-[2px] text-gray-400 ml-2">
                    Hub Name
                  </label>

                  <select
                    {...register("hubName", {
                      required: "Hub Name is required",
                    })}
                    disabled={!selectedDistrict}
                    className="w-full mt-1 h-13 px-5 rounded-xl bg-gray-50 border border-gray-100 text-sm font-bold text-[#002B36] focus:outline-none focus:ring-2 focus:ring-[#CAEB66] disabled:opacity-50"
                  >
                    <option value="">Select Hub</option>

                    {getHubs(selectedDistrict).map((hub, i) => (
                      <option key={i} value={hub}>
                        {hub}
                      </option>
                    ))}
                  </select>
                </div>

                {/* BTN */}
                <button
                  type="submit"
                  className="w-full h-14 rounded-2xl bg-[#CAEB66] text-[#02312A] text-xs font-black uppercase tracking-[3px] mt-5 transition-all cursor-pointer"
                >
                  Create Hub
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HubManager;
