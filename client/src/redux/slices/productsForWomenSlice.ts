import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../store';
import api from '@/utils/api/api';
import axios from 'axios';

// Define the interface for a ProductForWomen item
export interface ProductForWomen {
  _id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string; // To ensure products are for women
}

// Define the initial state
interface ProductsForWomenState {
  productsForWomen: ProductForWomen[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: ProductsForWomenState = {
  productsForWomen: [],
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

// Async thunk to fetch products for women
export const fetchProductsForWomen = createAsyncThunk<ProductForWomen[], void, { rejectValue: string }>(
  'productsForWomen/fetchProductsForWomen',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/manageproductforwomenmen'); // Adjust API endpoint as needed
      if (response.data) {
        return response.data; // Extract 'productsForWomen' from the response
      } else {
        throw new Error(response.data.message || 'Failed to fetch products for women');
      }
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

// Create the slice
const productsForWomenSlice = createSlice({
  name: 'productsForWomen',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductsForWomen.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchProductsForWomen.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.productsForWomen = action.payload; // Set the productsForWomen array
      })
      .addCase(fetchProductsForWomen.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to fetch products for women';
      });
  },
});

// Selector for accessing products for women state
export const selectProductsForWomen = (state: RootState) => state.productsForWomen;

// Export the reducer to include it in the store
export default productsForWomenSlice.reducer;
