import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { backend_url } from '../../App';
import { Typography, Button, Box } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import './MyOrders.css'; // Estilos CSS personalizados para a página de pedidos

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
    <div className="orders-container">
      <h1>My Orders</h1>
      
      {orders.length === 0 ? (
        <Box className="no-orders-container" display="flex" flexDirection="column" alignItems="center" justifyContent="center">
          <ShoppingCartIcon sx={{ fontSize: 80, color: '#888888' }} />
          <Typography variant="h5" gutterBottom>
            You don't have any orders yet.
          </Typography>
          <Button component={Link} to="/" variant="contained" color="primary">
            Go to Home
          </Button>
        </Box>
      ) : (
        <ul className="orders-list">
          {orders.map(order => (
            <li key={order.id} className="order-item">
              <div className="order-summary">
                <span><strong>Order Number:</strong> {order.orderNumber}</span>
                <span><strong>Date:</strong> {new Date(order.date).toLocaleString()}</span>
                <span><strong>Total Paid:</strong> ${order.finalAmount}</span>
                <span><strong>Total Items:</strong> {Object.values(order.cartItems[0]).filter(quantity => quantity > 0).length}</span>
              </div>
              <Link to={`/order/${order._id}`} className="order-details-link">
                <span className="view-details-span">View Details &gt;</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyOrders;
