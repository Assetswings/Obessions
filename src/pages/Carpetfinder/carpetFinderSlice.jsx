import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../app/api";

// Thunk 1: Fetch initial Carpet Finder setup (steps, options, etc.)
export const fetchCarpetFinder = createAsyncThunk(
  "carpetFinder/fetchCarpetFinder",
  async (filters = [], { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();

      filters.forEach((filter) => {
        const [key, value] = Object.entries(filter)[0];

        if (Array.isArray(value)) {
          // multiple values → comma separated
          params.append(key, value.join(","));
        } else {
          params.append(key, value);
        }
      });

      const response = await API.get(
        `/carpet-finder?${params.toString()}`
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || error.message
      );
    }
  }
);

// Thunk 2: Fetch filtered carpet results (floor-covering with query params)
// export const filterCarpet = createAsyncThunk(
//   "carpetFinder/filterCarpet",
//   async (filters = [], { rejectWithValue }) => {
//     try {
//       const params = new URLSearchParams();

//       filters.forEach((filter) => {
//         const [key, value] = Object.entries(filter)[0];

//         if (Array.isArray(value)) {
//           // multiple values → comma separated
//           params.append(key, value.join(","));
//         } else {
//           params.append(key, value);
//         }
//       });

//       const response = await API.get(
//         `/carpet-finder/items?${params.toString()}`
//       );
//       console.log('finder result ????',response.data);

//       return response.data?.data;
//     } catch (error) {
//       return rejectWithValue(
//         error.response?.data || error.message
//       );
//     }
//   }
// );

export const filterCarpet = createAsyncThunk(
  "carpetFinder/filterCarpet",
  async (
    {
      selectedFilter = [], // array of objects
      filters = {},        // object
      page = 1,
      limit = 40,
    },
    { rejectWithValue }
  ) => {
    try {
      const params = new URLSearchParams({
        page,
        limit,
      });
      
      // ✅ Step-based filters (array)
      selectedFilter.forEach((filter) => {
        const [key, value] = Object.entries(filter)[0];

        if (Array.isArray(value) && value.length > 0) {
          params.append(key, value.join(","));
        } else if (value) {
          params.append(key, value);
        }
      });

      // ✅ Extra filters (object)
      Object.entries(filters).forEach(([key, value]) => {
        if (Array.isArray(value) && value.length > 0) {
          params.append(key, value.join(","));
        } else if (value !== null && value !== undefined && value !== "") {
          params.append(key, value);
        }
      });

      const response = await API.get(
        `/carpet-finder/items?${params.toString()}`
      );

      return response.data?.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || error.message
      );
    }
  }
);

const carpetFinderSlice = createSlice({
  name: "carpetFinder",
  initialState: {
    data: null,
    filteredData: null,
    filters: {},
    sorting: {},
    pagination: {},
    loading: false,
    filterLoading: false,
    error: null,
    filterError: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    // fetchCarpetFinder cases
    builder
      .addCase(fetchCarpetFinder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCarpetFinder.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchCarpetFinder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // filterCarpet cases
    builder
      .addCase(filterCarpet.pending, (state) => {
        state.loading = true;
        state.filterError = null;
      })
      .addCase(filterCarpet.fulfilled, (state, action) => {
        state.loading = false;
        state.filteredData = action.payload.products;
        state.pagination = {
          total: action.payload.total,
          current_page: action.payload.current_page,
          limit: action.payload.limit,
        };
        state.filters = action.payload.filters || {};
        state.sorting = action.payload.sorting.sort_by || {};
      })
      .addCase(filterCarpet.rejected, (state, action) => {
        state.loading = false;
        state.filterError = action.payload;
      });
  },
});

export default carpetFinderSlice.reducer;
