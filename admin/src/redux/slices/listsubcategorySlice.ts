import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import api from '@/utlis/api/api';

// Define types for the subcategory and state

interface SubCategory {
  category_id: string;
  subcategory_id: string;
  subcatename: string;
  status: string | number;
  name?: string;
  active?: boolean;
  _id: string;
}


interface listSubCategory{
  
    _id:string;
    name:string;
  
}

interface ListSubCategoryState {
  status: 'idle' | 'loading' | 'succeeded' | 'failed'; // Replace loading with status
  listsubcategories: SubCategory[];
  subcategorybyid: listSubCategory[];
  error: string | null;
  pageIndex: number;
  pageCount: number;
  listsubcategoryById:string[];
  data?: any; // To store single subcategory data
}

interface ListSubCategoryData{
  cat_id: string;
 subcat_id: string; 
 listsubcat:string;
 status:string;
}

interface ActivesubCategoryParams {
  id: string;
  status: number;
}
// Custom Axios error handler to standardize error responses
const handleApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    // Network or response error
    if (error.response) {
      // Server responded with a status other than 2xx
      return error.response.data?.message || error.response.statusText || 'Server error';
    } else if (error.request) {
      // Request was made but no response received
      return 'No response from server';
    } else {
      // Something happened while setting up the request
      return error.message || 'Error occurred';
    }
  } else {
    // Non-Axios error (e.g. generic JS errors)
    return (error as Error).message || 'Unknown error occurred';
  }
};

