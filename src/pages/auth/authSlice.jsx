// src/pages/auth/authSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../app/api";

// SEND OTP
export const sendOtp = createAsyncThunk(
  "auth/sendOtp",
  async (mobile, { rejectWithValue }) => {
    try {
      const res = await API.post("/auth/send-otp", { mobile });
      return { ...res.data, mobile };
    } catch (err) {
      if (err.response?.status === 404) {
        return rejectWithValue({ notRegistered: true, mobile });
      }
      return rejectWithValue({ error: err.message });
    }
  }
);

// VERIFY OTP
export const verifyOtp = createAsyncThunk(
  "auth/verifyOtp",
  async ({ otp, otp_requested_id, temp_id }, { rejectWithValue }) => {
    try {
      const res = await API.post("/auth/verify-otp", {
        otp,
        otp_requested_id,
        temp_id,
      });
      if (res.data?.token) {
        localStorage.setItem("token", res.data.token);
      }
      return res.data;
    } catch (err) {
      return rejectWithValue({ error: err.message });
    }
  }
);

// REGISTER
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async ({ first_name, last_name, email, mobile }, { rejectWithValue }) => {
    try {
      const res = await API.post("/auth/register", {
        first_name,
        last_name,
        email,
        mobile,
      });
      return res.data;
    } catch (err) {
      return rejectWithValue({ error: err.message });
    }
  }
);

// SLICE
const authSlice = createSlice({
  name: "auth",
  initialState: {
    loading: false,
    mobile: "",
    otp_requested_id: null,
    temp_id: null,
    token: null,
    error: null,
  },
  reducers: {
    updateField: (state, action) => {
      const { key, value } = action.payload;
      state[key] = value;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendOtp.fulfilled, (state, action) => {
        state.loading = false;
        const { data, mobile } = action.payload;
        state.otp_requested_id = data.otp_requested_id;
        state.temp_id = data.temp_id;
        state.mobile = mobile;
      })
      .addCase(sendOtp.rejected, (state, action) => {
        state.loading = false;
        if (action.payload?.notRegistered) {
          state.mobile = action.payload.mobile;
        } else {
          state.error = action.payload?.error || "Send OTP failed";
        }
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        const { data } = action.payload;
        state.otp_requested_id = data.otp_requested_id;
        state.temp_id = data.temp_id;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error;
      })
      .addCase(verifyOtp.pending, (state) => {
        state.loading = true;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error;
      });
  },
});

export const { updateField } = authSlice.actions;
export default authSlice.reducer;
