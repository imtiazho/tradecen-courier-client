import React, { useState } from "react";
import {
  FaWallet,
  FaArrowUp,
  FaHistory,
  FaUniversity,
  FaMobileAlt,
  FaCheckCircle,
  FaTimes,
  FaBox,
  FaReceipt,
  FaMoneyCheckAlt,
} from "react-icons/fa";
import { CiBank } from "react-icons/ci";
import { TbCurrencyTaka } from "react-icons/tb";
import useAuth from "../../Hooks/useAuth";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import LoadingModal from "../../Components/LoadingModal/LoadingModal";
import Swal from "sweetalert2";
import FinanceAlert from "../FinanceAlert/FinanceAlert";
import DynamicTitle from "../../Components/DynamicTitle/DynamicTitle";

const PaymentPayout = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    title: "",
    type: "",
  });

  const {
    isLoading: paymentPayoutDataLoading,
    data: paymentPayoutData = {},
    refetch,
  } = useQuery({
    queryKey: ["paymentPayoutData", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/payment-payout-summary/${user.email}`,
      );
      return res.data;
    },
    enabled: !!user?.email,
  });

  const openModal = (title, type) => {
    setModalConfig({ isOpen: true, title, type });
  };

  const closeModal = () => {
    setModalConfig({ isOpen: false, title: "", type: "" });
  };

  const handleWithdrawClick = () => {
    openModal("Confirm Payout Request", "withdraw_form");
  };

  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      email: user?.email,
      withdrawAmount: paymentPayoutData.availableBalance,
      paymentMethod: {
        type: "bKash",
        number: "01700-XXXXXX",
      },
    };

    try {
      const res = await axiosSecure.post("/request-payout", payload);
      if (res.data.success) {
        closeModal();
        Swal.fire({
          title: "Success!",
          text: res.data.message,
          icon: "success",
          confirmButtonColor: "#02312A",
        });
        refetch();
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: "Error!",
        text: error.response?.data?.message || "Something went wrong",
        icon: "error",
        confirmButtonColor: "#02312A",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (paymentPayoutDataLoading) {
    return <LoadingModal></LoadingModal>;
  }

  return (
    <div className="p-6 md:p-10 bg-[#ffffff] min-h-screen rounded-tradecen relative">
      <DynamicTitle title="Dashboard | Payment & Payouts" />
      {/* Header */}
      <div className="mb-10">
        <h2 className="text-3xl font-black text-[#02312A] mb-2">
          Payments & Payouts
        </h2>
        <p className="text-gray-500 text-sm">
          Track your earnings and manage your withdrawal methods.
        </p>
      </div>

      <FinanceAlert></FinanceAlert>

      {/* 1. Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {/* 1. Available Balance Card (Primary Dark Theme) */}
        <div className="bg-[#02312A] p-8 rounded-tradecen border border-secondary text-white relative overflow-hidden group flex flex-col justify-between border border-[#02312A] shadow-lg shadow-[#02312A]/10 min-h-[220px]">
          <FaWallet className="absolute -right-4 -bottom-4 text-white/5 size-28 pointer-events-none group-hover:scale-110 transition-transform duration-500" />

          <div>
            <p className="text-[10px] uppercase tracking-widest font-black text-[#CAEB66] mb-2">
              Available Balance
            </p>
            <h3 className="text-4xl font-black tracking-tight">
              ৳ {paymentPayoutData.availableBalance || 0}
            </h3>

            <p
              onClick={() =>
                openModal("Available Balance Parcels", "available")
              }
              className="text-[#CAEB66]/80 hover:text-[#CAEB66] text-[11px] font-black hover:underline cursor-pointer mt-4 inline-flex items-center gap-1.5 transition-colors uppercase tracking-wider"
            >
              See base parcels &rarr;
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-white/10 z-10">
            <button
              onClick={handleWithdrawClick}
              disabled={
                !paymentPayoutData.availableBalance ||
                paymentPayoutData.availableBalance <= 0
              }
              className="w-full bg-[#CAEB66] text-[#02312A] py-3 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-[#b8d957] active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100 shadow-md shadow-[#CAEB66]/10"
            >
              Withdraw Money
            </button>
          </div>
        </div>

        {/* 2. Pending Payouts Card (Subtle Warning/Amber Theme) */}
        <div className="bg-[#FFF9F2] p-8 rounded-tradecen border border-[#FFE7CC] relative overflow-hidden group flex flex-col justify-between min-h-[220px] shadow-flat">
          <div className="absolute -right-4 -bottom-4 text-[#F39C12]/5 size-28 pointer-events-none group-hover:scale-110 transition-transform duration-500 font-bold">
            <TbCurrencyTaka className="absolute -right-5 bottom-15 text-[#F39C12]/5 size-35 pointer-events-none group-hover:scale-110 transition-transform duration-500" />
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-widest font-black text-[#D35400] mb-2">
              Pending Payouts
            </p>
            <h3 className="text-4xl font-black text-[#02312A] tracking-tight">
              ৳ {paymentPayoutData.totalPending || 0}
            </h3>
          </div>

          <div className="mt-auto">
            <p
              onClick={() => openModal("Pending Payout Requests", "pending")}
              className="text-[#D35400] hover:text-[#A04000] text-[11px] font-black hover:underline cursor-pointer inline-flex items-center gap-1.5 transition-colors uppercase tracking-wider"
            >
              See pending requests &rarr;
            </p>
          </div>
        </div>

        <div className="bg-[#F4F9F4] p-8 rounded-tradecen border border-[#E2EFE2] relative overflow-hidden group flex flex-col justify-start min-h-[220px] shadow-flat">
          <div className="absolute -right-4 -bottom-4 text-green-600/5 size-28 pointer-events-none group-hover:scale-110 transition-transform duration-500 font-bold">
            <CiBank className="absolute -right-12 bottom-15 text-green-600/5 size-35 pointer-events-none group-hover:scale-110 transition-transform duration-500" />
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-widest font-black text-green-700 mb-2">
              Total Withdrawn
            </p>
            <h3 className="text-4xl font-black text-[#02312A] tracking-tight">
              ৳ {paymentPayoutData.totalWithdrawn || 0}
            </h3>
          </div>

          <div className="mt-auto pt-2">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              Successfully processed to bank/wallet
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-1 space-y-6">
          <h4 className="text-md font-bold text-[#02312A] flex items-center gap-2">
            <FaArrowUp className="text-[#CAEB66]" /> Withdrawal Method
          </h4>

          <div className="p-6 bg-white rounded-tradecen border-2 border-[#CAEB66] shadow-flat relative">
            <div className="absolute top-4 right-4">
              <FaCheckCircle className="text-[#CAEB66]" size={20} />
            </div>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-pink-50 rounded-2xl flex items-center justify-center text-pink-600">
                <FaMobileAlt size={24} />
              </div>
              <div>
                <p className="font-bold text-[#02312A]">bKash</p>
                <p className="text-[10px] text-gray-400 uppercase">
                  Mobile Banking
                </p>
              </div>
            </div>
            <p className="text-xs font-bold text-[#02312A]">01700-XXXXXX</p>
          </div>

          <div className="p-6 bg-[#F3F4F6] rounded-[30px] border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-gray-100 transition-colors">
            <FaUniversity className="text-gray-400" size={24} />
            <p className="text-xs font-bold text-gray-500">Add Bank Account</p>
          </div>
        </div>

        {/* 3. Transaction History (Right Side) */}
        <div className="lg:col-span-2">
          <h4 className="text-lg font-bold text-[#02312A] mb-6 flex items-center gap-2">
            <FaHistory className="text-[#CAEB66]" /> Recent Transactions
          </h4>

          <div className="bg-white rounded-tradecen overflow-hidden shadow-flat border border-gray-50">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#f9fafa]">
                  <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400">
                    Date
                  </th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400">
                    Transaction ID
                  </th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400 text-center">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {paymentPayoutData.recentTransactions?.map((row, i) => (
                  <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-5 text-xs font-bold text-gray-500">
                      {row.requestedAt
                        ? new Date(row.requestedAt).toLocaleDateString(
                            "en-US",
                            { month: "short", day: "numeric", year: "numeric" },
                          )
                        : "N/A"}
                    </td>
                    <td className="px-6 py-5 text-xs font-black text-[#02312A]">
                      {row.trxID ? row.trxID : "Pending"}
                    </td>
                    <td className="px-6 py-5 text-xs font-black text-[#02312A]">
                      ৳{row.amount}
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${
                          row.payoutStatus === "completed"
                            ? "bg-green-100 text-green-600"
                            : "bg-orange-100 text-orange-600"
                        }`}
                      >
                        {row.payoutStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ================= DYNAMIC MODAL LAYER ================= */}
      {modalConfig.isOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-opacity">
          <div className="bg-white w-full max-w-2xl rounded-[35px] shadow-2xl overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="bg-[#CAEB66] p-6 text-[#02312A] flex justify-between items-center">
              <h3 className="text-xl font-black flex items-center gap-2">
                {modalConfig.type === "available" && (
                  <FaBox className="text-[#CAEB66]" />
                )}
                {modalConfig.type === "pending" && (
                  <FaReceipt className="text-[#CAEB66]" />
                )}
                {modalConfig.type === "withdraw_form" && (
                  <FaMoneyCheckAlt className="text-[#CAEB66]" />
                )}
                {modalConfig.title}
              </h3>
              <button
                onClick={closeModal}
                disabled={isSubmitting}
                className="p-2 hover:bg-black/10 rounded-full text-[#02312A] cursor-pointer transition-colors disabled:opacity-50"
              >
                <FaTimes size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              {modalConfig.type === "available" &&
                (paymentPayoutData.deliveredParcels?.length > 0 ? (
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b-2 border-gray-100 text-[10px] font-black text-gray-400 uppercase">
                        <th className="pb-3">Tracking ID</th>
                        <th className="pb-3">COD Amount</th>
                        <th className="pb-3">Delivery Fee</th>
                        <th className="pb-3 text-right">Net Earnings</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {paymentPayoutData.deliveredParcels.map((parcel) => {
                        const isPaid =
                          parcel.deliveryChargeStatus?.toLowerCase() === "paid";
                        const net = isPaid
                          ? Number(parcel.codAmount)
                          : Number(parcel.codAmount) -
                            Number(parcel.deliveryCharge);
                        return (
                          <tr
                            key={parcel._id}
                            className="text-xs font-bold text-[#02312A]"
                          >
                            <td className="py-4 text-gray-500 font-mono">
                              #{parcel._id?.slice(-6).toUpperCase()}
                            </td>
                            <td className="py-4">৳{parcel.codAmount}</td>
                            <td className="py-4">
                              ৳{parcel.deliveryCharge}
                              <span
                                className={`ml-1.5 text-[9px] px-1.5 py-0.5 rounded font-black uppercase ${isPaid ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"}`}
                              >
                                {parcel.deliveryChargeStatus || "Unpaid"}
                              </span>
                            </td>
                            <td className="py-4 text-right font-black text-green-600">
                              ৳{net}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-center text-sm text-gray-400 py-6 font-bold">
                    No delivered parcels available for drawdown.
                  </p>
                ))}

              {modalConfig.type === "pending" &&
                (paymentPayoutData.pendingTransactions.length > 0 ? (
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b-2 border-gray-100 text-[10px] font-black text-gray-400 uppercase">
                        <th className="pb-3">Request Date</th>
                        <th className="pb-3">Method</th>
                        <th className="pb-3 text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {paymentPayoutData.pendingTransactions.map((trx) => (
                        <tr
                          key={trx._id}
                          className="text-xs font-bold text-[#02312A]"
                        >
                          <td className="py-4 text-gray-500">
                            {new Date(trx.requestedAt).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              },
                            )}
                          </td>
                          <td className="py-4 flex items-center gap-1.5 uppercase text-[10px] font-black">
                            <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse"></span>
                            {trx.method || "bKash"}
                          </td>
                          <td className="py-4 text-right font-black text-orange-600">
                            ৳{trx.amount}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-center text-sm text-gray-400 py-6 font-bold">
                    No pending payout requests at the moment.
                  </p>
                ))}

              {modalConfig.type === "withdraw_form" && (
                <form onSubmit={handleFinalSubmit} className="space-y-6">
                  <div className="bg-[#02312A]/5 p-6 rounded-2xl border border-gray-100">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                      Total Payout Amount
                    </p>
                    <h4 className="text-3xl font-black text-[#02312A]">
                      ৳ {paymentPayoutData.availableBalance || 0}
                    </h4>
                  </div>

                  <div className="space-y-3">
                    <label className="text-xs font-black text-[#02312A] uppercase tracking-wider block">
                      Receiving Account Details
                    </label>
                    <div className="flex items-center gap-4 p-4 border-2 border-[#CAEB66] rounded-2xl bg-white shadow-sm">
                      <div className="w-10 h-10 bg-pink-50 rounded-xl flex items-center justify-center text-pink-600 shrink-0">
                        <FaMobileAlt size={20} />
                      </div>
                      <div>
                        <p className="text-xs font-black text-[#02312A]">
                          bKash (Mobile Banking)
                        </p>
                        <p className="text-[11px] font-bold text-gray-400">
                          01700-XXXXXX
                        </p>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs font-bold text-gray-400 bg-gray-50 p-4 rounded-xl border border-dashed">
                    ℹ️ Note: Payout requests usually take up to 12-24 hours to
                    process and reflect in your merchant mobile banking account.
                  </p>

                  <div className="flex gap-4 pt-2">
                    <button
                      type="button"
                      onClick={closeModal}
                      disabled={isSubmitting}
                      className="flex-1 border-2 border-gray-100 text-gray-500 py-3 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-gray-50 transition-all disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 bg-[#02312A] text-white py-3 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-[#034037] active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg"
                    >
                      {isSubmitting ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                          Processing...
                        </>
                      ) : (
                        "Confirm Withdraw"
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentPayout;
