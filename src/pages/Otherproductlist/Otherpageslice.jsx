import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../app/api";

export const fetchOtherProducts = createAsyncThunk(
  "otherProducts/fetchOtherProducts",
  // async ({ slug, page = 1, limit = 10 }) => {
  //   console.log("slice", slug, page, limit);

  //   const params = new URLSearchParams({ page, limit });
  //   const url = `/${slug}?${params.toString()}`;

  //   const response = await API.get(url);
  //   return response.data.data;
  // }
  async ({
    slug,
    page = 1,
    limit = 20,
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

    const url = `/${slug}?${params.toString()}`;
    const response = await API.get(url);
    return response.data.data;
  }
);

const otherproductSlice = createSlice({
  name: "otherProducts",
  initialState: {
    data: [],
    filters: {},
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase("otherproduct/clear", (state) => {
        state.data = [];
        state.loading = true; // so skeletons show
      })
      .addCase(fetchOtherProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOtherProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.products || [];
        state.filters = action.payload.filters || {};
      })
      .addCase(fetchOtherProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default otherproductSlice.reducer;
