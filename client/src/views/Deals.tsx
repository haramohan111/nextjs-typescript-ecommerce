import { useDispatch, useSelector } from "react-redux";
import CardDealsOfTheDay from "../components/card/CardDealsOfTheDay";
import { AppDispatch, RootState } from "@/redux/store";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchDealOfTheDay } from "@/redux/slices/dealofthedaySlice";
import { selectAuthState } from "@/redux/slices/loginSlice";
import { addToCart, fetchCart, removeFromHomeCart } from "@/redux/slices/cartSlice"; // Assuming you have a cart slice
import { toast } from "react-toastify";
import SignInViewModal from "./signInModel";

interface DealsProps {
  selectedCategories: Set<string>;
  handleAddToWishlist: (productId: string) => void;
  selectedCart: Set<string>;
  handleAddToCart: (e: React.MouseEvent<HTMLButtonElement>, cartType: string, productId: string, qty: number) => void;
}

const Deals: React.FC<DealsProps> = ({ selectedCategories, handleAddToWishlist, selectedCart, handleAddToCart }) => {

  const dispatch = useDispatch<AppDispatch>();
  const { deals, status } = useSelector((state: RootState) => state.dealOfTheDay);
  const { user } = useSelector(selectAuthState);
  const [showModal, setShowModal] = useState(false);
  console.log(user)

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchDealOfTheDay());
    }
  }, [status, dispatch]);


  return (
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
                        src={require(`../../../backend/uploads/${item?.product?.image}`)}
                        className="product-card-img"
                        alt={`Product ${id}`}
                      />
                    </Link>
                    <div className="product-card-body">
                      <h5
                        className="product-card-title"
                        title={item?.product?.name}
                      >
                        {item?.product?.name.length > 30
                          ? `${item?.product?.name.slice(0, 30)}...`
                          : item?.product?.name}
                      </h5>
                      <p className="product-card-text">
                        Rs. {item.product.price}
                        {selectedCart.has(item?.product?._id) ? (
                      <button
                        className="product-cart-icon cart-green"
                        aria-label={`Add Product ${id} to cart`}
                        title="1"
                        onClick={(e) => handleAddToCart(e, "homecart", item?.product?._id, 1)}
                      >
                        <i className="bi bi-cart3"></i>
                      </button>
                    ) : (
                      <button
                        className="product-cart-icon cart-icon"
                        aria-label={`Add Product ${id} to cart`}
                        title="2"
                        onClick={(e) =>
                          handleAddToCart(e, "homecart", item?.product?._id, 1)
                        }
                      >
                        <i className="bi bi-cart3"></i>
                      </button>
                    )}
                      </p>
                    </div>

                    {user == null ?

                      <button
                        className="product-wishlist-icon heart-red"
                        aria-label={`Remove Product ${id} from wishlist`}
                        onClick={() => setShowModal(true)}
                      >
                        &#9829;
                      </button>
                      :
                      <p>
                        {selectedCategories.has(item?.product?._id) ? (
                          <button
                            className="product-wishlist-icon heart-red"
                            aria-label={`Remove Product ${id} from wishlist`}
                            onClick={() => handleAddToWishlist(item?.product?._id)}
                          >
                            &#9829;
                          </button>
                        ) : (
                          <button
                            className="product-wishlist-icon heart-black"
                            aria-label={`Add Product ${id} to wishlist`}
                            onClick={() => handleAddToWishlist(item?.product?._id)}
                          >
                            &#9829;
                          </button>
                        )}
                      </p>}


                  </div>
                </div>
              ))}
            </div>
          </CardDealsOfTheDay>
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

          .product-wishlist-icon,
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
  }

  .cart-green {
    color: green;
  }
        `}
      </style>
      <SignInViewModal show={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
};

export default Deals;
