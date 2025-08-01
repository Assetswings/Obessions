import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../app/api';

// Add to cart
export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ product_id, quantity }, { rejectWithValue }) => {
    try {
      const response = await API.post('/cart/add-to-cart', { product_id, quantity });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Fetch cart
export const fetchCartDetails = createAsyncThunk(
  'cart/fetchCartDetails',
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get('/cart');
      return response.data?.data || [];
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Remove from cart
export const removeCartItem = createAsyncThunk(
  'cart/removeCartItem',
  async (cart_id, { rejectWithValue }) => {
    try {
      await API.delete(`/cart/item/${cart_id}`);
      return cart_id;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// ✅ Update quantity in cart
export const updateCartItem = createAsyncThunk(
  'cart/updateCartItem',
  async ({ product_id, quantity }, { rejectWithValue }) => {
    try {
      await API.post('/cart/update-cart', { product_id, quantity });
      return { product_id, quantity };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    cartItems: [],
    loading: false,
    error: null,
    addCartSuccess: false,
  },
  reducers: {
    resetCartStatus: (state) => {
      state.addCartSuccess = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Add to cart
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.addCartSuccess = false;
      })
      .addCase(addToCart.fulfilled, (state) => {
        state.loading = false;
        state.addCartSuccess = true;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // Fetch cart
      .addCase(fetchCartDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCartDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.cartItems = action.payload;
      })
      .addCase(fetchCartDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // Remove item
      .addCase(removeCartItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeCartItem.fulfilled, (state, action) => {
        state.loading = false;
        const removedId = action.payload;
        state.cartItems.items = state.cartItems.items.filter((item) => item.id !== removedId);
      })
      .addCase(removeCartItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // ✅ Update quantity
      .addCase(updateCartItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.loading = false;
        const { product_id, quantity } = action.payload;
        // const item = state.cartItems.items?.find((i) => i.product_id === product_id);

      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export const { resetCartStatus } = cartSlice.actions;
export default cartSlice.reducer;

