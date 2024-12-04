"use client"
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import SelectGroupOne from "@/components/SelectGroup/SelectGroupOne";
import Link from "next/link";
import { useState, ChangeEvent, FormEvent, useEffect, FormEventHandler } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategory } from "@/redux/slices/categorySlice";
import { AppDispatch } from '@/redux/store';
import { toast } from 'react-toastify';
import { categoryRootState } from "@/types/categoryTypes";
import { addlistsubCategory, getSubcategoryById, getListsubcategoryById } from "@/redux/slices/listsubcategorySlice";
import {  editProduct, updateProduct } from "@/redux/slices/productSlice";
import { fetchSize } from "@/redux/slices/sizeSlice";
import { fetchColor } from "@/redux/slices/colorSlice";
import { fetchSeller } from "@/redux/slices/sellerSlice";
import { fetchBrand } from "@/redux/slices/brandSlice";
import { useRouter, useParams, useSearchParams } from "next/navigation";


interface FormData {
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
  listsubcategoryById: {
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

export interface Brand {
  _id: string;
  name: string;
  status: number;
}
export interface ListBrandState {
  brands: {
    result: Brand[];
  }

  length: number;
  status: string;
  error: string;
  loading: boolean;
}
interface brandRootState {
  brandreducer: ListBrandState;
}

export interface Color {
  _id: string;
  name: string;
  status: number;
}
export interface ListColorState {
  colors: {
    result: Color[];
    length: number;
  }

  length: number;
  status: string;
  error: string;
  loading: boolean;
}
interface colorRootState {
  colorreducer: ListColorState;
}

export interface Size {
  _id: string;
  name: string;
  status: number;
}
export interface ListSizeState {
  sizes: {
    result: Size[];
    length: number;
  }

  length: number;
  status: string;
  error: string;
  loading: boolean;
}
interface sizeRootState {
  sizereducer: ListSizeState;
}

export interface Seller {
  _id: string;
  name: string;
  status: number;
}
export interface ListSellerState {
  sellers: {
    result: Seller[];
    length: number;
  }

  status: string;
  error: string;
  loading: boolean;
}
interface sellerRootState {
  sellerreducer: ListSellerState;
}



export interface Product {
  _id: string;
  name: string;
  status: number;

}
export interface ListProductState {
  products: {
    result: Product[];
    length: number;
    category_id: string;
    subcategory_id: string, listsubcategory_id: string, name: string, price: string, stock: string, brand: string,
    color: string, size: string, seller: string, tags: string, description: string, status: string
  }

  status: string;
  error: string;
  loading: boolean;
}
interface productRootState {
  productreducer: ListProductState;
}
const EditProduct = () => {
  const { id } = useParams();
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [isOptionSelected, setIsOptionSelected] = useState<boolean>(false);

  const changeTextColor = () => {
    setIsOptionSelected(true);
  };

  const dispatch = useDispatch<AppDispatch>();
  const [catid, setCatid] = useState<string>('');
  const [subcatid, setSubcatid] = useState<string>('');
  const [listsubcatid, setListsubcatid] = useState<string>('');
  const [productname, setProductname] = useState<string>('');
  const [price, setPrice] = useState<string | number>(0);
  const [stock, setStock] = useState<string | number>(0);
  const [brand, setBrand] = useState<string>('');
  const [size, setSize] = useState<string>('');
  const [color, setColor] = useState<string>('');
  const [seller, setSeller] = useState<string>('');
  const [tags, setTags] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [photo, setPhoto] = useState<string>('');
  const [photofile, setPhotofile] = useState<File | null>(null);
  const [formData, setFormData] = useState<FormData>({
    category_id: "", subcategory_id: "", listsubcategory_id: "", name: "", price: "", stock: "", brand: "",
    color: "", size: "", seller: "", tags: "", description: "", status: ""
  })

  const { categories } = useSelector((state: categoryRootState) => state.categoryreducer);
  const { products } = useSelector((state: productRootState) => state.productreducer);
  const { subcategorybyid, listsubcategoryById } = useSelector((state: listsubcategoryRootState) => state.listsubcategoryreducer);
  const { brands } = useSelector((state: brandRootState) => state.brandreducer);
  const { colors } = useSelector((state: colorRootState) => state.colorreducer);
  const { sizes } = useSelector((state: sizeRootState) => state.sizereducer);
  const { sellers } = useSelector((state: sellerRootState) => state.sellerreducer);

  const router = useRouter(); // For navigation
  const searchParams = useSearchParams();
  const page = searchParams.get('page');

  const handleCreate = (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    e.preventDefault();
    try {

      //  const formData = new FormData();

      // if (photofile) {
      //   formData.append("photo", photofile);
      // }
      //formData.append("photo", photofile as Blob);
      // formData.append("category_id", catid);
      // formData.append("subcategory_id", subcatid);
      // formData.append("listsubcategory_id", listsubcatid);
      // formData.append("productname", productname);
      // formData.append("price", price.toString());
      // formData.append("stock", stock.toString());
      // formData.append("brand", brand);
      // formData.append("size", size);
      // formData.append("color", color);
      // formData.append("seller", seller);
      // formData.append("status", status);
      // formData.append("tags", tags);
      // formData.append("description", description);
      // for (const [key, value] of formData.entries()) {
      //   console.log(`${key}: ${value}`);
      // }
      // console.log("File details:", photofile);
      // console.log("File name:", photofile.name);
      // console.log("File size:", photofile.size);
      // console.log("File type:", photofile.type);
      // const data = new FormData();
    

      // // Check if a photo file exists
      // if (photofile) {
      //   data.append("photo", photofile);
      // }
      // const resolvedId = Array.isArray(id) ? id[0] : id ?? '';
      // console.log(id)
      // if (resolvedId) {
      //   data.append("_id", resolvedId);
      // } else {
      //   console.warn("No valid ID found to append.");
      // }
      // // Append form fields dynamically
      // Object.entries(formData).forEach(([key, value]) => {
      //   if (value) {
      //     data.append(key, value.toString());
      //   } else {
      //     console.warn(`Skipping empty field: ${key}`);
      //   }
      // }); 
  
      // Debug the FormData object

      // for (const [key, value] of data.entries()) {
      //   console.log(`${key}: ${value}`);
      // }
      console.log(id)
      const updatedFormData = { ...formData, id }; // Dispatch the updateProduct action dispatch(updateProduct(updatedFormData));
      console.log("Prepared FormData:",updatedFormData);
      dispatch(updateProduct(updatedFormData));
      router.push(`/product/manage-product?showToast=true&page=${page}`);
    } catch (error) {
      console.error(error);
    }
  };

  const catgoryById = (cat_id: string) => {
    if (cat_id) {
      dispatch(getSubcategoryById(cat_id));
    }
  };

  const getlistsubcategoryByID = (listcat_id: string) => {
    if (listcat_id) {
      dispatch(getListsubcategoryById(listcat_id));
    }
  };

  const showImage = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setPhoto(URL.createObjectURL(e.target.files[0]));
      setPhotofile(e.target.files[0]);
    }
  };

