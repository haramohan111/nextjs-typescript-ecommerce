import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../store';
import api from '@/utils/api/api';
import axios from 'axios';

// Define the interface for a Deal item

interface Product {
    _id: string;
    name: string;
    price: number;
    description: string;
    image: string;  
  }

export interface Deal {
  _id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  product:Product
}

// Define the initial state
interface DealOfTheDayState {
  deals: Deal[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: DealOfTheDayState = {
  deals: [],
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

// Async thunk to fetch deals
export const fetchDealOfTheDay = createAsyncThunk<Deal[], void, { rejectValue: string }>(
  'dealOfTheDay/fetchDealOfTheDay',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/dealoftheday');
      if (response.data) {
        return response.data; // Extract 'deals' from the response
      } else {
        throw new Error(response.data.message || 'Failed to fetch deals');
      }
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

// Create the slice
const dealOfTheDaySlice = createSlice({
  name: 'dealOfTheDay',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDealOfTheDay.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchDealOfTheDay.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.deals = action.payload; // Set the deals array
      })
      .addCase(fetchDealOfTheDay.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to fetch deals';
      });
  },
});

// Selector for accessing deal of the day state
export const selectDealOfTheDay = (state: RootState) => state.dealOfTheDay;

// Export the reducer to include it in the store
export default dealOfTheDaySlice.reducer;
