import React from "react";
import {
  FaBarcode,
  FaBoxOpen,
  FaCreditCard,
  FaRegEdit,
  FaTrashAlt,
  FaTruckMoving,
} from "react-icons/fa";
import { HiDotsVertical } from "react-icons/hi";
import { RiMoneyDollarCircleFill } from "react-icons/ri";
import LoadingModal from "../../Components/LoadingModal/LoadingModal";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import useAuth from "../../Hooks/useAuth";
import { useQuery } from "@tanstack/react-query";

const Delivered = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { data: deliveredParcels = [], isLoading } = useQuery({
    queryKey: ["deliveredParcels", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/parcels/status/${user.email}?status=delivered`,
      );
      return res.data;
    },
    
    enabled: !!user?.email,
  });

  if (isLoading) return <LoadingModal isLoading={isLoading} />;

  return (
    <div className="py-8 px-12 bg-[#ffffff] shadow-flat rounded-tradecen font-sans text-slate-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#02312A] tracking-tight">
            Delivered Parcels
          </h1>
          <p className="text-slate-500 text-sm mt-2">
            All your delivered parcels here!
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-separate border-spacing-y-3">
          <thead>
            <tr className="text-[#ADB5BD] text-[11px] uppercase tracking-widest font-black">
              <th className="px-6 py-3">Tracking ID</th>
              <th className="px-6 py-3">Parcel Name</th>
              <th className="px-6 py-3">COD</th>
              <th className="px-6 py-3">Charge</th>
            </tr>
          </thead>
          <tbody>
            {deliveredParcels.map((parcel) => (
              <tr
                key={parcel._id}
                className="bg-[#FFFFFF] hover:bg-[#F8F9FA]/60 transition-all group"
              >
                <td className="px-6 py-5 rounded-l-[16px] text-xs text-[#02312A]">
                  <div className="flex items-center gap-2">
                    <FaBarcode className="text-gray-400 text-xs" />
                    <span className="font-mono font-black text-gray-500 tracking-tighter uppercase">
                      #{parcel.trackingID}
                    </span>
                  </div>
                </td>

                {/* Parcel Name */}
                <td className="px-6 py-5 text-xs text-[#02312A]">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-50 text-[#02312A] rounded-xl flex items-center justify-center border border-gray-100 group-hover:bg-white group-hover:shadow-sm transition-all">
                      <FaBoxOpen size={14} />
                    </div>
                    <span className="font-bold text-sm text-[#02312A]">
                      {parcel.parcelName}
                    </span>
                  </div>
                </td>

                {/* Charge */}
                <td className="px-6 py-5 text-sm font-black text-[#02312A]">
                  ৳{parcel.codAmount}
                </td>

                <td className="px-6 py-5 rounded-r-[16px] text-xs text-[#02312A]">
                  <div className="flex flex-col gap-1.5">
                    <span
                      className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full w-fit tracking-tighter border ${
                        parcel.deliveryChargeStatus === "paid"
                          ? "bg-green-50 text-green-600 border-green-100"
                          : "bg-orange-50 text-orange-600 border-orange-100"
                      }`}
                    >
                      {parcel.deliveryChargeStatus}
                    </span>
                    <span className="font-black text-sm">
                      ৳{parcel.deliveryCharge}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {deliveredParcels.length === 0 && (
          <div className="py-24 text-center bg-white rounded-[20px] border border-dashed border-gray-100 mt-2">
            <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100 text-[#02312A]/40">
              <FaBoxOpen size={32} />
            </div>
            <h3 className="text-[#02312A] font-black text-lg tracking-tight">
              All settled!
            </h3>
            <p className="text-gray-400 text-xs font-bold max-w-[340px] mx-auto mt-1.5 leading-relaxed">
              No delivered parcel found in your history log at this moment.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Delivered;
