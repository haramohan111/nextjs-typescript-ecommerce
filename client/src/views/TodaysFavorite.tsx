import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { fetchTodaysFavorite, selectTodaysFavorite } from '@/redux/slices/todayfavSlice'
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import Image from "next/image";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { selectAuthState } from '@/redux/slices/loginSlice';
import SignInViewModal from './signInModel';

interface DealsProps {
    selectedCategories: Set<string>;
    handleAddToWishlist: (productId: string) => void;
    selectedCart: Set<string>;
    handleAddToCart: (e: React.MouseEvent<HTMLButtonElement>, cartType: string, productId: string, qty: number) => void;
  }

const TodaysFavorite: React.FC<DealsProps> = ({ selectedCategories, handleAddToWishlist,selectedCart,handleAddToCart }) => {

    const dispatch = useDispatch<AppDispatch>();
    const { favorites, status, error } = useSelector(selectTodaysFavorite);
    const { user } = useSelector(selectAuthState);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchTodaysFavorite());
        }
    }, [status, dispatch]);
    const responsive = {
        superLargeDesktop: {
            // the naming can be any, depends on you.
            breakpoint: { max: 4000, min: 3000 },
            items: 5,
            slidesToSlide: 3
        },
        desktop: {
            breakpoint: { max: 3000, min: 1024 },
            items: 3
        },
        tablet: {
            breakpoint: { max: 1024, min: 464 },
            items: 2
        },
        mobile: {
            breakpoint: { max: 464, min: 0 },
            items: 1
        }
    };
    return (
        <div className="container-fluid bg-light mb-3">
            <div className="card">
                <div className="card-body">
                    <h5 className="card-title pb-3 border-bottom">Today's Favorites</h5>
                    <Carousel
                        responsive={responsive}
                        containerClass="carousel-container"
                        itemClass="carousel-item-padding-40-px"
                        autoPlay={true}
                        infinite={true}
                    >
                        {favorites.map((item, index) => (
                            <div key={index} className="d-flex justify-content-center">
                                <div
                                    className="card text-center position-relative"
                                    style={{
                                        width: '280px', // Adjusted fixed width for the card
                                        margin: '0 auto',
                                        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', // Optional: subtle shadow
                                    }}
                                >
                                    <Link href={`/product/detail?id=${item?._id}`}>
                                        <Image
                                            src={require(`../../../backend/uploads/${item.image}`)}
                                            alt={item.name}
                                            width={280}
                                            height={350}
                                            style={{
                                                objectFit: 'cover',
                                                borderRadius: '4px 4px 0 0', // Rounded top corners for a polished look
                                            }}
                                        />
                                    </Link>
                                    <div className="card-body p-3">
                                        <h5 className="card-title text-truncate" title={item.name}>
                                            {item.name}
                                        </h5>

                    {user == null ?

<button
  className="product-wishlist-ico heart-red"
  aria-label={`Remove Product ${item?._id} from wishlist`}
  onClick={() => setShowModal(true)}
>
  &#9829;
</button>
:
<p>
  {selectedCategories.has(item?._id) ? (
    <button
      className="product-wishlist-ico heart-red"
      aria-label={`Remove Product ${item?._id} from wishlist`}
      onClick={() => handleAddToWishlist(item?._id)}
    >
      &#9829;
    </button>
  ) : (
    <button
      className="product-wishlist-ico heart-black"
      aria-label={`Add Product ${item?._id} to wishlist`}
      onClick={() => handleAddToWishlist(item?._id)}
    >
      &#9829;
    </button>
  )}
</p>}
                                        <p className="card-text m-0">Rs. {item.price}
                                        {selectedCart.has(item?._id) ? (
                      <button
                        className="product-cart-icon cart-green"
                        aria-label={`Add Product ${item?._id} to cart`}
                        title="1"
                        onClick={(e) => handleAddToCart(e, "homecart", item?._id, 1)}
                      >
                       <i className="bi bi-cart3"></i>
                      </button>
                    ) : (
                      <button
                        className="product-cart-icon cart-icon"
                        aria-label={`Add Product ${item?._id} to cart`}
                        title="2"
                        onClick={(e) =>
                          handleAddToCart(e, "homecart", item?._id, 1)
                        }
                      >
                      <i className="bi bi-cart3"></i>
                      </button>
                    )}

                                        </p>
                                   

                                    </div>

                                </div>
                            </div>
                        ))}
                    </Carousel>

                </div>
            </div>
            <style jsx>
        {`
 .heart-black {
            color: red;
            font-size: 2rem;
          }

          .heart-red {
            color: green;
            font-size: 2rem;
          }

          .product-wishlist-ico{
                     background: none;
            border: none;
            cursor: pointer;
            transition: transform 0.3s ease;
         margin-left:2px;
          }
          .product-cart-icon {
            background: none;
            border: none;
            cursor: pointer;
            transition: transform 0.3s ease;
            margin-right: 5px;
          }

          .product-wishlist-icon:hover,
          .product-cart-icon:hover {
            transform: scale(1.2);
          }
  .cart-icon {
    color: red;
      font-size: 1.5rem;
  }

  .cart-green {
    color: green;
      font-size: 1.5rem;
  }
        `}
      </style>
      <SignInViewModal show={showModal} onClose={() => setShowModal(false)} />
        </div>
    );
}

export default TodaysFavorite