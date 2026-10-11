import React, { useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router";
import Swal from "sweetalert2";
import DynamicTitle from "../../Components/DynamicTitle/DynamicTitle";

const OTPVerify = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef([]);

  // Common SweetAlert2 Configuration for #CAEB66
  const swalConfig = {
    confirmButtonColor: "#CAEB66",
    customClass: {
      popup: "rounded-3xl",
      confirmButton:
        "px-8 py-3 rounded-xl font-bold transition-transform active:scale-95",
    },
    buttonsStyling: true,
  };

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return;
    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    if (element.value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const finalOtp = otp.join("");

    if (!email) {
      return Swal.fire({
        ...swalConfig,
        icon: "warning",
        title: "Session Expired",
        text: "We couldn't find your email. Please go back and try again.",
        confirmButtonText: '<span style="color: #02312A">Go Back</span>',
      });
    }

    if (finalOtp.length !== 6) {
      return Swal.fire({
        ...swalConfig,
        icon: "info",
        title: "Incomplete Code",
        text: "Please enter the full 6-digit OTP sent to your email.",
        confirmButtonText: '<span style="color: #02312A">Okay</span>',
      });
    }

    try {
      setLoading(true);
      const response = await fetch("https://tradecen-courier-server.onrender.com/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: finalOtp }),
      });

      const data = await response.json();

      if (data.success) {
        Swal.fire({
          ...swalConfig,
          icon: "success",
          title: "Code Verified!",
          text: "Identity confirmed. You can now reset your password.",
          confirmButtonText: '<span style="color: #02312A">Proceed</span>',
          timer: 2000,
        });

        navigate("/auth/reset-password", { state: { email } });
      } else {
        Swal.fire({
          ...swalConfig,
          icon: "error",
          title: "Verification Failed",
          text: data.error || "The code you entered is invalid or has expired.",
          confirmButtonColor: "#02312A", // Contrast button for error
        });
      }
    } catch (error) {
      Swal.fire({
        ...swalConfig,
        icon: "error",
        title: "Connection Error",
        text: "Something went wrong on our end. Please try again.",
        confirmButtonColor: "#02312A",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      if (!email) return;

      const response = await fetch("https://tradecen-courier-server.onrender.com/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        Swal.fire({
          ...swalConfig,
          icon: "success",
          title: "New Code Sent",
          text: "A fresh OTP has been sent to your email inbox.",
          confirmButtonText: '<span style="color: #02312A">Got it</span>',
          timer: 3000,
          toast: true, // Making this one a toast for a modern feel
          position: "top-end",
          showConfirmButton: false,
        });
      } else {
        Swal.fire({
          ...swalConfig,
          icon: "error",
          title: "Resend Failed",
          text: "Could not resend code. Try again in a minute.",
        });
      }
    } catch (error) {
      Swal.fire({
        ...swalConfig,
        icon: "error",
        title: "Server Error",
        text: "Unable to reach the server.",
      });
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <DynamicTitle title="Verify OTP" />
      <div className="mb-8">
        <h1 className="text-4xl font-black text-black mb-2">Enter Code</h1>
        <p className="text-gray-500 text-sm">
          Enter the 6-digit OTP sent to your email:
        </p>
        <p className="text-sm font-bold text-[#A5C141] mt-1">{email}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="flex gap-2 justify-center">
          {otp.map((digit, index) => (
            <input
              key={index}
              type="text"
              maxLength="1"
              value={digit}
              ref={(el) => (inputRefs.current[index] = el)}
              onChange={(e) => handleChange(e.target, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="w-12 h-14 text-center text-xl font-bold border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#CAEB66] focus:border-[#CAEB66] outline-none"
            />
          ))}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#CAEB66] hover:bg-[#b8d65a] text-[#02312A] font-black py-4 rounded-xl transition-all shadow-lg active:scale-[0.98] disabled:opacity-50"
        >
          {loading ? "Verifying..." : "Verify Code"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500">
        Didn’t receive code?{" "}
        <button
          type="button"
          onClick={handleResend}
          className="font-bold text-[#A5C141] hover:text-[#8ba335] transition-colors cursor-pointer"
        >
          Resend OTP
        </button>
      </p>
    </div>
  );
};

export default OTPVerify;
