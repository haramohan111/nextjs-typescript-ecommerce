"use client"
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from 'axios'
import { ReactComponent as IconEnvelope } from "bootstrap-icons/icons/envelope.svg";
import { ReactComponent as IconTruck } from "bootstrap-icons/icons/truck.svg";
import { ReactComponent as IconReceipt } from "bootstrap-icons/icons/receipt.svg";
import { ReactComponent as IconCreditCard2Front } from "bootstrap-icons/icons/credit-card-2-front.svg";
import { ReactComponent as IconCart3 } from "bootstrap-icons/icons/cart3.svg";
import { useRouter } from "next/navigation";

import { AppDispatch, RootState } from "@/redux/store";
import { selectAuthState, userVerifyID } from "@/redux/slices/loginSlice";
import { fetchCart, updateCartUserId } from "@/redux/slices/cartSlice";
import { createOrder, manageCustomer, selectOrderState } from "@/redux/slices/orderSlice";


const CheckoutView = () => {

  // interface CartItem {
  //   id: string;
  //   name: string;
  //   quantity: number;
  //   price: number;
  // }
  // class Razorpay {
  //   constructor(options: RazorpayOptions) { }
  //   open(): void { }
  //   on(event: string, callback: (response: any) => void): void { }
  // }


  interface RazorpayOptions {
    key: string;
    amount: number;
    currency: string;
    name: string;
    description: string;
    image?: string;
    order_id?: string;
    callback_url: string
    handler?: (response: RazorpayResponse) => void;
    prefill?: {
      name?: string;
      email?: string;
      contact?: string;
    };
    notes?: { [key: string]: string };
    theme?: {
      color?: string;
    };
  }

  interface RazorpayResponse {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
  }


  const dispatch = useDispatch<AppDispatch>();
  const [email, setEmail] = useState<string>('');
  const [mobile, setMobile] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [addressoptional, setAddressoptional] = useState<string>('');
  const [state, setState] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [zip, setZip] = useState<string>('');
  const [cities, setCities] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const [selectedState, setSelectedState] = useState<string>('');
  const [razorpayReady, setRazorpayReady] = useState(false);
  const isDefault = true;
  const router = useRouter();

  const states = ['Odisha', 'Maharashtra', 'Karnataka'];
  const stateCities: { [key: string]: string[] } = {
    'Odisha': ['Cuttack', 'Bhubaneswar', 'Puri'],
    'Maharashtra': ['Mumbai', 'Pune', 'Nagpur'],
    'Karnataka': ['Bangalore', 'Mysore', 'Hubli']
  };
  const handleStateChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const state = event.target.value;
    setSelectedState(state);
    setCities(stateCities[state]);
  };
  // const [auth] = useAuth();
  // const [checklog, setChecklog] = useState<boolean>(false);
  const { cartItems, status, error } = useSelector((state: RootState) => state.cart);
  const { user } = useSelector(selectAuthState);
  const { orders, customers } = useSelector(selectOrderState);



  const handleAddressSelect = (address: any) => {
    setEmail(address.email);
    setMobile(address.phone);
    setName(address.name);
    setAddress(address.address);
    setState(address.state);
    setCity(address.city);
    setZip(address.zip)
  };


  useEffect(() => {

    dispatch(userVerifyID());

  }, []);

  useEffect(() => {
    dispatch(updateCartUserId())

    dispatch(fetchCart());
    dispatch(manageCustomer());
  }, [user, dispatch])


  const payClick = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault()

    const shippingAdd = {
      email, mobile, name, address, city, state, postalCode: zip,
    }
    dispatch(createOrder({
      orderItems: cartItems?.allCart,
      shippingAddress: shippingAdd,
      paymentMethod: "online",
      itemsPrice: cartItems?.totalPrice,
      shippingPrice: "50",
      taxPrice: "1000",
      totalPrice: cartItems?.totalPrice,
      postalCode: zip,
      city: state,
    }))
    ///const { data: { key } } = await axios.get("http://www.localhost:8000/api/getkey")

    const { data } = await axios.post("http://localhost:9000/api/v1/payment",null,{ withCredentials: true})
    
    console.log(data)
    const options: RazorpayOptions = {
      key: "rzp_test_8sbyXFCLzRr4Kf",
      amount: 6666666666666666666666666666,
      currency: "INR",
      name: "Flipmart Ecommerce private Ltd",
      description: "Ecommerce company",
      image: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fbuiltin.com%2Fe-commerce&psig=AOvVaw0_ouVUJ_sYocADw5J3NlNh&ust=1691836612545000&source=images&cd=vfe&opi=89978449&ved=0CA4QjRxqFwoTCPilsdS01IADFQAAAAAdAAAAABAD",
      order_id: data.order.id,
      callback_url: "http://localhost:9000/api/v1/paymentverify",
      prefill: {
        name: "haramohan mahalik",
        email: "haramohan111@gmail.com",
        contact: "9556213317"
      },
      notes: {
        "address": "Razorpay Corporate Office"
      },
      theme: {
        "color": "#121212"
      }
    };
    // Ensure Razorpay is loaded before this code runs
    if (typeof Razorpay !== 'undefined') {
      const razorpayInstance = new Razorpay(options);
      razorpayInstance.open();
    } else {
      console.error('Razorpay SDK is not loaded.');
    }

  }

  return (
    <React.Fragment>
      <div className="bg-secondary border-top p-4 text-white mb-3">
        <h1 className="display-6">Checkout</h1>
      </div>
      <div className="container mb-3">
        <div className="row">
          <div className="col-md-8">
            <div className="card mb-3">
              <div className="card-header">
                <IconEnvelope className="i-va" /> Contact Info
              </div>
              <div className="card-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <input
                      type="email"
                      className="form-control"
                      placeholder="Email Address"
                      aria-label="Email Address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="col-md-6">
                    <input
                      type="tel"
                      className="form-control"
                      placeholder="Mobile no"
                      aria-label="Mobile no"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="card mb-3">
              <div className="card-header">
                <IconTruck className="i-va" /> Shipping Infomation
              </div>
              <div className="card-body">
                <div className="row g-3">
                  <div className="col-md-12">
                    <input
                      type="text"
                      className="form-control"
                      onChange={(e) => setName(e.target.value)}
                      value={name}
                      placeholder="Name"
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <input
                      type="text"
                      className="form-control"
                      onChange={(e) => setAddress(e.target.value)}
                      value={address}
                      placeholder="Addresss"
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <input
                      type="text"
                      className="form-control"
                      onChange={(e) => setAddressoptional(e.target.value)}
                      placeholder="Address 2 (Optional)"
                    />
                  </div>
                  <div className="col-md-4">
                    <select onChange={handleStateChange} value={state} className="form-select" required>
                      <option value="">-- Country --</option>
                      {states.map(state => (<option key={state} value={state}>{state}</option>))}
                    </select>
                  </div>
                  <div className="col-md-4">
                    <select onChange={(e) => setState(e.target.value)} className="form-select" required>
                      <option >-- State --</option>
                      {cities.map(city => (<option key={city} value={city}>{city}</option>))}
                    </select>
                  </div>
                  <div className="col-md-4">
                    <input
                      type="text"
                      onChange={(e) => setZip(e.target.value)}
                      className="form-control"
                      placeholder="Zip"
                      value={zip}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="card mb-3">
              <div className="card-header">
                <IconReceipt className="i-va" /> Billing Infomation
                <div className="form-check form-check-inline ms-3">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    defaultValue={isDefault ? 'default value' : inputValue}
                    id="flexCheckDefault"
                  />
                  <label
                    className="form-check-label"
                    htmlFor="flexCheckDefault"

                  >
                    Same as Shipping Infomation
                  </label>
                </div>
              </div>
              <div className="card-body">
                <div className="row g-3">
                  <div className="col-md-12">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Name"
                      value={name}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Addresss"
                      value={address}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Address 2 (Optional)"
                    />
                  </div>
                  <div className="col-md-4">
                    <select className="form-select" value={state} required>
                      <option >-- State --</option>
                      <option>United States</option>
                    </select>
                  </div>
                  <div className="col-md-4">
                    <select className="form-select" value={state} required>
                      <option >-- State --</option>
                      <option>California</option>
                    </select>
                  </div>
                  <div className="col-md-4">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Zip"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="card mb-3 border-info">
              <div className="card-header bg-info">
                <IconCreditCard2Front className="i-va" /> Payment Method
              </div>
              <div className="card-body">
                <div className="row g-3 mb-3 border-bottom">
                  <div className="col-md-4">
                    <div className="form-check">
                      <input
                        id="credit"
                        name="paymentMethod"
                        type="radio"
                        className="form-check-input"
                        defaultChecked
                        required
                      />
                      <label className="form-check-label" htmlFor="credit">
                        Credit card
                        <img
                          src="../../images/payment/cards.webp"
                          alt="..."
                          className="ms-3"
                          height={26}
                        />
                      </label>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-check">
                      <input
                        id="paypal"
                        name="paymentMethod"
                        type="radio"
                        className="form-check-input"
                        required
                      />
                      <label className="form-check-label" htmlFor="paypal">
                        PayPal
                        <img
                          src="../../images/payment/paypal_64.webp"
                          alt="..."
                          className="ms-3"
                          height={26}
                        />
                      </label>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-check">
                      <input
                        id="paypal"
                        name="paymentMethod"
                        type="radio"
                        className="form-check-input"
                        required
                      />
                      <label className="form-check-label" htmlFor="paypal">
                        UPI
                        <img
                          src="../../images/payment/razorpay.webp"
                          alt="..."
                          className="ms-3"
                          height={26}
                        />
                      </label>
                    </div>
                  </div>
                </div>
                <div className="row g-3">
                  <div className="col-md-6">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Name on card"
                    />
                  </div>
                  <div className="col-md-6">
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Card number"
                    />
                  </div>
                  <div className="col-md-4">
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Expiration month"
                    />
                  </div>
                  <div className="col-md-4">
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Expiration year"
                    />
                  </div>
                  <div className="col-md-4">
                    <input
                      type="number"
                      className="form-control"
                      placeholder="CVV"
                    />
                  </div>
                </div>
              </div>
              <div className="card-footer border-info d-grid">

                <button type="button" onClick={(e) => payClick(e)} className="btn btn-info">
                  Pay Now <strong>Rs. {cartItems?.totalPrice}</strong>
                </button>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card">
              <div className="card-header">
                <IconCart3 className="i-va" /> Cart{" "}
                <span className="badge bg-secondary float-end">3</span>
              </div>
              <ul className="list-group list-group-flush">
                {cartItems?.allCart?.map((cartlist: any) => (
                  <li className="list-group-item d-flex justify-content-between lh-sm">
                    <div>
                      <h6 className="my-0">{cartlist.product_id.name}</h6>
                      <small className="text-muted">Brief description</small>
                    </div>
                    <span className="text-muted">{cartlist.product_id.price}</span>
                  </li>
                ))}
                {/* <li className="list-group-item d-flex justify-content-between bg-light">
                  <div className="text-success">
                    <h6 className="my-0">Promo code</h6>
                    <small>EXAMPLECODE</small>
                  </div>
                  <span className="text-success">−$50</span>
                </li> */}
                <li className="list-group-item d-flex justify-content-between">
                  <span>Total (USD)</span>
                  <strong>Rs {cartItems?.totalPrice}</strong>
                </li>
              </ul>
            </div>
            <hr></hr>
            <div className="card">
              <div className="card-header">
                <IconCart3 className="i-va" /> Address{" "}
                <span className="badge bg-secondary float-end">3</span>
              </div>
              <ul className="list-group list-group-flush">
                {customers?.map((list: any) => (
                  <button onClick={() => handleAddressSelect(list)}>
                    <li className="list-group-item d-flex justify-content-between lh-sm">
                      <div>
                        <h6 className="my-0">Name : -<span className="text-muted">{list.name}</span></h6>
                        <h6 className="my-1">Email : -  <span className="text-muted">{list.email}</span></h6>
                        <h6 className="my-0">Phone : -   <span className="text-muted">{list.phone}</span></h6>
                        <h6 className="my-1">State : -  <span className="text-muted">{list.state}</span></h6>
                        <h6 className="my-0">City : -   <span className="text-muted">{list.city}</span></h6>
                        <h6 className="my-0">Address : -   <span className="text-muted">{list.address}</span></h6>
                      </div>
                    </li>
                  </button>
                ))}

                <li className="list-group-item d-flex justify-content-between">
                  <span></span>
                  <strong>Edit</strong>
                </li>
              </ul>
            </div>
          </div>


        </div>
      </div>
    </React.Fragment>
  );

}

export default CheckoutView;
