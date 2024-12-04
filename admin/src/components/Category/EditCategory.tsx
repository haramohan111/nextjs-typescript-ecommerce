"use client";
import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { addCategory, editCategory, updateCategory } from "@/redux/slices/categorySlice";
import { AppDispatch } from '@/redux/store';
import { toast } from 'react-toastify';
import { useRouter, useParams, useSearchParams } from "next/navigation";

// Define interface for form data
interface FormData {
  name: string;
  status: string;
  _id?: string;
}

// Define the state structure from Redux store
interface CategoryState {
    categories: {
    status: any;
    name: string;
    length: number;
    result: Array<any>;
    pageCount: number;
  }[];
}
interface RootState{
    categoryreducer:CategoryState
}

const EditCategory = () => {
  const { id } = useParams(); // Extract category ID from URL
  const { categories } = useSelector((state: RootState) => state.categoryreducer); // Access categories from Redux store
  const router = useRouter(); // For navigation
  const searchParams = useSearchParams();
  const page = searchParams.get('page');

  const dispatch = useDispatch<AppDispatch>();

  // Initialize form data state
  const [formData, setFormData] = useState<FormData>({ name: "", status: "" });

  // Handle input field changes
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    try {
      // Ensure _id is a string, or set a default if not available
      const dataToSubmit = { ...formData, _id: Array.isArray(id) ? id[0] : id ?? '' };
  //console.log(dataToSubmit)
      // Dispatch the action with the updated data
      dispatch(updateCategory(dataToSubmit));
      router.push(`/category/manage-category?showToast=true&page=${page}`);
    } catch (error) {
      console.error("Error updating category:", error);
    }
  };
  
  

  // Fetch category data when the component is mounted
  useEffect(() => {
    if (id) {
      dispatch(editCategory({ id:id as string })); // Dispatch editCategory action to load existing category
    }
  }, [dispatch, id]);

  const category = categories?.length > 0 ? categories[0] : null;

  useEffect(() => {

    if (category) {
   
      setFormData({ name: category.name, status: category.status});
    }
  }, [category]);

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Edit Category" />
      <div className="grid grid-cols-1 gap-9 sm:grid-cols-2">
        <div className="flex flex-col gap-9">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">Edit Category</h3>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="p-6.5">
                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                  <div className="w-full xl:w-1/2">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                      Category Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      placeholder="Enter category name"
                      value={formData.name || ''}
                      onChange={handleChange}
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                  </div>

                  <div className="w-full xl:w-1/2">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                      Category Status
                    </label>
                    <div className="relative z-20 bg-transparent dark:bg-form-input">
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary`}
                      >
                        <option value="" disabled className="text-body dark:text-bodydark">
                          Select category status
                        </option>
                        <option value="1" className="text-body dark:text-bodydark">
                          Active
                        </option>
                        <option value="0" className="text-body dark:text-bodydark">
                          Inactive
                        </option>
                      </select>

                      <span className="absolute right-4 top-1/2 z-30 -translate-y-1/2">
                        <svg
                          className="fill-current"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g opacity="0.8">
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                            ></path>
                          </g>
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>

                <button type="submit" className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90">
                  Update Category
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default EditCategory;
