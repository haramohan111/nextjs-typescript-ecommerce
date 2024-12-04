import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "@/utils/api/api";
import { RootState } from "../store"; // Import RootState
import axios from 'axios';

// Helper function to handle API errors
const handleApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || "Something went wrong";
  } else if (error instanceof Error) {
    return error.message;
  }
  return "An unknown error occurred";
}

// Define interfaces
interface OrderState {
  orders: any[]; // Replace `any` with your specific order data structure
  customers: any[]; // Replace `any` with your specific customer data structure
  status: 'idle' | 'loading' | 'success' | 'failed';
  error: string | null;
}

const initialState: OrderState = {
  orders: [],
  customers: [],
  status: 'idle',
  error: null,
};

// Thunk for creating an order
export const createOrder = createAsyncThunk(
  "order/createOrder",
  async (input: Record<string, any>, thunkAPI) => {
    try {
      const response = await api.post("createorder", input, {
        withCredentials: true,
      });
      return response.data.order; // Assuming `order` is returned in the response
    } catch (error: unknown) {
      return thunkAPI.rejectWithValue(handleApiError(error));
    }
  }
);

// Async thunk to fetch orders
export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('getclientorders',{withCredentials:true}); // Replace with your API endpoint
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error)); // Utilize the handleApiError function
    }
  }
);

// Thunk for managing customers
export const manageCustomer = createAsyncThunk(
  "order/manageCustomer",
  async (_, thunkAPI) => {
    try {
      const response = await api.get("customeraddress");
      return response.data; // Assuming the response contains the customer data directly
    } catch (error: unknown) {
      return thunkAPI.rejectWithValue(handleApiError(error));
    }
  }
);

// Slice for orders
const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Handle createOrder lifecycle
    builder
      .addCase(createOrder.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action: PayloadAction<any>) => {
        state.status = "success";
        state.orders.push(action.payload); // Add the created order to the state
      })
      .addCase(createOrder.rejected, (state, action: PayloadAction<any>) => {
        state.status = "failed";
        state.error = action.payload;
      });

    // Handle manageCustomer lifecycle
    builder
      .addCase(manageCustomer.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(manageCustomer.fulfilled, (state, action: PayloadAction<any[]>) => {
        state.status = "success";
        state.customers = action.payload; // Update customers with the fetched data
      })
      .addCase(manageCustomer.rejected, (state, action: PayloadAction<any>) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchOrders.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action: PayloadAction<OrderState[]>) => {
        state.status = 'success';
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action: PayloadAction<any>) => {
        state.status = 'failed';
        state.error = action.payload;
      })
  },
});

// Selector for accessing order state
export const selectOrderState = (state: RootState) => state.order;

// Export the reducer to include it in the store
export default orderSlice.reducer;
