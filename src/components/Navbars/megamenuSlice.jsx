import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../app/api';

export const fetchMegamenuData = createAsyncThunk(
'megamenu/fetchMegamenuData',
async () => {
const response = await API.get('/categories/megamenu');
return response.data.data; 
  }
  );

  const megamenuSlice = createSlice({
  name: 'megamenu',
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMegamenuData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMegamenuData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchMegamenuData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default megamenuSlice.reducer;
