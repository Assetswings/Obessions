// src/features/search/searchSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../app/api";

// Thunk: Perform global search
export const fetchSearchResults = createAsyncThunk(
  "search/fetchSearchResults",
  async (query, { rejectWithValue }) => {
    try {
      const response = await API.get(`/search?q=${query}`);
      console.log("====================================");
      console.log("ddd--carpet--->", response?.data?.data?.products);
      console.log("====================================");
      return response?.data?.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.data || error.message
      );
    }
  }
);

const searchSlice = createSlice({
  name: "search",
  initialState: {
    results: [],
    filters: {},
    loading: false,
    error: null,
  },
  reducers: {
    clearSearchResults: (state) => {
      state.results = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSearchResults.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSearchResults.fulfilled, (state, action) => {
        state.loading = false;
        // state.results = action.payload.products;
        // state.filters = action.payload || {};
        state.results = action.payload.products;
        state.filters = action.payload.filters.product_filter || {};
      })
      .addCase(fetchSearchResults.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSearchResults } = searchSlice.actions;
export default searchSlice.reducer;
