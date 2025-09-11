import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../app/api";

// Thunk 1: Fetch initial Carpet Finder setup (steps, options, etc.)
export const fetchCarpetFinder = createAsyncThunk(
  "carpetFinder/fetchCarpetFinder",
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get("/carpet-finder");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Thunk 2: Fetch filtered carpet results (floor-covering with query params)
export const filterCarpet = createAsyncThunk(
  "carpetFinder/filterCarpet",
  async (filters, { rejectWithValue }) => {
    try {
      const response = await API.get(
        `/carpet-finder/room_filter=${filters.room_filter}&size_filter=${filters.size_filter}&color_filter=${filters.color_filter}&pattern_filter=${filters.pattern_filter}`
      );

      return response.data?.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const carpetFinderSlice = createSlice({
  name: "carpetFinder",
  initialState: {
    data: null,
    filteredData: null,
    filters:{},
    loading: false,
    filterLoading: false,
    error: null,
    filterError: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    // fetchCarpetFinder cases
    builder
      .addCase(fetchCarpetFinder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCarpetFinder.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchCarpetFinder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // filterCarpet cases
    builder
      .addCase(filterCarpet.pending, (state) => {
        state.filterLoading = true;
        state.filterError = null;
      })
      .addCase(filterCarpet.fulfilled, (state, action) => {
        state.filterLoading = false;
        state.filteredData = action.payload.products;
        state.filters = action.payload.filters.product_filter || {};
      })
      .addCase(filterCarpet.rejected, (state, action) => {
        state.filterLoading = false;
        state.filterError = action.payload;
      });
  },
});

export default carpetFinderSlice.reducer;
