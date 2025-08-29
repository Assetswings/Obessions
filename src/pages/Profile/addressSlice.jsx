import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../app/api';

// 👉 POST: Create Address
export const createAddress = createAsyncThunk(
  'address/createAddress',
  async (formData, { rejectWithValue }) => {
    try {
      const res = await API.post('/account/address/create', formData);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// 👉 GET: Fetch All Addresses
export const getAddress = createAsyncThunk(
  'address/getAddress',
  async (_, { rejectWithValue }) => {
    try {
      const res = await API.get('/account/address');
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// 👉 DELETE: Address
export const deleteAddress = createAsyncThunk(
  'address/deleteAddress',
  async (id, { rejectWithValue }) => {
    try {
      const res = await API.delete(`/account/address/${id}/delete`);
      return { id, message: res.data.message };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// 👉 Default: Address
export const makeDefaultAddress = createAsyncThunk(
  'address/makeDefaultAddress',
  async (id, { rejectWithValue }) => {
    try {
      const res = await API.put(`/account/address/${id}/markedAsDefault`);
      return { id, message: res.data.message };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// 👉 PUT: Edit Address
export const editAddress = createAsyncThunk(
  'address/editAddress',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await API.put(`/account/address/${id}/edit`, data);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// 👉 addressSlice
const addressSlice = createSlice({
  name: 'address',
  initialState: {
    data: [],
    creating: false,
    fetching: false,
    error: null,
    success: null,
  },
  reducers: {
    clearAddressMessages: (state) => {
      state.error = null;
      state.success = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // CREATE
      .addCase(createAddress.pending, (state) => {
        state.creating = true;
        state.error = null;
        state.success = null;
      })
      .addCase(createAddress.fulfilled, (state, action) => {
        state.creating = false;
        state.success = 'Address added successfully';
        state.data = [...state.data, action.payload];
      })
      .addCase(createAddress.rejected, (state, action) => {
        state.creating = false;
        state.error = action.payload;
      })

      // GET
      .addCase(getAddress.pending, (state) => {
        state.fetching = true;
        state.error = null;
      })
      .addCase(getAddress.fulfilled, (state, action) => {
        state.fetching = false;
        // ✅ sort so default address is always first
        state.data = action.payload.sort((a, b) =>
          b.is_default - a.is_default
        );
      })
      .addCase(getAddress.rejected, (state, action) => {
        state.fetching = false;
        state.error = action.payload;
      })

      // DELETE
      .addCase(deleteAddress.pending, (state) => {
        state.error = null;
      })
      .addCase(deleteAddress.fulfilled, (state, action) => {
        state.success = action.payload.message;
        state.data = state.data.filter((address) => address.id !== action.payload.id);
      })
      .addCase(deleteAddress.rejected, (state, action) => {
        state.error = action.payload;
      })

      // MARK DEFAULT
      .addCase(makeDefaultAddress.pending, (state) => {
        state.error = null;
      })
      .addCase(makeDefaultAddress.fulfilled, (state, action) => {
        state.success = action.payload.message;
        // ✅ update state so only one default exists
        state.data = state.data.map((addr) =>
          addr.id === action.payload.id
            ? { ...addr, is_default: true }
            : { ...addr, is_default: false }
        );
        // sort again so default is on top
        state.data = state.data.sort((a, b) => b.is_default - a.is_default);
      })
      .addCase(makeDefaultAddress.rejected, (state, action) => {
        state.error = action.payload;
      })

      // EDIT
      .addCase(editAddress.fulfilled, (state, action) => {
        state.success = 'Address updated successfully';
        state.data = state.data.map((addr) =>
          addr.id === action.payload.id ? action.payload : addr
        );
      })
      .addCase(editAddress.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearAddressMessages } = addressSlice.actions;
export default addressSlice.reducer;
