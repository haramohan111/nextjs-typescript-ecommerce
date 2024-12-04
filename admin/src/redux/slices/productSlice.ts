import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';
import api from '@/utlis/api/api';

// Define types for state and async action parameters
interface ProductState {
  loading: boolean;
  products: any[]; // Ideally, replace `any` with your actual product type
  error: string | null;
  pageIndex: number;
  pageCount: number;
  file: any; // Replace with the correct file type, like File or Blob
  status: string | null;
}

interface AddProductParams {
  formData: FormData; // Replace with your actual form data type
}

interface FetchProductParams {
  customPage: number;
  limit: number;
  search: string;
}

interface ActiveProductParams {
  data:{
    id: string;
    status: number;
  }

}

interface FetchlistsubCategorybyIDParams {
  id: string;
}

interface updatedFormData{
  category_id: string;
  subcategory_id: string;
  listsubcategory_id: string;
  name: string,
  price: string,
  stock: string,
  brand: string,
  color: string,
  size: string,
  seller: string,
  tags: string,
  description: string,
  status: string;
  _id?: string;
}

// Custom Axios error handler to standardize error responses
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

// Async thunk actions
export const uploadFile = createAsyncThunk('upload/uploadFile', async (formData: FormData) => {
  const response = await api.post('/api/upload', formData);
  return response.data;
});

export const addProduct = createAsyncThunk('addProduct', async ({ formData }: AddProductParams, { rejectWithValue }) => {
  try {
    const response = await api.post('addproducts', formData);
    // const response = await axios.post('http://localhost:9000/api/v1/addproducts', formData, {
    //   headers: {
    //     'Content-Type': 'multipart/form-data',
    //   }
    // });
    toast(response.data.message);
    return response.data;
  } catch (error) {
    return rejectWithValue(handleApiError(error));
  }
});

export const fetchlistsubCategorybyIDfromProduct = createAsyncThunk('fetchlistsubCategorybyIDfromProduct', async (id: string, { rejectWithValue }) => {
  try {
    const response = await api.get(`product/listsubcategory?id=${id}`);
    return response.data.category;
  } catch (error) {
    return rejectWithValue(handleApiError(error));
  }
});

export const fetchProduct = createAsyncThunk('fetchProduct', async ({ customPage, limit, search }: FetchProductParams, { rejectWithValue }) => {
  try {
    const response = await api.get(`manageproductspagination?page=${customPage}&limit=${limit}&search=${search}`);
    return response.data.results;
  } catch (error) {
    return rejectWithValue(handleApiError(error));
  }
});

export const activeProduct = createAsyncThunk('activeProduct', async ({ data }: ActiveProductParams, { rejectWithValue }) => {
  try {
    const response = await api.put(`activeproduct?id=${data.id}&status=${data.status}`);
    toast.success(response.data.message);
    return response.data.results;
  } catch (error) {
    return rejectWithValue(handleApiError(error));
  }
});

export const deleteProduct = createAsyncThunk('deleteProduct', async (Id: string, { rejectWithValue }) => {
  try {
    await api.delete(`deleteproduct/${Id}`);
    return Id;
  } catch (error) {
    return rejectWithValue(handleApiError(error));
  }
});

export const deleteAllProduct = createAsyncThunk<string[], string[], { rejectValue: string }>(
  'deleteAllSubCategories',
  async (categoryIds, { rejectWithValue }) => {
    try {
      // Assuming your API allows you to delete multiple categories with a DELETE request, and you pass the IDs as query parameters
      const response = await api.delete('deleteallproduct', {
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

export const editProduct = createAsyncThunk('editProduct', async ({ id }: { id: string }) => {
  try {
    const response = await api.get(`editproduct/${id}`);
    return response.data.category;
  } catch (error) {
    throw error;
  }
});

export const updateProduct = createAsyncThunk('updateProduct', async (updatedFormData:updatedFormData) => {
  try {

    const response = await api.put('updateproduct', updatedFormData);
    return response.data.category;
  } catch (error) {
    throw error;
  }
});

// Initial state for the slice
const initialState: ProductState = {
  loading: false,
  products: [],
  error: null,
  pageIndex: 1,
  pageCount: 0,
  file: null,
  status: null,
};

// Product slice
const ProductSlice = createSlice({
  name: 'Product',
  initialState,
  reducers: {
    setFile: (state, action: PayloadAction<any>) => {
      state.file = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
        state.pageIndex = action.payload.pageindex;
        state.pageCount = action.payload.pageCount;
        state.error = null;
      })
      .addCase(fetchProduct.rejected, (state, action) => {
        state.loading = false;
        state.products = [];
        state.error = action.error.message || 'Error fetching products';
      })
      .addCase(addProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products.push(action.payload);
        state.error = null;
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(editProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(editProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload
        state.error = null;
      })
      .addCase(editProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Error editing product';
      })
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload
        state.error = null;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Error updating product';
      })
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products = [];
        state.error = null;
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(activeProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(activeProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload
        state.error = null;
      })
      .addCase(activeProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchlistsubCategorybyIDfromProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchlistsubCategorybyIDfromProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products = [action.payload]; // Assuming the result is a single product
        state.error = null;
      })
      .addCase(fetchlistsubCategorybyIDfromProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(uploadFile.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(uploadFile.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.file = action.payload;
      })
      .addCase(uploadFile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Error uploading file';
      });
  },
});

export const { setFile } = ProductSlice.actions;
export default ProductSlice.reducer;
