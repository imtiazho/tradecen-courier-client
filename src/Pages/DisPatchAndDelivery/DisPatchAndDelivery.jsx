import React from "react";
import { NavLink, Outlet } from "react-router";
import useAuth from "../../Hooks/useAuth";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import DynamicTitle from "../../Components/DynamicTitle/DynamicTitle";

const DispatchAndDelivery = () => {
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

  const tabs = [
    {
      name: "Dispatch",
      path: ".",
      desc: "Parcels to be sent to other district hubs",
    },
    {
      name: "Delivery",
      path: "delivery-local",
      desc: "Parcels to be delivered to destination",
    },
  ];

  return (
    <div className="p-8 bg-[#ffffff] rounded-tradecen shadow-flat min-h-screen">
      <DynamicTitle title="Dashboard | Dispatch & Delivery" />
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-secondary tracking-tight">
          Dispatch & Delivery
        </h1>
        <p className="text-sm text-gray-400 mt-1 font-medium italic">
          Sorting house for{" "}
          <span className="text-[#002B36] font-bold underline decoration-[#CAEB66]">
            {managerData?.hubName} Hub
          </span>{" "}
          operations.
        </p>
      </div>

      {/* Modern Tabs Navigation */}
      <div className="flex gap-2 border border-gray-100 mb-8 bg-white/50 p-1.5 rounded-xl w-fit">
        {tabs.map((tab) => (
          <NavLink
            key={tab.path}
            to={tab.path}
            end
            className={({ isActive }) => `
              px-6 py-2.5 text-xs font-black uppercase tracking-wider transition-all duration-300 rounded-md
              ${
                isActive
                  ? "bg-[#CAEB66] text-[#002B36] shadow-sm"
                  : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
              }
            `}
          >
            {tab.name}
          </NavLink>
        ))}
      </div>

      {/* Contextual Info Note */}
      <div className="mb-6 px-4 py-3 bg-[#F4F9F4] border-l-4 border-green-600 text-green-700 rounded-r-xl">
        <p className="text-xs font-black uppercase tracking-wider text-green-800">
          Operations Guide:
        </p>
        <p className="text-[11px] text-green-700 mt-1 leading-relaxed">
          Final distribution of incoming parcels arriving from outside
          districts, destined within the{" "}
          <span className="font-bold underline">{managerData?.hubName}</span>{" "}
          coverage perimeter. Forwarding all outgoing parcels picked up locally
          that are bound for destinations outside our home territory.
        </p>
      </div>

      {/* Content Area */}
      <div className="transition-all duration-500 bg-white p-6 rounded-tradecen border border-gray-50">
        <Outlet context={managerData?.hubName} />
      </div>
    </div>
  );
};

export default DispatchAndDelivery;
