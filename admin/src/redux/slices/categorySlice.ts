import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import api from '@/utlis/api/api';
import { toast } from 'react-toastify';

// Define types for the state
interface Category {
  _id: string;
  name: string;
  // Add any other properties that a category object contains
}

interface CategoryState {
  status: string;
  categories: Category[];
  error: string | null;
  pageIndex: number;
  pageCount: number;
}

// Define types for the parameters of fetchCategory
interface FetchCategoryParams {
  customPage: string | number | null;
  limit: number;
  search: string;
}

interface ActiveCategoryParams {
  id: string;
  status: number;
}

const handleError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    // Axios-specific error handling
    return error.response?.data?.message || 'Something went wrong';
  } else if (error instanceof Error) {
    // General error handling
    return error.message;
  }
  return 'An unknown error occurred'; // Fallback for unexpected error types
};

// Async thunk for fetching categories with typed parameters and return type
export const fetchCategory = createAsyncThunk<Category[], FetchCategoryParams, { rejectValue: string }>(
  'categories/fetchCategory',
  async ({ customPage, limit, search }, { rejectWithValue }) => {
    try {
      const response = await api.get(`categorypagination?page=${customPage}&limit=${limit}&search=${search}`);
      return response.data.results;  // Assuming the response contains an array of categories
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);



// Async thunk for activating or deactivating a category
export const activeCategory = createAsyncThunk<Category[], { data: ActiveCategoryParams }, { rejectValue: string }>(
  'categories/activeCategory',
  async ({ data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`activecategory?id=${data.id}&status=${data.status}`);
      toast.success(response.data.message);
      return response.data.results;
    } catch (error) {
      toast.error('Failed to update category status');
      return rejectWithValue(handleError(error));
    }
  }
);


// Async thunk for deleting a category
export const deleteCategory = createAsyncThunk<string, string, { rejectValue: string }>(
  'categories/deleteCategory',
  async (catId, { rejectWithValue }) => {
    try {
      const response = await api.delete(`deletecategory/${catId}`);
      toast.success(response.data.message);
      return catId;
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);


// Async thunk for editing a category
export const editCategory = createAsyncThunk<Category, { id: string }, { rejectValue: string }>(
  'categories/editCategory',
  async ({ id }, { rejectWithValue }) => {
    try {
      const response = await api.get(`editcategory/${id}`);
      return response.data.category;
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);


// Async thunk for updating a category
export const updateCategory = createAsyncThunk<Category, Category, { rejectValue: string }>(
  'categories/updateCategory',
  async (categoryData, { rejectWithValue }) => {
    try {
      const response = await api.put('updatecategory', categoryData);
      return response.data.category;
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);


// Async thunk for adding a new category
export const addCategory = createAsyncThunk<Category, Category, { rejectValue: string }>(
  'categories/addCategory',
  async (categoryData, { rejectWithValue }) => {
    try {
      const response = await api.post('addcategory', categoryData);
      toast(response.data.message);
      return response.data;
    } catch (error) {
      return rejectWithValue(handleError(error));  // Using handleError for consistent error handling
    }
  }
);


export const deleteAllCategories = createAsyncThunk<string[], string[], { rejectValue: string }>(
  'categories/deleteAllCategories',
  async (categoryIds, { rejectWithValue }) => {
    try {
      // Assuming your API allows you to delete multiple categories with a DELETE request, and you pass the IDs as query parameters
      const response = await api.delete('deleteallcategories', {
        data: { ids: categoryIds }  // Send the category IDs in the request body
      });
      toast.success(response.data.message);
      return categoryIds;  // Return the deleted category IDs to update the Redux state
    } catch (error) {
      return rejectWithValue(handleError(error));  // Handle error using the custom error handling function
    }
  }
);


// Define the initial state
const initialState: CategoryState = {
  status: 'idle',
  categories: [],
  error: null,
  pageIndex: 1,
  pageCount: 0,
};

const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategory.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchCategory.fulfilled, (state, action: PayloadAction<Category[]>) => {
        state.status ='succeeded';
        state.categories = action.payload;
        state.pageIndex = 1;  // Adjust based on your response structure
        state.pageCount = action.payload.length;  // Adjust based on your response structure
        state.error = null;
      })
      .addCase(fetchCategory.rejected, (state, action) => {
        state.status = 'failed';
        state.categories = [];
        state.error = action.error.message || 'Failed to fetch categories';
      })
      .addCase(addCategory.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addCategory.fulfilled, (state, action: PayloadAction<Category>) => {
        state.status = 'succeeded';
        state.categories.push(action.payload);  // Add the new category to the array
        state.error = null;
      })
      .addCase(addCategory.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(editCategory.pending, (state) => {
        state.status =  'loading';
      })
      .addCase(editCategory.fulfilled, (state, action: PayloadAction<Category>) => {
        state.status = 'succeeded';
        state.categories = Array.isArray(state.categories) ? [...state.categories, action.payload] : [action.payload];
        state.error = null;
      })
      .addCase(editCategory.rejected, (state, action) => {
        state.status ='failed';
        state.error = action.error.message || 'Failed to edit category';
      })
      .addCase(updateCategory.pending, (state) => {
        state.status ='loading';
      })
      .addCase(updateCategory.fulfilled, (state, action: PayloadAction<Category>) => {
        state.status ='succeeded';
        state.categories = state.categories.map((category) =>
          category._id === action.payload._id ? action.payload : category
        );
        state.error = null;
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to update category';
      })
      .addCase(deleteCategory.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteCategory.fulfilled, (state, action: PayloadAction<string>) => {
        state.status = 'succeeded';
        if (Array.isArray(state.categories)) {
          state.categories = state.categories.filter((category) => category._id !== action.payload); // Correct filter logic
        } else{
          state.categories = [];
        }
        
        state.error = null;
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to delete category';
      })
      .addCase(activeCategory.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(activeCategory.fulfilled, (state, action: PayloadAction<Category[]>) => {
        state.status = 'succeeded';
        state.categories = action.payload;
        state.error = null;
      })
      .addCase(activeCategory.rejected, (state, action) => {
        state.status = 'failed';
        state.error = typeof action.payload === 'string' ? action.payload : 'An error occurred'; // Ensure it's a string
      })
 
      .addCase(deleteAllCategories.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteAllCategories.fulfilled, (state, action: PayloadAction<string[]>) => {
        state.status = 'succeeded';
        if (Array.isArray(state.categories)) {
        state.categories = state.categories.filter(
          (category) => !action.payload.includes(category._id)
        );
      }else{
        state.categories = [];
      }
        state.error = null;
      })
      .addCase(deleteAllCategories.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export default categorySlice.reducer;
