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
  // const [timeFrame, setTimeFrame] = useState("this-week");
  // const [weekFrame, setWeekFrame] = useState("this-week");
  const { role, roleLoading } = useRole();
  const { user } = useAuth();
  // const axiosSecure = useAxiosSecure();
  // const [totalParcels, setTotalParcels] = useState(0);
  // const [totalPages, setTotalPages] = useState(0);
  // const [currentPage, setCurrentPage] = useState(0);
  // const limit = 10;

  // merchant
  // const { isLoading: statusLoading, data: stats = {} } = useQuery({
  //   queryKey: ["statistics", user?.email],
  //   queryFn: async () => {
  //     const res = await axiosSecure.get(`/parcels/stats/${user.email}`);
  //     return res.data;
  //   },
  //   enabled: !!user && !!user?.accessToken,
  // });

  // // merchant
  // const { isLoading: chartLoading, data: chartData = {} } = useQuery({
  //   queryKey: ["revenueStats", user?.email, timeFrame],
  //   queryFn: async () => {
  //     const res = await axiosSecure.get(
  //       `/revenue/stats/${user?.email}?filter=${timeFrame}`,
  //     );
  //     return res.data;
  //   },
  //   enabled: !!user && !!user?.accessToken,
  // });

  // // merchant
  // const { isLoading: shippingLoading, data: shippingData = {} } = useQuery({
  //   queryKey: ["shippingData", user?.email, weekFrame, currentPage],
  //   queryFn: async () => {
  //     const res = await axiosSecure.get(
  //       `/parcels?email=${user.email}&limit=${limit}&skip=${limit * currentPage}&filter=${weekFrame}`,
  //     );
  //     setTotalParcels(res.data.count);
  //     setTotalPages(Math.ceil(res.data.count / limit));
  //     return res.data.data;
  //   },
  //   enabled: !!user && !!user?.accessToken,
  // });

  // merchant
  // const { isLoading: lateInvoicesLoading, data: lateInvoicesData = [] } =
  //   useQuery({
  //     queryKey: ["lateInvoicesData", user?.email],
  //     queryFn: async () => {
  //       const res = await axiosSecure.get(`/late-invoices/${user.email}`);
  //       return res.data;
  //     },
  //     enabled: !!user && !!user?.accessToken,
  //   });

  if (roleLoading) return <LoadingModal loading={roleLoading}></LoadingModal>;
  if (role === "admin") return <AdminState></AdminState>;
  if (role === "hub-manager")
    return <HubmanagerDashboard></HubmanagerDashboard>;
  if (role === "merchant") return <MerchantState></MerchantState>;
  if (role === "rider") return <RiderState></RiderState>;
};

export default Dashboard;
