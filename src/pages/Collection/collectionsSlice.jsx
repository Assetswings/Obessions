import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../app/api"; // make sure your API instance has baseURL & headers

// 🔹 Thunk to fetch all collections
export const fetchCollections = createAsyncThunk(
  "collections/fetchCollections",
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get("/collections"); // GET /collections
      console.log("---------> collections response", response);
      return response.data?.data; // your API returns { success, status, message, data }
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const collectionsSlice = createSlice({
  name: "collections",
  initialState: {
    items: [],       // collections array
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCollections.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCollections.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchCollections.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export default collectionsSlice.reducer;
