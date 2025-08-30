import { createSlice } from "@reduxjs/toolkit";

let initialState = {
  details: [],
};
const cartSlice = createSlice({
  name: "details",
  initialState,
  reducers: {
    setDetails: (state, action) => {
      state.details = action.payload;
      return state;
    },
  },
});

export const { setDetails } = cartSlice.actions;
export default cartSlice.reducer;
