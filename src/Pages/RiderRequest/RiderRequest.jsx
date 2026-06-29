import React from "react";
import {
  RiCheckLine,
  RiCloseLine,
  RiEyeLine,
  RiListCheck2,
} from "react-icons/ri";
import Swal from "sweetalert2";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import useAuth from "../../Hooks/useAuth";
import LoadingModal from "../../Components/LoadingModal/LoadingModal";

const RiderRequest = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const {
    data: riders = [],
    refetch,
    isLoading: ridersLoading,
  } = useQuery({
    queryKey: ["riders", "pending"],
    queryFn: async () => {
      const res = await axiosSecure.get("/riders?status=pending");
      return res.data;
    },

    enabled: !!user && !!user?.accessToken,
  });

  const handleApprove = async (rider) => {
    try {
      const response = await axiosSecure.patch(`/riders/${rider._id}`, {
        status: "active",
        workStatus: "available",
        email: rider.email,
      });

      if (response.data.success) {
        Swal.fire(
          "Approved!",
          "Rider is now active and role updated.",
          "success",
        );
        refetch();
      }
    } catch (error) {
      console.error("Approve Error:", error);
      Swal.fire("Error!", "Failed to approve rider.", "error");
    }
  };

  // const handleReject = async (id) => {
  //   Swal.fire({
  //     title: "Are you sure?",
  //     text: "This rider request will be deleted!",
  //     icon: "warning",
  //     showCancelButton: true,
  //     confirmButtonColor: "#d33",
  //     cancelButtonColor: "#3085d6",
  //     confirmButtonText: "Yes, Reject!",
  //   }).then(async (result) => {
  //     if (result.isConfirmed) {
  //       try {
  //         const response = await axiosSecure.delete(`/riders/${id}`);
  //         if (response.data.deletedCount > 0) {
  //           Swal.fire("Rejected!", "Rider request removed.", "success");
  //           refetch();
  //         }
  //       } catch (error) {
  //         console.error("Reject Error:", error);
  //         Swal.fire("Error!", "Something went wrong.", "error");
  //       }
  //     }
  //   });
  // };

  if (ridersLoading) {
    return <LoadingModal isLoading={true}></LoadingModal>;
  }
  
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-black text-slate-800">
            Rider Onboarding Requests
          </h2>
          <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">
            TradeCen Fleet Management
          </p>
        </div>
      </div>

      <div className="overflow-x-auto bg-white rounded-tradecen">
        <table className="w-full text-left">
          <thead>
            <tr>
              <th className="py-5 text-[10px] font-black uppercase text-gray-400 tracking-wider">
                Rider
              </th>
              <th className="py-5 text-[10px] font-black uppercase text-gray-400 tracking-wider">
                Location
              </th>
              <th className="py-5 text-[10px] font-black uppercase text-gray-400 tracking-wider">
                Vehicle
              </th>
              <th className="py-5 text-[10px] font-black uppercase text-gray-400 tracking-wider text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {riders.map((rider) => (
              <tr
                key={rider._id}
                className="hover:bg-[#F8F9FA]/60 transition-all group"
              >
                <td className="py-5">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <img
                        src={rider.photoURL}
                        className="w-12 h-12 rounded-2xl object-cover ring-2 ring-gray-50"
                        alt={rider.name}
                      />
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-orange-400 border-2 border-white rounded-full"></div>
                    </div>
                    <div>
                      <p className="text-sm font-black text-slate-700">
                        {rider.name}
                      </p>
                      <p className="text-[10px] text-gray-400 font-bold">
                        NID: {rider.nid}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="py-5">
                  <p className="text-xs font-black text-slate-600 uppercase tracking-tight">
                    {rider.area}
                  </p>
                  <p className="text-[10px] text-gray-400 font-bold">
                    {rider.district}, {rider.region}
                  </p>
                </td>
                <td className="py-5">
                  <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[9px] font-black uppercase">
                    {rider.vehicle}
                  </span>
                </td>
                <td className="py-5">
                  <div className="flex justify-end gap-3">
                    <button
                      disabled
                      className="p-2.5 text-blue-500 bg-blue-100 rounded-xl transition-colors border border-transparent border-blue-100 cursor-not-allowed"
                    >
                      <RiEyeLine size={18} />
                    </button>
                    <button
                      onClick={() => handleApprove(rider)}
                      className="p-2.5 text-green-600 bg-green-50 rounded-xl transition-colors border border-transparent border-green-100 cursor-pointer"
                    >
                      <RiCheckLine size={18} />
                    </button>
                    {/* <button
                      onClick={() => handleReject(rider._id)}
                      className="p-2.5 text-red-500 bg-red-50 rounded-xl transition-colors border border-transparent border-red-100 cursor-pointer"
                    >
                      <RiCloseLine size={18} />
                    </button> */}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {riders.length === 0 && (
          <div className="py-20 text-center">
            <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <RiListCheck2 className="text-gray-300" size={30} />
            </div>
            <p className="text-gray-400 text-xs font-black uppercase tracking-widest">
              No pending rider requests found
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RiderRequest;
