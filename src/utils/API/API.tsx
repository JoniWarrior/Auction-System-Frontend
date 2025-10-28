import Axios from "axios";
import {store} from '@/store/store'
import {logOut} from "@/store/auth/authSlice";

const {getState, dispatch} = store

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
      const state = getState();
      const {accessToken} = state.auth;
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
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
            dispatch(logOut());
            window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  }
);

export default API;
