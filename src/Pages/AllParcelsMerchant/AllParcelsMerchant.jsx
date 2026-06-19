import React, { useState } from "react";
import useAuth from "../../Hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import {
  FaEdit,
  FaTrashAlt,
  FaChevronLeft,
  FaChevronRight,
  FaLongArrowAltRight,
} from "react-icons/fa";
import Swal from "sweetalert2";
import LoadingModal from "../../Components/LoadingModal/LoadingModal";
import { Link } from "react-router";
import { CgDetailsMore } from "react-icons/cg";
import DynamicTitle from "../../Components/DynamicTitle/DynamicTitle";

const AllParcelsMerchant = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  // Pagination states
  const [currentPage, setCurrentPage] = useState(0);
  const limit = 10;

  const {
    data: parcelsData,
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["all-parcels-merchant", user?.email, currentPage],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/parcels?email=${user?.email}&skip=${currentPage * limit}&limit=${limit}`,
      );
      return res.data;
    },

    enabled: !!user && !!user?.accessToken,
  });

  // Delete Logic
  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#02312A",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const res = await axiosSecure.delete(`/parcel/${id}?email=${user?.email}`);
        if (res.data.deletedCount > 0) {
          refetch();
          Swal.fire("Deleted!", "Your parcel has been deleted.", "success");
        }
      }
    });
  };

  // Pagination
  const totalPages = Math.ceil((parcelsData?.count || 0) / limit);

  if (isLoading) {
    return <LoadingModal isLoading={true}></LoadingModal>;
  }

  return (
    <div className="p-6 bg-white rounded-[20px] shadow-flat">
      <DynamicTitle title="Dashboard | All Parcels" />
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-black text-secondary">All Parcels</h2>
        <div className="bg-primary text-secondary px-4 py-1 rounded-[10px] text-[10px] font-bold uppercase">
          Total: {parcelsData?.count || 0}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-separate border-spacing-y-3">
          <thead>
            <tr className="text-[#ADB5BD] text-[11px] uppercase tracking-widest font-black">
              <th className="px-6 py-3">Tracking ID</th>
              <th className="px-6 py-3">Parcel</th>
              <th className="px-6 py-3">Recipient</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Charge</th>
              <th className="px-6 py-3">COD Amount</th>
              <th className="px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {parcelsData.length < 1 ? (
              <tr>
                <td colSpan={7} className="py-20 text-center">
                  <div className="flex flex-col items-center justify-center text-gray-400 gap-2">
                    <span className="text-3xl">📄</span>
                    <p className="text-xs font-bold uppercase tracking-widest">
                      No parcels data available
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              parcelsData?.data?.map((parcel) => (
                <tr
                  key={parcel._id}
                  className="bg-[#FFFFFF] hover:bg-[#F8F9FA]/60 transition-all group"
                >
                  <td className="px-6 py-5 rounded-l-[16px] text-xs font-black text-[#02312A]">
                    #{parcel.trackingID}
                  </td>
                  <td className="px-6 py-5 text-xs font-medium text-[#02312A]">
                    <p className="font-black text-sm text-[#02312A]">
                      {parcel.parcelName}
                    </p>
                    <Link
                      className="inline-flex items-center gap-1 mt-1.5 font-bold text-gray-400 hover:text-[#02312A] hover:underline underline-offset-4 transition-all duration-200 cursor-pointer uppercase text-[9px] tracking-wider"
                      to={`parcel-detail/${parcel._id}`}
                    >
                      <CgDetailsMore size={12} /> View Details
                    </Link>
                  </td>
                  <td className="px-6 py-5">
                    <p className="text-xs font-bold text-[#02312A]">
                      {parcel.receiverInfo?.name}
                    </p>
                    <p className="text-[10px] text-gray-400">
                      {parcel.receiverInfo?.phone}
                    </p>
                  </td>
                  <td className="px-6 py-5">
                    <span
                      className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter 
                                        ${parcel.deliveryStatus === "delivered" ? "bg-green-100 text-green-600" : "bg-blue-100 text-blue-600"}`}
                    >
                      {parcel.deliveryStatus.replace(/-/g, " ")}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-xs font-bold text-[#02312A]">
                    ৳{parcel.deliveryCharge}
                  </td>
                  <td className="px-6 py-5 text-xs font-black text-[#02312A]">
                    ৳{parcel.codAmount || 0}
                  </td>
                  <td className="px-6 py-5 rounded-r-[16px] text-center">
                    {parcel.deliveryStatus === "parcel-created" ||
                    parcel.deliveryStatus === "assign-pickup-rider" ? (
                      <div className="flex justify-center gap-3">
                        <button className="p-2 bg-[#CAEB66] text-[#02312A] rounded-lg hover:scale-110 transition-transform">
                          <FaEdit size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(parcel._id)}
                          className="p-2 bg-red-100 text-red-500 rounded-lg hover:scale-110 transition-transform"
                        >
                          <FaTrashAlt size={14} />
                        </button>
                      </div>
                    ) : (
                      <span className="text-[10px] font-bold text-gray-300 italic">
                        Locked
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="mt-8 grid grid-cols-3 items-center justify-center">
          <div className="flex justify-start">
            {currentPage > 0 && (
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-400 hover:text-[#02312A] transition-all flex items-center gap-2 cursor-pointer hover:border-[#CAEB66]"
              >
                ← Previous
              </button>
            )}
          </div>

          <div className="flex gap-2 justify-center">
            {[...Array(totalPages).keys()].map((n, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(n)}
                className={`w-8 h-8 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  n === currentPage
                    ? "bg-[#CAEB66] text-[#02312A] shadow-sm font-black scale-105"
                    : "text-gray-400 hover:bg-gray-50 hover:text-[#02312A]"
                }`}
              >
                {n + 1}
              </button>
            ))}
          </div>

          <div className="flex justify-end">
            {currentPage < totalPages - 1 && (
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-400 hover:text-[#02312A] transition-all flex items-center gap-2 cursor-pointer hover:border-[#CAEB66]"
              >
                Next →
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AllParcelsMerchant;
