// src/features/wishlist/wishlistSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../app/api';

// ✅ Add to Wishlist
export const addToWishlist = createAsyncThunk(
  'wishlist/addToWishlist',
  async ({ product_id }, { rejectWithValue }) => {
    try {
      const response = await API.post('/wishlist/add-to-wishlist', { product_id });
      return { product_id }; // Only return product_id for tracking
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || 'Failed to add to wishlist');
    }
  }
);

// ✅ Get Wishlist Items
export const fetchWishlist = createAsyncThunk(
  'wishlist/fetchWishlist',
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get('/wishlist');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || 'Failed to fetch wishlist');
    }
  }
);

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    loading: false,
    success: false,
    error: null,
    items: [], // product list
    productIds: [], // just product IDs for quick check
  },
  reducers: {
    clearWishlistState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addToWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        const { product_id } = action.payload;
        if (!state.productIds.includes(product_id)) {
          state.productIds.push(product_id);
        }
      })
      .addCase(addToWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.productIds = action.payload.map((item) => item.product_id); // assumes API returns product_id
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearWishlistState } = wishlistSlice.actions;
export default wishlistSlice.reducer;
