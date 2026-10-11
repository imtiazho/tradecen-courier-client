import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import {
  FaCalendarAlt,
  FaUserAlt,
  FaMoneyBillWave,
  FaBox,
  FaHashtag,
  FaCheck,
  FaShieldAlt,
} from "react-icons/fa";
import useAuth from "../../Hooks/useAuth";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import LoadingModal from "../../Components/LoadingModal/LoadingModal";
import DynamicTitle from "../../Components/DynamicTitle/DynamicTitle";

const FinanceAndReport = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [processingId, setProcessingId] = useState(null);

  const {
    isLoading: historyLoading,
    data: depositData = {},
    refetch: historyRefetch,
  } = useQuery({
    queryKey: ["allDepositHistory", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/hub-deposit-history?status=pending`);
      return res.data;
    },
    
    enabled: !!user && !!user?.accessToken,
  });

  const historyList = depositData?.history || [];

  const handleApprove = (id, amount, hub) => {
    Swal.fire({
      title: '<span style="color: #02312A;">Confirm Audit?</span>',
      html: `Are you sure you received <span class="font-bold text-[#02312A]">৳${amount}</span> from <strong>${hub} Hub</strong>? This will lock the parcels permanently.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#CAEB66",
      cancelButtonColor: "#d33",
      confirmButtonText:
        '<span style="color: #02312A; font-weight: bold;">Yes, Approve</span>',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          setProcessingId(id);

          const response = await axiosSecure.patch(`/approve-deposit/${id}`);

          if (response.data.success) {
            historyRefetch();

            Swal.fire({
              icon: "success",
              title:
                '<span style="color: #02312A; font-weight: 900;">Deposit Verified!</span>',
              text: "The cash amount has been safely credited to HQ Main Ledger.",
              iconColor: "#02312A",
              confirmButtonColor: "#CAEB66",
              confirmButtonText:
                '<span style="color: #02312A; font-weight: bold;">Done</span>',
              customClass: {
                popup: "rounded-[20px]",
              },
            });
          }
        } catch (error) {
          console.error("Approval Error:", error);
          Swal.fire({
            icon: "error",
            title: "Approval Failed",
            text: error.response?.data?.message || "Something went wrong.",
            confirmButtonColor: "#02312A",
            customClass: {
              popup: "rounded-[20px]",
            },
          });
        } finally {
          setProcessingId(null);
        }
      }
    });
  };

  if (historyLoading) {
    return <LoadingModal isLoading={true}></LoadingModal>;
  }

  return (
    <div className="space-y-6 p-4 md:p-8 bg-[#ffffff] rounded-tradecen min-h-screen">
      <DynamicTitle title="Dashboard | Financial Reports" />
      {/* HQ Admin Header Banner */}
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-[#002B36] tracking-wide">
            HQ Central Finance Ledger
          </h2>
          <p className="text-sm text-gray-500 mt-1 font-medium">
             <span className="w-2.5 h-2.5 bg-[#CAEB66] rounded-full animate-pulse"></span>
            Review, audit, and approve liquid cash deposit requests coming from
            various branches.
          </p>
        </div>
        <div className="flex items-center gap-3 bg-[#CAEB66]/20 px-4 py-2 rounded-full border border-[#CAEB66]">
          <span className="text-[#002B36] font-bold text-sm uppercase tracking-wider">
            Team: {historyList?.length || 0} Active
          </span>
        </div>
      </div>

      {/* Main Request Table View */}
      {historyList.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[850px]">
            <thead>
              <tr>
                <th className="py-4 px-4 text-[11px] font-black uppercase text-gray-400">
                  Branch / Hub
                </th>
                <th className="py-4 px-4 text-[11px] font-black uppercase text-gray-400">
                  Requested Date
                </th>
                <th className="py-4 px-4 text-[11px] font-black uppercase text-gray-400">
                  Method / Reference
                </th>
                <th className="py-4 px-4 text-[11px] font-black uppercase text-gray-400 text-center">
                  Volume
                </th>
                <th className="py-4 px-4 text-[11px] font-black uppercase text-gray-400">
                  Received Cash
                </th>
                <th className="py-4 px-4 text-[11px] font-black uppercase text-gray-400 text-center">
                  HQ Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-[#FFFFFF]">
              {historyList.map((invoice) => (
                <tr
                  key={invoice._id}
                  className="hover:bg-gray-50/40 transition-all duration-300 group"
                >
                  {/* 1. Hub & Sender Info */}
                  <td className="py-4 px-4 rounded-l-[16px]">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-[#02312A]/5 text-[#02312A] rounded-lg flex items-center justify-center shrink-0">
                        <FaUserAlt size={11} />
                      </div>
                      <div>
                        <span className="text-[13px] font-bold text-[#02312A] block">
                          {invoice.hubName} Hub
                        </span>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide mt-0.5">
                          By: {invoice.submittedBy?.split(" ")[0] || "Manager"}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* 2. Date - স্যাম্পলের মতো ক্লিন ১ লাইনে সাজানো */}
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2 text-[12px] font-semibold text-gray-500">
                      <FaCalendarAlt size={12} className="text-gray-400" />
                      {new Date(invoice.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </td>

                  {/* 3. Method / TrxID */}
                  <td className="py-4 px-4">
                    <div className="text-[12px] font-bold text-[#02312A] uppercase tracking-wider">
                      {invoice.paymentMethod}
                    </div>
                    <div className="text-[12px] font-mono font-medium text-gray-400 mt-0.5 flex items-center gap-1">
                      <FaHashtag size={9} className="text-gray-400" />
                      {invoice.transactionDetails?.slipNo || "N/A"}
                    </div>
                  </td>

                  {/* 4. Total Parcels Volume */}
                  <td className="py-4 px-4 text-center">
                    <div className="inline-flex items-center gap-1 text-[11px] font-black text-slate-600 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-lg">
                      <FaBox size={10} className="text-slate-400" />
                      {invoice.totalParcelCount ||
                        invoice.totalParcelsCovered ||
                        0}{" "}
                      Pcs
                    </div>
                  </td>

                  {/* 5. Amount - স্যাম্পলের লাক্সারি গ্রিন ফন্ট ভাইব */}
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-1 text-[14px] font-black text-[#002B36]">
                      <FaMoneyBillWave className="text-emerald-600" size={13} />
                      ৳{invoice.depositedAmount?.toLocaleString()}
                    </div>
                  </td>

                  {/* 6. Admin Action Button */}
                  <td className="py-4 px-4 rounded-r-[16px] text-center">
                    <div className="flex items-center justify-center">
                      {invoice.status === "pending" ? (
                        processingId === invoice._id ? (
                          <span className="w-5 h-5 border-2 border-[#02312A] border-t-transparent rounded-full animate-spin"></span>
                        ) : (
                          <button
                            onClick={() =>
                              handleApprove(
                                invoice._id,
                                invoice.depositedAmount,
                                invoice.hubName,
                              )
                            }
                            className="p-2 px-3 bg-green-50 text-green-600 hover:bg-[#CAEB66] hover:text-[#02312A] border border-green-200/40 rounded-xl transition-all active:scale-95 flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider cursor-pointer"
                            title="Verify & Accept"
                          >
                            <FaCheck size={10} /> Approve
                          </button>
                        )
                      ) : (
                        <span className="px-3 py-1 bg-gray-100 text-gray-400 rounded-xl text-[10px] font-black uppercase tracking-wider border border-gray-200/30">
                          Success Verified
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* Empty Ledger State */
        <div className="text-center py-16 bg-white rounded-[25px] border border-dashed border-gray-200">
          <p className="text-sm font-bold text-gray-400">
            No branch deposits recorded in the central ledger yet. 🏦
          </p>
        </div>
      )}
    </div>
  );
};

export default FinanceAndReport;
