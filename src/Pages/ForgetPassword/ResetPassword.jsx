import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import Swal from "sweetalert2";
import DynamicTitle from "../../Components/DynamicTitle/DynamicTitle";

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email;

  const [passwords, setPasswords] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  // Common SweetAlert2 Styling
  const swalConfig = {
    confirmButtonColor: "#CAEB66",
    customClass: {
      popup: "rounded-3xl",
      confirmButton:
        "px-8 py-3 rounded-xl font-bold transition-transform active:scale-95",
    },
    buttonsStyling: true,
  };

  const handleChange = (e) => {
    setPasswords({
      ...passwords,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      return Swal.fire({
        ...swalConfig,
        icon: "warning",
        title: "Session Expired",
        text: "Your reset session has expired. Please restart the process.",
        confirmButtonText: '<span style="color: #02312A">Restart</span>',
      });
    }

    if (passwords.newPassword !== passwords.confirmPassword) {
      return Swal.fire({
        ...swalConfig,
        icon: "error",
        title: "Mismatch!",
        text: "Passwords do not match. Please check again.",
        confirmButtonText: '<span style="color: #02312A">Try Again</span>',
      });
    }

    try {
      setLoading(true);

      const response = await fetch("https://tradecen-courier-server.onrender.com/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          newPassword: passwords.newPassword,
        }),
      });

      const data = await response.json();

      if (data.success) {
        await Swal.fire({
          ...swalConfig,
          icon: "success",
          title: "Success!",
          text: "Your password has been reset successfully.",
          confirmButtonText: '<span style="color: #02312A">Login Now</span>',
        });
        navigate("/auth/login");
      } else {
        Swal.fire({
          ...swalConfig,
          icon: "error",
          title: "Update Failed",
          text: data.error || "Unable to reset password. Please try again.",
          confirmButtonColor: "#02312A",
        });
      }
    } catch (error) {
      Swal.fire({
        ...swalConfig,
        icon: "error",
        title: "Server Error",
        text: "A connection error occurred. Please try again later.",
        confirmButtonColor: "#02312A",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto md:mx-0">
      <DynamicTitle title="Reset Password" />
      {/* HEADER */}
      <div className="mb-10">
        <h1 className="text-4xl md:text-5xl font-black text-black mb-3 tracking-[-0.08rem]">
          Reset Password
        </h1>
        <p className="text-gray-500 text-sm font-medium">
          Create a new password for your account
        </p>
        {email && (
          <p className="text-sm font-bold text-[#A5C141] mt-2">{email}</p>
        )}
      </div>

      {/* FORM */}
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <label className="text-sm font-bold text-black ml-1">
            New Password
          </label>
          <input
            type="password"
            name="newPassword"
            value={passwords.newPassword}
            onChange={handleChange}
            placeholder="Enter new password"
            className="w-full border border-gray-200 rounded-lg py-3 px-4 mt-1 focus:ring-2 focus:ring-[#CAEB66] focus:border-[#CAEB66] outline-none transition-all"
            required
          />
        </div>

        <div>
          <label className="text-sm font-bold text-black ml-1">
            Confirm Password
          </label>
          <input
            type="password"
            name="confirmPassword"
            value={passwords.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm password"
            className="w-full border border-gray-200 rounded-lg py-3 px-4 mt-1 focus:ring-2 focus:ring-[#CAEB66] focus:border-[#CAEB66] outline-none transition-all"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#D1EE67] hover:bg-[#c2e25a] text-[#02312A] font-bold py-3.5 rounded-lg transition-all shadow-md active:scale-[0.98] disabled:opacity-50 cursor-pointer"
        >
          {loading ? "Updating..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
