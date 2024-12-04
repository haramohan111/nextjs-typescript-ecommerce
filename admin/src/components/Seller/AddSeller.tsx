"use client"
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import SelectGroupOne from "@/components/SelectGroup/SelectGroupOne";
import Link from "next/link";
import { ChangeEvent, FormEvent, useState } from "react";
import { addCategory } from "@/redux/slices/categorySlice";
import { AppDispatch } from '@/redux/store';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from "react-redux";
import { addSeller } from "@/redux/slices/sellerSlice";


interface FormData {
  name: string;
  status: string;
  _id?: string;
}
const AddSeller = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [isOptionSelected, setIsOptionSelected] = useState<boolean>(false);

 const [formData, setFormData] = useState<FormData>({ name: "", status: "" });
  const status = useSelector((state: any) => state.categoryreducer.status);
  const error = useSelector((state: any) => state.categoryreducer.error);
  const changeTextColor = () => {
    setIsOptionSelected(true);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const emptyFields = Object.entries(formData).filter(([key, value]) => value.trim() === '');

    if (emptyFields.length > 0) {
      // Display error toast for the first empty field found
      toast.error(`Please fill in the ${emptyFields[0][0]} field`);
      return;
    }

    // Ensure _id is set when dispatching the action
    const categoryData = {
      ...formData,
      _id: formData._id || "",  // Set _id to an empty string if it's not provided
    };

    try {
      // Dispatch the category data to Redux
      dispatch(addSeller(categoryData));

      // Reset the form after submission
      setFormData({ name: "", status: "" });
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Add Color" />

      <div className="grid grid-cols-1 gap-9 sm:grid-cols-2">
        <div className="flex flex-col gap-9">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">Add Category</h3>
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
                      value={formData.name}
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
                        className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary ${isOptionSelected ? "text-black dark:text-white" : ""}`}
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
                  Add Category
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default AddSeller;
