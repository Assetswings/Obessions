// src/pages/faq/faqSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../app/api";


export const fetchFaqs = createAsyncThunk(
  "faq/fetchFaqs",
  async (query = "", { rejectWithValue }) => {
    try {
      const response = await API.get("/pages/faqs", {
        params: query ? { q: query } : {}, 
      });

      if (!response.data.success) {
        return rejectWithValue(response.data.message || "Failed to fetch FAQs");
      }

      return response.data.data; 
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const faqSlice = createSlice({
  name: "faq",
  initialState: {
    faqs: [],      
    loading: false,
    error: null,
  },
  reducers: {
    resetFaqState: (state) => {
      state.faqs = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFaqs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFaqs.fulfilled, (state, action) => {
        state.loading = false;
        state.faqs = action.payload;
      })
      .addCase(fetchFaqs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

export const { resetFaqState } = faqSlice.actions;
export default faqSlice.reducer;
