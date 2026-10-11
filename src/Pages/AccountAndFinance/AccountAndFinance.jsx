import React from "react";
import { useLocation, Link, Outlet } from "react-router";
import { FaMoneyCheckAlt, FaUsers, FaBiking, FaWallet } from "react-icons/fa";
import { RiLuggageDepositFill } from "react-icons/ri";
import FinanceAlert from "../FinanceAlert/FinanceAlert";
import DynamicTitle from "../../Components/DynamicTitle/DynamicTitle";

const AccountAndFinance = () => {
  const location = useLocation();

  const tabs = [
    {
      id: "payout-requests",
      label: "Payout Requests",
      path: "/dashboard/account-finance",
      icon: <FaMoneyCheckAlt size={16} />,
    },
    {
      id: "deposits-hq",
      label: "My Deposits",
      path: "/dashboard/account-finance/deposits-hq",
      icon: <RiLuggageDepositFill size={16} />,
    },
  ];

  return (
    <div className="p-6 md:p-10 bg-[#ffffff] min-h-screen rounded-tradecen shadow-flat relative">
      <DynamicTitle title="Dashboard | Account & Finance" />
      {/* 1. Header Section */}
      <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-secondary mb-2 flex items-center gap-3">
            <div className="p-3 bg-[#CAEB66] text-secondary rounded-xl shadow-md">
              <FaWallet size={20} />
            </div>
            Account & Finance Hub
          </h2>
          <p className="text-gray-500 text-sm">
            Manage merchant payout approvals, user accounting, and rider
            financial settlements.
          </p>
        </div>

        <div className="bg-[#CAEB66] text-secondary px-5 py-3 rounded-2xl flex items-center gap-3 border border-white/10 w-fit">
          <span className="w-2 h-2 bg-[#02312A] rounded-full animate-pulse"></span>
          <p className="text-[11px] font-black uppercase tracking-wider text-secondary">
            Hub Terminal: <span className="text-secondary">Active</span>
          </p>
        </div>
      </div>

      <FinanceAlert></FinanceAlert>

      {/* 2. Professional Navigation Tabs */}
      <div className="flex gap-2 border border-gray-100 mb-8 bg-white/50 p-1.5 rounded-xl w-fit">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path;

          return (
            <Link
              key={tab.id}
              to={tab.path}
              className={`px-6 py-2.5 text-xs font-black uppercase tracking-wider transition-all duration-300 rounded-md flex gap-2 ${
                isActive
                  ? "bg-[#CAEB66] text-[#002B36] shadow-sm"
                  : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
              }`}
            >
              {tab.icon}
              {tab.label}
            </Link>
          );
        })}
      </div>

      {/* 3. Dynamic Content Area via Outlet */}
      <div className="rounded-tradecen border border-gray-50 p-6 md:p-8 transform transition-all animate-in fade-in duration-300">
        <Outlet />
      </div>
    </div>
  );
};

export default AccountAndFinance;
