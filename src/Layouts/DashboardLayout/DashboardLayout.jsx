import React, { useState } from "react";
import NavBar from "../../Components/Shared/NavBar/NavBar";
import { Link, NavLink, Outlet, useNavigate } from "react-router";
import Sidebar from "../../Components/Sidebar/Sidebar";
import useAuth from "../../Hooks/useAuth";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import useRole from "../../Hooks/useRole";
import {
  RiDashboardFill,
  RiTruckLine,
  RiFileTextLine,
  RiStore2Line,
  RiBankCardLine,
  RiMapPin2Line,
  RiUserReceivedLine,
  RiFocus2Line,
  RiArrowGoBackLine,
  RiMotorbikeLine,
  RiWallet3Line,
  RiAddCircleLine,
  RiSearchLine,
  RiMapPinUserLine,
  RiLineChartLine,
  RiLogoutBoxRLine,
  RiMenuFoldLine,
  RiMenuUnfoldLine,
  RiNotification3Line,
  RiSettings4Line,
  RiLockPasswordLine,
  RiQuestionLine,
  RiUserSettingsLine,
  RiFileChartLine,
  RiListCheck2,
  RiMap2Line,
  RiCheckboxCircleLine,
  RiMoneyDollarCircleLine,
  RiRadarLine,
  RiStore3Line,
  RiCustomerService2Line,
} from "react-icons/ri";
import Swal from "sweetalert2";
import { FaBox, FaUserTie } from "react-icons/fa6";
import ScrollToTop from "../../Components/ScrollToTop/ScrollToTop";

const roleMenuItems = {
  "admin": [
    {
      name: "Overview Dashboard",
      icon: <RiDashboardFill size={22} />,
      path: "/dashboard",
    },
    { name: "Hub Management", icon: <RiMapPin2Line size={22} />, path: "hubs" },
    {
      name: "User Management",
      icon: <RiUserSettingsLine size={22} />,
      path: "users",
    },
    // {
    //   name: "Pricing & Coverage",
    //   icon: <RiBankCardLine size={22} />,
    //   path: "/admin/pricing-coverage",
    // },
    {
      name: "Financial Reports",
      icon: <RiFileChartLine size={22} />,
      path: "/dashboard/finance-reports",
    },
    // {
    //   name: "System Settings",
    //   icon: <RiSettings4Line size={22} />,
    //   path: "/admin/settings",
    // },
  ],
  "hub-manager": [
    {
      name: "Hub Dashboard",
      icon: <RiDashboardFill size={22} />,
      path: "/dashboard",
    },
    {
      name: "Incoming",
      icon: <RiUserReceivedLine size={22} />,
      path: "/dashboard/incoming",
    },
    {
      name: "Dispatch / Delivery",
      icon: <RiTruckLine size={22} />,
      path: "/dashboard/dispatch-delivery",
    },
    {
      name: "Pickups",
      icon: <RiFocus2Line size={22} />,
      path: "/dashboard/pick-ups",
    },
    {
      name: "Returns",
      icon: <RiArrowGoBackLine size={22} />,
      path: "/dashboard/return-parcels",
    },
    {
      name: "My Merchants",
      icon: <FaUserTie size={22} />,
      path: "/dashboard/area-merchants",
    },
    {
      name: "My Riders",
      icon: <RiMotorbikeLine size={22} />,
      path: "/dashboard/area-riders",
    },
    {
      name: "Accounts / Finance",
      icon: <RiWallet3Line size={22} />,
      path: "/dashboard/account-finance",
    },
  ],
  rider: [
    {
      name: "Dashboard",
      icon: <RiDashboardFill size={22} />,
      path: "/dashboard",
    },
    {
      name: "My Task List",
      icon: <RiListCheck2 size={22} />,
      path: "/dashboard/my-task",
    },
    {
      name: "COD Collection",
      icon: <RiMoneyDollarCircleLine size={22} />,
      path: "/dashboard/cod-collection",
    },
    {
      name: "My Earnings",
      icon: <RiFileTextLine size={22} />,
      path: "/dashboard/my-earnings",
    },
    {
      name: "Profile / Wallet",
      icon: <RiWallet3Line size={22} />,
      path: "/dashboard/profile-wallet",
    },
  ],
  merchant: [
    {
      name: "Dashboard",
      icon: <RiDashboardFill size={22} />,
      path: "/dashboard",
    },
    {
      name: "All Parcels",
      icon: <FaBox size={22} />,
      path: "/dashboard/all-parcels",
    },
    {
      name: "Create Order",
      icon: <RiAddCircleLine size={22} />,
      path: "/dashboard/create-order",
    },
    {
      name: "Track Parcels",
      icon: <RiRadarLine size={22} />,
      path: "/dashboard/track-parcel",
    },
    {
      name: "Payment / Payouts",
      icon: <RiBankCardLine size={22} />,
      path: "/dashboard/payment-payout",
    },
    {
      name: "Store Settings",
      icon: <RiStore3Line size={22} />,
      path: "/dashboard/store-settings",
    },
    {
      name: "Support / Claims",
      icon: <RiCustomerService2Line size={22} />,
      path: "/dashboard/support",
    },
  ],
};

