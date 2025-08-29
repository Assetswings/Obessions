import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../app/api';

// ✅ Add to Wishlist
export const addToWishlist = createAsyncThunk(
  'wishlist/addToWishlist',
  async ({ product_id }, { rejectWithValue }) => {
    try {
      await API.post('/wishlist/add-to-wishlist', { product_id });
      return { product_id };
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

// ✅ Remove from Wishlist
export const removeFromWishlist = createAsyncThunk(
  'wishlist/removeFromWishlist',
  async (wishlist_id, { rejectWithValue }) => {
    try {
      await API.delete(`/wishlist/item/${wishlist_id}`);
      return wishlist_id;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || 'Failed to remove from wishlist');
    }
  }
);

// ✅ Move to Cart
export const moveToCart = createAsyncThunk(
  'wishlist/moveToCart',
  async ({ product_id, quantity = 1 }, { rejectWithValue }) => {
    try {
      const response = await API.post('/wishlist/move-to-cart', { product_id, quantity });
      return { product_id, data: response.data.data };
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || 'Failed to move to cart');
    }
  }
);

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    loading: false,
    success: false,
    error: null,
    items: [],
    productIds: [],
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
      // Add to Wishlist
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
        state.productIds = action.payload.map((item) => item.product_id);
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Remove from Wishlist
      .addCase(removeFromWishlist.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        const wishlist_id = action.payload;
        state.loading = false;
        state.success = true;
        state.items = state.items.filter(item => item.id !== wishlist_id);
        state.productIds = state.items.map(item => item.product_id);
      })
      .addCase(removeFromWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Move to Cart
      .addCase(moveToCart.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(moveToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        const { product_id } = action.payload;
        // Remove moved product from wishlist state
        state.items = state.items.filter(item => item.product_id !== product_id);
        state.productIds = state.items.map(item => item.product_id);
      })
      .addCase(moveToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearWishlistState } = wishlistSlice.actions;
export default wishlistSlice.reducer;
