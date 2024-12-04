"use client"
import { useEffect, useState } from "react";
import Link from 'next/link';
import Image from "next/image";
import { data } from "../data";
import { ReactComponent as IconLaptop } from "bootstrap-icons/icons/laptop.svg";
import { ReactComponent as IconHeadset } from "bootstrap-icons/icons/headset.svg";
import { ReactComponent as IconPhone } from "bootstrap-icons/icons/phone.svg";
import { ReactComponent as IconTv } from "bootstrap-icons/icons/tv.svg";
import { ReactComponent as IconDisplay } from "bootstrap-icons/icons/display.svg";
import { ReactComponent as IconHdd } from "bootstrap-icons/icons/hdd.svg";
import { ReactComponent as IconUpcScan } from "bootstrap-icons/icons/upc-scan.svg";
import { ReactComponent as IconTools } from "bootstrap-icons/icons/tools.svg";
import './home.css'
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchDealOfTheDay } from "@/redux/slices/dealofthedaySlice";


import Support from "../components/Support";
import Banner from "../components/carousel/Banner";
import Carousel from "../components/carousel/Carousel";
import CardIcon from "../components/card/CardIcon";
import CardLogin from "../components/card/CardLogin";
import CardImage from "../components/card/CardImage";
import CardDealsOfTheDay from "../components/card/CardDealsOfTheDay";
import { fetchProductsForMen, selectProductsForMen } from "@/redux/slices/productsForMenSlice";
import { fetchProductsForWomen, selectProductsForWomen } from "@/redux/slices/productsForWomenSlice";
import Deals from "./Deals";
import ManProduct from "./ManProduct";
import WomenProduct from "./WomenProduct";
import { selectAuthState, userVerifyID } from "@/redux/slices/loginSlice";
import { addToWishlist, fetchWishlist, selectWishlistItems } from "@/redux/slices/wishlistSlice";
import { toast } from "react-toastify";
import { addToCart, fetchCart, removeFromHomeCart } from "@/redux/slices/cartSlice";
import TodaysFavorite from "./TodaysFavorite";
import Accessories from "./Accessories";
import SignInViewModal from "./signInModel";



interface IconProduct {
  img: keyof typeof components;
  title: string;
  text: string;
  tips: string;
  to: string;
  cssClass: string;
}

// Define the icons in an object, similar to the class component's `components` property
const components = {
  IconLaptop,
  IconHeadset,
  IconPhone,
  IconTv,
  IconDisplay,
  IconHdd,
  IconUpcScan,
  IconTools,
};

