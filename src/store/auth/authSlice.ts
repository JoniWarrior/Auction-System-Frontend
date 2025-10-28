import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type User = {
  id: string;
  email: string;
  name: string;
};

interface AuthState {
  user: User | null;
  accessToken: string | null;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
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
    },

    logOut: (state) => {
      state.user = null;
      state.accessToken = null;

  
    },
  },
});

export const { loginSucces, logOut } = authSlice.actions;
export default authSlice.reducer;
