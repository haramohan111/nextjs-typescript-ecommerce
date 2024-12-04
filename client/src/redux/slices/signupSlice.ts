import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../store';
import api from '@/utils/api/api';

// Helper function to handle API errors
const handleApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || 'Something went wrong';
  } else if (error instanceof Error) {
    return error.message;
  }
  return 'An unknown error occurred';
}

// Define SignupState
interface SignupState {
  user: { id: string; name: string; email: string } | null;
  status: 'idle' | 'loading' | 'success' | 'failed';
  error: string | null;
}

// Initial state
const initialState: SignupState = {
  user: null,
  status: 'idle',
  error: null,
};

// Async thunk for signup
export const signupUser = createAsyncThunk(
  'auth/signupUser',
  async (userDetails: { name: string; email: string; password: string }, thunkAPI) => {
    try {
      const response = await api.post('signup', userDetails);
      return response.data; // Return user data
    } catch (error: unknown) {
      return thunkAPI.rejectWithValue(handleApiError(error));
    }
  }
);

// Slice for signup
const signupSlice = createSlice({
  name: 'signup',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(signupUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action: PayloadAction<SignupState['user']>) => {
        state.status = 'success';
        state.user = action.payload;
      })
      .addCase(signupUser.rejected, (state, action: PayloadAction<any>) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const selectSignupState = (state: RootState) => state.signup;
export default signupSlice.reducer;
