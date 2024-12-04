import api from '@/utils/api/api';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../store';
// Types for product and cart items


interface CartItem {
  _id: string;
  product: string;
  name: string;
  image: string;
  price: number;
  countInStock: number;
  qty: number;
  quantity:number;

  product_id:{name:string,size:string,price:number,image: string; _id:string};
}

interface Cart {
  discountvalue:string;
  discountprice:string;
  coupon:string
  allCart: CartItem[];   // Array of CartItem objects
  totalPrice: number;     // Total price of items in cart
  desc:number;
}

interface CartState {
  cartItems: Cart;        // This should be a Cart object, not an array
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  couponData: any;
}

const initialState: CartState = {
  cartItems: {
    allCart: [], // This is an empty array for the cart items
    totalPrice: 0,
    discountvalue: '',
    discountprice: '',
    coupon: '',
    desc: 0
  },
  status: 'idle',       // Default status
  error: null,
  couponData: null,
};


// Handle API errors
const handleApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || 'Something went wrong';
  } else if (error instanceof Error) {
    return error.message;
  }
  return 'An unknown error occurred';
};

// Thunks for async actions
export const fetchCart = createAsyncThunk('cart/fetchCart', async () => {
  const { data } = await api.get('/cart', { withCredentials: true });
 
  return data;
});


