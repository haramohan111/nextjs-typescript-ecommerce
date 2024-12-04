"use client";
import React, { useState, useEffect } from "react";
//import { data } from "../../data/";
import { useSearchParams,useRouter, usePathname } from "next/navigation";

import Paging from "../../components/Paging";
import Breadcrumb from "../../components/Breadcrumb";
import FilterCategory from "../../components/filter/Category";
import FilterPrice from "../../components/filter/Price";
import FilterSize from "../../components/filter/Size";
import FilterStar from "../../components/filter/Star";
import FilterColor from "../../components/filter/Color";
import FilterTag from "../../components/filter/Tag";
import FilterClear from "../../components/filter/Clear";
import CardServices from "../../components/card/CardServices";
import CardProductGrid from "../../components/card/CardProductGrid";
import CardProductList from "../../components/card/CardProductList";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchGridListProducts } from "@/redux/slices/gridProductSlice";



const ProductListView: React.FC = () => {
  const [currentProducts, setCurrentProducts] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState<number | null>(null);
  const [totalPages, setTotalPages] = useState<number | null>(null);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [view, setView] = useState<"list" | "grid">("grid");
  const searchParams = useSearchParams();
  const pid:string | null = searchParams.get("id");
  // Fetch products data when the component mounts
  const dispatch = useDispatch<AppDispatch>();
  const { products, loading, error } = useSelector((state: RootState) => state.gridProduct);
  const router = useRouter();
  const pathname = usePathname();
  const [breadcrumbSegments, setBreadcrumbSegments] = useState<string[]>([]);

  const [lastSegment, setLastSegment] = useState<string | null>(null);

  useEffect(() => {
    const pathname = window.location.pathname;
    const segments = pathname.split('/').filter(Boolean);
    setLastSegment(segments[segments.length - 1] || null);
    
    if(lastSegment !==null)
    dispatch(fetchGridListProducts(lastSegment));
  }, [dispatch,lastSegment]);

  useEffect(() => {
    const totalItems = products.length;
    setTotalItems(totalItems);
    
  }, [products]);

console.log(products)
  //bradcrumb
  useEffect(() => {
    if (pathname) {
      // Extract the path segments from the URL and replace `%20` with a space
      const segments = pathname
        .replace("/category/", "") // Remove the base path
        .split("/") // Split the URL into segments
        .map((segment) => decodeURIComponent(segment)) // Decode URL-encoded characters (e.g., %20 to space)
        .filter((segment) => segment.trim() !== ""); // Remove empty segments

      // Extract query parameters and remove `id` from the URL
      const id = searchParams.get("id");
      if (id) {
        // If you need to display `id` elsewhere, handle it separately
        // You can also remove the `id` from the URL if not needed
      }

      setBreadcrumbSegments(segments);
    }
  }, [pathname, searchParams]);
  //end

  // Handle page changes
  const onPageChanged = (page: { currentPage: number; totalPages: number; pageLimit: number }) => {
    const product = products;
    const { currentPage, totalPages, pageLimit } = page;
    const offset = (currentPage - 1) * pageLimit;
    const currentProducts = product.slice(offset, offset + pageLimit);
    console.log(page,offset);
    setCurrentPage(currentPage);
    setCurrentProducts(currentProducts);
    setTotalPages(totalPages);
  };

  // Handle view change between grid and list
  const onChangeView = (view: "list" | "grid") => {
    setView(view);
  };

  // Function to get products data (duplicating data for demonstration)
  // const getProducts = (): any[] => {
  //   let products = data.products;
  //   products = products.concat(products);
  //   products = products.concat(products);
  //   products = products.concat(products);
  //   products = products.concat(products);
  //   products = products.concat(products);
  //   return products;
  // };

  return (
    <React.Fragment>
      <div
        className="p-5 bg-primary bs-cover"
        style={{
          backgroundImage: "url(../../images/banner/50-Banner.webp)",
        }}
      >
        <div className="container text-center">
          <span className="display-5 px-3 bg-white rounded shadow">{lastSegment}</span>
        </div>
      </div>
      <Breadcrumb  segments={breadcrumbSegments}/>
      <div className="container-fluid mb-3">
        <div className="row">
          <div className="col-md-3">
            <FilterCategory />
            <FilterPrice />
            <FilterSize />
            <FilterStar />
            <FilterColor />
            <FilterClear />
            <FilterTag />
            <CardServices />
          </div>
          <div className="col-md-9">
            <div className="row">
              <div className="col-7">
                <span className="align-middle fw-bold">
                  {totalItems} results for <span className="text-warning">{lastSegment}</span>
                </span>
              </div>
              <div className="col-5 d-flex justify-content-end">
                <select className="form-select mw-180 float-start" aria-label="Default select">
                  <option value={1}>Most Popular</option>
                  <option value={2}>Latest items</option>
                  <option value={3}>Trending</option>
                  <option value={4}>Price low to high</option>
                  <option value={5}>Price high to low</option>
                </select>
                <div className="btn-group ms-3" role="group">
                  <button
                    aria-label="Grid"
                    type="button"
                    onClick={() => onChangeView("grid")}
                    className={`btn ${view === "grid" ? "btn-primary" : "btn-outline-primary"}`}
                  >
                    <i className="bi bi-grid" />
                  </button>
                  <button
                    aria-label="List"
                    type="button"
                    onClick={() => onChangeView("list")}
                    className={`btn ${view === "list" ? "btn-primary" : "btn-outline-primary"}`}
                  >
                    <i className="bi bi-list" />
                  </button>
                </div>
              </div>
            </div>
            <hr />
            <div className="row g-7">
              {view === "grid" &&
                products.map((product, idx) => (
                  <div key={idx} className="col-md-2">
                    <CardProductGrid data={product} />
                  </div>
                ))
                
                }
              {view === "list" &&
                products.map((product, idx) => (
                  <div key={idx} className="col-md-12">
                    <CardProductList data={product} />
                  </div>
                ))}
            </div>
            <hr />
            <Paging
              totalRecords={totalItems}
              pageLimit={9}
              pageNeighbours={3}
              onPageChanged={onPageChanged}
              sizing=""
              alignment="justify-content-center"
            />
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default ProductListView;
