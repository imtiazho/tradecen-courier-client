import React from "react";
import { FaTruckFast } from "react-icons/fa6";
import AuthImg from "../../assets/authImage.png";
import { Outlet } from "react-router";
import ScrollToTop from "../../Components/ScrollToTop/ScrollToTop";

const AuthLayout = () => {
  return (
    <section className="min-h-screen grid grid-cols-1 md:grid-cols-2 font-sans bg-white">
      <ScrollToTop></ScrollToTop>
      {/* 1. Left Side: Form Content */}
      <div className="flex flex-col justify-center px-10 md:px-20 lg:px-32 py-12">
        {/* Logo Section */}
        <div className="flex items-center gap-2 mb-16">
          <div className="bg-[#CAEB66] p-2 rounded-lg">
            <FaTruckFast className="text-[#02312A]" size={24} />
          </div>
          <span className="text-2xl font-bold text-[#02312A]">TradeCen</span>
        </div>

        <Outlet></Outlet>
      </div>

      <div className="hidden md:flex items-center justify-center bg-[#FAFDF0] p-12">
        <div className="relative w-full max-w-lg">
          {/* This is where you will add your <img> tag for image_edc1c4.png */}
          <div
            className="aspect-square bg-contain bg-no-repeat bg-center"
            style={{ backgroundImage: `url('/path-to-your-image.png')` }}
          >
            <img src={AuthImg} alt="" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AuthLayout;
