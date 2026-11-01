import axios from "axios";
import { auth } from "../../firebase.init";
import { signOut } from "firebase/auth";
import { createAuthenticatedAxios } from "./createAuthenticatedAxios";

export const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"
).replace(/\/+$/, "");

export const axiosSecure = createAuthenticatedAxios({
  axios,
  auth,
  signOut,
  baseURL: API_BASE_URL,
});
