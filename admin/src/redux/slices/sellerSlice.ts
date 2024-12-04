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
  sellers: Category[];
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
export const addSeller = createAsyncThunk<Category, Category, { rejectValue: string }>(
  'seller/addSeller',
  async (Data, { rejectWithValue }) => {
    try {
      const response = await api.post('addseller', Data);
      toast(response.data.message);
      return response.data;
    } catch (error) {
      return rejectWithValue(handleError(error));  // Using handleError for consistent error handling
    }
  }
);

export const fetchSeller = createAsyncThunk<Category[], FetchCategoryParams, { rejectValue: string }>(
    'fetchSeller',
    async ({ customPage, limit, search }, { rejectWithValue }) => {
      try {
        const response = await api.get(`sellerpagination?page=${customPage}&limit=${limit}&search=${search}`);
        return response.data.results;  // Assuming the response contains an array of categories
      } catch (error) {
        return rejectWithValue(handleError(error));
      }
    }
  );

// Define the initial state
const initialState: CategoryState = {
  status: 'idle',
  sellers: [],
  error: null,

};

const sellerSlice = createSlice({
  name: 'seller',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addSeller.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addSeller.fulfilled, (state, action: PayloadAction<Category>) => {
        state.status = 'succeeded';
        state.sellers.push(action.payload);  // Add the new category to the array
        state.error = null;
      })
      .addCase(addSeller.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(fetchSeller.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchSeller.fulfilled, (state, action: PayloadAction<Category[]>) => {
        state.status ='succeeded';
        state.sellers = action.payload;
        state.error = null;
      })
      .addCase(fetchSeller.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch categories';
      })
  },
});

export default sellerSlice.reducer;
