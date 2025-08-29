import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../app/api";

// 🔹 Thunk for fetching Top Picks
export const fetchTopPicks = createAsyncThunk(
  "topPicks/fetchTopPicks",
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get("/product-others/top-picks");
      console.log("---------> response of top picks", response);
      return response.data?.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// 🔹 Thunk for fetching Add-Ons
export const fetchAddOns = createAsyncThunk(
  "topPicks/fetchAddOns",
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get("/product-others/add-ons");
      console.log("---------> response of add-ons", response);
      return response.data?.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// 🔹 Thunk for fetching More Like Products
export const fetchMoreLike = createAsyncThunk(
  "topPicks/fetchMoreLike",
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get("/product-others/more-like");
      console.log("---------> response of more like", response);
      return response?.data;
    } catch (err) {
      return rejectWithValue(err.response?.data.message || err.message);
    }
  }
);

const topPicksSlice = createSlice({
  name: "topPicks",
  initialState: {
    items: [],
    addOns: [],
    moreLike: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // 🔹 Top Picks cases
      .addCase(fetchTopPicks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTopPicks.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchTopPicks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // 🔹 Add-Ons cases
      .addCase(fetchAddOns.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAddOns.fulfilled, (state, action) => {
        state.loading = false;
        state.addOns = action.payload;
      })
      .addCase(fetchAddOns.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // 🔹 More Like cases
      .addCase(fetchMoreLike.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMoreLike.fulfilled, (state, action) => {
        state.loading = false;
        state.moreLike = action.payload;
      })
      .addCase(fetchMoreLike.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export default topPicksSlice.reducer;
