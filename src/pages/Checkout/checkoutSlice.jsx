// src/features/checkout/checkoutSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../app/api";

// Thunk: Fetch checkout items
export const fetchCheckout = createAsyncThunk(
  "checkout/fetchCheckout",
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get("/checkout");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Thunk: Process checkout (Place Order)
export const processCheckout = createAsyncThunk(
  "checkout/processCheckout",
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await API.post("/checkout/process", orderData);
      return response.data; // { success, status, message, data: {...} }
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const checkoutSlice = createSlice({
  name: "checkout",
  initialState: {
    checkoutData: null,
    orderResponse: null,
    loading: false,
    error: null
  },
  reducers: {
    clearCheckoutData: (state) => {
      state.checkoutData = {};
    },
    clearOrderResponse: (state) => {
      state.orderResponse = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // fetchCheckout
      .addCase(fetchCheckout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCheckout.fulfilled, (state, action) => {
        state.loading = false;
        state.checkoutData = action.payload;
      })
      .addCase(fetchCheckout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // processCheckout
      .addCase(processCheckout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(processCheckout.fulfilled, (state, action) => {
        state.loading = false;
        state.orderResponse = action.payload;
      })
      .addCase(processCheckout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearCheckoutData, clearOrderResponse } = checkoutSlice.actions;
export default checkoutSlice.reducer;
