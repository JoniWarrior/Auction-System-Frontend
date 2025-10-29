import { createSlice } from "@reduxjs/toolkit";

interface NotificationState {
  notification: number;
}

const initialState: NotificationState = {
  notification: 0,
};

const notificationSlice = createSlice({
  name: "notificationSlice",
  initialState,
  reducers: {
    incrementNotificationNumber: (state) => {
      state.notification += 1;
    },
  },
});

export const { incrementNotificationNumber } = notificationSlice.actions;
export default notificationSlice.reducer;
