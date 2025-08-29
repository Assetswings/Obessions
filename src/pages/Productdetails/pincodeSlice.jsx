import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../app/api';

export const checkPincode = createAsyncThunk(
  'pincode/checkPincode',
  async (pincode) => {
    const response = await API.post('/services/pincode', { pincode });
    return response.data.data; 
  }
);

const pincodeSlice = createSlice({
  name: 'pincode',
  initialState: {
    pinset: {},
    loading: false,
    error: null,
  },
  reducers: {
    resetPincodeState: (state) => {
      state.pinset = {};
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkPincode.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkPincode.fulfilled, (state, action) => {
        state.loading = false;
        state.pinset = action.payload;
      })
      .addCase(checkPincode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { resetPincodeState } = pincodeSlice.actions;
export default pincodeSlice.reducer;
