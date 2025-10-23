import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type User = {
    id : string,
    email : string,
    name : string
};

interface AuthState {
  user: User | null;
  accessToken: string | null;
}

const getStoredUser = () => {
  if (typeof window !== "undefined") {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  }
};

const getStoredAccessToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("accessToken");
  }
};

const initialState: AuthState = {
  user: getStoredUser(),
  accessToken: getStoredAccessToken() || null,
};

const authSlice = createSlice({
  name: "authSlice",
  initialState,
  reducers: {
    loginSucces: (
      state,
      action: PayloadAction<{ user: User; accessToken: string }>
    ) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;

      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(action.payload.user));
        localStorage.setItem(
          "accessToken",
          action.payload.accessToken
        );
      }
    },

    logOut: (state) => {
      state.user = null;
      state.accessToken = null;

      if (typeof window !== "undefined") {
        localStorage.removeItem("user");
        localStorage.removeItem("accessToken");
      }
    },
  },
});

export const { loginSucces, logOut } = authSlice.actions;
export default authSlice.reducer;