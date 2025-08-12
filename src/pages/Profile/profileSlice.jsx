import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../app/api';

// 👉 GET profile
export const fetchUserProfile = createAsyncThunk(
  'profile/fetchUserProfile',
  async (_, { rejectWithValue }) => {
    try {
      const res = await API.get('/account/profile');
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// 👉 EDIT profile
export const updateUserProfile = createAsyncThunk(
  'profile/updateUserProfile',
  async ({ id, data }, { rejectWithValue }) => {
    data['user_first_name'] = data.first_name;
    data['user_last_name'] = data.last_name;
    console.log('====================================');
    console.log('slice form data', data);
    console.log('====================================');
    try {
      const res = await API.put(`/account/profile/${id}/edit`, data);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const profileSlice = createSlice({
  name: 'profile',
  initialState: {
    data: null,
    loading: false,
    updating: false,
    error: null,
    success: null,
  },
  reducers: {
    clearProfileMessages(state) {
      state.error = null;
      state.success = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // GET
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // PUT
      .addCase(updateUserProfile.pending, (state) => {
        state.updating = true;
        state.error = null;
        state.success = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.updating = false;
        state.data = action.payload;
        state.success = 'Profile updated successfully';
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload;
      });
  },
});

export const { clearProfileMessages } = profileSlice.actions;
export default profileSlice.reducer;