const HomeView: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  // const { deals, status, error } = useSelector((state: RootState) => state.dealOfTheDay);
  // const { productsForMen} = useSelector(selectProductsForMen);
  // const { productsForWomen } = useSelector(selectProductsForWomen);
  const [showModal, setShowModal] = useState(false);

  // if (status === 'loading') return <p>Loading...</p>;
  // if (status === 'failed') return <p>Error: {error}</p>;
  useEffect(() => {

    dispatch(userVerifyID());

  }, []);

  const { wish, status } = useSelector(selectWishlistItems);
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set());
  const [isRefresh, setIsRefresh] = useState(false);

  const handleAddToWishlist = (productId: string) => {
    dispatch(addToWishlist(productId));
    setIsRefresh(true)
    const updatedSelectedCategories = new Set(selectedCategories);
    if (updatedSelectedCategories.has(productId)) {
      toast("Product removed from wishlist")
      updatedSelectedCategories.delete(productId);
    } else {
      toast("Product added to wishlist")
      updatedSelectedCategories.add(productId);
    }
    setSelectedCategories(updatedSelectedCategories);
  };

  useEffect(() => {
    // Fetch wishlist on initial load or when refresh is triggered
    if (isRefresh) {
      dispatch(fetchWishlist());
    }
    dispatch(fetchWishlist());
    // Set selected categories based on the updated wishlist
    if (wish.length > 0) {
      const initialProductIds = wish.map(item => item.productId);
      setSelectedCategories(new Set(initialProductIds));
    } else {
      setSelectedCategories(new Set()); // Reset if no items in the wishlist
    }

    // Reset isRefresh after fetching
    if (isRefresh) {
      setIsRefresh(false);
    }
  }, [dispatch, isRefresh, wish.length]);


  // State to track items added to the cart
  const [selectedCart, setSelectedCart] = useState<Set<string>>(new Set());
  const [iscartRefresh, setIscartRefresh] = useState(false);
  const { cartItems } = useSelector((state: RootState) => state.cart);
  console.log(selectedCart)
  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, buttontype: string, pid: string, qty: number) => {

    setIscartRefresh(true)
    const updatedselectedCart = new Set(selectedCart);
    if (updatedselectedCart.has(pid)) {
      console.log("remove")
      dispatch(removeFromHomeCart(pid));
      toast("Product removed from cart")
      updatedselectedCart.delete(pid);
    } else {
      console.log("add")
      dispatch(addToCart({ pid, qty, buttontype }))
      toast("Product added to cart")
      updatedselectedCart.add(pid);
    }
    setSelectedCart(updatedselectedCart);
  };


  useEffect(() => {
    // Fetch wishlist on initial load or when refresh is triggered
    if (iscartRefresh) {
      dispatch(fetchCart());
    }
    dispatch(fetchCart());
    // Set selected categories based on the updated wishlist
    if (cartItems?.allCart?.length > 0) {
      const initialProductIds = cartItems?.allCart?.map(item => item?.product_id?._id);
      console.log(initialProductIds)
      setSelectedCart(new Set(initialProductIds));
    } else {
      setSelectedCart(new Set()); // Reset if no items in the wishlist
    }

    // Reset isRefresh after fetching
    if (iscartRefresh) {
      setIscartRefresh(false);
    }
  }, [dispatch, iscartRefresh, cartItems?.allCart?.length]);
  //end cart

  const iconProducts = data.iconProducts as IconProduct[];
  const rows = Array.from({ length: Math.ceil(iconProducts.length / 4) });
  const productRows = rows.map((_, idx) => iconProducts.slice(idx * 4, idx * 4 + 4));

  const carouselContent = productRows.map((row, idx) => (
    <div className={`carousel-item ${idx === 0 ? "active" : ""}`} key={idx}>
      <div className="row g-3">
        {row.map((product, idx) => {
          const ProductImage = components[product.img];
          return (
            <div key={idx} className="col-md-3">
              <CardIcon
                title={product.title}
                text={product.text}
                tips={product.tips}
                to={product.to}
              >
                <ProductImage className={product.cssClass} width="80" height="80" />
              </CardIcon>
            </div>
          );
        })}
      </div>
    </div>
  ));


  return (
    <>
      <Banner className="mb-3" id="carouselHomeBanner" data={data.banner} />
      <div className="container-fluid bg-light mb-3">
        <div className="row g-3">
          <div className="col-md-9">
            <Carousel id="elect-product-category" className="mb-3">
              {carouselContent}
            </Carousel>
            <Support />
          </div>
          <div className="col-md-3">
            <CardLogin className="mb-3" />
            <CardImage src="../../images/banner/Watches.webp" to="promo" />
          </div>
        </div>
      </div>


      {/* deal of day */}

      <Deals selectedCategories={selectedCategories}
        handleAddToWishlist={(productId) => handleAddToWishlist(productId)} selectedCart={selectedCart} handleAddToCart={(e, cartType, productId, qty) =>
          handleAddToCart(e, cartType, productId, qty)
        } />

      {/* end */}


      {/* men */}

      <ManProduct selectedCategories={selectedCategories}
        handleAddToWishlist={(productId) => handleAddToWishlist(productId)} selectedCart={selectedCart} handleAddToCart={(e, cartType, productId, qty) =>
          handleAddToCart(e, cartType, productId, qty)
        } />
      {/* end */}

      {/* women */}
      <WomenProduct selectedCategories={selectedCategories}
        handleAddToWishlist={(productId) => handleAddToWishlist(productId)} selectedCart={selectedCart} handleAddToCart={(e, cartType, productId, qty) =>
          handleAddToCart(e, cartType, productId, qty)
        } />
      {/* end */}


      {/* today favorite */}

      <TodaysFavorite selectedCategories={selectedCategories}
        handleAddToWishlist={(productId) => handleAddToWishlist(productId)} selectedCart={selectedCart} handleAddToCart={(e, cartType, productId, qty) =>
          handleAddToCart(e, cartType, productId, qty)
        } />

      {/* end */}


      {/* container */}
      <Accessories />
      {/* end */}

      {/* <button onClick={() => setShowModal(true)} className="btn btn-primary">
        Open Sign In
      </button>
      <SignInViewModal show={showModal} onClose={() => setShowModal(false)} /> */}

      <div className="bg-info bg-gradient p-3 text-center mb-3">
        <h4 className="m-0">Explore Fashion Collection</h4>
      </div>
      <div className="container">
        <div className="row">
          <div className="col-md-3">
            <Link href="/" className="text-decoration-none">
              <img
                src="../../images/category/male.webp"
                className="img-fluid rounded-circle"
                alt="Men's Clothing"
              />
              <div className="text-center h6">Men's Clothing</div>
            </Link>
          </div>
          <div className="col-md-3">
            <Link href="/" className="text-decoration-none">
              <img
                src="../../images/category/female.webp"
                className="img-fluid rounded-circle"
                alt="Women's Clothing"
              />
              <div className="text-center h6">Women's Clothing</div>
            </Link>
          </div>
          <div className="col-md-3">
            <Link href="/" className="text-decoration-none">
              <img
                src="../../images/category/smartwatch.webp"
                className="img-fluid rounded-circle"
                alt="Smartwatch"
              />
              <div className="text-center h6">Smartwatch</div>
            </Link>
          </div>
          <div className="col-md-3">
            <Link href="/" className="text-decoration-none">
              <img
                src="../../images/category/footwear.webp"
                className="img-fluid rounded-circle"
                alt="Footwear"
              />
              <div className="text-center h6">Footwear</div>
            </Link>
          </div>
        </div>
      </div>

    </>
  );
};

export default HomeView;
