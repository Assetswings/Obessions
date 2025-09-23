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
    pinloading: false,
    pinerror: null,
  },
  reducers: {
    resetPincodeState: (state) => {
      state.pinset = {};
      state.pinloading = false;
      state.pinerror = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkPincode.pending, (state) => {
        state.pinloading = true;
        state.pinerror = null;
      })
      .addCase(checkPincode.fulfilled, (state, action) => {
        state.pinloading = false;
        state.pinset = action.payload;
      })
      .addCase(checkPincode.rejected, (state, action) => {
        state.pinloading = false;
        state.pinerror = action.error.message;
      });
  },
});

export const { resetPincodeState } = pincodeSlice.actions;
export default pincodeSlice.reducer;
