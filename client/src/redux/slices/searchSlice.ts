import api from '@/utils/api/api';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
}

interface SearchState {
  query: string;
  results: Product[];
  loading: boolean;
  error: string | null;
}

const initialState: SearchState = {
  query: '',
  results: [],
  loading: false,
  error: null,
};

// Async thunk to fetch search results
export const fetchSearchResults = createAsyncThunk<Product[], string>(
    "search/fetchSearchResults",
    async (query, { rejectWithValue }) => {
      try {
        const response = await api.get(`/homesearch?name=${query}`);
        if (response.status !== 200) {
          throw new Error("Failed to fetch search results");
        }
  
        // Return the products array
        return response.data; 
      } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || error.message);
      }
    }
  );

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setQuery: (state, action: PayloadAction<string>) => {
      state.query = action.payload;
    },
    clearSearch: (state) => {
      state.query = '';
      state.results = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSearchResults.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSearchResults.fulfilled, (state, action) => {
        state.loading = false;
        state.results = action.payload;
      })
      .addCase(fetchSearchResults.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setQuery, clearSearch } = searchSlice.actions;

export default searchSlice.reducer;
