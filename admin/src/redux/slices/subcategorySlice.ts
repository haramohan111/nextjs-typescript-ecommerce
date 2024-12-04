import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import api from '@/utlis/api/api';
import { toast } from 'react-toastify';

// Define types for state
interface SubCategoryState {
  loading: boolean;
  subcategories: any[]; // Replace `any` with the actual type for subcategory data
  error: string | null;
  pageIndex: number;
  pageCount: number;
}

interface FetchSubCategoryParams {
  customPage: number;
  limit: number;
  search: string;
}

interface ActivesubCategoryParams {
  id: string;
  status: number;
}

interface SubCategoryData {
  category_id:string;
  subcatename: string;
  status: number | string;
  _id?: string;
}

interface SubCategoryResponse {
  pageIndex: number;
  pageCount: number;
}

const handleApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      return error.response.data?.message || error.response.statusText || 'Server error';
    } else if (error.request) {
      return 'No response from server';
    } else {
      return error.message || 'Error occurred';
    }
  } else {
    return (error as Error).message || 'Unknown error occurred';
  }
};

export const fetchsubCategorybyID = createAsyncThunk(
  'fetchlistsubCategorybyID',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`listsubcategory/subcategory?id=${id}`);
      return response.data.category;
    } catch (error) {
      const errorMessage = handleApiError(error);
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchsubCategory = createAsyncThunk(
  'fetchsubCategory',
  async ({ customPage, limit, search }: FetchSubCategoryParams, { rejectWithValue }) => {
    try {
      const response = await api.get(`subcategorypagination?page=${customPage}&limit=${limit}&search=${search}`);
      return response.data.results;
    } catch (error) {
      const errorMessage = handleApiError(error);
      return rejectWithValue(errorMessage);
    }
  }
);

export const activesubCategory = createAsyncThunk<SubCategoryData, { data: ActivesubCategoryParams }, { rejectValue: string }>(
  'activesubCategory',
  async ({ data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`activesubcategory?id=${data.id}&status=${data.status}`);
      return response.data.results;
    } catch (error) {
      const errorMessage = handleApiError(error);
      return rejectWithValue(errorMessage);
    }
  }
);


export const deletesubCategory = createAsyncThunk(
  'deletesubCategory',
  async (catId: string, { rejectWithValue }) => {
    try {
      await api.delete(`deletesubcategory/${catId}`);
      return catId;
    } catch (error) {
      const errorMessage = handleApiError(error);
      return rejectWithValue(errorMessage);
    }
  }
);

export const editsubCategory = createAsyncThunk(
  'editsubCategory',
  async ({ id }: { id: string }, { rejectWithValue }) => {
    try {
      const response = await api.get(`editsubcategory/${id}`);
      return response.data.category;
    } catch (error) {
      const errorMessage = handleApiError(error);
      return rejectWithValue(errorMessage);
    }
  }
);

export const updatesubCategory = createAsyncThunk(
  'updatesubCategory',
  async (subcategoryData: SubCategoryData, { rejectWithValue }) => {
    try {
      const response = await api.put(`updatesubcategory`, subcategoryData);
      return response.data.category;
    } catch (error) {
      const errorMessage = handleApiError(error);
      return rejectWithValue(errorMessage);
    }
  }
);

export const addsubCategory = createAsyncThunk<SubCategoryData, SubCategoryData, { rejectValue: string }>(
  'addsubCategory',
  async (categoryData, { rejectWithValue }) => {
    try {
      const response = await api.post(`addsubcategory`, categoryData);
      toast(response.data.message);
      return response.data;
    } catch (error) {
      const errorMessage = handleApiError(error);
      return rejectWithValue(errorMessage);
    }
  }
);

export const deleteAllSubCategories = createAsyncThunk<string[], string[], { rejectValue: string }>(
  'deleteAllSubCategories',
  async (categoryIds, { rejectWithValue }) => {
    try {
      // Assuming your API allows you to delete multiple categories with a DELETE request, and you pass the IDs as query parameters
      const response = await api.delete('deleteallsubcategory', {
        data: { ids: categoryIds }  // Send the category IDs in the request body
      });
      toast.success(response.data.message);
      return categoryIds;  // Return the deleted category IDs to update the Redux state
    } catch (error) {
       const errorMessage = handleApiError(error);
      return rejectWithValue(errorMessage); // Handle error using the custom error handling function
    }
  }
);

const initialState: SubCategoryState = {
  loading: false,
  subcategories: [],
  error: null,
  pageIndex: 1,
  pageCount: 0,
};

const subcategorySlice = createSlice({
  name: 'subcategory',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchsubCategory.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchsubCategory.fulfilled, (state, action: PayloadAction<SubCategoryResponse[]>) => {
        state.loading = false;
        state.subcategories = action.payload; // Update subcategories

        state.error = null;
      })
      .addCase(fetchsubCategory.rejected, (state, action) => {
        state.loading = false;
        state.subcategories = [];
        state.error = action.payload as string || 'Failed to fetch subcategories';
      })
      .addCase(addsubCategory.pending, (state) => {
        state.loading = true;
      })
      .addCase(addsubCategory.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.subcategories = action.payload;
        state.error = null;
      })
      .addCase(addsubCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(editsubCategory.pending, (state) => {
        state.loading = true;
      })
      .addCase(editsubCategory.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.subcategories = action.payload;
        state.error = null;
      })
      .addCase(editsubCategory.rejected, (state, action) => {
        state.loading = false;
        state.subcategories = [];
        state.error = action.payload as string || 'Failed to edit subcategory';
      })
      .addCase(updatesubCategory.pending, (state) => {
        state.loading = true;
      })
      .addCase(updatesubCategory.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.subcategories = action.payload;
        state.error = null;
      })
      .addCase(updatesubCategory.rejected, (state, action) => {
        state.loading = false;
        state.subcategories = [];
        state.error = action.payload as string || 'Failed to update subcategory';
      })
      .addCase(deletesubCategory.pending, (state) => {
        state.loading = true;
      })
      .addCase(deletesubCategory.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        if (Array.isArray(state.subcategories)) {
        state.subcategories = state.subcategories.filter((subcategory) => subcategory.id !== action.payload);
        }else{
          state.subcategories = []
        }
        state.error = null;
      })
      .addCase(deletesubCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(activesubCategory.pending, (state) => {
        state.loading = true;
      })
      .addCase(activesubCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.subcategories = state.subcategories;
        state.error = null;
      })
      .addCase(activesubCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchsubCategorybyID.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchsubCategorybyID.fulfilled, (state, action) => {
        state.loading = false;
        state.subcategories = action.payload;
        state.error = null;
      })
      .addCase(fetchsubCategorybyID.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default subcategorySlice.reducer;
