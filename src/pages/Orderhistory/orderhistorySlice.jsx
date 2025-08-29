import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../app/api";

// Thunk: Fetch order history

export const fetchOrderHistory = createAsyncThunk(
  "orders/fetchOrderHistory",
  async (filters = {}, { rejectWithValue }) => {
    try {
      // Example: filters = { order_no: "OBS-EC-202508002647" }
      const queryParams = new URLSearchParams(filters).toString();
      const url = queryParams ? `/orders?${queryParams}` : "/orders";

      const response = await API.get(url);

      console.log("orderHistory--->", response?.data?.data?.order_header);
      return response?.data?.data?.order_header || [];
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const orderHistorySlice = createSlice({
  name: "orders",
  initialState: {
    results: [], 
    loading: false,
    error: null,
  },
  reducers: {
    clearOrderHistory: (state) => {
      state.results = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrderHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.results = action.payload; 
      })
      .addCase(fetchOrderHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearOrderHistory } = orderHistorySlice.actions;
export default orderHistorySlice.reducer;