const DashboardLayout = () => {
  const { dbUser, loading: authLoading, setLoading, handleLogOut } = useAuth();
  const axiosSecure = useAxiosSecure();
  const { role } = useRole();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const menuItems = roleMenuItems[role] || [];

  const generalItems = [
    {
      name: "Settings",
      icon: <RiSettings4Line size={22} />,
      path: "/admin/settings",
    },
    {
      name: "Change Password",
      icon: <RiLockPasswordLine size={22} />,
      path: "/admin/password",
    },
    { name: "Help", icon: <RiQuestionLine size={22} />, path: "/admin/help" },
  ];

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
      isActive
        ? "bg-primary text-secondary font-bold shadow-sm"
        : "text-[#5F7180] hover:bg-gray-100"
    }`;

  const handleSignOut = async () => {
    try {
      navigate('/')
      await handleLogOut();

      Swal.fire({
        icon: "success",
        title: "Signed Out!",
        text: "You have been logged out successfully.",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Opss...",
        text: "Something went wrong during sign out!",
      });
    }
  };
  return (
    <div className="flex min-h-screen bg-[#F8F9FA]">
      <ScrollToTop></ScrollToTop>
      <aside
        className={`bg-white border-gray-100 flex flex-col h-screen sticky top-0 transition-all duration-500 overflow-hidden z-20 ${
          isSidebarOpen ? "w-72" : "w-0 lg:w-0 border-none"
        }`}
      >
        <div className="p-8 min-w-[288px]">
          <Link
            to="/"
            className="text-2xl font-black text-secondary flex items-center gap-2"
          >
            TradeCen<span className="w-2 h-2 bg-[#CAEB66] rounded-full"></span>
          </Link>
        </div>

        <div className="flex-1 px-4 space-y-8 overflow-y-auto min-w-[288px]">
          <div>
            <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-4 px-4">
              Menu
            </p>
            <nav className="space-y-1">
              {menuItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={linkClass}
                  end
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <span className="absolute left-0 w-1.5 h-6 bg-secondary rounded-r-full" />
                      )}

                      <span
                        className={`flex-shrink-0 ${isActive ? "scale-110" : "group-hover:scale-110"} transition-transform`}
                      >
                        {item.icon}
                      </span>

                      <span className="text-sm">{item.name}</span>
                    </>
                  )}
                </NavLink>
              ))}
            </nav>
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-4 px-4">
              General
            </p>
            <nav className="space-y-1">
              {generalItems.map((item) => (
                <NavLink key={item.path} to={item.path} className={linkClass}>
                  <span className="flex-shrink-0">{item.icon}</span>
                  <span className="text-sm">{item.name}</span>
                </NavLink>
              ))}
            </nav>
          </div>
        </div>

        <div className="p-4 border-t border-gray-50 min-w-[288px]">
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 w-full rounded-xl transition-all font-semibold"
          >
            <RiLogoutBoxRLine size={22} />{" "}
            <span className="text-sm">Logout</span>
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-10">
          {/* Left Side: Sidebar Toggle Button */}
          <div>
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2.5 bg-[#F8F9FA] rounded-xl text-[#002B36] hover:bg-[#CAEB66] transition-all duration-300 cursor-pointer"
              title={isSidebarOpen ? "Close Sidebar" : "Open Sidebar"}
            >
              {isSidebarOpen ? (
                <RiMenuFoldLine size={24} />
              ) : (
                <RiMenuUnfoldLine size={24} />
              )}
            </button>
          </div>

          {/* Right Side: Profile & Notifications */}
          <div className="flex items-center gap-5">
            <button className="relative p-2.5 bg-[#F8F9FA] rounded-xl text-gray-500 hover:bg-gray-100 transition-all">
              <RiNotification3Line size={20} />
              <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>

            <div className="h-10 w-[1px] bg-gray-100 mx-1"></div>

            <div className="flex items-center gap-3 pl-2">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-black text-[#002B36] capitalize">
                  {dbUser.displayName}
                </p>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                  {dbUser.role} Account
                </p>
              </div>
              <div className="w-11 h-11 overflow-hidden bg-[#CAEB66] rounded-2xl flex items-center justify-center font-black text-[#002B36] shadow-sm border-2 border-white cursor-pointer hover:scale-105 transition-transform">
                <img src={dbUser?.photoURL} alt="" />
              </div>
            </div>
          </div>
        </header>

        {/* ================= PAGE CONTENT ================= */}
        <main className="p-6 lg:p-8 flex-1 overflow-y-auto bg-[#F8F9FA]">
          <div className="max-w-[1600px] mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
