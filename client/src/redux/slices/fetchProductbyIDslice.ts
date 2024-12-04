import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../store';
import api from '@/utils/api/api';
import axios from 'axios';

// Define the interface for a single product
export interface Product {
  _id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
}

// Define the initial state
interface ProductState {
  product: Product | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: ProductState = {
  product: null,
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

// Async thunk to fetch product by ID
export const fetchProductById = createAsyncThunk<Product, string, { rejectValue: string }>(
  'product/fetchProductById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/productbyid/${id}`); // Adjust API endpoint as needed
      if (response.data) {
        return response.data; // Return the fetched product data
      } else {
        throw new Error('Failed to fetch product');
      }
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

// Create the slice
const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductById.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.product = action.payload; // Set the fetched product data
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to fetch product';
      });
  },
});

// Selector for accessing the product state
export const selectProduct = (state: RootState) => state.product;

// Export the reducer to include it in the store
export default productSlice.reducer;
