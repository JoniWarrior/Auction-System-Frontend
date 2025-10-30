import Axios from "axios";
import { store } from "@/store/store";
import { logOut, updateAccessToken } from "@/store/auth/authSlice";

const API = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

API.interceptors.request.use(
  (config) => {
    const accessToken = store.getState().auth.accessToken;
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

API.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    // Logjik refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const { refreshToken, user } = store.getState().auth;
        console.log("Access Token Redux State: ", store.getState().auth.accessToken);
        console.log("Refresh Token in Redux State , ", refreshToken);
        if (!refreshToken || !user?.id) {
          store.dispatch(logOut());
          return Promise.reject(error);
        }

        // Request the new toeke from the back
        const response = await Axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/refresh`,
          { userId: user.id, refreshToken }
        );

        const newAccessToken = response.data.data.accessToken;
        console.log("New AccessToken after expiring: ", newAccessToken);
        store.dispatch(updateAccessToken(newAccessToken));

        API.defaults.headers.Authorization = `Bearer ${newAccessToken}`;
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return API(originalRequest);
      } catch (err) {
        store.dispatch(logOut());
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default API;
