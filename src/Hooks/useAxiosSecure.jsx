import axios from "axios";
import React, { useEffect } from "react";
import useAuth from "./useAuth";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";

const axiosSecure = axios.create({
  baseURL: "http://localhost:5000",
});

const useAxiosSecure = () => {
  const { user, handleLogOut, setLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const reqInterceptor = axiosSecure.interceptors.request.use((config) => {
      if (user && user.accessToken) {
        config.headers.Authorization = `Bearer ${user.accessToken}`;
      }
      return config;
    });

    // Interceptor Response
    const resInterceptor = axiosSecure.interceptors.response.use(
      (res) => {
        return res;
      },
      (err) => {
        const statusCode = err.status;
        if (statusCode === 401 || statusCode === 403) {
          handleLogOut().then(() => {
            Swal.fire({
              icon: "error",
              title: "Unauthorized Access Detected! 🛑",
              text: "Your session has expired or something went wrong. For security reasons, please login again.",
              confirmButtonColor: "#02312A",
              allowOutsideClick: false,
            });
            navigate("/auth/login");
            setLoading(false)
          });
        }
        return Promise.reject(err);
      },
    );

    return () => {
      axiosSecure.interceptors.request.eject(reqInterceptor);
      axiosSecure.interceptors.response.eject(resInterceptor);
    };
  }, [user, handleLogOut, navigate, setLoading]);

  return axiosSecure;
};

export default useAxiosSecure;
