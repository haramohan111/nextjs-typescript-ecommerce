"use client"
import  {  useEffect, useState } from "react";
import { data } from "../../data"; // Make sure data has proper TypeScript types
import { useSearchParams } from "next/navigation";
import CardFeaturedProduct from "../../components/card/CardFeaturedProduct";
import CardServices from "../../components/card/CardServices";
import Details from "../../components/others/Details";
import RatingsReviews from "../../components/others/RatingsReviews";
import QuestionAnswer from "../../components/others/QuestionAnswer";
import ShippingReturns from "../../components/others/ShippingReturns";
import SizeChart from "../../components/others/SizeChart";
import { fetchProductById, selectProduct } from "@/redux/slices/fetchProductbyIDslice";
import { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "@/redux/slices/cartSlice";
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import Image from "next/image";
import { fetchDealOfTheDay } from "@/redux/slices/dealofthedaySlice";

const ProductDetailView: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

   const [qty, setQty] = useState(1);
   const router = useRouter();
   const searchParams = useSearchParams();
   const pid:string | null = searchParams.get("id");
   const { product, status, error } = useSelector(selectProduct);
   const { deals } = useSelector((state: RootState) => state.dealOfTheDay);


   const addtoCart = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>,buttontype: string,qty: number) => {
    e.preventDefault()

    if(pid){
      dispatch(addToCart({ pid, qty, buttontype }))
      .unwrap() // Handle success and errors
      .then((addedItem) => {
        // Show success message if added successfully
        toast("Item added successfully");

        // Navigate based on buttontype
        if (buttontype === 'cart') {
          router.push('/cart');
        } else if (buttontype === 'checkout') {
          router.push('/checkout');
        }
      })
      .catch((error) => {
        console.error(error);
        toast.error('Failed to add item to cart');
      });

    }
    
    
}

   useEffect(() => {

    if (pid) {
    dispatch(fetchProductById(pid));
    dispatch(fetchDealOfTheDay());
   
    }
  }, [dispatch]);

  if (status === 'loading') return <p>Loading product...</p>;
  if (status === 'failed') return <p>Error: {error}</p>;

  if (!product) return <p>No product found</p>;


  return (
    <div className="container-fluid mt-3">
      <div className="row">
        <div className="col-md-8">
          <div className="row mb-3">
            <div className="col-md-5 text-center ms-3">
              <Image
                src={require(`../../../../backend/uploads/${product.image}`)}
                className="img-fluid mb-3"
                height="400"
                width="480"
                alt="Product in red"
              />
              <Image
                src={require(`../../../../backend/uploads/${product.image}`)}
                className="border border-secondary me-2"
                width="75"
                alt="Product in grey"
              />
              <Image
                src={require(`../../../../backend/uploads/${product.image}`)}
                className="border border-secondary me-2"
                width="75"
                alt="Product in black"
              />
              <Image
                src={require(`../../../../backend/uploads/${product.image}`)}
                className="border border-secondary me-2"
                width="75"
                alt="Product in green"
              />
            </div>
            <div className="col-md-5">
              <h1 className="h5 d-inline me-2">{product?.name}</h1>
              <span className="badge bg-success me-2">New</span>
              <span className="badge bg-danger me-2">Hot</span>
              <div className="mb-3">
                <i className="bi bi-star-fill text-warning me-1" />
                <i className="bi bi-star-fill text-warning me-1" />
                <i className="bi bi-star-fill text-warning me-1" />
                <i className="bi bi-star-fill text-warning me-1" />
                <i className="bi bi-star-fill text-secondary me-1" />|{" "}
                <span className="text-muted small">42 ratings and 4 reviews</span>
              </div>
              <dl className="row small mb-3">
                <dt className="col-sm-3">Availability</dt>
                <dd className="col-sm-9">In stock</dd>
                <dt className="col-sm-3">Sold by</dt>
                <dd className="col-sm-9">Authorised Store</dd>
                <dt className="col-sm-3">Size</dt>
                <dd className="col-sm-9">
                  {['S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                    <div className="form-check form-check-inline" key={size}>
                      <input
                        className="form-check-input"
                        type="radio"
                        name="size"
                        id={`size-${size}`}
                        disabled={size === 'S' || size === 'M'} // Example condition
                      />
                      <label className="form-check-label" htmlFor={`size-${size}`}>
                        {size}
                      </label>
                    </div>
                  ))}
                </dd>
                <dt className="col-sm-3">Color</dt>
                <dd className="col-sm-9">
                  {['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'dark'].map((color) => (
                    <button key={color} className={`btn btn-sm btn-${color} p-2 me-2`}></button>
                  ))}
                </dd>
              </dl>

              <div className="mb-3">
                <span className="fw-bold h5 me-2">Rs.{product?.price}</span>
                <del className="small text-muted me-2">Rs.{product?.price+100}</del>
                <span className="rounded p-1 bg-warning me-2 small">-Rs.100</span>
              </div>
              <div className="mb-3">
                <div className="d-inline float-start me-2">
                  <div className="input-group input-group-sm mw-140">
                    <button className="btn btn-primary text-white" type="button">
                      <i className="bi bi-dash-lg"></i>
                    </button>
                    <input type="text" className="form-control" defaultValue="1" />
                    <button className="btn btn-primary text-white" type="button">
                      <i className="bi bi-plus-lg"></i>
                    </button>
                  </div>
                </div>
                <button type="button" className="btn btn-sm btn-primary me-2" title="Add to cart" onClick={(e)=>{addtoCart(e,"cart",qty)}}>
                  <i className="bi bi-cart-plus me-1"></i>Add to cart
                </button>
                <button type="button" className="btn btn-sm btn-warning me-2" title="Buy now" onClick={(e)=>{addtoCart(e,"checkout",qty)}}>
                  <i className="bi bi-cart3 me-1"></i>Buy now
                </button>
                <button type="button" className="btn btn-sm btn-outline-secondary" title="Add to wishlist">
                  <i className="bi bi-heart-fill"></i>
                </button>
              </div>
              <div>
                <p className="fw-bold mb-2 small">Product Highlights</p>
                <ul className="small">
                  <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</li>
                  <li>Etiam ullamcorper nibh eget faucibus dictum.</li>
                  <li>Cras consequat felis ut vulputate porttitor.</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <nav>
                <div className="nav nav-tabs" id="nav-tab" role="tablist">
                  <a className="nav-link active" id="nav-details-tab" data-bs-toggle="tab" href="#nav-details" role="tab" aria-controls="nav-details" aria-selected="true">
                    Details
                  </a>
                  <a className="nav-link" id="nav-randr-tab" data-bs-toggle="tab" href="#nav-randr" role="tab" aria-controls="nav-randr" aria-selected="false">
                    Ratings & Reviews
                  </a>
                  <a className="nav-link" id="nav-faq-tab" data-bs-toggle="tab" href="#nav-faq" role="tab" aria-controls="nav-faq" aria-selected="false">
                    Questions and Answers
                  </a>
                  <a className="nav-link" id="nav-ship-returns-tab" data-bs-toggle="tab" href="#nav-ship-returns" role="tab" aria-controls="nav-ship-returns" aria-selected="false">
                    Shipping & Returns
                  </a>
                  <a className="nav-link" id="nav-size-chart-tab" data-bs-toggle="tab" href="#nav-size-chart" role="tab" aria-controls="nav-size-chart" aria-selected="false">
                    Size Chart
                  </a>
                </div>
              </nav>
              <div className="tab-content p-3 small" id="nav-tabContent">
                <div className="tab-pane fade show active" id="nav-details" role="tabpanel" aria-labelledby="nav-details-tab">
                  <Details />
                </div>
                <div className="tab-pane fade" id="nav-randr" role="tabpanel" aria-labelledby="nav-randr-tab">
                  {Array.from({ length: 5 }, (_, key) => (
                    <RatingsReviews key={key} rating={0} reviewDate={""} reviewText={""} helpfulCount={0} notHelpfulCount={0} />
                  ))}
                </div>
                <div className="tab-pane fade" id="nav-faq" role="tabpanel" aria-labelledby="nav-faq-tab">
                  <dl>
                    {Array.from({ length: 5 }, (_, key) => (
                      <QuestionAnswer key={key} question={""} answer={""} author={""} date={""} />
                    ))}
                  </dl>
                </div>
                <div className="tab-pane fade" id="nav-ship-returns" role="tabpanel" aria-labelledby="nav-ship-returns-tab">
                  <ShippingReturns />
                </div>
                <div className="tab-pane fade" id="nav-size-chart" role="tabpanel" aria-labelledby="nav-size-chart-tab">
                  <SizeChart />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <CardFeaturedProduct data={deals} />
          <CardServices />
        </div>
      </div>
    </div>
  );
};

export default ProductDetailView;
