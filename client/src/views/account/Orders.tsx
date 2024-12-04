import React, { useEffect } from "react";
import Link from 'next/link';
import { fetchOrders, selectOrderState } from "@/redux/slices/orderSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/redux/store";
import Image from "next/image";
import { deleteCookie } from 'cookies-next';
const OrdersView: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { orders, status, error } = useSelector(selectOrderState);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchOrders());
    }
    deleteCookie('cart_session_id', { path: '/' });
  }, [dispatch, status]);

  if (status === 'loading') return <p>Loading orders...</p>;
  if (status === 'failed') return <p>Error: {error}</p>;

  // Group orders by date
  const groupedOrders = orders.reduce((acc: any, order: any) => {
    const orderDate = new Date(order.createdAt).toLocaleDateString();
    if (!acc[orderDate]) {
      acc[orderDate] = [];
    }
    acc[orderDate].push(order);
    return acc;
  }, {});

  // Sort the grouped orders by date (latest first)
  const sortedDates = Object.keys(groupedOrders).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  return (
<div className="container mb-3">
  <h4 className="my-3">Orders</h4>
  <div className="row g-3">
    {sortedDates.map((date) => (
      <div key={date} className="w-100">
        {/* Date Header */}
        <h5 className="mt-4 mb-3">{date}</h5>
        {/* Orders for this date */}
        <div className="row g-3">
          {groupedOrders[date].map((order: any) => (
            <div key={order._id} className="col-md-6">
              <div className="card shadow-sm">
                <div className="card-header">
                  <div className="small d-flex justify-content-between">
                    <div>
                      <span className="border bg-secondary rounded-left px-2 text-white">
                        Order ID
                      </span>
                      <span className="border bg-white rounded-right px-2 me-2">
                        #{order._id}
                      </span>
                    </div>
                    <div>
                      <span className="border bg-secondary rounded-left px-2 text-white">
                        Date & Time
                      </span>
                      <span className="border bg-white rounded-right px-2">
                        {new Date(order.createdAt).toLocaleString()} {/* Includes date and time */}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="card-body">
                  <h6>
                    <Link href={`/order/${order._id}`} className="text-decoration-none">
                      View Order
                    </Link>
                  </h6>
                  {/* Shipping Address */}
                  <div className="mb-3">
                    <h6>Shipping Address</h6>
                    <div className="small text-muted">
                      <div>
                        <strong>Name:</strong> {order?.shippingAddress?.name || 'N/A'}
                      </div>
                      <div>
                        <strong>Email:</strong> {order.shippingAddress.email || 'N/A'}
                      </div>
                      <div>
                        <strong>Mobile:</strong> {order.shippingAddress.mobile || 'N/A'}
                      </div>
                      <div>
                        <strong>Address:</strong> {order.shippingAddress.address || 'N/A'}
                      </div>
                      <div>
                        <strong>State:</strong> {order.shippingAddress.state || 'N/A'}
                      </div>
                    </div>
                  </div>
                  {/* Order Items */}
                  {order.orderItems.map((item: any) => (
                    <div key={item._id} className="d-flex align-items-start mb-3">
                      <div className="order-item-image me-3">
                        <Image
                          src={require(`../../../../backend/uploads/${item?.product_id?.image}`)} // Replace with actual product image URL
                          className="img-fluid rounded"
                          alt="Product"
                          height="200"
                          width="100"
                        />
                      </div>
                      <div>
                        <h6 className="mb-1">{item?.product_id?.name || 'Product Name'}</h6> {/* Replace with actual product name */}
                        <div className="small text-muted">
                          <span className="me-2">Quantity: {item.quantity}</span>
                          <span className="me-2">Price: Rs. {item?.price}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="small mt-2">
                    <span className="text-muted me-2">Total Price:</span>
                    <span className="fw-bold">Rs {order.totalPrice}</span>
                  </div>
                </div>
                <div className="card-footer d-flex justify-content-between">
                  <div>
                    <span className="me-2">Status:</span>
                    <span className={order.isDelevired ? 'text-success' : 'text-warning'}>
                      {order.isDelevired ? 'Delivered' : 'Processing'}
                    </span>
                  </div>
                  <div>
                    <span className="me-2">Payment:</span>
                    <span className={order.isPaid ? 'text-success' : 'text-danger'}>
                      {order.isPaid ? 'Paid' : 'Pending'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
  <style jsx>
    {`
      .order-item-image img {
        width: 80px;
        height: 80px;
        object-fit: cover;
      }

      .card {
        border-radius: 10px;
        overflow: hidden;
      }

      .card-header {
        background: #f8f9fa;
      }

      .card-footer {
        background: #f8f9fa;
      }
    `}
  </style>
</div>


  );
};

export default OrdersView;
