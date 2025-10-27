import Axios from "axios";

const API = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
    // "Access-Control-Allow-Origin": "*",
    Accept: "application/json",
  },
});
API.interceptors.request.use(
  (config) => {
    const persistedState = localStorage.getItem("persist:root");
    if (persistedState) {
      const authState = JSON.parse(JSON.parse(persistedState).auth);
      const accessToken = authState?.accessToken;
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

API.interceptors.response.use(
  (res) => res,
  (error) => {
    console.log(error);
    if (error.response) {
      const status = error.response.status;

      if (status === 401) {
        if (typeof window !== "undefined") {
          localStorage.removeItem("persist:root");
          alert("Session expired! Log in again!");
          window.location.href = "/login";
        }
      }

      if (status === 403) {
        alert("You do not have permission to perform this action");
      }
    }
    return Promise.reject(error);
  }
);

export default API;
