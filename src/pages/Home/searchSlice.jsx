// src/features/search/searchSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../app/api";

// Thunk: Perform global search
export const fetchSearchResults = createAsyncThunk(
  "search/fetchSearchResults",
  // async (query, { rejectWithValue }) => {
  //   try {
  //     const response = await API.get(`/search?q=${query}`);
  //     return response?.data?.data;
  //   } catch (error) {
  //     return rejectWithValue(
  //       error.response?.data?.data || error.message
  //     );
  //   }
  // }
  async ({
    query,
    page = 1,
    limit = 40,
    filters = {},
  }) => {
    const params = new URLSearchParams({ page, limit });
    Object.entries(filters).forEach(([key, value]) => {
      if (Array.isArray(value) && value.length > 0) {
        params.append(key, value.join(","));
      } else if (value) {
        params.append(key, value);
      }
    });
    const url = `search?q=${query}`;
    // const url = subcategory
    //   ? `/products/${category}/${subcategory}?${params.toString()}`
    //   : `/products/${category}?${params.toString()}`;

    const response = await API.get(url);
    return response.data.data;
  }
);

const searchSlice = createSlice({
  name: "search",
  initialState: {
    results: [],
    pagination: {},
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
        state.pagination = {
          // total: action.payload.total,
          total: action.payload.products.length,
          current_page: action.payload.current_page,
          limit: action.payload.limit,
        };
        state.filters = action.payload.filters || {};
      })
      .addCase(fetchSearchResults.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSearchResults } = searchSlice.actions;
export default searchSlice.reducer;
