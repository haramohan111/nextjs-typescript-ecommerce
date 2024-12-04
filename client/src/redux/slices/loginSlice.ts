import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../store'; // Import RootState
import api from '@/utils/api/api';
import { deleteCookie } from 'cookies-next';

// Helper function to handle API errors
const handleApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || 'Something went wrong';
  } else if (error instanceof Error) {
    return error.message;
  }
  return 'An unknown error occurred';
};

// Define LoginState
interface LoginState {
  user: { id: string; name: string; email: string,success:boolean } | null;
  status: 'idle' | 'loading' | 'success' | 'failed';
  verifiedstatus: 'idle' | 'loading' | 'success' | 'failed';
  error: string | null;
  verifiederror: string | null;
}

// Initial state
const initialState: LoginState = {
  user: null,
  status: 'idle',
  error: null,
  verifiederror:null,
  verifiedstatus: 'idle',
};

// Async thunk for login
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials: { email: string; password: string }, thunkAPI) => {
    try {
      const response = await api.post('userlogin', credentials,     {
        withCredentials: true, // This ensures cookies are included in the request
      });
      return response.data; // Return user data
    } catch (error: unknown) {
      return thunkAPI.rejectWithValue(handleApiError(error));
    }
  }
);

// Async thunk for user verification
export const userVerifyID = createAsyncThunk(
  'auth/userVerifyID',
  async (_, thunkAPI) => {
    try {
      // Make a GET or POST request to your user verification API endpoint
      const response = await api.post(
        'userverifyid',
        null, // No request body required for this endpoint
        {
          withCredentials: true, // Ensure cookies are sent
        }
      );
      return response.data; // Return verified user data
    } catch (error: unknown) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      deleteCookie('ucid', { path: '/' });
      return thunkAPI.rejectWithValue(handleApiError(error));
    }
  }
);

// Async thunk for logout
export const userLogout = createAsyncThunk(
  'auth/userLogout',
  async (_, thunkAPI) => {
    try {
      const response = await api.post(
        'userlogout',
        null,
        {
          withCredentials: true, // Ensure cookies are included
        }
      );

      const data = response.data;

      if (data.success === false) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      }

      return data; // Return the response
    } catch (error: unknown) {
      return thunkAPI.rejectWithValue(handleApiError(error));
    }
  }
);

// Slice for login
const loginSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<LoginState['user']>) => {
        state.status = 'success';
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action: PayloadAction<any>) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(userVerifyID.pending, (state) => {
        state.verifiedstatus = 'loading';
        state.error = null;
      })
      .addCase(userVerifyID.fulfilled, (state, action: PayloadAction<LoginState['user']>) => {
        state.verifiedstatus = 'success';
        state.user = action.payload;
      })
      .addCase(userVerifyID.rejected, (state, action: PayloadAction<any>) => {
        state.verifiedstatus = 'failed';
        state.verifiederror = action.payload;
        state.user = null; // Clear user data if verification fails
      })
      .addCase(userLogout.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(userLogout.fulfilled, (state) => {
        state.status = 'success';
        state.user = null; // Clear user data on logout
      })
      .addCase(userLogout.rejected, (state, action: PayloadAction<any>) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

// Selector using RootState
export const selectAuthState = (state: RootState) => state.auth;

export const { logout } = loginSlice.actions;
export default loginSlice.reducer;
