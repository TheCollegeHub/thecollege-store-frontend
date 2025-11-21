import React, { useContext, useEffect } from 'react';
import { ShopContext } from '../../Context/ShopContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import { backend_url, currency } from '../../App';
import "./OrderCompleted.css"

const OrderCompleted = () => {
  const { products, clearCart } = useContext(ShopContext);
  const location = useLocation();
  const navigate = useNavigate();
  const order = location.state?.order;

  useEffect(() => {
    // If no order data is available, redirect to home
    if (!order) {
      setTimeout(() => {
        navigate('/');
      }, 3000); // Show message for 3 seconds before redirecting
    } else {
      clearCart();
    }
  }, [order, navigate, clearCart]);

  const handleGoMyOrders = () => {
    navigate('/myorders');
  };

  // Show error message when no order data is available
  if (!order) {
    return (
      <div className="modern-order-completed-container">
        <div className="no-order-content">
          <div className="error-header">
            <div className="error-icon">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                <path d="M15 9L9 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M9 9L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <div className="error-content">
              <h1 className="error-title">No Order Found</h1>
              <p className="error-message">
                It looks like you've accessed this page directly. You'll be redirected to the home page in a few seconds.
              </p>
              <div className="redirect-actions">
                <Button
                  variant="contained"
                  className="home-btn"
                  onClick={() => navigate('/')}
                >
                  Go to Home
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modern-order-completed-container">
      <div className="order-completed-content">
        {/* Success Header */}
        <div className="success-header">
          <div className="success-icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" fill="currentColor"/>
              <path d="M9 12L11 14L15 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="success-content">
            <h1 className="success-title">Order Completed Successfully!</h1>
            <p className="success-message">Thank you for your purchase. Your order has been confirmed and is being processed.</p>
          </div>
        </div>

        {/* Order Summary Card */}
        <div className="order-summary-card">
          <div className="card-header">
            <div className="header-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 11H15M9 15H15M17 21H7C5.89543 21 5 20.1046 5 19V5C5 3.89543 5.89543 3 7 3H12.5858C12.851 3 13.1054 3.10536 13.2929 3.29289L19.7071 9.70711C19.8946 9.89464 20 10.149 20 10.4142V19C20 20.1046 19.1046 21 18 21H17Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h2 className="card-title">Order Details</h2>
          </div>
          
          <div className="order-info-grid">
            <div className="info-item">
              <span className="info-label">Order Number</span>
              <span className="info-value">{order.orderNumber}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Total Amount</span>
              <span className="info-value">${order.totalAmount}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Discount</span>
              <span className="info-value discount-value">{order.discount}%</span>
            </div>
            <div className="info-item total-item">
              <span className="info-label">Final Amount</span>
              <span className="info-value final-amount">${order.finalAmount}</span>
            </div>
          </div>
        </div>

        {/* Delivery Information */}
        <div className="info-card delivery-card">
          <div className="card-header">
            <div className="header-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 21C15.5 17.4 19 14.1764 19 10.2C19 6.22355 15.7764 3 12 3C8.22355 3 5 6.22355 5 10.2C5 14.1764 8.5 17.4 12 21Z" stroke="currentColor" strokeWidth="2"/>
                <path d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </div>
            <h3 className="card-title">Delivery Address</h3>
          </div>
          <div className="address-content">
            <p className="address-line">{order.address.street}</p>
            <p className="address-line">{order.address.city}, {order.address.state} {order.address.zip}</p>
          </div>
        </div>

        {/* Payment Information */}
        <div className="info-card payment-card">
          <div className="card-header">
            <div className="header-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="2" y="4" width="20" height="16" rx="3" stroke="currentColor" strokeWidth="2"/>
                <path d="M2 10H22" stroke="currentColor" strokeWidth="2"/>
                <path d="M6 14H6.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M10 14H12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <h3 className="card-title">Payment Method</h3>
          </div>
          <div className="payment-content">
            <div className="card-display">
              <span className="card-number">•••• •••• •••• {order.paymentMethod.cardNumber.slice(-4)}</span>
              <span className="card-type">Credit Card</span>
            </div>
          </div>
        </div>
        {/* Products Section */}
        <div className="products-card">
          <div className="card-header">
            <div className="header-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 4V2C7 1.44772 7.44772 1 8 1H16C16.5523 1 17 1.44772 17 2V4H20C20.5523 4 21 4.44772 21 5C21 5.55228 20.5523 6 20 6H19V19C19 20.1046 18.1046 21 17 21H7C5.89543 21 5 20.1046 5 19V6H4C3.44772 6 3 5.55228 3 5C3 4.44772 3.44772 4 4 4H7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 className="card-title">Ordered Products</h3>
          </div>
          
          <div className="products-list">
            {products.map((product) => {
              if (order.cartItems[0][product.id] > 0) {
                return (
                  <div key={product.id} className="product-item">
                    <div className="product-image">
                      <img src={backend_url + "/api" + product.image} alt={product.name} />
                    </div>
                    <div className="product-details">
                      <h4 className="product-name">{product.name}</h4>
                      <div className="product-meta">
                        <span className="product-price">{currency}{product.new_price}</span>
                        <span className="product-quantity">Qty: {order.cartItems[0][product.id]}</span>
                      </div>
                    </div>
                    <div className="product-total">
                      {currency}{product.new_price * order.cartItems[0][product.id]}
                    </div>
                  </div>
                );
              }
              return null;
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          <Button
            variant="contained"
            className="my-orders-btn"
            onClick={handleGoMyOrders}
          >
            View My Orders
          </Button>
          <Button
            variant="outlined"
            className="continue-shopping-btn"
            onClick={() => navigate('/')}
          >
            Continue Shopping
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderCompleted;
