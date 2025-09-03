import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../app/api";

// Async thunk for fetching bestsellers (other products)
export const fetchOtherProducts = createAsyncThunk(
  "otherProducts/fetchOtherProducts",
  async ({ page = 1, limit = 10 , path}) => {
    const params = new URLSearchParams({ page, limit });

    const url = `/${path}?${params.toString()}`;

    const response = await API.get(url);
    return response.data.data; // response format -> { products, filters, etc. }
  }
);

const otherproductSlice = createSlice({
  name: "otherProducts",
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOtherProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOtherProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.products || [];
      })
      .addCase(fetchOtherProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default otherproductSlice.reducer;
