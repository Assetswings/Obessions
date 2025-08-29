// src/features/about/aboutSlice.jsx
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../app/api";

// 🔹 Thunk to fetch About Us details
export const fetchAboutUs = createAsyncThunk(
  "about/fetchAboutUs",
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get("/pages/about-us");

      // If API success = false, reject
      if (!response.data.success) {
        return rejectWithValue(response.data.message || "Failed to fetch About Us data");
      }

      return response.data.data; // returning only "data" object
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const aboutSlice = createSlice({
  name: "about",
  initialState: {
    loading: false,
    data: [], // will store "data" from API
    error: null,
  },
  reducers: {
    resetAboutState: (state) => {
      state.loading = false;
      state.data = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAboutUs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAboutUs.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchAboutUs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export const { resetAboutState } = aboutSlice.actions;
export default aboutSlice.reducer;
