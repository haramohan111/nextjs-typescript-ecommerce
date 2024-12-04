"use client"
import { Metadata } from "next";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { toast } from 'react-toastify';
import { AppDispatch } from '@/redux/store';
import { useDispatch, useSelector } from "react-redux";
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import DefaultLayout from "../Layouts/DefaultLayout";
import Breadcrumb from "../Breadcrumbs/Breadcrumb";
import ReactPaginate from 'react-paginate';
import { subcategoryRootState } from "@/types/subcategoryTypes";
import { fetchsubCategory,deleteAllSubCategories, deletesubCategory, activesubCategory } from "@/redux/slices/subcategorySlice";

export const metadata: Metadata = {
  title: "Manage SubCategory | Dashboard",
  description: "Manage your subcategories efficiently with checkboxes",
};



const ManageSubCategory: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedsubcategories, setSelectedsubcategories] = useState<Set<string>>(new Set());


  //const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const showToast = searchParams.get('showToast'); // This should return 'true'
  const page = searchParams.get('page');

  const { subcategories, status, error } = useSelector(
    (state: subcategoryRootState) => state.subcategoryreducer
  );

  const pageIndex = subcategories?.pageindex ?? 1;


  const limit = 3;
  const currentPage = useRef<number>(1);
  const [search, setSearch] = useState("");
  //const [previousPage, setPreviousPage] = useState(1);
  const [currentPageNum, setCurrentPageNum] = useState(1);
  const [loading, setLoading] = useState(false);
  const [currentAction, setCurrentAction] = useState("")
  const [searchSubmitted, setSearchSubmitted] = useState(false);
  const [hasShownToast, setHasShownToast] = useState(false);
  // Fetch subcategories data based on the current page

  const fetchsubcategories = async () => {
    setLoading(true);


    let pageToFetch = page ? parseInt(page, 10) : 1;

    setCurrentPageNum(pageToFetch)

    if (search == '' && localStorage.getItem("currentPage")) {
      pageToFetch = parseInt(localStorage.getItem("currentPage") || "1", 10)
      setCurrentPageNum(pageToFetch)
      const url = new URL(window.location.href);
      url.searchParams.set("page", pageToFetch.toString());

      router.push(url.toString());
      localStorage.removeItem("currentPage");
      console.log("a")
    }
    // else if(search!== ''){
    //   pageToFetch = 1
    //   console.log("b")
    // }


    await dispatch(fetchsubCategory({ customPage: pageToFetch, limit, search }))
      .then((response: any) => {
        // Check if the result is empty and reset to page 1 if the current page has no data
        if (response.payload?.result.length === 0 && currentPageNum > 1) {
          const prevPage = currentPageNum - 1
          //currentPage.current = 1; // Reset to page 1
          setCurrentPageNum(prevPage);
          console.log("response", currentPageNum)
          // Fetch the first page's data
          dispatch(fetchsubCategory({ customPage: prevPage, limit, search }));
          const url = new URL(window.location.href);
          url.searchParams.set("page", prevPage.toString());
          router.push(url.toString());
        }
      });


    setLoading(false);
  };

  const handlePageClick = (e: { selected: number }) => {
    const newPage = e.selected + 1;  // React Paginate gives zero-indexed page number
    currentPage.current = newPage;
    setCurrentPageNum(newPage); // Adjusting the page number when clicked

    const url = new URL(window.location.href);
    url.searchParams.set("page", newPage.toString());

    router.push(url.toString()); // Use push to add the page number to the URL
  };


  const handleKeyPress = (e: ChangeEvent<HTMLInputElement>) => {

    const value = e.target.value;
    if (value !== '') {
      localStorage.setItem("currentPage", currentPageNum.toString());
    }

    setSearch(value)
    setCurrentPageNum(1); // Reset to the first page for new searches
    // setSearchSubmitted(true); // Mark that a search was submitted

    const url = new URL(window.location.href);
    url.searchParams.set("page", "1".toString());

    router.push(url.toString());

  };

  const handleDelete = (id: string) => {
    dispatch(deletesubCategory(id));
    setIsSubmitted(true)

  };

  const handleDeleteSelected = async () => {
    const selectedIds: string[] = [...selectedsubcategories]; // Convert Set<string> to string[]


    if (selectedIds.length > 0) {
      // Step 1: Dispatch the delete action for all selected subcategories
      dispatch(deleteAllSubCategories(selectedIds));
      setIsSubmitted(true);
      setSelectedsubcategories(new Set());

    } else {
      toast.error("No subcategories selected for deletion.");
    }
  };

  const handleEdit = (id: string) => {
    router.push(`/subcategory/edit-subcategory/${id}?page=${currentPageNum}`);
  };

  const handleActive = (e: React.MouseEvent<HTMLButtonElement>, id: string) => {
    e.preventDefault();

    const act = e.currentTarget.value === "Active" ? 0 : 1;
    const data = { id, status: act };
    dispatch(activesubCategory({ data }));
    setIsSubmitted(true)
  };

  const handleSelectAll = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const allIds = subcategories.result.map((category) => category._id);
      setSelectedsubcategories(new Set(allIds));
    } else {
      setSelectedsubcategories(new Set());
    }
  };

  const handleSelectCategory = (id: string) => {
    const updatedSelectedsubcategories = new Set(selectedsubcategories);
    if (updatedSelectedsubcategories.has(id)) {
      updatedSelectedsubcategories.delete(id);
    } else {
      updatedSelectedsubcategories.add(id);
    }
    setSelectedsubcategories(updatedSelectedsubcategories);
  };


  const pageCount = subcategories?.pageCount ? Math.max(1, Math.ceil(subcategories.pageCount)) : 1;

  // Ensure forcePage does not exceed pageCount - 1
  const forcePageValue = Math.min(currentPageNum - 1, pageCount - 1);
  useEffect(() => {
    const fetchData = async () => {
      try {
        fetchsubcategories();


        if (showToast && !hasShownToast) {

          const url = new URL(window.location.href);
          url.searchParams.delete("showToast");

          router.replace(url.toString());
          toast.success("Data updated successfully!");
          setHasShownToast(true);
        }

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    setIsSubmitted(false)
    fetchData();
  }, [search, showToast, hasShownToast, isSubmitted, currentAction, page, dispatch]);


  return (
    <DefaultLayout>
      <Breadcrumb pageName="Manage SubCategory" />
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="px-4 py-6 md:px-6 xl:px-7.5 relative flex items-center w-full">
          <div className="relative w-1/3">
            <input
              type="text"
              value={search}
              onChange={handleKeyPress}
              className="w-full px-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Search Category"
            />
          </div>
          <button
            onClick={handleDeleteSelected}
            className="ml-auto px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Delete All Selected
          </button>
        </div>

        <div className="grid grid-cols-7 border-t border-stroke px-4 py-4.5 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5">
          <div className="col-span-1 flex items-center">
            <input
              type="checkbox"
              onChange={handleSelectAll}
              checked={subcategories?.result?.length === selectedsubcategories.size}
            />
          </div>
          <div className="col-span-1 flex items-center">
            <p className="font-medium">ID</p>
          </div>
          <div className="col-span-1 flex items-center">
            <p className="font-medium">Category Name</p>
          </div>
          <div className="col-span-2 flex items-center">
            <p className="font-medium">Subcategory Name</p>
          </div>
          <div className="col-span-1 hidden items-center sm:flex">
            <p className="font-medium">Status</p>
          </div>
          <div className="col-span-1 flex items-center">
            <p className="font-medium">Action</p>
          </div>
        </div>
        {loading ? (
          <div className="text-center py-4">
            <p>Loading...</p>
          </div>
        ) : subcategories?.result?.length === 0 ? (
          <div className="text-center py-4">
            <p>No results found for "{search}".</p>
          </div>
        ): (
          <>
            {subcategories?.result?.map((item, key) => (
              <div
                className="grid grid-cols-7 border-t border-stroke px-4 py-4.5 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5"
                key={key}
              >
                <div className="col-span-1 flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedsubcategories.has(item._id)}
                    onChange={() => handleSelectCategory(item._id)}
                  />
                </div>
                <div className="col-span-1 flex items-center">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    <p className="text-sm text-black dark:text-white">{pageIndex + key + 1}</p>
                  </div>
                </div>
                <div className="col-span-1 flex items-center">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    <p className="text-sm text-black dark:text-white">{item?.category_id?.name}</p>
                  </div>
                </div>
                <div className="col-span-2 flex items-center">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    <p className="text-sm text-black dark:text-white">{item?.name}</p>
                  </div>
                </div>

                <div className="col-span-1 hidden items-center sm:flex">
                  {item.status === 1 ? (
                    <button
                      className="ml-2 px-3 py-1 text-sm text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
                      value="Active"
                      onClick={(e) => handleActive(e, item._id)}
                    >
                      Active
                    </button>
                  ) : (
                    <button
                      className="ml-2 px-3 py-1 text-sm text-white bg-red-500 rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300"
                      value="InActive"
                      onClick={(e) => handleActive(e, item._id)}
                    >
                      In-Active
                    </button>
                  )}
                </div>

                <div className="col-span-1 flex items-center">
                  {/* Edit Button */}
                  <button
                    onClick={() => handleEdit(item._id)}
                    className="ml-2 px-3 py-1 text-sm text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  >
                    Edit
                  </button>

                  {/* Delete Button */}
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="ml-2 px-3 py-1 text-sm text-white bg-red-500 rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </>
        )}
        <div className="px-4 py-4.5">
          <ReactPaginate
            forcePage={forcePageValue}
            breakLabel="..."
            nextLabel="&raquo;"
            onPageChange={handlePageClick}
            pageRangeDisplayed={limit}
            pageCount={pageCount}
            previousLabel="&laquo;"
            renderOnZeroPageCount={null}
            marginPagesDisplayed={2}
            containerClassName="pagination flex justify-center items-center space-x-1"
            pageClassName="page-item"
            pageLinkClassName="page-link px-3 py-1 text-sm font-medium rounded-full bg-gray-200 hover:bg-blue-500 hover:text-white transition duration-200"
            previousClassName="page-item"
            previousLinkClassName="page-link px-3 py-1 text-sm font-medium rounded-full bg-gray-200 hover:bg-blue-500 hover:text-white transition duration-200"
            nextClassName="page-item"
            nextLinkClassName="page-link px-3 py-1 text-sm font-medium rounded-full bg-gray-200 hover:bg-blue-500 hover:text-white transition duration-200"
            activeClassName="active bg-blue-500 text-white"

          />
        </div>


      </div>
    </DefaultLayout>
  );
};

export default ManageSubCategory;
