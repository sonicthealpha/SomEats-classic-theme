import { createSelector, createSlice } from "@reduxjs/toolkit";
import moment from "moment";
import { settingsAPI } from "../../utils/api";
import { apiCallBegan } from "../actions/apiActions";

import { store } from "../store";

let initialState = {
  data: [],
  payment_data: [],
  lastFetch: null,
  loading: false,
};

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    settingsRecevied: (state, action) => {
      state.data = action.payload.data;
      state.lastFetch = Date.now();
      state.loading = true;
      return state;
    },
    settingspaymentRecevied: (state, action) => {
      // console.log("action",action)
      state.payment_data = action.payload.data;
      return state;
    },
  },
});

export const { settingsRecevied, settingspaymentRecevied } =
  settingsSlice.actions;
export default settingsSlice.reducer;

// api calls for all data
export const loadsettings = (type, user_id, onSuccess, onError, onStart) => {
  const { lastFetch } = store.getState().settings;
  const diffInMinutes = moment().diff(moment(lastFetch), "minutes");

  if (diffInMinutes < 5) return false;

  store.dispatch(
    apiCallBegan({
      ...settingsAPI(type, user_id),
      displayToast: false,
      onSuccessDispatch: settingsRecevied.type,
      onStart,
      onSuccess,
      onError,
    })
  );
};

// api calls for payment
export const loadpaymentsettings = (
  type,
  user_id,
  onSuccess,
  onError,
  onStart
) => {
  const { lastFetch } = store.getState().settings;
  const diffInMinutes = moment().diff(moment(lastFetch), "minutes");

  if (diffInMinutes < 5) return false;

  store.dispatch(
    apiCallBegan({
      ...settingsAPI(type, user_id),
      displayToast: false,
      onSuccessDispatch: settingspaymentRecevied.type,
      onStart,
      onSuccess,
      onError,
    })
  );
};

// selector functions
export const selectData = createSelector(
  (state) => state.settings,
  (settings) => settings.data
);

// selector payment
export const selectpaymentData = createSelector(
  (state) => state.settings,
  (settings) => settings.payment_data
);
