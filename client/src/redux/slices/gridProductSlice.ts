import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '@/utils/api/api';  // Adjust the import based on your API utility (axios/fetch)

// Define Product interface
interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
}

// Define the GridProductState interface
interface GridProductState {
  products: Product[];  // Array of products for the grid view
  loading: boolean;      // Loading state for API requests
  error: string | null;  // Error message (if any)
}

const initialState: GridProductState = {
  products: [],
  loading: false,
  error: null,
};

// Async thunk to fetch grid products
export const fetchGridListProducts = createAsyncThunk<Product[], string>(
    'gridProduct/fetchGridListProducts',
    async (query, { rejectWithValue }) => {
      try {
        // Make API call with the query parameter (e.g., 'name' for searching products)
        const response = await api.get(`/gridlistproducts?name=${query}`);  // Pass query in URL
        if (response.status !== 200) {
          throw new Error('Failed to fetch products');
        }
        return response.data;  // Assuming the products are in the `data` field of the response
      } catch (error: any) {
        return rejectWithValue(error.message || 'Error fetching products');
      }
    }
  );

// Create the slice
const gridProductSlice = createSlice({
  name: 'gridProduct',
  initialState,
  reducers: {
    clearGridProducts: (state) => {
      state.products = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGridListProducts.pending, (state) => {  // Updated to reflect the new thunk
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGridListProducts.fulfilled, (state, action: PayloadAction<Product[]>) => {  // Updated
        state.loading = false;
        state.products = action.payload;  // Populate the products array
      })
      .addCase(fetchGridListProducts.rejected, (state, action) => {  // Updated
        state.loading = false;
        state.error = action.payload as string;  // Handle errors
      });
  },
});

export const { clearGridProducts } = gridProductSlice.actions;

export default gridProductSlice.reducer;