export const updateCartUserId = createAsyncThunk(
  'cart/updateCartUserId',
  async (_, { rejectWithValue }) => {
    try {
      // POST request without explicit cartSessionId since it's in the cookie
      const { data } = await api.post('updatecartuserid', null, { withCredentials: true });
      return data; // Success response will be returned as the fulfilled payload
    } catch (error: any) {
      // Handle errors and return them via `rejectWithValue`
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const addToCart = createAsyncThunk<
  CartItem, // Return type (CartItem)
  { pid: string; qty: number; buttontype: string }, // Argument type
  { rejectValue: string }>( // Reject value type (error message)

  'cart/addToCart',
  async ({ pid, qty, buttontype }, { rejectWithValue }) => {
    try {
      // Make the API request
      const response = await api.post(`addtocart/${pid}/${qty}`,null,{ withCredentials: true });

      if (response.data) {
        const addedItem: CartItem = response.data; // Assuming the API response has a CartItem structure
        return addedItem; // Return the added item to the redux store
      } else {
        throw new Error('Failed to add item to cart');
      }
    } catch (error) {
      // Handle the error using your helper function
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const removeFromCart = createAsyncThunk('cart/removeFromCart', async (id: string) => {
  const { data } = await api.get(`/deletecart/${id}`, { withCredentials: true });
  return data;
});

export const removeFromHomeCart = createAsyncThunk('cart/removeFromHomeCart', async (id: string) => {
  const { data } = await api.get(`/deletecartbasedonproductid/${id}`, { withCredentials: true });
  return data;
});

export const applyCoupon = createAsyncThunk('cart/applyCoupon', async (id: string) => {
  const { data } = await api.get(`/coupon/${id}`);
  return data;
});

export const increaseQty = createAsyncThunk('cart/increaseQty', async (id: string) => {
  const { data } = await api.get(`/incqty/${id}`, { withCredentials: true });
  return data;
});

export const decreaseQty = createAsyncThunk('cart/decreaseQty', async (id: string) => {
  const { data } = await api.get(`/descqty/${id}`, { withCredentials: true });
  return data;
});

// Create slice
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    saveShippingAddress: (state, action: PayloadAction<any>) => {
      localStorage.setItem('shippingaddress', JSON.stringify(action.payload));
    },
    removeCartItemBeforeLogin: (state, action: PayloadAction<string>) => {
     // state.cartItems = state.cartItems.filter(item => item.product !== action.payload);
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch cart
      .addCase(fetchCart.pending, (state) => {
        state.status = 'loading';  // Set status to 'loading' when fetching starts
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.status = 'succeeded';  // Set status to 'succeeded' when the fetch is successful
     
        state.cartItems = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.status = 'failed';  // Set status to 'failed' if there is an error
        state.error = handleApiError(action.error);
      })
      // Add to cart
      .addCase(addToCart.pending, (state) => {
        state.status = 'loading';  // Set status to 'loading' when adding to cart
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.status = 'succeeded';  // Set status to 'succeeded' after adding to cart
      
        const addedItem = action.payload;  // This is the single CartItem added to the cart
      
        // Find if the item already exists in the cart (based on product ID)
        const existingItemIndex = state.cartItems.allCart.findIndex(item => item._id === addedItem._id);
      
        if (existingItemIndex >= 0) {
          // If the item exists, update its quantity
          state.cartItems.allCart[existingItemIndex].qty += addedItem.qty;
        } else {
          // If the item does not exist, add it to the cart
          state.cartItems.allCart.push(addedItem);
        }
      
        // Recalculate the total price
        state.cartItems.totalPrice = state.cartItems.allCart.reduce((total, item) => total + item.price * item.qty, 0);
      })      
      
      .addCase(addToCart.rejected, (state, action) => {
        state.status = 'failed';  // Set status to 'failed' if there is an error
        state.error = handleApiError(action.error);
      })
      // Remove from cart
      .addCase(removeFromCart.pending, (state) => {
        state.status = 'loading';  // Set status to 'loading' when removing an item
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.status = 'succeeded';  // Set status to 'succeeded' after removing item
        state.cartItems = action.payload;
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.status = 'failed';  // Set status to 'failed' if there is an error
        state.error = handleApiError(action.error);
      })
      // Apply coupon
      .addCase(applyCoupon.pending, (state) => {
        state.status = 'loading';  // Set status to 'loading' when applying a coupon
      })
      .addCase(applyCoupon.fulfilled, (state, action) => {
        state.status = 'succeeded';  // Set status to 'succeeded' after applying coupon
        state.couponData = action.payload;
      })
      .addCase(applyCoupon.rejected, (state, action) => {
        state.status = 'failed';  // Set status to 'failed' if there is an error
        state.error = handleApiError(action.error);
      })
      // Increase quantity
      .addCase(increaseQty.pending, (state) => {
        state.status = 'loading';  // Set status to 'loading' when increasing quantity
      })
      .addCase(increaseQty.fulfilled, (state, action) => {
        state.status = 'succeeded';  // Set status to 'succeeded' after increasing quantity
        state.cartItems = action.payload;
      })
      .addCase(increaseQty.rejected, (state, action) => {
        state.status = 'failed';  // Set status to 'failed' if there is an error
        state.error = handleApiError(action.error);
      })
      // Decrease quantity
      .addCase(decreaseQty.pending, (state) => {
        state.status = 'loading';  // Set status to 'loading' when decreasing quantity
      })
      .addCase(decreaseQty.fulfilled, (state, action) => {
        state.status = 'succeeded';  // Set status to 'succeeded' after decreasing quantity
        state.cartItems = action.payload;
      })
      .addCase(decreaseQty.rejected, (state, action) => {
        state.status = 'failed';  // Set status to 'failed' if there is an error
        state.error = handleApiError(action.error);
      })
      .addCase(updateCartUserId.pending, (state) => {
        state.status = 'loading'; // Set status when the request starts
      })
      .addCase(updateCartUserId.fulfilled, (state, action) => {
        state.status = 'succeeded'; // Set status on success
        //state.cartItems = action.payload; // Replace cart items with fetched data
      })
      .addCase(updateCartUserId.rejected, (state, action) => {
        state.status = 'failed'; // Set status on error
        state.error = handleApiError(action.error);; // Save the error message
      })
      .addCase(removeFromHomeCart.pending, (state) => {
        state.status = 'loading';  // Set status to 'loading' when removing an item
      })
      .addCase(removeFromHomeCart.fulfilled, (state, action) => {
        state.status = 'succeeded';  // Set status to 'succeeded' after removing item
        state.cartItems = action.payload;
      })
      .addCase(removeFromHomeCart.rejected, (state, action) => {
        state.status = 'failed';  // Set status to 'failed' if there is an error
        state.error = handleApiError(action.error);
      })
  }
});

// Export actions
export const { saveShippingAddress, removeCartItemBeforeLogin } = cartSlice.actions;
//export const selectCart = (state: RootState) => state.cart;
// Export reducer
export default cartSlice.reducer;
