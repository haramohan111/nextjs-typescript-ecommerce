import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { useRouter } from 'next/router';

import axios from 'axios';
import api, { apiUrl } from '@/utlis/api/api';
import { toast } from 'react-toastify';

// Define types for the state
interface User {
  _id?: string;
  email: string;
  password: string;
  // Add any other properties that a category object contains
}

interface AuthState {
  loading: boolean;
  users: User[];
  isAuthenticated: boolean;
  error: string | null;
}

// Async thunk for adding a new category
export const adminLogin = createAsyncThunk<User, User, { rejectValue: string }>(
  'users/adminLogin',
  async ({email, password}, { rejectWithValue }) => {
    try {
      //api.defaults.withCredentials = true;
      const response = await api.post('adminlogin', {email, password}, { withCredentials: true });
      console.log(response)
      if (typeof window !== 'undefined') {
      localStorage.setItem("accessToken", JSON.stringify(response.data.accessToken));
      localStorage.setItem("refreshToken", JSON.stringify(response.data.refreshToken));
      }

      //toast(response.data.message);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // If it's an axios error, use the error message or response message
        return rejectWithValue(error.response?.data?.message || 'Something went wrong');
      } else if (error instanceof Error) {
        // If it's a general error, just use the error message
        return rejectWithValue(error.message);
      }
      // For any unexpected error type, return a fallback message
      return rejectWithValue('An unknown error occurred');
    }
  }
);

export const verifyToken = createAsyncThunk<boolean, string | undefined>(
  'auth/verifyToken',
  async (token, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${apiUrl}/verify`, {
        token,
      });
      return response.data.valid;
    } catch (error) {
      return rejectWithValue('Token verification failed');
    }
  }
);

// Define the initial state
const initialState: AuthState = {
  loading: false,
  isAuthenticated: false,
  users: [],
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(adminLogin.pending, (state) => {
        state.loading = true;
      })
      .addCase(adminLogin.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.users.push(action.payload);  // Add the new category to the array
        state.error = null;
      })
      .addCase(adminLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(verifyToken.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyToken.fulfilled, (state, action: PayloadAction<boolean>) => {
        state.loading = false;
        state.isAuthenticated = action.payload;
      })
      .addCase(verifyToken.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default userSlice.reducer;
