import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../app/api";

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async ({
    category,
    subcategory = "",
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

    const url = subcategory
      ? `/products/${category}/${subcategory}?${params.toString()}`
      : `/products/${category}?${params.toString()}`;

    const response = await API.get(url);
    return response.data.data;
  }
);

const productSlice = createSlice({
  name: "products",
  initialState: {
    data: [],
    filters: {},
    sorting:{},
    pagination: {},
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.products;
        state.pagination = {
          total: action.payload.total,
          current_page: action.payload.current_page,
          limit: action.payload.limit,
        };
        state.filters = action.payload.filters || {};
        state.sorting = action.payload.sorting.sort_by || {};
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default productSlice.reducer;
