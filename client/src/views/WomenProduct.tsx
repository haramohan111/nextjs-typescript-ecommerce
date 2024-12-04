import Link from 'next/link';
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import Image from "next/image";
import { fetchProductsForWomen, selectProductsForWomen } from '@/redux/slices/productsForWomenSlice';
import { AppDispatch, RootState } from '@/redux/store';
import { selectAuthState } from '@/redux/slices/loginSlice';
import SignInViewModal from './signInModel';

interface DealsProps {
  selectedCategories: Set<string>;
  handleAddToWishlist: (productId: string) => void;
  selectedCart: Set<string>;
  handleAddToCart: (e: React.MouseEvent<HTMLButtonElement>, cartType: string, productId: string, qty: number) => void;
}

const WomenProduct: React.FC<DealsProps> = ({ selectedCategories, handleAddToWishlist, selectedCart, handleAddToCart }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector(selectAuthState);
  const [showModal, setShowModal] = useState(false);
  const { productsForWomen, status } = useSelector(selectProductsForWomen);

  useEffect(() => {
    if (status === 'idle') {

      dispatch(fetchProductsForWomen());

    }
  }, [status, dispatch]);
  return (
    <>
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
                          <h6 className="custom-card-title">{item?.name.length > 15
                            ? `${item?.name.slice(0, 12)}...`
                            : item?.name}</h6>

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
                          <p className="custom-card-text">
                            
                            Rs. {item?.price}

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
                </div>
              </div>
            </div>
          </div>
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
    </>
  )
}

export default WomenProduct