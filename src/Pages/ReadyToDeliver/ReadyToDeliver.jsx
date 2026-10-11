import React from "react";
import {
  FaBarcode,
  FaBoxOpen,
  FaCreditCard,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaRegEdit,
  FaTruckMoving,
  FaTrashAlt,
  FaTruckLoading,
  FaUserCircle,
} from "react-icons/fa";
import { HiDotsVertical } from "react-icons/hi";
import { RiMoneyDollarCircleFill } from "react-icons/ri";
import useAuth from "../../Hooks/useAuth";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import LoadingModal from "../../Components/LoadingModal/LoadingModal";

const ReadyToDeliver = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { data: readyToDeliverParcels = [], isLoading } = useQuery({
    queryKey: ["readyToDeliver", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/parcels/status/${user.email}?status=assign-delivery-rider`,
      );
      return res.data;
    },
  });

  if (isLoading) return <LoadingModal isLoading={isLoading} />;

  return (
    <div className="py-8 px-12 bg-[#fff] shadow-flat rounded-tradecen font-sans text-slate-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#02312A] tracking-tight">
            Ready to Delivery
          </h1>
          <p className="text-slate-500 text-sm mt-2">
            Parcels are going to delivery through rider.
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-separate border-spacing-y-3">
          <thead>
            <tr className="text-[#ADB5BD] text-[11px] uppercase tracking-widest font-black">
              <th className="px-6 py-3">Shipment Details</th>
              <th className="px-6 py-3">Assigned Rider</th>
              <th className="px-6 py-3">Delivery Charge</th>
              <th className="px-6 py-3">Amount</th>
              <th className="px-6 py-3 text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            {readyToDeliverParcels.map((parcel) => (
              <tr
                key={parcel._id}
                className="bg-[#FFFFFF] hover:bg-[#F8F9FA]/60 transition-all group"
              >
                <td className="px-6 py-5 rounded-l-[16px] text-xs text-[#02312A]">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <FaBarcode className="text-gray-400 text-xs" />
                      <span className="font-mono font-black text-gray-500 tracking-tighter uppercase">
                        #{parcel.trackingID}
                      </span>
                    </div>
                    <p className="font-bold text-sm text-[#02312A] capitalize">
                      {parcel.parcelName}
                    </p>
                  </div>
                </td>

                <td className="px-6 py-5 text-xs text-[#02312A]">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-50 text-[#02312A] rounded-xl flex items-center justify-center border border-gray-100 group-hover:bg-white group-hover:shadow-sm transition-all">
                      <FaUserCircle size={18} />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-[#02312A] capitalize">
                        {parcel.deliveryRider?.name || "Assigning..."}
                      </p>
                      {parcel.deliveryRider?.phone ? (
                        <a
                          href={`tel:${parcel.deliveryRider.phone}`}
                          className="flex items-center gap-1 mt-1 text-[10px] font-black text-gray-400 hover:text-[#02312A] transition-colors uppercase tracking-wider cursor-pointer"
                        >
                          <FaPhoneAlt size={8} /> {parcel.deliveryRider.phone}
                        </a>
                      ) : (
                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">
                          No Contact
                        </p>
                      )}
                    </div>
                  </div>
                </td>

                {/* Delivery Charge */}
                <td className="px-6 py-5 text-xs text-[#02312A]">
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

                {/* Amount */}
                <td className="px-6 py-5 text-sm font-black text-[#02312A]">
                  ৳{parcel.codAmount}
                </td>

                <td className="px-6 py-5 rounded-r-[16px] text-center">
                  <div className="flex justify-center">
                    <span className="inline-flex items-center gap-1.5 bg-blue-50/60 text-blue-600 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider border border-blue-100/50">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                      On the way
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {readyToDeliverParcels.length === 0 && (
          <div className="py-24 text-center bg-white rounded-[20px] border border-dashed border-gray-100 mt-2">
            <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100 text-[#02312A]/40">
              <FaBoxOpen size={32} />
            </div>
            <h3 className="text-[#02312A] font-black text-lg tracking-tight">
              All settled!
            </h3>
            <p className="text-gray-400 text-xs font-bold max-w-[340px] mx-auto mt-1.5 leading-relaxed">
              No pending shipments found ready for delivery at this moment.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReadyToDeliver;
