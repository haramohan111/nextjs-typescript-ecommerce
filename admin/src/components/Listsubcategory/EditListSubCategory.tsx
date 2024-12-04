"use client";
import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

import { AppDispatch } from '@/redux/store';

import { useRouter, useParams, useSearchParams } from "next/navigation";
import { categoryRootState } from "@/types/categoryTypes";
import { editsubCategory, updatesubCategory } from "@/redux/slices/subcategorySlice";
import { fetchCategory } from "@/redux/slices/categorySlice";
import { subcategoryRootState } from "@/types/subcategoryTypes";
import { editlistsubCategory, fetchlistsubCategorybyID, getSubcategoryById, updatelistsubCategory } from "@/redux/slices/listsubcategorySlice";
import { toast } from "react-toastify";


interface FormData {
  category_id: string;
  subcategory_id: string;
  subcatename: string;
  status: number | string;
  _id?: string;
}

// types/categoryTypes.ts

export interface Category {
  _id: string;
  name: string;
  status: number;

}

export interface CategoryState {
  listsubcategories: {
    result: Category[];
    pageCount: number;
    pageindex: number;
    length: number;
    name: string;
    status: number;
    category_id: {
      _id: string
    };
    subcategory_id: {
      _id: string
    };

  }[];

  
  subcategorybyid: {
    _id: string;
    name: string;
  }[];
  status: string;
  error: string;
  loading: boolean;
}

export interface listsubcategoryRootState {
  listsubcategoryreducer: CategoryState;
}

