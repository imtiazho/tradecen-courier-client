import React, { useState } from "react";
import { useForm } from "react-hook-form";
import useAuth from "../../Hooks/useAuth";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import Swal from "sweetalert2";
import LoadingModal from "../../Components/LoadingModal/LoadingModal";
import DynamicTitle from "../../Components/DynamicTitle/DynamicTitle";

const ProfilePage = () => {
  const {user, dbUser, setDbUser, loading } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [isEditing, setIsEditing] = useState(false);

  // React Hook Form setup with default values from your sample data
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      displayName: dbUser?.displayName || user?.displayName,
    },
  });

  const onSubmit = async (data) => {
    try {
      const res = await axiosSecure.patch(
        `/users/update/${dbUser?.email}`,
        data,
      );

      if (res.data.modifiedCount > 0 || res.data.matchedCount > 0) {
        setDbUser({ ...dbUser, ...data });
        setIsEditing(false);
        Swal.fire("Updated!", "Profile info has been updated.", "success");
      }
    } catch (error) {
      Swal.fire("Error", "Could not update profile", "error");
    }
  };

  if (loading) <LoadingModal isLoading={true}></LoadingModal>;
  return (
    <div className="p-6">
      <DynamicTitle title={user?.displayName} />
      <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header/Banner Area */}
        <div className="h-32 bg-[#CAEB66]"></div>

        <div className="px-8 pb-8">
          {/* Profile Image */}
          <div className="relative -mt-16 mb-6">
            <img
              src={dbUser?.photoURL || "https://via.placeholder.com/150"}
              alt="Profile"
              className="w-32 h-32 rounded-2xl border-4 border-white object-cover shadow-md"
            />
          </div>

          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-black text-[#02312A]">
                {dbUser?.displayName}
              </h1>
              <span className="bg-[#02312A] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                {dbUser?.role}
              </span>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="text-sm font-bold text-[#02312A] underline underline-offset-4 cursor-pointer"
            >
              {isEditing ? "Cancel" : "Edit Details"}
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Display Name */}
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase">
                Full Name
              </label>
              <input
                {...register("displayName")}
                disabled={!isEditing}
                defaultValue={dbUser?.displayName || user?.displayName}
                className={`w-full mt-1 p-3 rounded-xl border-2 transition-all ${
                  isEditing
                    ? "border-[#CAEB66] bg-white"
                    : "border-transparent bg-gray-50"
                }`}
              />
            </div>

            {/* Email (Always Disabled) */}
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase">
                Email
              </label>
              <input
                value={dbUser?.email}
                disabled
                className="w-full mt-1 p-3 rounded-xl border-2 border-transparent bg-gray-100 text-gray-500 cursor-not-allowed"
              />
            </div>

            {/* Role & Verification Info (ReadOnly) */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase">
                  Account Status
                </p>
                <p className="font-bold text-green-600">
                  {dbUser?.isOnboarded ? "Verified" : "Pending"}
                </p>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase">
                  Joined On
                </p>
                <p className="font-bold text-[#02312A]">
                  {new Date(dbUser?.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Save Button */}
            {isEditing && (
              <button
                type="submit"
                className="w-full bg-[#02312A] text-white font-bold py-4 rounded-2xl mt-6 shadow-lg active:scale-95 transition-transform"
              >
                Save Changes
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
