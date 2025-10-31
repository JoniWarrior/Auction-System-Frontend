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

const guestRoutes = ['/auth/login', '/auth/register'];

const GUEST_API = Axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
})

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

    if (error.response?.status === 401 && !originalRequest._retry && !guestRoutes.includes(originalRequest.url)) {
      originalRequest._retry = true;

      try {
        const { refreshToken } = store.getState().auth;
        if (!refreshToken) {
          store.dispatch(logOut());
          return Promise.reject(error);
        }

        const response = await GUEST_API.post(
          `/auth/refresh`,
          {  refreshToken }
        );

        const newAccessToken = response.data.data.accessToken;
        console.log("New AccessToken after expiring: ", newAccessToken);
        store.dispatch(updateAccessToken(newAccessToken));

        API.defaults.headers.Authorization = `Bearer ${newAccessToken}`;
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return API(originalRequest);
      } catch (err) {
        store.dispatch(logOut());
        window.location.reload();
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default API;