const EditListSubCategory = () => {
  const { id } = useParams(); // Extract category ID from URL
  // Initialize form data state
  const [cat, setCat] = useState<string>('');
  const [subcat, setSubcat] = useState<string>('');
  const [listsubcat, setListsubcat] = useState<string>('');
  const [status, setStatus] = useState<string>('');

  const [formData, setFormData] = useState<FormData>({ category_id: "", subcategory_id: "", subcatename: "", status: "" })
  const { listsubcategories,subcategorybyid } = useSelector((state: listsubcategoryRootState) => state.listsubcategoryreducer); // Access subcategories from Redux store

  const { categories } = useSelector(
    (state: categoryRootState) => state.categoryreducer
  );
  const { subcategories } = useSelector(
    (state: subcategoryRootState) => state.subcategoryreducer
  );
  const router = useRouter(); // For navigation
  const searchParams = useSearchParams();
  const page = searchParams.get('page');

  const dispatch = useDispatch<AppDispatch>();



  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const category_id = String(formData.category_id).trim();
    const subcategory_id = String(formData.subcategory_id).trim();
    const subcatename = String(formData.subcatename).trim();
    const status = String(formData.status).trim();
console.log(formData)
    // Check if any field is empty
    if (!category_id || !subcategory_id || !subcatename || !status) {
      toast.error("Please fill in all fields.");
      return;
    }

    try {
      // Dispatch the subcategory data to Redux
     // const data = { category_id, subcategory_id, subcatename, status,_id:id };
      const dataToSubmit = { ...formData, _id: Array.isArray(id) ? id[0] : id ?? '' };
      //console.log(data)
      dispatch(updatelistsubCategory(dataToSubmit));

      // Reset form fields after submission
      setCat('');
      setSubcat('');
      setListsubcat('');
      setStatus('');
      router.push(`/listsubcategory/manage-listsubcategory?showToast=true&page=${page}`);
    } catch (error) {
      console.error("Error adding subcategory:", error);
    }
  };


  // const catgoryById = (cat_id: string) => {
  //   if (cat_id) {
  //     console.log(cat_id)
  //     dispatch(getSubcategoryById(cat_id));
  //   }
  // };

  const handleCategoryChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { value } = e.target;
    
    // Update the form data
    setFormData({ ...formData, category_id: value });

    // Dispatch the categoryById action with the new category_id
    if (value) {
      dispatch(getSubcategoryById(value)); // Dispatch action to fetch category by ID
    }
  };
  // Fetch category data when the component is mounted
  useEffect(() => {
    if (id) {
      dispatch(editlistsubCategory({ id: id as string })); // Dispatch editCategory action to load existing category
    }
  }, [dispatch, id]);

  const listsubcategory = listsubcategories?.length > 0 ? listsubcategories[0] : null;

  useEffect(() => {

    if (listsubcategory) {

      setFormData({
        category_id: listsubcategory.category_id._id, subcategory_id: listsubcategory.subcategory_id._id, subcatename: listsubcategory.name,
        status: listsubcategory.status
      });
    }
    if(listsubcategory?.category_id?._id){
      console.log(formData.category_id,listsubcategory?.category_id?._id);
      dispatch(getSubcategoryById(formData.category_id));
    }
    dispatch(fetchCategory({ customPage: 1, limit: 100, search: '' }));
  }, [listsubcategory]);

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Edit ListSubCategory" />
      <div className="grid grid-cols-1 gap-9 sm:grid-cols-1">
  <div className="flex flex-col gap-9">
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
        <h3 className="font-medium text-black dark:text-white">Edit SubCategory</h3>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="p-6.5">
          <div className="mb-4.5 grid grid-cols-1 gap-6 xl:grid-cols-2 xl:gap-6">
            
            {/* First Row: Category Name Dropdown */}
            <div className="w-full">
              <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                Category Name
              </label>
              <div className="relative z-20 bg-transparent dark:bg-form-input">
                <select
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleCategoryChange}
                  //onChange={(e) => { setCat(e.target.value); catgoryById(e.target.value) }}
                  className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary`}
                >
                  <option value="" disabled className="text-body dark:text-bodydark">
                    Select category
                  </option>
                  {categories?.result?.length > 0 && categories?.result?.map((item) => (
                    <option value={item._id} key={item._id}>{item.name}</option>
                  ))}
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

            {/* Second Row: SubCategory Name (Input Box) */}
     
            <div className="w-full">
              <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                Subcategory Name
              </label>
              <div className="relative z-20 bg-transparent dark:bg-form-input">
                <select
                  name="status"
                  value={formData.subcategory_id}
                  onChange={(e) => setFormData({ ...formData, subcategory_id: e.target.value })}
                  className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary`}
                >
                  <option value="" disabled className="text-body dark:text-bodydark">
                    Select subcategory status
                  </option>
                        {
                          subcategorybyid?.map((subcat, index) => (
                            <option value={subcat?._id} key={index}>{subcat?.name}</option>
                          ))
                        }
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

          <div className="mb-4.5 grid grid-cols-1 gap-6 xl:grid-cols-2 xl:gap-6">
            
            {/* Third Row: Category Status Dropdown */}

            <div className="w-full">
              <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                ListSubCategory Name
              </label>
              <input
                type="text"
                name="subcatename"
                placeholder="Enter SubCategory name"
                value={formData.subcatename}
                onChange={(e) => setFormData({ ...formData, subcatename: e.target.value })}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
            </div>
            {/* Fourth Row: Another Dropdown (e.g., Another Category or Option) */}
            <div className="w-full">
              <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                Status
              </label>
              <div className="relative z-20 bg-transparent dark:bg-form-input">
                <select
                  name="another_option"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary`}
                >
                  <option value="" disabled className="text-body dark:text-bodydark">
                    Select option
                  </option>
                  <option value="1" className="text-body dark:text-bodydark">
                    Active
                  </option>
                  <option value="0" className="text-body dark:text-bodydark">
                   In-Active
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

          {/* Submit Button */}
          <div className="w-full">
            <button type="submit" className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90">
              Update ListSubCategory
            </button>
          </div>

        </div>
      </form>
    </div>
  </div>
</div>


    </DefaultLayout>
  );
};

export default EditListSubCategory;