// Async thunk actions
export const fetchlistsubCategorybyID = createAsyncThunk(
  'fetchlistsubCategorybyID',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`listsubcategorybyid/${id}`);
      return response.data.category;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const fetchlistsubCategory = createAsyncThunk(
  'fetchlistsubCategory',
  async (
    { customPage, limit, search }: { customPage: number; limit: number; search: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.get(
        `listsubcategorypagination?page=${customPage}&limit=${limit}&search=${search}`
      );
      return response.data.results;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const activelistsubCategory = createAsyncThunk<ListSubCategoryData, { data: ActivesubCategoryParams }>(
  'activelistsubCategory',
  async ({ data }, { rejectWithValue }) => {
    try {
      const response = await api.put(
        `activelistsubcategory?id=${data.id}&status=${data.status}`
      );
      return response.data.results;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const deletelistsubCategory = createAsyncThunk(
  'deletelistsubCategory',
  async (catId: string, { rejectWithValue }) => {
    try {
      await api.delete(`deletelistsubcategory/${catId}`);
      return catId;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const editlistsubCategory = createAsyncThunk(
  'editlistsubCategory',
  async ({ id }: { id: string }, { rejectWithValue }) => {
    try {
      const response = await api.get(`editlistsubcategory/${id}`);
      return response.data.category;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const updatelistsubCategory = createAsyncThunk(
  'updatelistsubCategory',
  async (subcategoryData: SubCategory, { rejectWithValue }) => {
    try {
      const response = await api.put(`updatelistsubcategory`, subcategoryData);
      return response.data.category;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const addlistsubCategory = createAsyncThunk<ListSubCategoryData, ListSubCategoryData, { rejectValue: string }>(
  'addlistsubCategory',
  async (categoryData, { rejectWithValue }) => {
    try {
      const response = await api.post('addlistsubcategory', categoryData);
      toast(response.data.message);
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const getSubcategoryById = createAsyncThunk(
  'lissubcategory/getById',
  async (cat_id: string, { rejectWithValue }) => {
    try {

      const { data } = await api.get(`getsubcategorybyid/${cat_id}`);
      return data; // Return data to the fulfilled action
    } catch (error: any) {
      // Use the handleApiError to format the error
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const getListsubcategoryById = createAsyncThunk(
  'lissubcategorygetById',
  async (cat_id: string, { rejectWithValue }) => {
    try {

      const { data } = await api.get(`getlistsubcategorybyid/${cat_id}`);
      return data; // Return data to the fulfilled action
    } catch (error: any) {
      // Use the handleApiError to format the error
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const deleteAlllistSubCategories = createAsyncThunk<string[], string[], { rejectValue: string }>(
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

// Initial state for the slice
const initialState: ListSubCategoryState = {
  status: 'idle', // Initialize status to 'idle'
  listsubcategories: [],
  subcategorybyid:[],
  listsubcategoryById:[],
  error: null,
  pageIndex: 1,
  pageCount: 0,
};

// Slice for managing state and async actions
const listsubcategorySlice = createSlice({
  name: 'listsubcategory',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch List Subcategory
      .addCase(fetchlistsubCategory.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchlistsubCategory.fulfilled, (state, action: PayloadAction<any>) => {
        state.status = 'succeeded';
        state.listsubcategories = action.payload;
        state.pageIndex = action.payload.pageIndex;
        state.pageCount = action.payload.pageCount;
        state.error = null;
      })
      .addCase(fetchlistsubCategory.rejected, (state, action: PayloadAction<any>) => {
        state.status = 'failed';
        state.listsubcategories = [];
        state.error = action.payload;
      })
      // Add Subcategory
      .addCase(addlistsubCategory.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addlistsubCategory.fulfilled, (state, action: PayloadAction<any>) => {
        state.status = 'succeeded';
        state.listsubcategories = action.payload;
        state.error = null;
      })
      .addCase(addlistsubCategory.rejected, (state, action: PayloadAction<any>) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Edit Subcategory
      .addCase(editlistsubCategory.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(editlistsubCategory.fulfilled, (state, action: PayloadAction<any>) => {
        state.status = 'succeeded';
        state.listsubcategories = action.payload;
        state.error = null;
      })
      .addCase(editlistsubCategory.rejected, (state, action: PayloadAction<any>) => {
        state.status = 'failed';
        state.listsubcategories = [];
        state.error = action.payload;
      })
      // Update Subcategory
      .addCase(updatelistsubCategory.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updatelistsubCategory.fulfilled, (state, action: PayloadAction<any>) => {
        state.status = 'succeeded';
        state.listsubcategories = action.payload;
        state.error = null;
      })
      .addCase(updatelistsubCategory.rejected, (state, action: PayloadAction<any>) => {
        state.status = 'failed';
        state.listsubcategories = [];
        state.error = action.payload;
      })
      // Delete Subcategory
      .addCase(deletelistsubCategory.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deletelistsubCategory.fulfilled, (state, action: PayloadAction<any>) => {
        state.status = 'succeeded';
        state.listsubcategories = Array.isArray(state.listsubcategories)
        ? state.listsubcategories.filter(
            (category) => category._id !== action.payload
          )
        : [];
        state.error = null;
      })
      .addCase(deletelistsubCategory.rejected, (state, action: PayloadAction<any>) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Active/Inactive Subcategory
      .addCase(activelistsubCategory.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(activelistsubCategory.fulfilled, (state, action: PayloadAction<any>) => {
        state.status = 'succeeded';
        state.listsubcategories = Array.isArray(state.listsubcategories)
        ? state.listsubcategories.map((category) =>
            category._id === action.payload._id
              ? { ...category, active: action.payload.active }
              : category
          )
        : [];
        state.error = null;
      })
      .addCase(activelistsubCategory.rejected, (state, action: PayloadAction<any>) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Fetch Subcategory by ID
      .addCase(fetchlistsubCategorybyID.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchlistsubCategorybyID.fulfilled, (state, action: PayloadAction<any>) => {
        state.status = 'succeeded';
        state.listsubcategories = [action.payload];
        state.error = null;
      })
      .addCase(fetchlistsubCategorybyID.rejected, (state, action: PayloadAction<any>) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Get Subcategory by ID
      .addCase(getSubcategoryById.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(getSubcategoryById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.subcategorybyid = action.payload;
      })
      .addCase(getSubcategoryById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string; // This will be the error message from handleApiError
      })
      .addCase(getListsubcategoryById.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      // Handle fulfilled state (successful data fetch)
      .addCase(getListsubcategoryById.fulfilled, (state, action: PayloadAction<any>) => {
        state.status = 'succeeded';
        state.listsubcategoryById = action.payload; // Store the fetched data in state
      })
      // Handle rejected state (error handling)
      .addCase(getListsubcategoryById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string; // Assign the formatted error message
      });
  },
});

export default listsubcategorySlice.reducer;
