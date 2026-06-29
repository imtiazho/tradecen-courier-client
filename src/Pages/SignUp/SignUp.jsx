import React, { useState, useRef } from "react";
import { FcGoogle } from "react-icons/fc";
import { FiUser, FiUpload, FiX } from "react-icons/fi";
import { Link, useLocation, useNavigate } from "react-router";
import useAuth from "../../Hooks/useAuth";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";
import axios from "axios";
import LoadingModal from "../../Components/LoadingModal/LoadingModal";
import DynamicTitle from "../../Components/DynamicTitle/DynamicTitle";

const SignUp = () => {
  const navigate = useNavigate();
  const {
    googleSignIn,
    createUser,
    updateUser,
    setLoading,
    loading,
    verifyEmail,
    setDbUser,
  } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef(null);
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const profileImage = data.profileImage[0];

    if (!profileImage) {
      return Swal.fire("Error", "Please select an image", "error");
    }

    setLoading(true);

    try {
      // ImageBB
      const formData = new FormData();
      formData.append("image", profileImage);
      const imageAPIUrl = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_host_key}`;

      const imageRes = await axios.post(imageAPIUrl, formData);
      const photoURL = imageRes.data.data.display_url;

      // Create User
      await createUser(data.email, data.password);

      // Update User
      await updateUser({
        displayName: data.name,
        photoURL: photoURL,
      });

      // Updated from Firebase
      const userInfo = {
        email: data.email,
        displayName: data.name,
        photoURL: photoURL,
        isOnboarded: false,
        role: "user",
        createdAt: new Date(),
      };

      await verifyEmail();

      // Send data to DB
      const dbRes = await axiosSecure.post("/users", userInfo);
      if (dbRes.data.insertedId) {
        setDbUser(userInfo);
        Swal.fire({
          title: "Success!",
          text: "Account created successfully",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
        navigate(from, { replace: true });
      }
    } catch (error) {
      console.error("Signup Error:", error);
      Swal.fire("Error", error.message || "Signup failed!", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target.result);
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleRemoveImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSocialLogin = (e) => {
    e.preventDefault();
    googleSignIn().then((res) => {
      // Info from firebase
      const userInfo = {
        email: res.user.email,
        displayName: res.user.displayName,
        photoURL: res.user.photoURL,
        isOnboarded: true,
        role: "user",
        createdAt: new Date(),
      };

      axiosSecure.post("/users", userInfo).then(() => {
        navigate("/");
        setDbUser(userInfo);
      });
    });
  };

  return (
    <div className="relative">
      <DynamicTitle title="Register" />
      <LoadingModal isLoading={loading}></LoadingModal>
      <div className="w-full max-w-md mx-auto md:mx-0">
        <div className="mb-10">
          <h1 className="text-4xl md:text-5xl font-black text-black mb-1.5 tracking-[-0.08rem]">
            Create an Account
          </h1>
          <p className="text-gray-600 text-sm font-medium">
            Register with TradeCen
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Image Picker Form */}
          <div className="mb-8 relative w-20 h-20">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              // register এর ভেতর ref এবং onChange দুটোই হ্যান্ডেল করুন
              {...register("profileImage", {
                onChange: (e) => {
                  handleImageChange(e); // আপনার ইমেজ প্রিভিউ লজিক
                },
              })}
              // নিচের লাইনটি আপনার তৈরি করা fileInputRef এর সাথে কানেক্ট করবে
              ref={(e) => {
                register("profileImage").ref(e); // hook form ref
                fileInputRef.current = e; // your custom ref
              }}
            />
            <div
              type="button"
              onClick={selectedImage ? null : handleUploadClick}
              className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 relative border ${
                selectedImage
                  ? "bg-gray-100 border-gray-200"
                  : "bg-[#F2F4F7] border-gray-200 hover:border-[#CAEB66] cursor-pointer group"
              }`}
            >
              {selectedImage ? (
                <>
                  <div className="w-full h-full rounded-full overflow-hidden">
                    <img
                      src={selectedImage}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    type="button" // Type button না দিলে রিলোড হবে
                    onClick={handleRemoveImage}
                    className="absolute -top-1 -right-1 bg-white p-1 rounded-full text-gray-500 hover:text-red-500 shadow-md border z-10"
                  >
                    <FiX size={16} />
                  </button>
                </>
              ) : (
                <div className="flex items-center justify-center relative">
                  <div className="bg-gray-200 p-3 rounded-full text-gray-500 group-hover:bg-[#CAEB66]/20 transition-colors">
                    <FiUser size={30} />
                  </div>
                  <div className="absolute -right-3 bottom-0 bg-[#CAEB66] p-1.5 rounded-full text-gray-900 border-4 border-white">
                    <FiUpload size={14} />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Name Field */}
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-black ml-1">Name</label>
            <input
              type="text"
              {...register("name", { required: "Name is required" })}
              placeholder="Name"
              className="w-full bg-white border border-gray-200 rounded-lg py-3 px-4 focus:ring-2 focus:ring-[#CAEB66]/50 focus:border-[#CAEB66] outline-none"
            />
            {errors.name && (
              <p className="text-red-500 text-xs ml-1">{errors.name.message}</p>
            )}
          </div>

          {/* Email Field */}
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-black ml-1">Email</label>
            <input
              type="email"
              {...register("email", { required: "Email is required" })}
              placeholder="Email"
              className="w-full bg-white border border-gray-200 rounded-lg py-3 px-4 focus:ring-2 focus:ring-[#CAEB66]/50 focus:border-[#CAEB66] outline-none"
            />
            {errors.email && (
              <p className="text-red-500 text-xs ml-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-black ml-1">
              Password
            </label>
            <input
              type="password"
              {...register("password", {
                required: "Password is required",
                minLength: { value: 6, message: "Minimum 6 characters" },
              })}
              placeholder="Password"
              className="w-full bg-white border border-gray-200 rounded-lg py-3 px-4 focus:ring-2 focus:ring-[#CAEB66]/50 focus:border-[#CAEB66] outline-none"
            />
            {errors.password && (
              <p className="text-red-500 text-xs ml-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-[#D1EE67] hover:bg-[#c2e25a] text-[#02312A] font-bold py-3.5 rounded-lg transition-all shadow-lg active:scale-95 cursor-pointer"
          >
            Register
          </button>
        </form>

        {/* Social Login Footer (Outside Form) */}
        <div className="mt-8 text-center space-y-6">
          <p className="text-sm font-medium text-gray-500">
            Already have an account?{" "}
            <Link
              to="/auth/login"
              className="font-bold text-[#A5C141] hover:underline"
            >
              Login
            </Link>
          </p>
          <div className="relative flex items-center justify-center">
            <span className="bg-white px-4 text-gray-400 text-sm z-10">Or</span>
            <div className="absolute w-full border-t border-gray-100"></div>
          </div>
          <button
            type="button"
            onClick={handleSocialLogin}
            className="w-full flex items-center justify-center gap-3 bg-[#E9EDF2] hover:bg-[#dfe4ea] text-[#02312A] font-bold py-3.5 rounded-lg cursor-pointer transition-colors"
          >
            <FcGoogle size={24} />
            Register with Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
