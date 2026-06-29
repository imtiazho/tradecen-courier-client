import React, { useEffect, useState } from "react";
import riderImage from "../../assets/agent-pending.png";
import { useForm, useWatch } from "react-hook-form";
import { useLoaderData, useNavigate } from "react-router";
import { useGeolocation } from "../../Hooks/useGeolocation";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import Swal from "sweetalert2";
import useAuth from "../../Hooks/useAuth";
import LoadingModal from "../../Components/LoadingModal/LoadingModal";
import DynamicTitle from "../../Components/DynamicTitle/DynamicTitle";

// Error Message Component
const ErrorMsg = ({ errors, name }) => {
  if (!errors[name]) return null;
  return (
    <span className="text-red-500 text-xs mt-1 block">
      {errors[name].message}
    </span>
  );
};

const RiderRegistration = () => {
  const { user, setLoading, loading: mainLoading, fetchDbUser } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      photoURL: "",
      region: "",
      district: "",
      area: "",
      nid: "",
      phone: "",
      vehicle: "",
      license: "",
      bikeModel: "",
      bikeRegistration: "",
    },
  });

  useEffect(() => {
    if (user) {
      setValue(setValue("name", user?.displayName || ""));
      setValue(setValue("email", user?.email || ""));
      setValue("photoURL", user?.photoURL || "");
    }
  }, [user, setValue]);
  const areaAndLocation = useLoaderData() || [];
  const clearRegions = [...new Set(areaAndLocation.map((rg) => rg.region))];

  const riderSelectedRegion = useWatch({ control, name: "region" });
  const riderSelectedDistrict = useWatch({ control, name: "district" });

  // Watch the vehicle type to toggle fields
  const selectedVehicle = useWatch({ control, name: "vehicle" });

  const { getCoordinates, loading } = useGeolocation();
  const axiosSecure = useAxiosSecure();
  const [locationStatus, setLocationStatus] = useState(
    "📍 Detect My Current Location",
  );

  useEffect(() => {
    setValue("district", "");
    setValue("area", "");
  }, [riderSelectedRegion, setValue]);

  useEffect(() => {
    setValue("area", "");
  }, [riderSelectedDistrict, setValue]);

  // Handle location capture
  const handleLocationCapture = async () => {
    try {
      const coords = await getCoordinates();
      setValue("latitude", coords.lat);
      setValue("longitude", coords.lng);
      setLocationStatus(
        `Captured: ${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`,
      );
    } catch (err) {
      setLocationStatus("Failed to get location. Try again.");
    }
  };

  const getDistricts = (region) => {
    if (!region) return [];
    return areaAndLocation
      .filter((item) => item.region === region)
      .map((d) => d.district);
  };

  const getAreas = (district) => {
    if (!district) return [];
    const findDistrict = areaAndLocation.find(
      (item) => item.district === district,
    );
    return findDistrict?.covered_area || [];
  };

  const handleBeARiderReg = (data) => {
    setLoading(true);
    const newRider = {
      ...data,
      status: "pending",
      workStatus: "Not Confirmed",
      createdAt: new Date(),
      currentLocation: { latitude: data.latitude, longitude: data.longitude },
      avgDeliveryTime: 0,
      successRate: 0,
      rating: 0,
      totalEarnings: 0,
      currentTasks: 0,
      totalAssign: 0,
      successfullyComplete: 0,
      bloodGroup: "A+",
    };

    axiosSecure
      .post("/riders", newRider)
      .then(async (res) => {
        if (res.data.insertedId) {
          Swal.fire({
            icon: "success",
            title: "Registration Successful!",
            text: "Your rider profile is now pending for approval.",
            showConfirmButton: false,
            timer: 2000,
          });
          navigate("/");
          await fetchDbUser(user);
        } else if (res.data.message) {
          const isEmailError = res.data.message.toLowerCase().includes("email");
          Swal.fire({
            icon: "warning",
            title: isEmailError
              ? "Email Already Registered"
              : "Registration Issue",
            text: res.data.message,
            confirmButtonColor: "#002B36",
          });
        }
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Registration Failed",
          text: "Something went wrong. Please try again.",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="relative">
      <DynamicTitle title="Join as a Rider" />
      <LoadingModal isLoading={mainLoading}></LoadingModal>

      <div className="min-h-screen flex items-center justify-center pt-8 pb-12 bg-gray-50">
        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl w-full max-w-7xl mx-4">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-[#002B36] mb-4">
                Be a Rider
              </h1>
              <p className="text-gray-600 mb-10 text-[15px] max-w-xl">
                Enjoy fast, reliable parcel delivery with real-time tracking.
                Join our fleet and start earning on your own schedule.
              </p>

              <form
                onSubmit={handleSubmit(handleBeARiderReg)}
                className="space-y-6"
              >
                <h2 className="text-xl font-semibold text-[#002B36] border-b border-gray-100 pb-4">
                  Tell us about yourself
                </h2>

                <div className="grid sm:grid-cols-2 gap-6">
                  {/* Name */}
                  <div className="form-control">
                    <label className="label font-semibold text-[#002B36] text-[15px] mb-1">
                      Your Name
                    </label>
                    <input
                      {...register("name", { required: "Name is required" })}
                      type="text"
                      defaultValue={user.displayName}
                      placeholder="e.g. Jon Doe"
                      className={`w-full bg-white border rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#CAEB66]/50 transition-all ${errors.name ? "border-red-500" : "border-gray-200"}`}
                    />
                    <ErrorMsg errors={errors} name="name" />
                  </div>

                  {/* Email */}
                  <div className="form-control">
                    <label className="label font-semibold text-[#002B36] text-[15px] mb-1">
                      Your Email
                    </label>
                    <input
                      {...register("email", { required: "Email is required" })}
                      type="email"
                      placeholder="e.g. abc@gmail.com"
                      className={`w-full bg-white border rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#CAEB66]/50 transition-all ${errors.email ? "border-red-500" : "border-gray-200"}`}
                    />
                    <ErrorMsg errors={errors} name="email" />
                  </div>

                  {/* Region */}
                  <div className="form-control">
                    <label className="label font-semibold text-[#002B36] text-[15px] mb-1">
                      Your Region
                    </label>
                    <select
                      {...register("region", { required: "Select a region" })}
                      className={`select select-bordered w-full rounded-lg focus:outline-[#CAEB66] ${errors.region ? "border-red-500" : "border-gray-200"}`}
                    >
                      <option value="">Select your Region</option>
                      {clearRegions.map((region, i) => (
                        <option value={region} key={i}>
                          {region}
                        </option>
                      ))}
                    </select>
                    <ErrorMsg errors={errors} name="region" />
                  </div>

                  {/* District */}
                  <div className="form-control">
                    <label className="label font-semibold text-[#002B36] text-[15px] mb-1">
                      Your District
                    </label>
                    <select
                      {...register("district", {
                        required: "Select a district",
                      })}
                      className={`select select-bordered w-full rounded-lg focus:outline-[#CAEB66] ${errors.district ? "border-red-500" : "border-gray-200"}`}
                      disabled={!riderSelectedRegion}
                    >
                      <option value="">Select your District</option>
                      {getDistricts(riderSelectedRegion).map((district, i) => (
                        <option value={district} key={i}>
                          {district}
                        </option>
                      ))}
                    </select>
                    <ErrorMsg errors={errors} name="district" />
                  </div>

                  {/* Area */}
                  <div className="form-control">
                    <label className="label font-semibold text-[#002B36] text-[15px] mb-1">
                      Your Area
                    </label>
                    <select
                      {...register("area", { required: "Select an area" })}
                      className={`select select-bordered w-full rounded-lg focus:outline-[#CAEB66] ${errors.area ? "border-red-500" : "border-gray-200"}`}
                      disabled={!riderSelectedDistrict}
                    >
                      <option value="">Select your Area</option>
                      {getAreas(riderSelectedDistrict).map((area, i) => (
                        <option value={area} key={i}>
                          {area}
                        </option>
                      ))}
                    </select>
                    <ErrorMsg errors={errors} name="area" />
                  </div>

                  {/* NID */}
                  <div className="form-control">
                    <label className="label font-semibold text-[#002B36] text-[15px] mb-1">
                      NID No
                    </label>
                    <input
                      {...register("nid", { required: "NID is required" })}
                      type="text"
                      placeholder="e.g. 8091-8621-1212-2323-1"
                      className={`w-full bg-white border rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#CAEB66]/50 transition-all ${errors.nid ? "border-red-500" : "border-gray-200"}`}
                    />
                    <ErrorMsg errors={errors} name="nid" />
                  </div>

                  {/* Phone */}
                  <div className="form-control col-span-2">
                    <label className="label font-semibold text-[#002B36] text-[15px] mb-1">
                      Phone Number
                    </label>
                    <input
                      {...register("phone", { required: "Phone is required" })}
                      type="tel"
                      placeholder="e.g. 01328503739"
                      className={`w-full bg-white border rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#CAEB66]/50 transition-all ${errors.phone ? "border-red-500" : "border-gray-200"}`}
                    />
                    <ErrorMsg errors={errors} name="phone" />
                  </div>

                  {/* Vehicle Type */}
                  <div className="form-control col-span-2">
                    <label className="label font-semibold text-[#002B36] text-[15px] mb-1">
                      Vehicle Type
                    </label>
                    <select
                      {...register("vehicle", {
                        required: "Select vehicle type",
                      })}
                      className={`select select-bordered w-full rounded-lg focus:outline-[#CAEB66] ${errors.vehicle ? "border-red-500" : "border-gray-200"}`}
                    >
                      <option value="">Select your Vehicle</option>
                      <option value="Bike">Bike</option>
                      <option value="Cycle">Cycle</option>
                    </select>
                    <ErrorMsg errors={errors} name="vehicle" />
                  </div>

                  {/* CONDITIONAL FIELDS: Show only if "Bike" is selected */}
                  {selectedVehicle === "Bike" && (
                    <>
                      {/* License Number */}
                      <div className="form-control">
                        <label className="label font-semibold text-[#002B36] text-[15px] mb-1">
                          Driving License Number
                        </label>
                        <input
                          {...register("license", {
                            required: "License number is required",
                          })}
                          type="text"
                          placeholder="License Number"
                          className={`w-full bg-white border rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#CAEB66]/50 transition-all ${errors.license ? "border-red-500" : "border-gray-200"}`}
                        />
                        <ErrorMsg errors={errors} name="license" />
                      </div>

                      {/* Bike Model */}
                      <div className="form-control">
                        <label className="label font-semibold text-[#002B36] text-[15px] mb-1">
                          Vehicles Brand Model
                        </label>
                        <input
                          {...register("bikeModel", {
                            required: "Model information is required",
                          })}
                          type="text"
                          placeholder="e.g., Yamaha FZ 2023"
                          className={`w-full bg-white border rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#CAEB66]/50 transition-all ${errors.bikeModel ? "border-red-500" : "border-gray-200"}`}
                        />
                        <ErrorMsg errors={errors} name="bikeModel" />
                      </div>

                      {/* Bike Registration Number */}
                      <div className="form-control sm:col-span-2">
                        <label className="label font-semibold text-[#002B36] text-[15px] mb-1">
                          Bike Registration Number
                        </label>
                        <input
                          {...register("bikeRegistration", {
                            required: "Registration number is required",
                          })}
                          type="text"
                          placeholder="DHAKA METRO-LA-11-2222"
                          className={`w-full bg-white border rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#CAEB66]/50 transition-all ${errors.bikeRegistration ? "border-red-500" : "border-gray-200"}`}
                        />
                        <ErrorMsg errors={errors} name="bikeRegistration" />
                      </div>
                    </>
                  )}

                  {/* Location Capture */}
                  <div className="form-control sm:col-span-2">
                    <label className="label font-semibold text-[#002B36] text-[15px] mb-1">
                      Your Current Location
                    </label>
                    <button
                      type="button"
                      onClick={handleLocationCapture}
                      disabled={loading}
                      className={`w-full flex items-center justify-center gap-2 border-2 rounded-lg py-3 px-4 font-bold transition-all cursor-pointer
                        ${
                          locationStatus.includes("Captured")
                            ? "bg-[#CAEB66]/20 border-[#CAEB66] text-[#002B36]"
                            : "border-[#002B36] text-[#002B36] hover:bg-[#002B36] hover:text-white"
                        }`}
                    >
                      {loading ? (
                        <>
                          <span className="loading loading-spinner loading-sm"></span>{" "}
                          Capturing...
                        </>
                      ) : (
                        locationStatus
                      )}
                    </button>
                    <input
                      type="hidden"
                      {...register("latitude", {
                        required: "Location is required",
                      })}
                    />
                    <input
                      type="hidden"
                      {...register("longitude", {
                        required: "Location is required",
                      })}
                    />
                    <ErrorMsg errors={errors} name="latitude" />
                  </div>
                </div>

                {/* Hidden Field for Photo URL */}
                <input type="hidden" {...register("photoURL")} />

                <button
                  type="submit"
                  className="btn btn-block bg-[#D1E066] hover:bg-[#C1D056] text-[#002B36] font-bold border-none rounded-lg h-14 mt-4 cursor-pointer"
                >
                  Submit Registration
                </button>
              </form>
            </div>

            {/* Illustration */}
            <div className="hidden md:flex justify-center md:sticky md:top-10">
              <img
                src={riderImage}
                alt="Rider Illustration"
                className="w-full max-w-lg object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiderRegistration;
