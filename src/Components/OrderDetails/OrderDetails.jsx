
import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { backend_url, currency } from '../../App';
import { ShopContext } from '../../Context/ShopContext';
import './OrderDetails.css';

const OrderDetails = () => {
  const { _id } = useParams();
  const [orderDetails, setOrderDetails] = useState(null);
  const { products } = useContext(ShopContext);

  // Status configuration with icons and colors
  const getStatusConfig = (status) => {
    const configs = {
      'PENDING': {
        label: 'Ready to be shipped',
        color: '#FFA500',
        icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 8V12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/>
          </svg>
        )
      },
      'IN_TRANSIT': {
        label: 'In transit',
        color: '#2196F3',
        icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13 16V6C13 4.89543 13.8954 4 15 4H19C20.1046 4 21 4.89543 21 6V16M13 16H3M13 16L15 16M21 16H15M15 16V18C15 19.1046 15.8954 20 17 20C18.1046 20 19 19.1046 19 18V16M3 16V6C3 4.89543 3.89543 4 5 4H9C10.1046 4 11 4.89543 11 6V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )
      },
      'OUT_FOR_DELIVERY': {
        label: 'Out for delivery',
        color: '#9C27B0',
        icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 17C9 18.1046 8.10457 19 7 19C5.89543 19 5 18.1046 5 17C5 15.8954 5.89543 15 7 15C8.10457 15 9 15.8954 9 17Z" stroke="currentColor" strokeWidth="2"/>
            <path d="M19 17C19 18.1046 18.1046 19 17 19C15.8954 19 15 18.1046 15 17C15 15.8954 15.8954 15 17 15C18.1046 15 19 15.8954 19 17Z" stroke="currentColor" strokeWidth="2"/>
            <path d="M5 17H3V13L5 5H14V17M5 17H7M14 17H15M19 17H21V13H17M14 17H15M15 17C15 15.8954 15.8954 15 17 15M17 15V9H21L23 13H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )
      },
      'DELIVERED': {
        label: 'Delivered',
        color: '#4CAF50',
        icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/>
          </svg>
        )
      },
      'RETURNED': {
        label: 'Returned to warehouse',
        color: '#F44336',
        icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 14L4 9M4 9L9 4M4 9H15C18.3137 9 21 11.6863 21 15C21 18.3137 18.3137 21 15 21H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )
      }
    };
    
    return configs[status] || configs['PENDING'];
  };

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
    return (
      <div className="modern-order-details-container">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading order details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="modern-order-details-container">
      <div className="order-details-content">
        {/* Header Section */}
        <div className="details-header">
          <div className="header-content">
            <div className="header-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 11H15M9 15H15M17 21H7C5.89543 21 5 20.1046 5 19V5C5 3.89543 5.89543 3 7 3H12.5858C12.851 3 13.1054 3.10536 13.2929 3.29289L19.7071 9.70711C19.8946 9.89464 20 10.149 20 10.4142V19C20 20.1046 19.1046 21 18 21H17Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="header-text">
              <h1 className="page-title">Order Details</h1>
              <p className="page-subtitle">#{orderDetails.orderNumber}</p>
            </div>
            {(() => {
              const statusConfig = getStatusConfig(orderDetails.status);
              return (
                <div className="order-status-badge" style={{ backgroundColor: `${statusConfig.color}15`, borderColor: statusConfig.color }}>
                  <div className="status-icon" style={{ color: statusConfig.color }}>
                    {statusConfig.icon}
                  </div>
                  <span style={{ color: statusConfig.color }}>{statusConfig.label}</span>
                </div>
              );
            })()}
          </div>
        </div>

        {/* Order Summary Card */}
        <div className="order-summary-card">
          <div className="card-header">
            <div className="header-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 17H7C4.79086 17 3 15.2091 3 13V7C3 4.79086 4.79086 3 7 3H17C19.2091 3 21 4.79086 21 7V13C21 15.2091 19.2091 17 17 17H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M21 7L12 13L3 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h2 className="card-title">Order Summary</h2>
          </div>
          
          <div className="summary-grid">
            <div className="summary-item">
              <span className="summary-label">Order Date</span>
              <span className="summary-value">{new Date(orderDetails.date).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Subtotal</span>
              <span className="summary-value">${orderDetails.totalAmount}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Discount</span>
              <span className="summary-value discount-value">{orderDetails.discount}%</span>
            </div>
            <div className="summary-item total-item">
              <span className="summary-label">Total Paid</span>
              <span className="summary-value total-value">${orderDetails.finalAmount}</span>
            </div>
          </div>
        </div>

        <div className="details-grid">
          {/* Shipping Address Card */}
          <div className="info-card">
            <div className="card-header">
              <div className="header-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 21C15.5 17.4 19 14.1764 19 10.2C19 6.22355 15.7764 3 12 3C8.22355 3 5 6.22355 5 10.2C5 14.1764 8.5 17.4 12 21Z" stroke="currentColor" strokeWidth="2"/>
                  <path d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              <h3 className="card-title">Shipping Address</h3>
            </div>
            <div className="address-details">
              <p className="address-line">{orderDetails.address.street}</p>
              <p className="address-line">{orderDetails.address.city}, {orderDetails.address.state} {orderDetails.address.zip}</p>
            </div>
          </div>

          {/* Payment Method Card */}
          <div className="info-card">
            <div className="card-header">
              <div className="header-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="2" y="4" width="20" height="16" rx="3" stroke="currentColor" strokeWidth="2"/>
                  <path d="M2 10H22" stroke="currentColor" strokeWidth="2"/>
                  <path d="M6 14H6.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M10 14H12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <h3 className="card-title">Payment Method</h3>
            </div>
            <div className="payment-details">
              <div className="card-display">
                <span className="card-number">•••• •••• •••• {orderDetails.paymentMethod.cardNumber.slice(-4)}</span>
                <span className="card-type">Credit Card</span>
              </div>
            </div>
          </div>
        </div>

        {/* Products Card */}
        <div className="products-card">
          <div className="card-header">
            <div className="header-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 4V2C7 1.44772 7.44772 1 8 1H16C16.5523 1 17 1.44772 17 2V4H20C20.5523 4 21 4.44772 21 5C21 5.55228 20.5523 6 20 6H19V19C19 20.1046 18.1046 21 17 21H7C5.89543 21 5 20.1046 5 19V6H4C3.44772 6 3 5.55228 3 5C3 4.44772 3.44772 4 4 4H7Z" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </div>
            <h3 className="card-title">Ordered Items</h3>
          </div>
          
          <div className="products-list">
            {products.map((product) => {
              if (orderDetails.cartItems[0][product.id] > 0) {
                return (
                  <div key={product.id} className="product-item">
                    <div className="product-image">
                      <img src={backend_url + product.image} alt={product.name} />
                    </div>
                    <div className="product-details">
                      <h4 className="product-name">{product.name}</h4>
                      <div className="product-meta">
                        <span className="product-price">{currency}{product.new_price}</span>
                        <span className="product-quantity">Qty: {orderDetails.cartItems[0][product.id]}</span>
                      </div>
                    </div>
                    <div className="product-total">
                      {currency}{product.new_price * orderDetails.cartItems[0][product.id]}
                    </div>
                  </div>
                );
              }
              return null;
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
