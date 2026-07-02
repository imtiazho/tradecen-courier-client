import React from "react";
import { useForm, useWatch } from "react-hook-form";
import { useLoaderData, useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import useAuth from "../../Hooks/useAuth";
import LoadingModal from "../../Components/LoadingModal/LoadingModal";
import DynamicTitle from "../../Components/DynamicTitle/DynamicTitle";

const ErrorMsg = ({ errors, name }) => {
  if (!errors[name]) return null;
  return (
    <span className="text-red-500 text-xs mt-1 block font-medium">
      {errors[name].message}
    </span>
  );
};

const trackingIDGenerator = () => {
  return `TCC-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
};

const deliveryOTPGenerator = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const SendParcel = () => {
  const { dbUser, loading: authLoading, setLoading } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const areaAndLocation = useLoaderData() || [];
  // Use watch to toggle the field
  console.log(areaAndLocation);
  const { data: merchant = {}, isLoading: merchantLoading } = useQuery({
    queryKey: ["merchant", dbUser?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/merchant/${dbUser?.email}`);
      return res.data;
    },
    enabled: !!dbUser?.email && !authLoading,
  });

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      parcelType: "Document",
      parcelWeight: 1,
    },
  });

  // Watch fields for logic
  const pType = useWatch({ control, name: "parcelType" });
  const pWeight = parseFloat(useWatch({ control, name: "parcelWeight" })) || 1;
  const selectedRegion = useWatch({ control, name: "receiverRegion" });
  const selectedDistrict = useWatch({ control, name: "receiverDistrict" });
  const selectedMethodRev = useWatch({ control, name: "selectedMethodRev" });

  // Location Helper
  const clearRegions = [...new Set(areaAndLocation.map((rg) => rg.region))];
  const getDistricts = (region) =>
    areaAndLocation.filter((i) => i.region === region).map((d) => d.district);
  const getAreas = (district) =>
    areaAndLocation.find((i) => i.district === district)?.covered_area || [];

  // Calculation
  const calculateCost = () => {
    const merchantDistrict = merchant?.district;
    if (!merchantDistrict) return 0;

    const isOutsideCity =
      selectedDistrict &&
      merchantDistrict.toLowerCase() !== selectedDistrict.toLowerCase();

    if (pType === "Document") {
      return isOutsideCity ? 80 : 60;
    }

    // Non-Document logic
    if (pWeight <= 3) {
      return isOutsideCity ? 150 : 110;
    }

    // Weight > 3kg
    const extraWeight = pWeight - 3;
    const baseCharge = isOutsideCity ? 150 : 110;
    const extraCharge = extraWeight * 40;
    const additionalOutsideFee = isOutsideCity ? 40 : 0;

    return baseCharge + extraCharge + additionalOutsideFee;
  };

  const deliveryCharge = calculateCost();

  const handleSendParcel = async (data) => {
    setLoading(true);
    const trackingID = trackingIDGenerator();

    const parcelData = {
      // For Owner checking
      email: dbUser?.email,

      // 📦 Basic Info
      parcelType: data.parcelType,
      parcelName: data.parcelName,
      parcelWeight: parseFloat(data.parcelWeight),
      deliveryCharge: deliveryCharge,
      codAmount: selectedMethodRev ? parseInt(data.CODAmount) : 0,
      currency: "BDT",
      trackingID: trackingID,
      createdAt: new Date(),

      // 🚦 Statuses
      deliveryStatus: "parcel-created",
      deliveryChargeStatus: "unpaid",
      currentLocation: "merchant-location",
      revMethod: selectedMethodRev ? "COD" : "Online",
      merchantRevenueStatus: false,
      isDepositedToHQ: false,
      deliveryChargeOnlinePaymentStatus: false,
      inCity: merchant?.area === data.receiverArea,
      isReturnRequested: false,

      // 👤 Sender (Merchant) Details
      senderInfo: {
        name: merchant?.businessName || dbUser?.displayName,
        email: dbUser?.email,
        phone: merchant?.contact,
        address: merchant?.pickupPoint,
        region: merchant?.region,
        district: merchant?.district,
        area: merchant?.area,
      },

      // 👥 Receiver Details
      receiverInfo: {
        name: data.receiverName,
        phone: data.receiverPhone,
        address: data.receiverAddress,
        region: data.receiverRegion,
        district: data.receiverDistrict,
        area: data.receiverArea,
      },

      // 🚛 Logistics & Hubs (Initial state empty)
      serviceCenters: {
        origin: `${merchant?.area}`,
        destination: `${data.receiverArea}`,
      },

      // 🛵 Rider Assignment (Initial null)
      pickupRider: {
        id: null,
        email: null,
        name: "",
        phone: "",
      },
      deliveryRider: {
        id: null,
        email: null,
        name: "",
        phone: "",
      },

      // 🤖 AI, Security & Timeline
      security: {
        deliveryOTP: deliveryOTPGenerator(),
      },
      timeline: {
        lastScanLocation: "",
        estimatedDelivery: null, // AI will update this
        deliveredAt: null,
      },
    };

    try {
      const res = await axiosSecure.post("/parcels", parcelData);
      if (res.data.insertedId) {
        Swal.fire({
          icon: "success",
          title: "Booking Confirmed!",
          text: `Tracking ID: ${trackingID}`,
          confirmButtonColor: "#002B36",
        });
        navigate("/dashboard/all-parcels");
      }
    } catch (error) {
      Swal.fire("Error", "Failed to book parcel.", "error");
    } finally {
      setLoading(false);
    }
  };

  if (merchantLoading) return <LoadingModal isLoading={true} />;

  const inputStyle =
    "w-full border border-gray-200 p-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#CAEB66]/50 transition-all text-sm bg-white";
  const labelStyle = "block text-[13px] font-bold text-[#002B36] mb-1.5 ml-1";

  return (
    <div className="bg-white rounded-tradecen shadow-flat overflow-hidden">
      <DynamicTitle title="Dashboard | Book Consignment" />
      {/* Header Section */}
      <div className="p-10 border-b border-gray-50 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-[#002B36]">Send A Parcel</h1>
          <p className="text-gray-500 mt-2 font-medium">
            Detailed consignment booking for AI analytics
          </p>
        </div>
        <div className="hidden md:block bg-gray-50 px-6 py-3 rounded-2xl border border-gray-100">
          <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400">
            Pickup Location
          </p>
          <p className="text-sm font-bold text-[#002B36]">
            {merchant?.pickupPoint?.split(",")[0] || "Not Set"}
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit(handleSendParcel)}
        className="p-10 space-y-12"
      >
        {/* Parcel Category */}
        <div className="flex gap-6 items-center bg-gray-50 p-4 rounded-2xl w-fit border border-gray-100">
          <label className="flex items-center gap-2 cursor-pointer font-bold text-sm text-[#002B36]">
            <input
              {...register("parcelType")}
              type="radio"
              value="Document"
              className="radio radio-success radio-sm"
            />{" "}
            Document
          </label>
          <label className="flex items-center gap-2 cursor-pointer font-bold text-sm text-[#002B36]">
            <input
              {...register("parcelType")}
              type="radio"
              value="Non-Document"
              className="radio radio-success radio-sm"
            />{" "}
            Non-Document
          </label>
        </div>

        {/* Payment Method  */}
        <div className="bg-gray-50 p-4 rounded-2xl w-fit border border-gray-100">
          <label className="flex items-center gap-2 cursor-pointer font-bold text-sm text-[#002B36]">
            <input
              {...register("selectedMethodRev")}
              type="checkbox"
              value="COD"
              className="radio radio-success radio-sm"
            />{" "}
            COD
          </label>
        </div>

        <div className="grid md:grid-cols-2 gap-16">
          {/* Left Column: Product & Core Details */}
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-black text-[#002B36] flex items-center gap-2 mb-6">
                <span className="w-2 h-6 bg-[#CAEB66] rounded-full inline-block"></span>
                Parcel Information
              </h3>

              <div className="space-y-5">
                <div>
                  <label className={labelStyle}>Parcel Name / Item Type</label>
                  <input
                    {...register("parcelName", {
                      required: "Name is required",
                    })}
                    className={inputStyle}
                    placeholder="e.g. Official Documents, Leather Bag"
                  />
                  <ErrorMsg errors={errors} name="parcelName" />
                </div>

                {selectedMethodRev === "COD" && (
                  <div>
                    <label className={labelStyle}>COD Amount</label>
                    <input
                      type="number"
                      placeholder="Total Amount..."
                      {...register("CODAmount", {
                        required: true,
                      })}
                      className={inputStyle}
                    />
                  </div>
                )}

                <div>
                  <label className={labelStyle}>Weight (KG)</label>
                  <input
                    type="number"
                    step="0.1"
                    {...register("parcelWeight", {
                      required: true,
                      min: 0.1,
                    })}
                    className={inputStyle}
                  />
                </div>
              </div>
            </div>

            {/* Pricing Badge for Visual Emphasis */}
            <div className="bg-secondary text-white p-7 rounded-[32px] flex justify-between items-center shadow-lg">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                  Service Charge
                </p>
                <h2 className="text-4xl font-black text-primary">
                  {deliveryCharge}{" "}
                  <span className="text-sm text-white font-normal italic">
                    BDT
                  </span>
                </h2>
              </div>
              <div className="text-right border-l border-white/10 pl-6">
                <p className="text-[10px] text-gray-400 uppercase font-bold">
                  Est. Pickup
                </p>
                <p className="text-sm font-bold">Same Day</p>
                <p className="text-[11px] text-[#CAEB66]">4:00 PM - 7:00 PM</p>
              </div>
            </div>
          </div>

          {/* Right Column: Receiver & Granular Location */}
          <div className="space-y-8">
            <h3 className="text-lg font-black text-[#002B36] flex items-center gap-2 mb-6">
              <span className="w-2 h-6 bg-[#CAEB66] rounded-full inline-block"></span>
              Receiver & Location
            </h3>

            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelStyle}>Receiver Name</label>
                  <input
                    {...register("receiverName", {
                      required: "Name required",
                    })}
                    className={inputStyle}
                    placeholder="Full Name"
                  />
                  <ErrorMsg errors={errors} name="receiverName" />
                </div>
                <div>
                  <label className={labelStyle}>Contact Number</label>
                  <input
                    {...register("receiverPhone", {
                      required: "Phone required",
                    })}
                    className={inputStyle}
                    placeholder="01XXXXXXXXX"
                  />
                  <ErrorMsg errors={errors} name="receiverPhone" />
                </div>
              </div>

              {/* AI Integration Ready Granular Location Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className={labelStyle}>Region</label>
                  <select
                    {...register("receiverRegion", {
                      required: "Region required",
                    })}
                    className={inputStyle}
                  >
                    <option value="">Select Region</option>
                    {clearRegions.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                  <ErrorMsg errors={errors} name="receiverRegion" />
                </div>

                <div>
                  <label className={labelStyle}>District</label>
                  <select
                    {...register("receiverDistrict", {
                      required: "Required",
                    })}
                    disabled={!selectedRegion}
                    className={inputStyle}
                  >
                    <option value="">Select District</option>
                    {getDistricts(selectedRegion).map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={labelStyle}>Area / Hub</label>
                  <select
                    {...register("receiverArea", { required: "Required" })}
                    disabled={!selectedDistrict}
                    className={inputStyle}
                  >
                    <option value="">Select Area</option>
                    {getAreas(selectedDistrict).map((a) => (
                      <option key={a} value={a}>
                        {a}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className={labelStyle}>
                  Street Address / House / Road
                </label>
                <textarea
                  {...register("receiverAddress", {
                    required: "Detailed address required",
                  })}
                  className={`${inputStyle} h-24 resize-none`}
                  placeholder="Street Address / House / Road..."
                ></textarea>
                <ErrorMsg errors={errors} name="receiverAddress" />
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-100 w-full">
          <button
            type="submit"
            className="bg-[#CAEB66] hover:bg-[#b8d65a] text-[#002B36] font-black px-16 py-4 rounded-2xl shadow-xl shadow-[#CAEB66]/20 transition-all transform hover:-translate-y-0.5 cursor-pointer active:scale-95 text-lg w-full"
          >
            Confirm & Book Consignment
          </button>
        </div>
      </form>
    </div>
  );
};

export default SendParcel;
