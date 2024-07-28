import React, { useContext, useEffect } from 'react';
import { ShopContext } from '../../Context/ShopContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Typography, Grid, Paper } from '@mui/material';
import { backend_url, currency } from '../../App';
import "./OrderCompleted.css"

const OrderCompleted = () => {
  const { products, clearCart } = useContext(ShopContext);
  const location = useLocation();
  const navigate = useNavigate();
  const { order } = location.state;

  useEffect(() => {
    clearCart();
  });

  const handleGoMyOrders = () => {
    navigate('/myorders');
  };

  return (
    <Grid container justifyContent="center" alignItems="center" style={{ minHeight: '100vh' }}>
      <Paper elevation={3} style={{ padding: '20px', maxWidth: '600px', width: '100%', marginTop: '20px' }}>
        <Typography variant="h4" gutterBottom>
          Order Completed Successfully!
        </Typography>
        <Typography variant="body1" gutterBottom sx={{ mt: 2 }}>
          <strong>Order Number:</strong> {order.orderNumber}
        </Typography>
        <Typography variant="body1" gutterBottom>
        <strong>Total Amount:</strong> ${order.totalAmount}
        </Typography>
        <Typography variant="body1" gutterBottom>
        <strong>Discount:</strong> {order.discount}%
        </Typography>
        <Typography variant="body1" gutterBottom>
        <strong>Final Amount:</strong> ${order.finalAmount}
        </Typography>
        <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
        <strong>Delivery Address</strong>
        </Typography>
        <Typography variant="body1" gutterBottom>
          {order.address.street}, {order.address.city}, {order.address.state}, {order.address.zip}
        </Typography>
        <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
        <strong>Payment </strong>
        </Typography>
        <Typography variant="body1" gutterBottom>
        <strong>Card:</strong> ****-****-****-{order.paymentMethod.cardNumber.slice(-4)}
        </Typography>
        <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
        <strong>Products</strong>
        </Typography>
        <div className="cartitems-format-main">
          <p>Products</p>
          <p>Title</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
        </div>
        <hr />
        {products.map((product) => {
          if (order.cartItems[0][product.id] > 0) {
            return (
              <div key={product.id}>
                <div className="cartitems-format-main cartitems-format">
                  <img className="cartitems-product-icon" src={backend_url + product.image} alt="" />
                  <p className="cartitems-product-title">{product.name}</p>
                  <p>{currency}{product.new_price}</p>
                  <button className="cartitems-quantity">{order.cartItems[0][product.id]}</button>
                  <p>{currency}{product.new_price * order.cartItems[0][product.id]}</p>
                </div>
                <hr />
              </div>
            );
          }
          return null;
        })}
         <div className="buttonContainer">
          <Button
            variant="contained"
            color="primary"
            onClick={handleGoMyOrders}
          >
            GO MY ORDERS
          </Button>
        </div>
      </Paper>
    </Grid>
  );
};

export default OrderCompleted;
