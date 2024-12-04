import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../store';
import api from '@/utils/api/api';
import axios from 'axios';

// Define the interface for a Favorite item

interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
  image: string;  
}

export interface Favorite {
  _id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  product: Product;
}

// Define the initial state
interface TodaysFavoriteState {
  favorites: Favorite[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: TodaysFavoriteState = {
  favorites: [],
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

// Async thunk to fetch today's favorites
export const fetchTodaysFavorite = createAsyncThunk<Favorite[], void, { rejectValue: string }>(
  'todaysFavorite/fetchTodaysFavorite',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/todayfav');
      if (response.data) {
        return response.data; // Extract 'favorites' from the response
      } else {
        throw new Error(response.data.message || 'Failed to fetch favorites');
      }
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

// Create the slice
const todaysFavoriteSlice = createSlice({
  name: 'todaysFavorite',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodaysFavorite.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchTodaysFavorite.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.favorites = action.payload; // Set the favorites array
      })
      .addCase(fetchTodaysFavorite.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to fetch favorites';
      });
  },
});

// Selector for accessing today's favorite state
export const selectTodaysFavorite = (state: RootState) => state.todaysFavorite;

// Export the reducer to include it in the store
export default todaysFavoriteSlice.reducer;
