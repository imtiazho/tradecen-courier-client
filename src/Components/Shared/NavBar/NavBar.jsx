import React, { useEffect, useState } from "react";
import { FaTruckFast } from "react-icons/fa6";
import { Link, NavLink } from "react-router";
import useAuth from "../../../Hooks/useAuth";
import Swal from "sweetalert2";
import { BsBuildingFillAdd } from "react-icons/bs";
import logo from "../../../assets/logo.png";

const NavBar = () => {
  const { user, dbUser, handleLogOut, fetchDbUser } = useAuth();
  const currentRole = dbUser?.role || "user";
  useEffect(() => {
    if (dbUser?.role === "pending-rider") {
      const interval = setInterval(async () => {
        await fetchDbUser(user);
      }, 15000);

      if (dbUser?.status === "approved") {
        clearInterval(interval);
      }

      return () => clearInterval(interval);
    }
  }, [dbUser, user, fetchDbUser]);

  const list = (
    <>
      <li>
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? "bg-[#CAEB66] text-black" : "bg-transparent"
          }
        >
          Home
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/coverage-area"
          className={({ isActive }) =>
            isActive ? "bg-[#CAEB66] text-black" : "bg-transparent"
          }
        >
          Coverage
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/track-parcel"
          className={({ isActive }) =>
            isActive ? "bg-[#CAEB66] text-black" : "bg-transparent"
          }
        >
          Track Order
        </NavLink>
      </li>
      {/* <li>
        <NavLink
          to="/about-us"
          className={({ isActive }) =>
            isActive ? "bg-[#CAEB66] text-black" : "bg-transparent"
          }
        >
          About
        </NavLink>
      </li> */}
      <li>
        <NavLink
          to="/pricing"
          className={({ isActive }) =>
            isActive ? "bg-[#CAEB66] text-black" : "bg-transparent"
          }
        >
          Pricing
        </NavLink>
      </li>
      {/* <li>
        <NavLink
          to="/contact"
          className={({ isActive }) =>
            isActive ? "bg-[#CAEB66] text-black" : "bg-transparent"
          }
        >
          Contact
        </NavLink>
      </li> */}
    </>
  );

  const handleSignOut = async () => {
    try {
      await handleLogOut();

      Swal.fire({
        icon: "success",
        title: "Signed Out!",
        text: "You have been logged out successfully.",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Opss...",
        text: "Something went wrong during sign out!",
      });
    }
  };

  return (
    <div className="navbar bg-base-100 py-3.75 px-6.25 rounded-[15px]">
      <div className="navbar-start">
        <div className="dropdown">
          <label tabIndex={0} className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </label>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
          >
            {list}
          </ul>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-[#CAEB66] px-2 py-1 rounded-lg">
            <FaTruckFast className="text-[#0D2E2E]" size={25} />
          </div>
          <span className="text-2xl font-bold text-[#0D2E2E]">TradeCen</span>
        </div>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 text-sm font-medium text-[#606060]">
          {list}
        </ul>
      </div>
      <div className="navbar-end gap-2">
        {user ? (
          <div className="dropdown dropdown-end">
            <label
              tabIndex={0}
              className="btn btn-ghost btn-circle avatar border-2 border-[#CAEB66] w-14 h-14"
            >
              <div className="w-14 rounded-full shadow-inner">
                <img
                  src={user?.photoURL || dbUser?.photoURL}
                  className="object-cover w-full h-full"
                  alt="User Profile"
                />
              </div>
            </label>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-4 z-[20] p-2 shadow-[0_20px_50px_rgba(0,0,0,0.15)] bg-white border border-gray-100 rounded-2xl w-64 backdrop-blur-lg"
            >
              {/* User Info Section with Gradient Background */}
              <div className="flex flex-col items-center p-4 mb-2 rounded-xl bg-gradient-to-br from-[#CAEB66]/20 to-transparent border border-[#CAEB66]/30">
                <div className="avatar mb-2">
                  <div className="w-16  ring ring-[#CAEB66] ring-offset-base-100 ring-offset-2">
                    <img
                      src={
                        user?.photoURL || "https://i.ibb.co/mR79Y6B/user.png"
                      }
                      alt="User"
                    />
                  </div>
                </div>
                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">
                  Welcome back,
                </p>
                <p className="text-base font-black text-[#0D2E2E] truncate w-full text-center">
                  {user?.displayName || "User Name"}
                </p>
                <p className="text-[10px] text-white truncate text-center uppercase bg-gray-900 py-1 px-2 rounded">
                  {dbUser?.role}
                </p>
              </div>

              {/* Menu Items */}
              <div className="space-y-1">
                <li>
                  <Link
                    to="/profile"
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#CAEB66] hover:text-black transition-all duration-300 group"
                  >
                    <span className="p-2 bg-gray-50 rounded-md group-hover:bg-white/50">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </span>
                    <span className="font-bold">My Profile</span>
                  </Link>
                </li>

                {currentRole === "user" || currentRole === "pending-rider" ? (
                  <li>
                    <Link
                      to="/role-onboarding"
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#CAEB66] hover:text-black transition-all duration-300 group"
                    >
                      <span className="p-2 bg-gray-50 rounded-md group-hover:bg-white/50">
                        <BsBuildingFillAdd />
                      </span>
                      <span className="font-bold">Join with Us</span>
                    </Link>
                  </li>
                ) : (
                  <li>
                    <Link
                      to="/dashboard"
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#CAEB66] hover:text-black transition-all duration-300 group"
                    >
                      <span className="p-2 bg-gray-50 rounded-md group-hover:bg-white/50">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                          />
                        </svg>
                      </span>
                      <span className="font-bold">Dashboard</span>
                    </Link>
                  </li>
                )}

                <div className="divider my-1 opacity-50"></div>

                <li>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-3 p-3 rounded-lg text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300 group w-full"
                  >
                    <span className="p-2 bg-red-50 rounded-md group-hover:bg-white/20">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                      </svg>
                    </span>
                    <span className="font-black italic">Logout</span>
                  </button>
                </li>
              </div>
            </ul>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link
              to="/auth/login"
              className="btn btn-ghost capitalize text-[#0D2E2E] border border-gray-200"
            >
              Sign In
            </Link>
            <Link
              to="/auth/sign-up"
              className="btn bg-[#CAEB66] hover:bg-[#c4e685] border-none text-black capitalize flex items-center gap-2"
            >
              Sign Up
              <div className="bg-[#1A2E2E] rounded-full p-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2.5}
                  stroke="white"
                  className="w-3 h-3"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"
                  />
                </svg>
              </div>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default NavBar;
