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
  sizes: Category[];
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
export const addSize = createAsyncThunk<Category, Category, { rejectValue: string }>(
  'size/addSize',
  async (categoryData, { rejectWithValue }) => {
    try {
      const response = await api.post('addsize', categoryData);
      toast(response.data.message);
      return response.data;
    } catch (error) {
      return rejectWithValue(handleError(error));  // Using handleError for consistent error handling
    }
  }
);

export const fetchSize = createAsyncThunk<Category[], FetchCategoryParams, { rejectValue: string }>(
  'fetchSize',
  async ({ customPage, limit, search }, { rejectWithValue }) => {
    try {
      const response = await api.get(`sizepagination?page=${customPage}&limit=${limit}&search=${search}`);
      return response.data.results;  // Assuming the response contains an array of categories
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);

// Define the initial state
const initialState: CategoryState = {
  status: 'idle',
  sizes: [],
  error: null,

};

const sizeSlice = createSlice({
  name: 'size',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addSize.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addSize.fulfilled, (state, action: PayloadAction<Category>) => {
        state.status = 'succeeded';
        state.sizes.push(action.payload);  // Add the new category to the array
        state.error = null;
      })
      .addCase(addSize.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(fetchSize.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchSize.fulfilled, (state, action: PayloadAction<Category[]>) => {
        state.status ='succeeded';
        state.sizes = action.payload;
        state.error = null;
      })
      .addCase(fetchSize.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch categories';
      })

  },
});

export default sizeSlice.reducer;
