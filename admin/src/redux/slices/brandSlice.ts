import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import api from '@/utlis/api/api';
import { toast } from 'react-toastify';

// Define types for the state
interface Category {
  _id: string;
  name: string;
  // Add any other properties that a category object contains
}

interface CategoryState {
  status: string;
  brands: Category[];
  error: string | null;
}


interface FetchCategoryParams {
    customPage: string | number | null;
    limit: number;
    search: string;
  }

const handleError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    // Axios-specific error handling
    return error.response?.data?.message || 'Something went wrong';
  } else if (error instanceof Error) {
    // General error handling
    return error.message;
  }
  return 'An unknown error occurred'; // Fallback for unexpected error types
};


// Async thunk for adding a new category
export const addBrand = createAsyncThunk<Category, Category, { rejectValue: string }>(
  'brand/addBrand',
  async (categoryData, { rejectWithValue }) => {
    try {
      const response = await api.post('addbrand', categoryData);
      toast(response.data.message);
      return response.data;
    } catch (error) {
      return rejectWithValue(handleError(error));  // Using handleError for consistent error handling
    }
  }
);

export const fetchBrand = createAsyncThunk<Category[], FetchCategoryParams, { rejectValue: string }>(
    'fetchBrand',
    async ({ customPage, limit, search }, { rejectWithValue }) => {
      try {
        const response = await api.get(`brandpagination?page=${customPage}&limit=${limit}&search=${search}`);
        return response.data.results;  // Assuming the response contains an array of categories
      } catch (error) {
        return rejectWithValue(handleError(error));
      }
    }
  );

// Define the initial state
const initialState: CategoryState = {
  status: 'idle',
  brands: [],
  error: null,

};

const brandSlice = createSlice({
  name: 'brand',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addBrand.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addBrand.fulfilled, (state, action: PayloadAction<Category>) => {
        state.status = 'succeeded';
        state.brands.push(action.payload);  // Add the new category to the array
        state.error = null;
      })
      .addCase(addBrand.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(fetchBrand.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchBrand.fulfilled, (state, action: PayloadAction<Category[]>) => {
        state.status ='succeeded';
        state.brands = action.payload;
        state.error = null;
      })
      .addCase(fetchBrand.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch categories';
      })
  },
});

export default brandSlice.reducer;
