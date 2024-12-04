// redux/slices/wishlistSlice.ts
import api from '@/utils/api/api';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../store';



interface wishlistItem {
success:boolean;
message:string;
wishlist:string[];
productId:string;
}

interface WishlistState {
  items: wishlistItem[]; // Store product IDs in the wishlist
  status: 'idle' | 'loading' | 'succeeded' | 'failed'; // Track loading state
  error: string | null;
  wish:wishlistItem[];
}

const initialState: WishlistState = {
  items: [],
  wish:[],
  status: 'idle',
  error: null,
};

const handleApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || 'Something went wrong';
  } else if (error instanceof Error) {
    return error.message;
  }
  return 'An unknown error occurred';
};

// Async Thunk for fetching wishlist
export const fetchWishlist = createAsyncThunk(
  'wishlist/fetchWishlist',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('fetchwishlist', {
        withCredentials: true, // Include cookies
      });
      return response.data; // Expect an array of product IDs
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

// Async Thunk for adding to wishlist
export const addToWishlist = createAsyncThunk(
  'wishlist/addToWishlist',
  async (productId: string, { rejectWithValue }) => {
    try {
      const response = await api.post('addwishlist', { productId }, {
        withCredentials: true, // Include cookies
      });
      return productId; // Return the product ID for success
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

// Async Thunk for removing from wishlist
export const removeFromWishlist = createAsyncThunk(
  'wishlist/removeFromWishlist',
  async (productId: string, { rejectWithValue }) => {
    try {
      const response = await api.post('removewishlist', { productId }, {
        withCredentials: true, // Include cookies
      });
      return productId;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch wishlist
      .addCase(fetchWishlist.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchWishlist.fulfilled, (state, action: PayloadAction<{wishlist: wishlistItem[]}>) => {
        state.status = 'succeeded';
    
        state.wish=action.payload.wishlist; // Populate items with fetched data
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      // Add to wishlist
      .addCase(addToWishlist.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addToWishlist.fulfilled, (state, action: PayloadAction<string>) => {
        state.status = 'succeeded';
      
        const productId = action.payload;
      
        // Check if the item is already in the wishlist
        const isItemInWishlist = state.items.some(item => item.productId === productId);
      
        if (!isItemInWishlist) {
          // Add the product to the wishlist (create a new wishlistItem)
          state.items.push({
            productId,
            success: true,
            message: 'Product added to wishlist',
            wishlist: [], // You can customize this field as needed
          });
        }
      })
      .addCase(addToWishlist.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      // Remove from wishlist
      .addCase(removeFromWishlist.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(removeFromWishlist.fulfilled, (state, action: PayloadAction<string>) => {
        state.status = 'succeeded';
        state.items = state.items.filter((item) => item.productId !== action.payload); ; // Remove product ID from wishlist
      })
      .addCase(removeFromWishlist.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

// Selectors
export const selectWishlistItems = (state: RootState) => state.wishlist;
// export const isInWishlist = (state: RootState, productId: string): boolean => {
//   return state.wishlist.items.includes(productId);
// };

export default wishlistSlice.reducer;
