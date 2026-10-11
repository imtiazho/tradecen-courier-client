import React, { useState } from "react";
import { FiArrowLeft } from "react-icons/fi";
import { Link, useNavigate } from "react-router";
import Swal from "sweetalert2"; // SweetAlert2 ইমপোর্ট করুন
import DynamicTitle from "../../Components/DynamicTitle/DynamicTitle";

const ForgetPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendMail = async (e) => {
    e.preventDefault();

    if (!email) {
      Swal.fire({
        icon: "warning",
        title: "Email Required",
        text: "Please enter your email address to proceed.",
        confirmButtonColor: "#CAEB66",
        confirmButtonText: '<span style="color: #02312A">Got it!</span>', // Dark text on lime button
        background: "#fff",
        backdrop: `rgba(202, 235, 102, 0.1)`, // Subtle lime tint on the background
      });
    }

    try {
      setLoading(true);
      const response = await fetch("https://tradecen-courier-server.onrender.com/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();

      if (data.success) {
        Swal.fire({
          icon: "success",
          title: "OTP Sent!",
          text: "We've sent a 6-digit code to your inbox.",
          iconColor: "#A5C141", // A slightly darker shade for the checkmark
          confirmButtonColor: "#CAEB66",
          confirmButtonText:
            '<span style="color: #02312A; font-weight: bold">Check Mail</span>',
          buttonsStyling: true,
          customClass: {
            popup: "rounded-3xl", // Matches your UI's rounded corners
            confirmButton:
              "px-8 py-3 rounded-xl transition-transform active:scale-95",
          },
        });

        navigate("/auth/verify-OTP", { state: { email } });
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: data.error || "Something went wrong!",
          confirmButtonColor: "#02312A",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Server Error",
        text: "We cant contact with server right now. Please try again later!",
        confirmButtonColor: "#d33",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto md:mx-0">
      <DynamicTitle title="Forget Password" />
      <div className="mb-10 mt-16 md:mt-0">
        <h1 className="text-4xl md:text-5xl font-black text-black mb-3 tracking-[-0.08rem]">
          Forgot Password
        </h1>
        <p className="text-gray-600 text-sm font-medium">
          Enter your email address and we'll send you a 6-digit OTP to reset
          your password.
        </p>
      </div>

      <form className="space-y-6" onSubmit={handleSendMail}>
        <div className="space-y-2">
          <label className="text-sm font-bold text-black ml-1">Email</label>
          <input
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Enter your email"
            className="w-full bg-white border border-gray-200 rounded-lg py-3 px-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#CAEB66]/50 focus:border-[#CAEB66] transition-all"
            required
          />
        </div>

        <button
          disabled={loading}
          type="submit"
          className="w-full bg-[#CAEB66] hover:bg-[#b8d65a] text-[#02312A] font-black py-4 rounded-xl text-base transition-all duration-300 active:scale-[0.98] shadow-md cursor-pointer disabled:opacity-50"
        >
          {loading ? "Sending..." : "Send OTP Code"}
        </button>
      </form>

      <div className="mt-10 text-center md:text-left">
        <p className="text-gray-500 text-sm font-medium">
          Remember your password?{" "}
          <Link
            to="/auth/login"
            className="font-bold text-[#A5C141] hover:text-[#8ba335] transition-colors inline-flex items-center gap-1"
          >
            Login
          </Link>
        </p>

        <Link
          to="/auth/login"
          className="mt-6 inline-flex items-center gap-2 text-gray-400 hover:text-[#02312A] font-bold text-sm transition-colors group"
        >
          <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
          Back to Login
        </Link>
      </div>
    </div>
  );
};

export default ForgetPassword;