  useEffect(() => {
    if (id) {
      dispatch(editProduct({ id: id as string })); // Dispatch editCategory action to load existing category
    }
  }, [dispatch, id]);
  // console.log("products",products)
  // console.log(formData)
  useEffect(() => {
    if (products) {

      setFormData({ ...formData,
        category_id: products.category_id || '', subcategory_id: products.subcategory_id || '', listsubcategory_id: products.listsubcategory_id || '',
        name: products.name || '', price: products.price || '', stock: products.stock || '', brand: products.brand || '', color: products.color || '', size: products.size || '',
        seller: products.seller || '', tags: products.tags || '', description: products.description || '', status: products.status || '',
      });
    }
    if (products.category_id) {
      dispatch(getSubcategoryById(products.category_id));
    }

    if (products.subcategory_id) {
      console.log(products.subcategory_id);
      dispatch(getListsubcategoryById(products.subcategory_id));
    }
    dispatch(fetchCategory({ customPage: 1, limit: 100, search: '' }));
    dispatch(fetchSize({ customPage: 1, limit: 100, search: '' }));
    dispatch(fetchColor({ customPage: 1, limit: 100, search: '' }));
    dispatch(fetchSeller({ customPage: 1, limit: 100, search: '' }));
    dispatch(fetchBrand({ customPage: 1, limit: 100, search: '' }));
  }, [dispatch, products]);

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Edit Product" />
      <div className="grid grid-cols-1 gap-9 sm:grid-cols-1">
        <div className="flex flex-col gap-9">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">Edit Product</h3>
            </div>
            <form >
              <div className="p-6.5">
                {/* Make this section a 3x5 grid (3 columns, 5 rows) */}
                <div className="grid grid-cols-1 gap-6 xl:grid-cols-3 mb-4.5">

