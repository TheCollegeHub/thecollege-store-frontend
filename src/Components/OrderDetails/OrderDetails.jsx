
import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { backend_url, currency } from '../../App';
import { ShopContext } from '../../Context/ShopContext';
import './OrderDetails.css';

const OrderDetails = () => {
  const { _id } = useParams();
  const [orderDetails, setOrderDetails] = useState(null);
  const { products } = useContext(ShopContext);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await fetch(`${backend_url}/api/orders/${_id}`, {
          headers: {
            'auth-token': localStorage.getItem('auth-token')
          }
        }); 
        if (response.ok) {
          const orderData = await response.json();
          setOrderDetails(orderData);
        } else {
          throw new Error('Error to get Order Details');
        }
      } catch (error) {
        console.error('Error to get Order Details:', error);
      }
    };

    fetchOrderDetails();
  }, [_id]);

  if (!orderDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div className="order-details-container">
      <h1>Order Details</h1>
      <div className="order-info">
        <span><strong>Order Number:</strong> {orderDetails.orderNumber}</span>
        <span><strong>Date:</strong> {new Date(orderDetails.date).toLocaleString()}</span>
        <span><strong>Total Before Discount:</strong> ${orderDetails.totalAmount}</span>
        <span><strong>Discount:</strong> {orderDetails.discount}%</span>
        <span><strong>Total Paid:</strong> ${orderDetails.finalAmount}</span>
        <span><strong>Shipping Address:</strong> {orderDetails.address.street}, {orderDetails.address.city}, {orderDetails.address.state}, {orderDetails.address.zip}</span>
        <span><strong>Payment Method:</strong>  Card: ****-****-****-{orderDetails.paymentMethod.cardNumber.slice(-4)}</span>
        
      </div>
      <div className="cartitems-format-main">
            <p>Products</p>
            <p>Title</p>
            <p>Price</p>
            <p>Quantity</p>
            <p>Total</p>
      </div>
      <hr />
      {products.map((product) => {
          if (orderDetails.cartItems[0][product.id] > 0) {
            return (
              <div key={product.id}>
                <div className="cartitems-format-main cartitems-format">
                  <img className="cartitems-product-icon" src={backend_url + product.image} alt="" />
                  <p className="cartitems-product-title">{product.name}</p>
                  <p>{currency}{product.new_price}</p>
                  <button className="cartitems-quantity">{orderDetails.cartItems[0][product.id]}</button>
                  <p>{currency}{product.new_price * orderDetails.cartItems[0][product.id]}</p>
                </div>
                <hr />
              </div>
            );
          }
          return null;
        })}
    </div>
  );
};

export default OrderDetails;
