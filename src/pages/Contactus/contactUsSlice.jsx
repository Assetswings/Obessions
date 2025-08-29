import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../app/api";

// 🔹 Thunk to submit contact form
export const submitContactForm = createAsyncThunk(
  "contact/submitContactForm",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await API.post("/forms/contact-process", formData);

      // If API success = false, reject
      if (!response.data.success) {
        return rejectWithValue(response.data.msg || "Submission failed");
      }

      return response.data; // { success: true, status: 201, message: "Successful" }
    } catch (err) {
      return rejectWithValue(err.response?.data?.msg || err.message);
    }
  }
);

// 🔹 Thunk to fetch contact details
export const fetchContactDetails = createAsyncThunk(
  "contact/fetchContactDetails",
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get("/forms/contact-us");
      console.log('responce of data---->',response);
      return response?.data; 
    } catch (err) {
      return rejectWithValue(err.response?.data?.msg || err.message);
    }
  }
  );

const contactSlice = createSlice({
  name: "contact",
  initialState: {
    details: [],
    loading: false,
    error: null,
    message: "",
  
  },
  reducers: {
    resetContactState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    // Submit form
    builder
      .addCase(submitContactForm.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.message = "";
      })
      .addCase(submitContactForm.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message || "Submitted successfully";
      })
      .addCase(submitContactForm.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload || action.error.message;
      });

    // Fetch contact details
    builder
      .addCase(fetchContactDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContactDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.details = action.payload;
      })
      .addCase(fetchContactDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export const { resetContactState } = contactSlice.actions;
export default contactSlice.reducer;
