"use client"
import  { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from 'next/link';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { ReactComponent as IconHeartFill } from "bootstrap-icons/icons/heart-fill.svg";
import { ReactComponent as IconTrash } from "bootstrap-icons/icons/trash.svg";
import { fetchCart, increaseQty, decreaseQty, removeFromCart, applyCoupon } from "@/redux/slices/cartSlice";
import Image from "next/image";
import fallbackImage from '@/../public/images/NO_IMG.png';
// Lazy load Coupon Apply Form
import CouponApplyForm from "../../components/others/CouponApplyForm";
import { AppDispatch, RootState } from "@/redux/store";
import { useRouter } from "next/navigation";


interface CartItem { _id: string; product_id: { name: string; size: string; price: number; }; quantity: number; price: number; }


const CartView = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { cartItems, status, error } = useSelector((state: RootState) => state.cart);
  // const { deals, status, error } = useSelector((state: RootState) => state.dealOfTheDay);
  // const { userverify } = useSelector((state: userRootreducer) => state.userreducer);

console.log(cartItems)
  useEffect(() => {
    if (localStorage.getItem("cpcode")) {
      dispatch(applyCoupon(localStorage.getItem("cpcode") as string));
    } 
    dispatch(fetchCart());
    localStorage.setItem('url', 'cart');

  }, [dispatch]);

  const handleIncreaseQty = (id: string) => {
    dispatch(increaseQty(id));
  };

  const handleDecreaseQty = (id: string) => {
    dispatch(decreaseQty(id));
  };

  const handleRemoveItem = (id: string) => {
    dispatch(removeFromCart(id));
  };

  const handleCheckout = () => {
    if (cartItems?.allCart?.length === 0) {
      console.log("a")
       router.push('/');
    } else {
      console.log("b")
       router.push('/checkout');
    }
  };

  const handleCouponSubmit = async (values: { coupon: string }) => {
    // localStorage.setItem("cpcode", values.coupon);
    // dispatch(applyCoupon(values.coupon));
  };

  return (
<>
      <div className="bg-secondary border-top p-4 text-white mb-3">
        <h1 className="display-6">Shopping Cart</h1>
      </div>
      <div className="container mb-3">
        <div className="row">
          <div className="col-md-9">
            <div className="card">
              <div className="table-responsive">
                <table className="table table-borderless">
                  <thead className="text-muted">
                    <tr className="small text-uppercase">
                      <th scope="col">Product</th>
                      <th scope="col" style={{ width: 120 }}>Quantity</th>
                      <th scope="col" style={{ width: 150 }}>Price</th>
                      <th scope="col" className="text-end" style={{ width: 130 }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartItems?.allCart?.map((item, index) => (
                      <tr key={index}>
                        <td>
                          <div className="row">
                            <div className="col-3 d-none d-md-block">
                              <Image
                                  //src={require(`@/../../backend/uploads/${item?.product_id?.image}`)}
                                  src={
                                    item?.product_id?.image
                                      ? require(`@/../../backend/uploads/${item?.product_id?.image}`)  // Use the correct static URL
                                      : fallbackImage  // Fallback image if no image is found
                                  }
                                width="80"
                                alt="..."
                              />
                            </div>
                            <div className="col">
                              <Link href={`/product/detail?id=${item?.product_id?._id}`} className="text-decoration-none">
                                {item?.product_id?.name}
                              </Link>
                              <p className="small text-muted">{item?.product_id?.size}</p>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="input-group input-group-sm mw-140">
                            <button className="btn btn-primary text-white" type="button" onClick={() => handleDecreaseQty(item?._id)}>
                              <FontAwesomeIcon icon={faMinus} />
                            </button>
                            <input type="text" className="form-control" value={item.quantity} />
                            <button className="btn btn-primary text-white" type="button" onClick={() => handleIncreaseQty(item?._id)}>
                              <FontAwesomeIcon icon={faPlus} />
                            </button>
                          </div>
                        </td>
                        <td>
                          <var className="price">&#8360; {item?.price}</var>
                          <small className="d-block text-muted">&#8360; {item?.product_id?.price} each</small>
                        </td>
                        <td className="text-end">

                          <button onClick={() => handleRemoveItem(item?._id)} className={`btn btn-sm btn-outline-${"danger"} me-2`}>
                              <IconHeartFill className="i-va" />
                            </button>
                            <button onClick={() => handleRemoveItem(item?._id)} className="btn btn-sm btn-outline-danger">
                              <IconTrash className="i-va" />
                            </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="card-footer">
                <button onClick={handleCheckout} className="btn btn-primary float-end">
                  Make Purchase
                </button>
                <Link href="/" className="btn btn-secondary">Continue shopping</Link>
              </div>
            </div>
            <div className="alert alert-success mt-3">
              <p className="m-0">Free Delivery within 1-2 weeks</p>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card mb-3">
              <div className="card-body">
                <CouponApplyForm onSubmit={handleCouponSubmit}  />
                {cartItems?.desc}
              </div>
            </div>
            <div className="card">
              <div className="card-body">
                <dl className="row border-bottom">
                  <dt className="col-6">Total price:</dt>
                  <dd className="col-6 text-end">{cartItems?.totalPrice}</dd>
                  <dt className="col-6 text-success">Discount:</dt>
                  <dd className="col-6 text-success text-end">-&#8360; {cartItems?.discountvalue}</dd>
                  <dt className="col-6 text-success">Coupon: <span className="small text-muted">{cartItems?.coupon}</span></dt>
                  <dd className="col-6 text-success text-end">-&#8360; {cartItems?.discountprice}</dd>
                </dl>
                <dl className="row">
                  <dt className="col-6">Total:</dt>
                  <dd className="col-6 text-end h5"><strong>&#8360; {cartItems?.totalPrice}</strong></dd>
                </dl>
                <hr />
                <p className="text-center">
                  <img src="../../images/payment/payments.webp" alt="..." height={26} />
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      </>
  );
};

export default CartView;
