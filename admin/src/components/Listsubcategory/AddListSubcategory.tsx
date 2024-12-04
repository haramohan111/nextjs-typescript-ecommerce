"use client";
import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { addCategory, fetchCategory } from "@/redux/slices/categorySlice";
import { AppDispatch } from '@/redux/store';
import { toast } from 'react-toastify';
import { categoryRootState } from "@/types/categoryTypes";
import { subcategoryRootState } from "@/types/subcategoryTypes";
import { addsubCategory } from "@/redux/slices/subcategorySlice";
import { addlistsubCategory, getSubcategoryById } from "@/redux/slices/listsubcategorySlice";


interface FormData {
  category_id: string;
  subcatename: string;
  status: string;
  _id?: string;
}

export interface Category {
  _id: string;
  name: string;
  status: number;
  category_id: {
    name: string;
  };
}

export interface ListSubCategoryState {
  listsubcategories: {
    result: Category[];
    pageCount: number;
    pageindex: number;
    length: number;
  };
  subcategorybyid: {
    _id: string;
    name: string;
  }[];
  status: string;
  error: string;
  loading: boolean;
}


// Redux store's state type
interface listsubcategoryRootState {
  listsubcategoryreducer: ListSubCategoryState;
}

const AddListSubCategory = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [cat, setCat] = useState<string>('');
  const [subcat, setSubcat] = useState<string>('');
  const [listsubcat, setListsubcat] = useState<string>('');
  const [status, setStatus] = useState<string>('');

  const [isOptionSelected, setIsOptionSelected] = useState<boolean>(false);




  const { categories } = useSelector(
    (state: categoryRootState) => state.categoryreducer
  );
  const { subcategorybyid } = useSelector(
    (state: listsubcategoryRootState) => state.listsubcategoryreducer
  );



  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Check if any field is empty
    if (!cat || !subcat || !listsubcat || !status) {
      // Display error toast if any field is empty
      toast.error("Please fill in all fields.");
      return;
    }

    try {
      // Dispatch the subcategory data to Redux
      const data = { cat_id: cat, subcat_id: subcat, listsubcat, status };
      dispatch(addlistsubCategory(data));

      // Reset form fields after submission
      setCat('');
      setSubcat('');
      setListsubcat('');
      setStatus('');
    } catch (error) {
      console.error("Error adding subcategory:", error);
    }
  };

  const catgoryById = (cat_id: string) => {
    if (cat_id) {
      dispatch(getSubcategoryById(cat_id));
    }
  };
  useEffect(() => {
    dispatch(fetchCategory({ customPage: 1, limit: 100, search: '' }));
  }, [dispatch]);
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Add ListSubCategory" />

      <div className="grid grid-cols-1 gap-9 sm:grid-cols-1">
        <div className="flex flex-col gap-9">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">Add ListSubCategory</h3>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="p-6.5">
                {/* Make this section a 2x2 grid */}
                <div className="grid grid-cols-1 gap-6 xl:grid-cols-2 mb-4.5">
                  {/* Column 1: Category Name */}
                  <div className="w-full">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                      Select Category Name
                    </label>
                    <div className="relative z-20 bg-transparent dark:bg-form-input">
                      <select
                        name="category_id"
                        value={cat}
                        onChange={(e) => { setCat(e.target.value); catgoryById(e.target.value) }}
                        className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary ${isOptionSelected ? "text-black dark:text-white" : ""}`}
                      >
                        <option value="" disabled className="text-body dark:text-bodydark">
                          Select category name
                        </option>
                        {categories?.result?.length > 0 && categories?.result?.map((item, index) => (
                          <option value={item._id} key={item._id}>{item.name}</option>
                        ))}
                      </select>
                      <span className="absolute right-4 top-1/2 z-30 -translate-y-1/2">
                        {/* Icon */}
                      </span>
                    </div>
                  </div>

                  <div className="w-full">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                      Select SubCategory Name
                    </label>
                    <div className="relative z-20 bg-transparent dark:bg-form-input">
                      <select
                        name="category_id"
                        value={subcat}
                        onChange={(e) => setSubcat(e.target.value)}
                        className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary ${isOptionSelected ? "text-black dark:text-white" : ""}`}
                      >
                        <option value="" disabled className="text-body dark:text-bodydark">
                          Select subcategory name
                        </option>
                        {
                          subcategorybyid?.map((subcat, index) => (
                            <option value={subcat?._id} key={index}>{subcat?.name}</option>
                          ))
                        }
                      </select>
                      <span className="absolute right-4 top-1/2 z-30 -translate-y-1/2">
                        {/* Icon */}
                      </span>
                    </div>
                  </div>

                  {/* Column 2: SubCategory Name */}
                  <div className="w-full">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                      ListSubCategory Name
                    </label>
                    <input
                      type="text"
                      name="subcatename"
                      placeholder="Enter Listsubcategory name"
                      value={listsubcat}
                      onChange={(e) => setListsubcat(e.target.value)}
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                  </div>
                  <div className="w-full">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                      Category Status
                    </label>
                    <div className="relative z-20 bg-transparent dark:bg-form-input">
                      <select
                        name="status"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary ${isOptionSelected ? "text-black dark:text-white" : ""}`}
                      >
                        <option value="" disabled className="text-body dark:text-bodydark">
                          Select subcategory status
                        </option>
                        <option value="1" className="text-body dark:text-bodydark">
                          Active
                        </option>
                        <option value="0" className="text-body dark:text-bodydark">
                          Inactive
                        </option>
                      </select>
                      <span className="absolute right-4 top-1/2 z-30 -translate-y-1/2">
                        {/* Icon */}
                      </span>
                    </div>
                  </div>

                </div>

                {/* Submit Button */}
                <button type="submit" className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90">
                  Add ListSubCategory
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

    </DefaultLayout>
  );
};

export default AddListSubCategory;
