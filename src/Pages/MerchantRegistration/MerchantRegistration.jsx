import React, { useEffect } from "react";
import merchantImage from "../../assets/merchant.png";
import { useForm, useWatch } from "react-hook-form";
import { useLoaderData, useNavigate } from "react-router";
import Swal from "sweetalert2";
import useAuth from "../../Hooks/useAuth";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
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

const MerchantRegistration = () => {
  const { user, setLoading, loading: mainLoading, fetchDbUser } = useAuth();
  const axiosSecure = useAxiosSecure();
  const areaAndLocation = useLoaderData() || [];
  const navigate = useNavigate();
  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      displayName: "",
      email: "",
      photoURL: "",
      businessName: "",
      region: "",
      district: "",
      area: "",
      contact: "",
      pickupPoint: "",
    },
  });

  useEffect(() => {
    if (user) {
      setValue("displayName", user?.displayName || "");
      setValue("email", user?.email || "");
      setValue("photoURL", user?.photoURL || "");
    }
  }, [user, setValue]);

  const clearRegions = [...new Set(areaAndLocation.map((rg) => rg.region))];
  const selectedRegion = useWatch({ control, name: "region" });
  const selectedDistrict = useWatch({ control, name: "district" });

  useEffect(() => {
    setValue("district", "");
    setValue("area", "");
  }, [selectedRegion, setValue]);

  useEffect(() => {
    setValue("area", "");
  }, [selectedDistrict, setValue]);

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

  const onSubmit = (data) => {
    setLoading(true);
    const newMerchant = {
      ...data,
      role: "merchant",
      createdAt: new Date(),
      merchantType: "Standard",
      totalSuccessfulDeliveries: 0,
      avgParcelWeight: null,
      accountStatus: "active",
    };

    axiosSecure
      .post("/merchants", newMerchant)
      .then(async (res) => {
        if (res.data.insertedId) {
          Swal.fire({
            icon: "success",
            title: "Registration Successful!",
            text: "Your merchant account is ready you can send Parcel from Dashboard",
            showConfirmButton: false,
            timer: 3000,
          });
          await fetchDbUser(user);
          navigate("/");
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
      <DynamicTitle title="Join as Merchant" />
      <LoadingModal isLoading={mainLoading} />

      <div className="min-h-screen flex items-center justify-center pt-8 pb-12 bg-gray-50">
        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl w-full max-w-7xl mx-4">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-[#002B36] mb-4">
                Be a Merchant
              </h1>
              <p className="text-gray-600 mb-10 text-[15px] max-w-xl">
                Expand your business with our reliable delivery network.
                Register your shop today and reach more customers.
              </p>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <h2 className="text-xl font-semibold text-[#002B36] border-b border-gray-100 pb-4">
                  Business & Personal Details
                </h2>

                <div className="grid sm:grid-cols-2 gap-6">
                  {/* Display Name */}
                  <div className="form-control">
                    <label className="label font-semibold text-[#002B36] text-[15px] mb-1">
                      Full Name
                    </label>
                    <input
                      {...register("displayName", {
                        required: "Name is required",
                      })}
                      type="text"
                      className={`w-full bg-white border rounded-lg py-3 px-4 focus:ring-2 focus:ring-[#CAEB66]/50 outline-none transition-all ${errors.displayName ? "border-red-500" : "border-gray-200"}`}
                    />
                    <ErrorMsg errors={errors} name="displayName" />
                  </div>

                  {/* Email */}
                  <div className="form-control">
                    <label className="label font-semibold text-[#002B36] text-[15px] mb-1">
                      Email Address
                    </label>
                    <input
                      {...register("email", { required: "Email is required" })}
                      type="email"
                      readOnly
                      className="w-full bg-gray-100 border border-gray-200 rounded-lg py-3 px-4 outline-none cursor-not-allowed"
                    />
                  </div>

                  {/* Business Name */}
                  <div className="form-control col-span-2">
                    <label className="label font-semibold text-[#002B36] text-[15px] mb-1">
                      Business/Shop Name
                    </label>
                    <input
                      {...register("businessName", {
                        required: "Business name is required",
                      })}
                      type="text"
                      placeholder="e.g. Gadget Store BD"
                      className={`w-full bg-white border rounded-lg py-3 px-4 focus:ring-2 focus:ring-[#CAEB66]/50 outline-none transition-all ${errors.businessName ? "border-red-500" : "border-gray-200"}`}
                    />
                    <ErrorMsg errors={errors} name="businessName" />
                  </div>

                  {/* Contact Number */}
                  <div className="form-control">
                    <label className="label font-semibold text-[#002B36] text-[15px] mb-1">
                      Contact Number
                    </label>
                    <input
                      {...register("contact", {
                        required: "Contact number is required",
                      })}
                      type="tel"
                      placeholder="017XXXXXXXX"
                      className={`w-full bg-white border rounded-lg py-3 px-4 focus:ring-2 focus:ring-[#CAEB66]/50 outline-none transition-all ${errors.contact ? "border-red-500" : "border-gray-200"}`}
                    />
                    <ErrorMsg errors={errors} name="contact" />
                  </div>

                  {/* Region */}
                  <div className="form-control">
                    <label className="label font-semibold text-[#002B36] text-[15px] mb-1">
                      Region
                    </label>
                    <select
                      {...register("region", { required: "Select a region" })}
                      className={`select select-bordered w-full rounded-lg focus:outline-[#CAEB66] ${errors.region ? "border-red-500" : "border-gray-200"}`}
                    >
                      <option value="">Select Region</option>
                      {clearRegions.map((r, i) => (
                        <option key={i} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                    <ErrorMsg errors={errors} name="region" />
                  </div>

                  {/* District */}
                  <div className="form-control">
                    <label className="label font-semibold text-[#002B36] text-[15px] mb-1">
                      District
                    </label>
                    <select
                      {...register("district", {
                        required: "Select a district",
                      })}
                      disabled={!selectedRegion}
                      className={`select select-bordered w-full rounded-lg focus:outline-[#CAEB66] ${errors.district ? "border-red-500" : "border-gray-200"}`}
                    >
                      <option value="">Select District</option>
                      {getDistricts(selectedRegion).map((d, i) => (
                        <option key={i} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                    <ErrorMsg errors={errors} name="district" />
                  </div>

                  {/* Area */}
                  <div className="form-control">
                    <label className="label font-semibold text-[#002B36] text-[15px] mb-1">
                      Area
                    </label>
                    <select
                      {...register("area", { required: "Select an area" })}
                      disabled={!selectedDistrict}
                      className={`select select-bordered w-full rounded-lg focus:outline-[#CAEB66] ${errors.area ? "border-red-500" : "border-gray-200"}`}
                    >
                      <option value="">Select Area</option>
                      {getAreas(selectedDistrict).map((a, i) => (
                        <option key={i} value={a}>
                          {a}
                        </option>
                      ))}
                    </select>
                    <ErrorMsg errors={errors} name="area" />
                  </div>

                  {/* Pickup Point */}
                  <div className="form-control col-span-2">
                    <label className="label font-semibold text-[#002B36] text-[15px] mb-1">
                      Full Pickup Address
                    </label>
                    <textarea
                      {...register("pickupPoint", {
                        required: "Pickup point is required",
                      })}
                      rows="3"
                      placeholder="House no, Road no, Landmark..."
                      className={`w-full bg-white border rounded-lg py-3 px-4 focus:ring-2 focus:ring-[#CAEB66]/50 outline-none transition-all ${errors.pickupPoint ? "border-red-500" : "border-gray-200"}`}
                    ></textarea>
                    <ErrorMsg errors={errors} name="pickupPoint" />
                  </div>
                </div>

                {/* Hidden Field for Photo URL */}
                <input type="hidden" {...register("photoURL")} />

                <button
                  type="submit"
                  className="btn btn-block bg-[#002B36] hover:bg-[#003b4a] text-white font-bold border-none rounded-lg h-14 mt-4"
                >
                  Register as Merchant
                </button>
              </form>
            </div>

            {/* Illustration */}
            <div className="hidden md:flex justify-center md:sticky md:top-10">
              <img
                src={merchantImage}
                alt="Merchant Illustration"
                className="w-full px-12 max-w-lg object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MerchantRegistration;
