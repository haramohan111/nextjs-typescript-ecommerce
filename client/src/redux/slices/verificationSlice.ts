// src/features/verification/verificationSlice.ts
import api from '@/utils/api/api';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Define async thunk to verify the email
export const verifyEmail = createAsyncThunk(
  'verification/verifyEmail',
  async (token: string, { rejectWithValue }) => {
    try {
      const response = await api.post('verify-email', { token });
      return response.data;
    } catch (error:any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to verify email');
    }
  }
);

// Define the initial state
interface VerificationState {
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  message: string;
}

const initialState: VerificationState = {
  status: 'idle',
  message: '',
};

// Create the slice
const verificationSlice = createSlice({
  name: 'verification',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(verifyEmail.pending, (state) => {
        state.status = 'loading';
        state.message = 'Verifying your email...';
      })
      .addCase(verifyEmail.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.message = action.payload.message;
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.status = 'failed';
        state.message = action.payload as string;
      });
  },
});

export default verificationSlice.reducer;
