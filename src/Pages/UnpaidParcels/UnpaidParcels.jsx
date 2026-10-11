import React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  FaTrashAlt,
  FaRegEdit,
  FaCreditCard,
  FaBarcode,
  FaBoxOpen,
} from "react-icons/fa";
import { HiDotsVertical } from "react-icons/hi";
import { RiMoneyDollarCircleFill } from "react-icons/ri";
import useAuth from "../../Hooks/useAuth";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import LoadingModal from "../../Components/LoadingModal/LoadingModal";
import Swal from "sweetalert2";

const UnpaidParcels = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const {
    data: unpaidParcelsData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["unPaidParcels", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/parcels/unpaid/${user.email}`);
      return res.data;
    },
  });

  if (isLoading) return <LoadingModal isLoading={isLoading}></LoadingModal>;

  const parcels = unpaidParcelsData?.data || [];
  const totalDue = unpaidParcelsData?.totalDue || 0;

  const handleParcelDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This parcel will be removed permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#BEF264",
      cancelButtonColor: "#64748B",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel",
      reverseButtons: true,
      customClass: {
        confirmButton: "!text-black !font-bold !px-6 !py-3 !rounded-[10px]",
        cancelButton: "!text-white !font-medium !px-6 !py-3 !rounded-[10px]",
      },

      buttonsStyling: true,
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure
          .delete(`/parcel/${id}`)
          .then((res) => {
            if (res.data.deletedCount > 0) {
              refetch();
              Swal.fire({
                title: "Deleted!",
                text: "The parcel has been successfully removed.",
                icon: "success",
                confirmButtonColor: "#BEF264",
                customClass: {
                  confirmButton: "!text-black !font-bold",
                },
              });
            }
          })
          .catch((err) => {
            console.error(err);
            Swal.fire("Error", "Something went wrong!", "error");
          });
      }
    });
  };

  // Handle Payment
  const handlePayment = async (parcel) => {
    const paymentInfo = {
      deliveryCharge: parcel.deliveryCharge,
      parcelId: parcel._id,
      senderEmail: parcel.senderInfo.email,
      parcelName: parcel.parcelName,
      trackingID: parcel.trackingID,
    };

    const res = await axiosSecure.post("/payment-checkout", paymentInfo);
    if (res.data?.url) {
      window.location.replace(res.data.url);
    }
  };

  return (
    <div className="py-8 px-12 bg-[#fff] rounded-tradecen min-h-screen font-sans text-slate-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#02312A] tracking-tight">
            Unpaid Invoices
          </h1>
          <p className="text-slate-500 text-sm mt-2">
            Settle your pending delivery charges to keep shipments moving.
          </p>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-separate border-spacing-y-3">
          <thead>
            <tr className="text-[#ADB5BD] text-[11px] uppercase tracking-widest font-black">
              <th className="px-6 py-3">Tracking ID</th>
              <th className="px-6 py-3">Parcel Name</th>
              <th className="px-6 py-3">Charge</th>
              <th className="px-6 py-3">Payment</th>
              <th className="px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {parcels?.map((parcel) => (
              <tr
                key={parcel._id}
                className="bg-[#FFFFFF] hover:bg-[#F8F9FA]/60 transition-all group"
              >
                <td className="px-6 py-5 rounded-l-[16px] text-xs font-black text-[#02312A]">
                  <div className="flex items-center gap-2">
                    <FaBarcode className="text-gray-400 text-xs" />
                    <span>#{parcel.trackingID}</span>
                  </div>
                </td>

                {/* Parcel Name */}
                <td className="px-6 py-5 text-xs font-medium text-[#02312A]">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-50 text-[#02312A] rounded-xl flex items-center justify-center group-hover:bg-white group-hover:shadow-sm transition-all border border-gray-100">
                      <FaBoxOpen size={14} />
                    </div>
                    <span className="font-bold">
                      {parcel.parcelName.length > 18
                        ? parcel.parcelName.slice(0, 18) + "..."
                        : parcel.parcelName}
                    </span>
                  </div>
                </td>

                {/* Charge */}
                <td className="px-6 py-5 text-xs font-bold text-[#02312A]">
                  ৳{parcel.deliveryCharge}
                </td>

                {/* Payment (Pay Now Button) */}
                <td className="px-6 py-5">
                  <button
                    onClick={() => handlePayment(parcel)}
                    className="flex items-center gap-1.5 text-[10px] font-black bg-orange-50 text-orange-600 px-3 py-1.5 rounded-xl hover:bg-orange-600 hover:text-white transition-all duration-300 cursor-pointer border border-orange-100"
                  >
                    <RiMoneyDollarCircleFill size={13} />
                    PAY NOW
                  </button>
                </td>

                <td className="px-6 py-5 rounded-r-[16px] text-center">
                  <div className="flex justify-center items-center gap-2">
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button
                        title="Edit"
                        className="p-2 bg-[#CAEB66] text-[#02312A] rounded-lg hover:scale-110 transition-transform cursor-pointer"
                      >
                        <FaRegEdit size={13} />
                      </button>
                      {parcel.deliveryStatus === "parcel-created" ||
                        (parcel.deliveryStatus === "assign-pickup-rider" && (
                          <button
                            onClick={() => handleParcelDelete(parcel._id)}
                            title="Delete"
                            className="p-2 bg-red-50 text-red-500 rounded-lg hover:scale-110 transition-transform cursor-pointer"
                          >
                            <FaTrashAlt size={13} />
                          </button>
                        ))}
                    </div>

                    <button className="p-2 text-gray-400 hover:text-[#02312A] rounded-xl transition-colors cursor-pointer">
                      <HiDotsVertical size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {parcels?.length === 0 && (
          <div className="py-24 text-center">
            <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
              <FaBoxOpen size={32} className="text-slate-200" />
            </div>
            <h3 className="text-slate-900 font-bold text-lg">
              Your Ledger is Clean!
            </h3>
            <p className="text-slate-400 text-sm max-w-112.5 mx-auto mt-1">
              Once you create new parcels and deliveries are initiated, your
              pending payments and invoices will show up here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UnpaidParcels;
