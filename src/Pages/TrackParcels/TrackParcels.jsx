import React, { useState } from "react";
import { FaSearch, FaBoxOpen } from "react-icons/fa";
import { IoCheckmarkCircle } from "react-icons/io5";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import LoadingModal from "../../Components/LoadingModal/LoadingModal";
import DynamicTitle from "../../Components/DynamicTitle/DynamicTitle";

const TrackParcels = () => {
  const axiosSecure = useAxiosSecure();
  const [trackingCode, setTrackingCode] = useState("");
  const [trackingData, setTrackingData] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!trackingCode) return;
    setLoading(true);
    try {
      const res = await axiosSecure.get(`/tracking/${trackingCode}`);
      if (res.data.success) {
        setTrackingData(res.data.result);
      }
    } catch (error) {
      setTrackingData([]);
    } finally {
      setLoading(false);
    }
  };

  const parcelInfo = trackingData.length > 0 ? trackingData[0] : null;

  return (
    <>
      <DynamicTitle title="Track Your Parcels" />
      <div className="p-6 lg:p-12 bg-white font-sans mt-6 rounded-tradecen shadow-flat min-h-screen">
        {/* Header Section */}
        <div className="mb-10">
          <h1 className="text-4xl font-black text-[#02312A] mb-2 tracking-tight">
            Track Your Consignment
          </h1>
          <p className="text-gray-400 font-medium">
            Enter your tracking ID to see the real-time status of your parcel.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-md mb-12">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="e.g. TCC-WB9CKMKEI"
            className="w-full bg-[#F3F4F6] border-none rounded-full py-4 pl-12 pr-32 focus:ring-2 focus:ring-[#CAEB66] transition-all outline-none text-sm font-bold"
            value={trackingCode}
            onChange={(e) => setTrackingCode(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
          />
          <button
            onClick={handleSearch}
            className="absolute right-1 top-1 bg-[#CAEB66] text-secondary font-bold px-6 py-2.5 rounded-full hover:bg-[#bad85d] transition-all active:scale-95 cursor-pointer"
          >
            {loading ? "Searching..." : "Track"}
          </button>
        </div>

        {trackingData.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start animate-in fade-in duration-500">
            <div className="bg-[#F3F7F9] p-8 rounded-[25px] border border-gray-100">
              <h2 className="text-2xl font-black text-[#02312A] mb-6 flex items-center gap-3">
                <FaBoxOpen
                  className="text-[#CAEB66] bg-[#02312A] p-2 rounded-lg"
                  size={35}
                />{" "}
                Product Details
              </h2>

              <div className="space-y-4">
                <div className="bg-[#CAEB66] p-4 rounded-xl">
                  <p className="text-secondary text-[10px] uppercase font-black tracking-widest mb-1">
                    Tracking ID
                  </p>
                  <p className="text-secondary font-mono font-bold">
                    #{parcelInfo.trackingID}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-400 text-[10px] uppercase font-black mb-1">
                      Parcel Name
                    </p>
                    <p className="text-gray-700 font-bold text-sm">
                      {parcelInfo.parcelName}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-[10px] uppercase font-black mb-1">
                      COD Amount
                    </p>
                    <p className="text-[#02312A] font-black">
                      ৳ {parcelInfo.codAmount}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-500 font-bold text-sm">
                      Merchant:
                    </span>
                    <span className="text-[#02312A] font-bold text-sm">
                      {parcelInfo.merchantName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 font-bold text-sm">
                      Receiver:
                    </span>
                    <span className="text-[#02312A] font-bold text-sm">
                      {parcelInfo.receiverName}
                    </span>
                  </div>
                </div>

                <div className="mt-6">
                  <span className="bg-[#CAEB66] text-[#02312A] px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-tighter">
                    Current Status:{" "}
                    {parcelInfo.deliveryStatus.replace(/-/g, " ")}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Card: Dynamic Tracking Updates */}
            <div className="bg-[#F3F7F9] p-8 rounded-[25px] border border-gray-100">
              <h2 className="text-2xl font-black text-[#02312A] mb-8">
                History
              </h2>

              <div className="relative space-y-8">
                {trackingData.map((step, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-6 relative group"
                  >
                    {/* Vertical Line */}
                    {index !== trackingData.length - 1 && (
                      <div className="absolute left-[103px] top-8 w-0.5 h-12 bg-gray-200 group-hover:bg-[#CAEB66] transition-colors"></div>
                    )}

                    {/* Date & Time formatting */}
                    <div className="w-24 text-right shrink-0">
                      <p className="text-[10px] font-black text-gray-400 uppercase leading-tight">
                        {new Date(step.createdAt).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                        })}
                      </p>
                      <p className="text-[10px] font-bold text-gray-300">
                        {new Date(step.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>

                    {/* Status Icon */}
                    <div className="relative ">
                      <IoCheckmarkCircle
                        className={`${index === 0 ? "text-[#CAEB66]" : "text-gray-300"} text-3xl bg-white rounded-full transition-transform group-hover:scale-110`}
                      />
                    </div>

                    {/* Status Message */}
                    <div className="pt-1">
                      <p
                        className={`text-sm font-bold uppercase tracking-tight ${index === 0 ? "text-[#02312A]" : "text-gray-400"}`}
                      >
                        {step.deliveryStatus.replace(/-/g, " ")}
                      </p>
                      <p className="text-[11px] text-gray-500 italic mt-0.5">
                        {step.details}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          !loading &&
          trackingCode && (
            <div className="text-center py-20 bg-gray-50 rounded-[40px] border-2 border-dashed border-gray-200">
              <div className="text-5xl mb-4 text-gray-200">🔍</div>
              <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">
                No data found for this ID
              </p>
            </div>
          )
        )}
        {loading && <LoadingModal isLoading={true} />}
      </div>
    </>
  );
};

export default TrackParcels;
