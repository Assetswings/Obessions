import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../app/api";

export const fetchProductDetail = createAsyncThunk(
  "productDetail/fetchProductDetail",
  async (slug) => {
    const response = await API.get(`/product-details/${slug}`);
    return response.data.data;
  }
);

const productDetailSlice = createSlice({
  name: "productDetail",
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearProductDetail: (state) => {
      state.data = null;
      state.loading = false;
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchProductDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductDetail.fulfilled, (state, action) => {
        //the responce of this line
        console.log("API Product Detail Response 👉", action.payload);
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchProductDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearProductDetail } = productDetailSlice.actions;
export default productDetailSlice.reducer;
