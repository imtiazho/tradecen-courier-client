import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import useAuth from "../../Hooks/useAuth";

const VerifyEmail = () => {
  const { user, dbUser, setDbUser, setLoading } = useAuth();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();

  const checkVerification = async () => {
    setLoading(true);
    try {
      await user.reload();

      if (user.emailVerified) {
        const res = await axiosSecure.patch(
          `/users/verify-status/${user.email}`,
          { isVerified: true },
        );

        if (res.data.modifiedCount > 0 || res.data.matchedCount > 0) {
          Swal.fire({
            title: "Verified!",
            text: "Your email is verified. Welcome!",
            icon: "success",
            timer: 2000,
            showConfirmButton: false,
          });
          
          navigate("/");
        }
      } else {
        Swal.fire(
          "Not Verified!",
          "Please check your inbox and click the link first.",
          "warning",
        );
      }
    } catch (error) {
      console.error("Verification Error:", error);
      Swal.fire("Error", "Something went wrong. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="bg-white p-10 rounded-3xl shadow-xl max-w-md w-full text-center border-2 border-[#CAEB66]">
        <div className="w-20 h-20 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-10 h-10"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </div>

        <h2 className="text-3xl font-black text-[#02312A] mb-3">
          Verify Email
        </h2>
        <p className="text-gray-500 mb-8">
          We've sent a verification link to <br />
          <span className="font-bold text-[#02312A]">{user?.email}</span>
        </p>

        <button
          onClick={checkVerification}
          className="w-full bg-[#02312A] text-white font-bold py-4 rounded-2xl hover:bg-[#034d42] transition-all transform active:scale-95 shadow-lg shadow-green-100 cursor-pointer"
        >
          I've Clicked the Link
        </button>

        <button
          onClick={() => window.location.reload()}
          className="mt-4 text-sm text-gray-400 hover:text-[#02312A] font-medium"
        >
          Didn't get the link? Refresh Page
        </button>
      </div>
    </div>
  );
};

export default VerifyEmail;
