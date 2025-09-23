import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../app/api';

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

export const removeCartItem = createAsyncThunk(
  'cart/removeCartItem',
  async (cart_id, { rejectWithValue }) => {
    try {
      const res = await API.delete(`/cart/item/${cart_id}`);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

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

      .addCase(removeCartItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // .addCase(removeCartItem.fulfilled, (state, action) => {
      //   state.loading = false;
      //   const removedId = action.payload;
      //   state.cartItems.items = state.cartItems.items.filter((item) => item.id !== removedId);
      //   let newTotal = 0;
      //   state.cartItems.items.forEach(i => {
      //     newTotal += (i.product?.selling_price || 0) * (i.cart_qty || 0);
      //   });
      //   state.cartItems.total = newTotal;
      // })
      .addCase(removeCartItem.fulfilled, (state, action) => {
        state.loading = false;

        const { success, message, data } = action.payload; // ✅ destructure response
        if (success) {
          // API already gives updated items & total
          state.cartItems.items = data.items || [];
          state.cartItems.total = data.total || 0;
        }
      })
      .addCase(removeCartItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      .addCase(updateCartItem.pending, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        const { product_id, quantity } = action.payload;
        const item = state.cartItems.items?.find((i) => i.product_id === product_id);
        if (item) {
          item.cart_qty = quantity;
          let newTotal = 0;
          state.cartItems.items.forEach(i => {
            newTotal += (i.product?.selling_price || 0) * (i.cart_qty || 0);
          });
          state.cartItems.total = newTotal;
        }
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export const { resetCartStatus } = cartSlice.actions;
export default cartSlice.reducer;