                  {/* Column 1 */}
                  <div className="w-full">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                      Select Category Name
                    </label>
                    <div className="relative z-20 bg-transparent dark:bg-form-input">
                      <select

                        name="category_id"
                        className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                        value={formData.category_id}
                        onChange={(e) => { setCatid(e.target.value); catgoryById(e.target.value); setFormData({ ...formData, category_id: e.target.value }) }}
                      >
                        <option value="" disabled className="text-body dark:text-bodydark">
                          Select category name
                        </option>
                        {categories?.result?.length > 0 && categories?.result?.map((item, index) => (
                          <option value={item._id} key={item._id}>{item.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Column 2 */}
                  <div className="w-full">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                      Select SubCategory Name
                    </label>
                    <div className="relative z-20 bg-transparent dark:bg-form-input">
                      <select
                        name="subcategory_id"
                        className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                        value={formData.subcategory_id}
                        onChange={(e) => {
                          setSubcatid(e.target.value);
                          getlistsubcategoryByID(e.target.value);
                          setFormData({ ...formData, subcategory_id: e.target.value })
                        }}

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
                    </div>
                  </div>

                  {/* Column 3 */}
                  <div className="w-full">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                      Select ListSubCategory Name
                    </label>
                    <div className="relative z-20 bg-transparent dark:bg-form-input">
                      <select
                        name="subcategory_id"
                        className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                        value={formData.listsubcategory_id}
                        onChange={(e) => setFormData({ ...formData, listsubcategory_id: e.target.value })}
                      >
                        <option value="" disabled className="text-body dark:text-bodydark">
                          Select subcategory name
                        </option>
                        {
                          listsubcategoryById?.map((subcat, index) => (
                            <option value={subcat?._id} key={index}>{subcat?.name}</option>
                          ))
                        }
                      </select>
                    </div>
                  </div>

                  {/* Column 1 */}
                  <div className="w-full">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                      Product Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      placeholder="Enter Product"
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                  </div>

                  {/* Additional Input Fields */}
                  {/* Column 2 */}
                  <div className="w-full">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                      Price
                    </label>
                    <input
                      type="text"
                      value={formData.price}
                      placeholder="Enter Price"
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                  </div>

                  {/* Column 3 */}
                  <div className="w-full">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                      Enter Stock
                    </label>
                    <input
                      type="text"
                      value={formData.stock}
                      placeholder="Enter Stock"
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                  </div>

                  {/* Column 1 */}
                  <div className="w-full">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                      Brand Name
                    </label>
                    <div className="relative z-20 bg-transparent dark:bg-form-input">
                      <select
                        name="status"
                        value={formData.brand}
                        onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                        className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary ${isOptionSelected ? "text-black dark:text-white" : ""}`}
                      >
                        <option value="" disabled className="text-body dark:text-bodydark">
                          Select Brand
                        </option>

                        {
                          brands?.result?.length > 0 && brands?.result?.map((bran, index) => (
                            <option value={bran._id} key={index}>{bran.name}</option>
                          ))
                        }
                      </select>
                    </div>
                  </div>

                  {/* Column 2 */}
                  <div className="w-full">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                      Color
                    </label>
                    <div className="relative z-20 bg-transparent dark:bg-form-input">
                      <select
                        name="status"
                        value={formData.color}
                        onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                        className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary ${isOptionSelected ? "text-black dark:text-white" : ""}`}
                      >
                        <option value="" disabled className="text-body dark:text-bodydark">
                          Select Color
                        </option>
                        {
                          colors?.result?.length > 0 && colors?.result?.map((bran, index) => (
                            <option value={bran._id} key={index}>{bran.name}</option>
                          ))
                        }
                      </select>
                    </div>
                  </div>

                  {/* Column 3 */}
                  <div className="w-full">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                      Size
                    </label>
                    <div className="relative z-20 bg-transparent dark:bg-form-input">
                      <select
                        name="status"
                        value={formData.size}
                        onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                        className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary ${isOptionSelected ? "text-black dark:text-white" : ""}`}
                      >
                        <option value="" disabled className="text-body dark:text-bodydark">
                          Select Size
                        </option>
                        {
                          sizes?.result?.length > 0 && sizes?.result?.map((bran, index) => (
                            <option value={bran._id} key={bran._id}>{bran.name}</option>
                          ))
                        }
                      </select>
                    </div>
                  </div>

                  {/* Column 1 */}
                  <div className="w-full">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                      Sellers
                    </label>
                    <div className="relative z-20 bg-transparent dark:bg-form-input">
                      <select
                        name="status"
                        value={formData.seller}
                        className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary ${isOptionSelected ? "text-black dark:text-white" : ""}`}
                        onChange={(e) => setFormData({ ...formData, seller: e.target.value })}
                      >
                        <option value="" disabled className="text-body dark:text-bodydark">
                          Select Seller
                        </option>
                        {
                          sellers?.result?.length > 0 && sellers?.result?.map((bran, index) => (
                            <option value={bran._id} key={index}>{bran.name}</option>
                          ))
                        }
                      </select>
                    </div>
                  </div>

                  {/* Column 2 */}
                  <div className="w-full">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                      Tags
                    </label>
                    <input
                      type="text"
                      value={formData.tags}
                      placeholder="Input Field 7"
                      onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                  </div>

                  {/* Column 3 */}
                  <div className="w-full">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                      Image
                    </label>

                    <input
                      type="file"
                      placeholder="Input Field 8"
                      onChange={(e) => showImage(e)}
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                  </div>

                  {/* Column 1 */}
                  <div className="w-full">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                      Description
                    </label>
                    <input
                      type="textarea"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Enter description"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                  </div>

                  {/* Column 2 */}
                  <div className="w-full">
                    {photo ? (
                      <div className="col-md-4">
                        <div className="form-group">
                          <label htmlFor="f">Image:-</label>
                          {photofile ? photofile.name : "Upload Photo"}
                          {photo.length > 0 ? <img src={photo} alt="product" height="100px" width="100px" /> : "No image"}
                        </div>
                      </div>
                    ) : (
                      ""
                    )}

                  </div>

                  {/* Column 3 */}
                  <div className="w-full">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                      Product Status
                    </label>
                    <div className="relative z-20 bg-transparent dark:bg-form-input">
                      <select
                        name="status"
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                      >
                        <option value="" disabled className="text-body dark:text-bodydark">
                          Select status
                        </option>
                        <option value="1" className="text-body dark:text-bodydark">
                          Active
                        </option>
                        <option value="0" className="text-body dark:text-bodydark">
                          Inactive
                        </option>
                      </select>
                    </div>
                  </div>


                </div>

                {/* Submit Button */}
                <button type="submit" onClick={handleCreate} className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90">
                  Update Product
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

    </DefaultLayout>
  );
};

export default EditProduct;
