import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { backend_url } from '../../App';
import { Button } from '@mui/material';
import './MyOrders.css';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const userId = localStorage.getItem('user-id');
        const response = await fetch(`${backend_url}/api/user/${userId}/orders`, {
          headers: {
            'auth-token': localStorage.getItem('auth-token')
          }
        });

        if (response.ok) {
          const ordersData = await response.json();
          setOrders(ordersData);
        } else {
          throw new Error('Error fetching orders');
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="modern-orders-container">
      <div className="orders-content">
        {/* Header Section */}
        <div className="orders-header">
          <div className="header-content">
            <div className="header-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 4H18C19.1046 4 20 4.89543 20 6V20C20 21.1046 19.1046 22 18 22H6C4.89543 22 4 21.1046 4 20V6C4 4.89543 4.89543 4 6 4H8M16 4C16 2.89543 15.1046 2 14 2H10C8.89543 2 8 2.89543 8 4M16 4C16 5.10457 15.1046 6 14 6H10C8.89543 6 8 5.10457 8 4M8 4H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 11V17M9 14L12 17L15 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="header-text">
              <h1 className="page-title">My Orders</h1>
              <p className="page-subtitle">Track and manage your order history</p>
            </div>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="modern-empty-state">
            <div className="empty-icon">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="9" cy="21" r="1" stroke="currentColor" strokeWidth="2"/>
                <circle cx="20" cy="21" r="1" stroke="currentColor" strokeWidth="2"/>
                <path d="M1 1H5L7.68 14.39C7.77144 14.8504 8.02191 15.264 8.38755 15.5583C8.75318 15.8526 9.2107 16.009 9.68 16H19.4C19.8693 16.009 20.3268 15.8526 20.6925 15.5583C21.0581 15.264 21.3086 14.8504 21.4 14.39L23 6H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 className="empty-title">No orders yet</h3>
            <p className="empty-message">You haven't placed any orders. Start shopping to see your order history here!</p>
            <Button component={Link} to="/" className="shop-now-btn">
              Start Shopping
            </Button>
          </div>
        ) : (
          <div className="orders-grid">
            {orders.map(order => (
              <div key={order.id} className="modern-order-card">
                <div className="order-card-header">
                  <div className="order-status">
                    <div className="status-indicator completed"></div>
                    <span className="status-text">Completed</span>
                  </div>
                  <div className="order-date">
                    {new Date(order.date).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </div>
                </div>

                <div className="order-card-body">
                  <div className="order-number">
                    <span className="label">Order</span>
                    <span className="value">#{order.orderNumber}</span>
                  </div>
                  
                  <div className="order-stats">
                    <div className="stat-item">
                      <span className="stat-value">${order.finalAmount}</span>
                      <span className="stat-label">Total Paid</span>
                    </div>
                    <div className="stat-divider"></div>
                    <div className="stat-item">
                      <span className="stat-value">
                        {Object.values(order.cartItems[0]).filter(quantity => quantity > 0).length}
                      </span>
                      <span className="stat-label">Items</span>
                    </div>
                  </div>
                </div>

                <div className="order-card-footer">
                  <Link to={`/order/${order._id}`} className="view-details-btn">
                    <span>View Details</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
