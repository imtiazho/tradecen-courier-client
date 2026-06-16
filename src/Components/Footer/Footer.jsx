import React from "react";
import {
  FaTruckFast,
  FaLinkedinIn,
  FaFacebookF,
  FaYoutube,
} from "react-icons/fa6";
import { FaXTwitter } from "react-icons/fa6";
import { Link } from "react-router";

const Footer = () => {
  return (
    <footer className="pt-10 pb-6 font-sans">
      {/* Main Footer Card */}
      <div className="bg-[#0A0A0A] rounded-[40px] py-16 px-6 md:px-20 flex flex-col items-center text-center">
        {/* 1. Logo Section */}
        <div className="flex items-center gap-2 mb-6">
          <div className="bg-[#CAEB66] px-2 py-1 rounded-lg">
            <FaTruckFast className="text-[#0D2E2E]" size={25} />
          </div>
          <span className="text-2xl font-bold text-white">TradeCen</span>
        </div>

        {/* 2. Tagline */}
        <p className="text-gray-400 text-sm md:text-base max-w-2xl leading-relaxed mb-10">
          Enjoy fast, reliable parcel delivery with real-time tracking and zero
          hassle. From personal packages to business shipments — we deliver on
          time, every time.
        </p>

        {/* 3. Upper Custom Dashed Border */}
        <div className="w-full h-[1px] bg-[linear-gradient(to_right,#333_50%,transparent_0%)] bg-[length:15px_1px] bg-repeat-x opacity-50" />

        {/* 4. Navigation Links */}
        <nav className="py-8">
          <ul className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-gray-300 text-sm md:text-base font-medium">
            {[
              { title: "Coverage", link: "/coverage-area" },
              { title: "About Us", link: "/about-us" },
              { title: "Pricing", link: "/pricing" },
              { title: "Contact", link: "/contact" },
            ].map((link) => (
              <li key={link}>
                <Link
                  to={link?.link}
                  className="hover:text-[#CAEB66] transition-colors"
                >
                  {link?.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* 5. Bottom Custom Dashed Border */}
        <div className="w-full h-[1px] bg-[linear-gradient(to_right,#333_50%,transparent_0%)] bg-[length:15px_1px] bg-repeat-x opacity-50 mb-10" />

        {/* 6. Social Media Icons */}
        <div className="flex items-center gap-4">
          <a
            href="#"
            className="w-10 h-10 rounded-full bg-[#0077B5] flex items-center justify-center text-white hover:scale-110 transition-transform"
          >
            <FaLinkedinIn />
          </a>
          <a
            href="#"
            className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-black hover:scale-110 transition-transform"
          >
            <FaXTwitter />
          </a>
          <a
            href="#"
            className="w-10 h-10 rounded-full bg-[#1877F2] flex items-center justify-center text-white hover:scale-110 transition-transform"
          >
            <FaFacebookF />
          </a>
          <a
            href="#"
            className="w-10 h-10 rounded-full bg-[#FF0000] flex items-center justify-center text-white hover:scale-110 transition-transform"
          >
            <FaYoutube />
          </a>
        </div>
      </div>

      {/* 7. Bottom Copyright Section */}
      <div className="mt-8 flex flex-col md:flex-row justify-between items-center px-10 text-gray-500 text-xs md:text-sm font-medium">
        <p>© 2026 TradeCen Logistics. All rights reserved.</p>
        <p className="mt-2 md:mt-0 tracking-wider uppercase">
          Developed by{" "}
          <span className="text-[#0D2E2E] font-black hover:text-[#CAEB66] transition-colors cursor-pointer">
            @imtiazho
          </span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
