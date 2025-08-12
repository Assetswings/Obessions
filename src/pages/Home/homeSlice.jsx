import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../app/api';

export const fetchHomeData = createAsyncThunk(
  'home/fetchHomeData',
    async () => {
    const response = await API.get('/banners/home-page');
    return response.data.data; 
  }
);

  const homeSlice = createSlice({
  name: 'home',
  initialState: {
    data: {},
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchHomeData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHomeData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchHomeData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default homeSlice.reducer;
