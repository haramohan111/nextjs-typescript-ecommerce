import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../store';
import api from '@/utils/api/api';
import axios from 'axios';


export interface ListSubcategory {
  _id: string;
  name: string;
}

export interface Subcategory {
  _id: any;
  name: string;
  listsubcategories?: ListSubcategory[];
}

// Define the interface for a Category item
export interface Category {
  id: string;
  name: string;
  link: string;
  status: string;
  subcategories?: Subcategory[];
}

// Define the initial state
interface TopMenuState {
  category: Category[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: TopMenuState = {
  category: [],
  status: 'idle',
  error: null,
};

// Helper function to handle API errors
const handleApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    // Axios-specific error handling
    return error.response?.data?.message || 'Something went wrong';
  } else if (error instanceof Error) {
    // General error handling
    return error.message;
  }
  return 'An unknown error occurred'; // Fallback for unexpected error types
};

// Async thunk to fetch the top menu
export const fetchTopMenu = createAsyncThunk<Category[], void, { rejectValue: string }>(
  'topMenu/fetchTopMenu',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/managefrontcategory');
      if (response.data.success) {
        return response.data.category; // Extract 'category' from the response
      } else {
        throw new Error(response.data.message || 'Failed to fetch top menu');
      }
    } catch (error) {
      return rejectWithValue(handleApiError(error)); // Use handleApiError for error handling
    }
  }
);

// Create the slice
const topMenuSlice = createSlice({
  name: 'topMenu',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTopMenu.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchTopMenu.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.category = action.payload; // Set the category array
      })
      .addCase(fetchTopMenu.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to fetch top menu';
      });
  },
});

// Selector for accessing top menu state
export const selectTopMenu = (state: RootState) => state.topMenu;

// Export the reducer to include it in the store
export default topMenuSlice.reducer;
