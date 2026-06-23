import React, { useEffect, useState } from "react";
import useRole from "../../Hooks/useRole";
import LoadingModal from "../../Components/LoadingModal/LoadingModal";
import MerchantState from "../../Components/MerchantState/MerchantState";
import AdminState from "../../Components/AdminState/AdminState";
import RiderState from "../../Components/RiderState/RiderState";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import useAuth from "../../Hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import HubmanagerDashboard from "../HubmanagerDashboard/HubmanagerDashboard";

const Dashboard = () => {
  const { role, roleLoading } = useRole();
  const { user } = useAuth();
  
  if (roleLoading) return <LoadingModal loading={roleLoading}></LoadingModal>;
  if (role === "admin") return <AdminState></AdminState>;
  if (role === "hub-manager")
    return <HubmanagerDashboard></HubmanagerDashboard>;
  if (role === "merchant") return <MerchantState></MerchantState>;
  if (role === "rider") return <RiderState></RiderState>;
};

export default Dashboard;
