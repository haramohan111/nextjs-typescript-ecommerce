import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../store';
import api from '@/utils/api/api';
import axios from 'axios';

// Define the interface for a ProductForMen item
export interface ProductForMen {
  _id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string; // To ensure products are for men
}

// Define the initial state
interface ProductsForMenState {
  productsForMen: ProductForMen[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: ProductsForMenState = {
  productsForMen: [],
  status: 'idle',
  error: null,
};

// Helper function to handle API errors
const handleApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || 'Something went wrong';
  } else if (error instanceof Error) {
    return error.message;
  }
  return 'An unknown error occurred';
};

// Async thunk to fetch products for men
export const fetchProductsForMen = createAsyncThunk<ProductForMen[], void, { rejectValue: string }>(
  'productsForMen/fetchProductsForMen',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/manageproductformen'); // Adjust API endpoint as needed
      if (response.data) {
        return response.data; // Extract 'productsForMen' from the response
      } else {
        throw new Error(response.data.message || 'Failed to fetch products for men');
      }
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

// Create the slice
const productsForMenSlice = createSlice({
  name: 'productsForMen',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductsForMen.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchProductsForMen.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.productsForMen = action.payload; // Set the productsForMen array
      })
      .addCase(fetchProductsForMen.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to fetch products for men';
      });
  },
});

// Selector for accessing products for men state
export const selectProductsForMen = (state: RootState) => state.productsForMen;

// Export the reducer to include it in the store
export default productsForMenSlice.reducer;
