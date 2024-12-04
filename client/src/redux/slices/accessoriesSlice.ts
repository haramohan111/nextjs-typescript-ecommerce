import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../store';
import api from '@/utils/api/api';

// Define interfaces for the data structure
interface Accessory {
  _id: string;
  name: string;
  price: number;
  image: string;
}

interface AccessoriesState {
  kids: Accessory[];
  beauty: Accessory[];
  watches: Accessory[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

// Initial state
const initialState: AccessoriesState = {
  kids: [],
  beauty: [],
  watches: [],
  status: 'idle',
  error: null,
};

// Async thunks for fetching data
export const fetchKidsAccessories = createAsyncThunk(
  'accessories/fetchKidsAccessories',
  async () => {
    const response = await api.get('manageproductsforkids');
    return response.data;
  }
);

export const fetchBeautyAccessories = createAsyncThunk(
  'accessories/fetchBeautyAccessories',
  async () => {
    const response = await api.get('manageproductsforbeauty');
    return response.data;
  }
);

export const fetchWatchesAccessories = createAsyncThunk(
  'accessories/fetchWatchesAccessories',
  async () => {
    const response = await api.get('manageproductsforwatch');
    return response.data;
  }
);

// Create the slice
const accessoriesSlice = createSlice({
  name: 'accessories',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Kids Accessories
      .addCase(fetchKidsAccessories.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchKidsAccessories.fulfilled, (state, action: PayloadAction<Accessory[]>) => {
        state.status = 'succeeded';
        state.kids = action.payload;
      })
      .addCase(fetchKidsAccessories.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch kids accessories.';
      })

      // Beauty Accessories
      .addCase(fetchBeautyAccessories.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchBeautyAccessories.fulfilled, (state, action: PayloadAction<Accessory[]>) => {
        state.status = 'succeeded';
        state.beauty = action.payload;
      })
      .addCase(fetchBeautyAccessories.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch beauty accessories.';
      })

      // Watches Accessories
      .addCase(fetchWatchesAccessories.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchWatchesAccessories.fulfilled, (state, action: PayloadAction<Accessory[]>) => {
        state.status = 'succeeded';
        state.watches = action.payload;
      })
      .addCase(fetchWatchesAccessories.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch watches accessories.';
      });
  },
});

// Export actions and reducer
export const selectAccessories = (state: RootState) => state.accessories;
export default accessoriesSlice.reducer;
