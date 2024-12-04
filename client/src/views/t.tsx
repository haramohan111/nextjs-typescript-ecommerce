"use client"
import { useEffect } from "react";
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
  const { deals, status, error } = useSelector((state: RootState) => state.dealOfTheDay);
  const { productsForMen } = useSelector(selectProductsForMen);
  const { productsForWomen } = useSelector(selectProductsForWomen);


  // useEffect(() => {
  //   if (status === 'idle') {
  //     dispatch(fetchDealOfTheDay());
  //     dispatch(fetchProductsForMen());
  //     dispatch(fetchProductsForWomen());
  //   }
  // }, [status, dispatch]);

  if (status === 'loading') return <p>Loading...</p>;
  if (status === 'failed') return <p>Error: {error}</p>;

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

      <div className="container-fluid bg-light mb-3">
        <div className="row">
          <div className="col-md-12">
            <CardDealsOfTheDay
              endDate={Date.now() + 1000 * 60 * 60 * 14}
              title="Deals of the Day"
              to="/"
            >
              <div className="row">
                {deals.map((item, id) => (
                  <div className="col-md-3" key={id}>
                    <div className="product-card shadow-sm mb-3 position-relative">
                      <Link href={`/product/detail?id=${item?.product?._id}`}>
                        <Image
                          //src={`https://picsum.photos/300/400?random=${id}`}
                          src={require(`../../../backend/uploads/${item?.product?.image}`)}
                          className="product-card-img"
                          alt={`Product ${id}`}
                        />
                      </Link>
                      <div className="product-card-body">
                        <h5 className="product-card-title">{item.product.name}</h5>
                        <p className="product-card-text">Rs. {item.product.price}</p>
                      </div>
                      {/* Heart Icon */}
                      <button
                        className="product-wishlist-icon"
                        aria-label={`Add Product ${id} to wishlist`}
                      >
                        ❤️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </CardDealsOfTheDay>
          </div>
        </div>
      </div>

      {/* end */}


      {/* men */}

      <div id="slider" className="carousel slide container-fluid bg-light mb-3" data-bs-ride="carousel">
        <div className="card">
          <div className="card-body">
            <h5 className="card-title pb-3 border-bottom">Men</h5>
            <div className="carousel-inner carousel-custom-item">
              <div className="carousel-item active">
                <div className="row justify-content-center g-2">
                  {productsForMen.map((item, index) => (
                    <div className="col-6 col-sm-4 col-md-2" key={index}>
                      <div className="custom-card text-center position-relative">
                        <Link href={`/product/detail?id=${item?._id}`}>
                          <Image
                            // src={`https://picsum.photos/150/200?random=${id}`}
                            src={require(`../../../backend/uploads/${item.image}`)}
                            className="card-img-top"
                            alt={`Product ${index}`}
                          />
                        </Link>
                        <div className="custom-card-body">
                          <h6 className="custom-card-title">Product {index}</h6>
                          <p className="custom-card-text">$ {(index * 10 + 39.99).toFixed(2)}</p>
                        </div>
                        <button className="wishlist-icon" aria-label="Add to wishlist">
                          ❤️
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* end */}

      {/* women */}
      <div id="slider" className="carousel slide container-fluid bg-light mb-3" data-bs-ride="carousel">
        <div className="card">
          <div className="card-body">
            <h5 className="card-title pb-3 border-bottom">Women</h5>
            <div className="carousel-inner carousel-custom-item">
              <div className="carousel-item active">
                <div className="row justify-content-center g-2">
                  {productsForWomen.map((item, id) => (
                    <div className="col-6 col-sm-4 col-md-2" key={id}>
                      <div className="custom-card text-center position-relative">
                        <Link href={`/product/detail?id=${item?._id}`}>
                          <Image
                            // src={`https://picsum.photos/150/200?random=${id}`}
                            src={require(`../../../backend/uploads/${item.image}`)}
                            className="card-img-top"
                            alt={`Product ${id}`}
                          />
                        </Link>
                        <div className="custom-card-body">
                          <h6 className="custom-card-title">Product {id}</h6>
                          <p className="custom-card-text">$ {(id * 10 + 39.99).toFixed(2)}</p>
                        </div>
                        <button className="wishlist-icon" aria-label="Add to wishlist">
                          ❤️
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* end */}


      {/* today favorite */}

      <div className="container-fluid bg-light mb-3">
        <div className="card">
          <div className="card-body">
            <h5 className="card-title pb-3 border-bottom">
              Today favorite
            </h5>
            <div id="slider2" className="carousel slide" data-bs-ride="carousel">
              <div className="carousel-inner">
                <div className="carousel-item active">
                  <div className="row">
                    <div className="col-md-3">
                      <div className="card text-center position-relative">
                        <Link href="/product/1">
                          <img
                            src="https://picsum.photos/200/300?random=1"
                            className="card-img-top"
                            alt="Product 1"
                          />
                        </Link>
                        <div className="card-body">
                          <h5 className="card-title">Product 1</h5>
                          <p className="card-text">$49.99</p>
                        </div>
                        {/* Heart icon in the bottom-right corner */}
                        <span className="heart-icon position-absolute" style={{ bottom: '10px', right: '10px' }}>
                          <i className="bi bi-heart-fill" style={{ fontSize: '1.5rem', color: 'red' }}></i>
                        </span>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="card text-center position-relative">
                        <Link href="/product/2">
                          <img
                            src="https://picsum.photos/200/300?random=2"
                            className="card-img-top"
                            alt="Product 2"
                          />
                        </Link>
                        <div className="card-body">
                          <h5 className="card-title">Product 2</h5>
                          <p className="card-text">$79.99</p>
                        </div>
                        {/* Heart icon in the bottom-right corner */}
                        <span className="heart-icon position-absolute" style={{ bottom: '10px', right: '10px' }}>
                          <i className="bi bi-heart-fill" style={{ fontSize: '1.5rem', color: 'red' }}></i>
                        </span>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="card text-center position-relative">
                        <Link href="/product/3">
                          <img
                            src="https://picsum.photos/200/300?random=3"
                            className="card-img-top"
                            alt="Product 3"
                          />
                        </Link>
                        <div className="card-body">
                          <h5 className="card-title">Product 3</h5>
                          <p className="card-text">$99.99</p>
                        </div>
                        {/* Heart icon in the bottom-right corner */}
                        <span className="heart-icon position-absolute" style={{ bottom: '10px', right: '10px' }}>
                          <i className="bi bi-heart-fill" style={{ fontSize: '1.5rem', color: 'red' }}></i>
                        </span>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="card text-center position-relative">
                        <Link href="/product/4">
                          <img
                            src="https://picsum.photos/200/300?random=4"
                            className="card-img-top"
                            alt="Product 4"
                          />
                        </Link>
                        <div className="card-body">
                          <h5 className="card-title">Product 4</h5>
                          <p className="card-text">$59.99</p>
                        </div>
                        {/* Heart icon in the bottom-right corner */}
                        <span className="heart-icon position-absolute" style={{ bottom: '10px', right: '10px' }}>
                          <i className="bi bi-heart-fill" style={{ fontSize: '1.5rem', color: 'red' }}></i>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="carousel-item">
                  <div className="row">
                    <div className="col-md-3">
                      <div className="card text-center position-relative">
                        <Link href="/product/5">
                          <img
                            src="https://picsum.photos/200/300?random=5"
                            className="card-img-top"
                            alt="Product 5"
                          />
                        </Link>
                        <div className="card-body">
                          <h5 className="card-title">Product 5</h5>
                          <p className="card-text">$89.99</p>
                        </div>
                        {/* Heart icon in the bottom-right corner */}
                        <span className="heart-icon position-absolute" style={{ bottom: '10px', right: '10px' }}>
                          <i className="bi bi-heart-fill" style={{ fontSize: '1.5rem', color: 'red' }}></i>
                        </span>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="card text-center position-relative">
                        <Link href="/product/6">
                          <img
                            src="https://picsum.photos/200/300?random=6"
                            className="card-img-top"
                            alt="Product 6"
                          />
                        </Link>
                        <div className="card-body">
                          <h5 className="card-title">Product 6</h5>
                          <p className="card-text">$69.99</p>
                        </div>
                        {/* Heart icon in the bottom-right corner */}
                        <span className="heart-icon position-absolute" style={{ bottom: '10px', right: '10px' }}>
                          <i className="bi bi-heart-fill" style={{ fontSize: '1.5rem', color: 'red' }}></i>
                        </span>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="card text-center position-relative">
                        <Link href="/product/7">
                          <img
                            src="https://picsum.photos/200/300?random=7"
                            className="card-img-top"
                            alt="Product 7"
                          />
                        </Link>
                        <div className="card-body">
                          <h5 className="card-title">Product 7</h5>
                          <p className="card-text">$39.99</p>
                        </div>
                        {/* Heart icon in the bottom-right corner */}
                        <span className="heart-icon position-absolute" style={{ bottom: '10px', right: '10px' }}>
                          <i className="bi bi-heart-fill" style={{ fontSize: '1.5rem', color: 'red' }}></i>
                        </span>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="card text-center position-relative">
                        <Link href="/product/8">
                          <img
                            src="https://picsum.photos/200/300?random=8"
                            className="card-img-top"
                            alt="Product 8"
                          />
                        </Link>
                        <div className="card-body">
                          <h5 className="card-title">Product 8</h5>
                          <p className="card-text">$109.99</p>
                        </div>
                        {/* Heart icon in the bottom-right corner */}
                        <span className="heart-icon position-absolute" style={{ bottom: '10px', right: '10px' }}>
                          <i className="bi bi-heart-fill" style={{ fontSize: '1.5rem', color: 'red' }}></i>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <button
                className="carousel-control-prev"
                type="button"
                data-bs-target="#slider2"
                data-bs-slide="prev"
              >
                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Previous</span>
              </button>
              <button
                className="carousel-control-next"
                type="button"
                data-bs-target="#slider2"
                data-bs-slide="next"
              >
                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Next</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* end */}



      {/* container */}

      <div className="container-fluid bg-light mb-3">
        <div className="row justify-content-between">
          {/* Container 1 */}
          <div className="col-12 col-md-4 mb-3">
            <div className="product-container">
              <div className="container-header d-flex justify-content-between align-items-center mb-3">
                <h5 className="text-start mb-0">Container 1</h5>
                <Link href="/container1" className="arrow-icon-link">
                  <span className="arrow-icon" style={{ fontSize: "1.5rem" }}>
                    &#8594;
                  </span>
                </Link>
              </div>
              {/* Row 1 - First Two Products */}
              <div className="row g-3">
                <div className="col-6">
                  <div className="product-card text-center">
                    <Link href="/product/1">
                      <img
                        src="https://picsum.photos/150/150?random=1"
                        className="product-img"
                        alt="Product 1"
                      />
                    </Link>
                    <div className="product-info">
                      <h6 className="product-title">Product 1</h6>
                      <p className="product-price">$39.99</p>
                    </div>
                  </div>
                </div>
                <div className="col-6">
                  <div className="product-card text-center">
                    <Link href="/product/2">
                      <img
                        src="https://picsum.photos/150/150?random=2"
                        className="product-img"
                        alt="Product 2"
                      />
                    </Link>
                    <div className="product-info">
                      <h6 className="product-title">Product 2</h6>
                      <p className="product-price">$49.99</p>
                    </div>
                  </div>
                </div>
              </div>
              {/* Row 2 - Last Two Products */}
              <div className="row g-3">
                <div className="col-6">
                  <div className="product-card text-center">
                    <Link href="/product/3">
                      <img
                        src="https://picsum.photos/150/150?random=3"
                        className="product-img"
                        alt="Product 3"
                      />
                    </Link>
                    <div className="product-info">
                      <h6 className="product-title">Product 3</h6>
                      <p className="product-price">$59.99</p>
                    </div>
                  </div>
                </div>
                <div className="col-6">
                  <div className="product-card text-center">
                    <Link href="/product/4">
                      <img
                        src="https://picsum.photos/150/150?random=4"
                        className="product-img"
                        alt="Product 4"
                      />
                    </Link>
                    <div className="product-info">
                      <h6 className="product-title">Product 4</h6>
                      <p className="product-price">$69.99</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Container 2 */}
          <div className="col-12 col-md-4 mb-3">
            <div className="product-container">
              <div className="container-header d-flex justify-content-between align-items-center mb-3">
                <h5 className="text-start mb-0">Container 2</h5>
                <Link href="/container2" className="arrow-icon-link">
                  <span className="arrow-icon" style={{ fontSize: "1.5rem" }}>
                    &#8594;
                  </span>
                </Link>
              </div>
              {/* Row 1 */}
              <div className="row g-3">
                <div className="col-6">
                  <div className="product-card text-center">
                    <Link href="/product/5">
                      <img
                        src="https://picsum.photos/150/150?random=5"
                        className="product-img"
                        alt="Product 5"
                      />
                    </Link>
                    <div className="product-info">
                      <h6 className="product-title">Product 5</h6>
                      <p className="product-price">$79.99</p>
                    </div>
                  </div>
                </div>
                <div className="col-6">
                  <div className="product-card text-center">
                    <Link href="/product/6">
                      <img
                        src="https://picsum.photos/150/150?random=6"
                        className="product-img"
                        alt="Product 6"
                      />
                    </Link>
                    <div className="product-info">
                      <h6 className="product-title">Product 6</h6>
                      <p className="product-price">$89.99</p>
                    </div>
                  </div>
                </div>
              </div>
              {/* Row 2 */}
              <div className="row g-3">
                <div className="col-6">
                  <div className="product-card text-center">
                    <Link href="/product/7">
                      <img
                        src="https://picsum.photos/150/150?random=7"
                        className="product-img"
                        alt="Product 7"
                      />
                    </Link>
                    <div className="product-info">
                      <h6 className="product-title">Product 7</h6>
                      <p className="product-price">$99.99</p>
                    </div>
                  </div>
                </div>
                <div className="col-6">
                  <div className="product-card text-center">
                    <Link href="/product/8">
                      <img
                        src="https://picsum.photos/150/150?random=8"
                        className="product-img"
                        alt="Product 8"
                      />
                    </Link>
                    <div className="product-info">
                      <h6 className="product-title">Product 8</h6>
                      <p className="product-price">$109.99</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Container 3 */}
          <div className="col-12 col-md-4 mb-3">
            <div className="product-container">
              <div className="container-header d-flex justify-content-between align-items-center mb-3">
                <h5 className="text-start mb-0">Container 3</h5>
                <Link href="/container3" className="arrow-icon-link">
                  <span className="arrow-icon" style={{ fontSize: "1.5rem" }}>
                    &#8594;
                  </span>
                </Link>
              </div>
              {/* Row 1 */}
              <div className="row g-3">
                <div className="col-6">
                  <div className="product-card text-center">
                    <Link href="/product/9">
                      <img
                        src="https://picsum.photos/150/150?random=9"
                        className="product-img"
                        alt="Product 9"
                      />
                    </Link>
                    <div className="product-info">
                      <h6 className="product-title">Product 9</h6>
                      <p className="product-price">$119.99</p>
                    </div>
                  </div>
                </div>
                <div className="col-6">
                  <div className="product-card text-center">
                    <Link href="/product/10">
                      <img
                        src="https://picsum.photos/150/150?random=10"
                        className="product-img"
                        alt="Product 10"
                      />
                    </Link>
                    <div className="product-info">
                      <h6 className="product-title">Product 10</h6>
                      <p className="product-price">$129.99</p>
                    </div>
                  </div>
                </div>
              </div>
              {/* Row 2 */}
              <div className="row g-3">
                <div className="col-6">
                  <div className="product-card text-center">
                    <Link href="/product/11">
                      <img
                        src="https://picsum.photos/150/150?random=11"
                        className="product-img"
                        alt="Product 11"
                      />
                    </Link>
                    <div className="product-info">
                      <h6 className="product-title">Product 11</h6>
                      <p className="product-price">$139.99</p>
                    </div>
                  </div>
                </div>
                <div className="col-6">
                  <div className="product-card text-center">
                    <Link href="/product/12">
                      <img
                        src="https://picsum.photos/150/150?random=12"
                        className="product-img"
                        alt="Product 12"
                      />
                    </Link>
                    <div className="product-info">
                      <h6 className="product-title">Product 12</h6>
                      <p className="product-price">$149.99</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* end */}



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
