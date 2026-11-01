import { axiosSecure } from "../api/apiClient";

// Auth is resolved from Firebase at request time by the singleton API client.
const useAxiosSecure = () => axiosSecure;

export default useAxiosSecure;
