import React, { useContext, useState } from "react";
import { useNavigate } from 'react-router-dom';
import "./CartItems.css";
import cross_icon from "../Assets/cart_cross_icon.png";
import { ShopContext } from "../../Context/ShopContext";
import { backend_url, currency } from "../../App";
import { Button, Typography, IconButton } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

const CartItems = () => {
  const { products, cartItems, removeFromCart, getTotalCartAmount, applyDiscount, clearCart } = useContext(ShopContext);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [discountCode, setDiscountCode] = useState("");
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [discountAppliedMessage, setDiscountAppliedMessage] = useState("");
  const navigate = useNavigate();

  const showToastNotification = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleRemoveFromCart = (itemId) => {
    removeFromCart(itemId);
    showToastNotification("Product removed from cart successfully!");
  };

  const handleClearCart = async () => {
    await clearCart();
    setDiscountPercentage(0);
    setDiscountAppliedMessage("");
    setDiscountCode("");
    showToastNotification("All products removed from cart successfully!");
  };

  const handleDiscountSubmit = async () => {
    if (discountPercentage > 0) {
      setDiscountAppliedMessage("Discount already applied");
      return;
    }

    const response = await applyDiscount(discountCode);
    if (response.status === 200) {
      setDiscountPercentage(response.discountPercentage);
      setDiscountAppliedMessage("Discount applied successfully!");
    } else if (response.status === 404) {
      setDiscountPercentage(0);
      setDiscountAppliedMessage("Invalid discount code");
    } else {
      setDiscountPercentage(0);
      setDiscountAppliedMessage("Something went wrong, please try again later");
    }
  };

  const handleRemoveDiscount = () => {
    setDiscountPercentage(0);
    setDiscountAppliedMessage("Discount removed");
  };

  const getTotalAfterDiscount = () => {
    const total = getTotalCartAmount();
    return total - (total * discountPercentage / 100);
  };

  const hasCartItems = products.some(e => cartItems[e.id] > 0);

  return (
    <div className="modern-cart-container">
      {hasCartItems ? (
        <div className="cart-layout">
          {/* Order Summary - Left Side */}
          <div className="order-summary">
            <div className="summary-header">
              <Typography variant="h4" className="summary-title">Order Summary</Typography>
              <Typography variant="body2" className="summary-items">
                {Object.values(cartItems).reduce((a, b) => a + b, 0)} items
              </Typography>
            </div>

            <div className="summary-details">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>{currency}{getTotalCartAmount()}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span className="free-shipping">Free</span>
              </div>
              {discountPercentage > 0 && (
                <div className="summary-row discount-row">
                  <span>Discount ({discountPercentage}%)</span>
                  <span className="discount-amount">-{currency}{(getTotalCartAmount() * discountPercentage / 100).toFixed(2)}</span>
                  <button
                    className="remove-discount-btn"
                    onClick={handleRemoveDiscount}
                    title="Remove discount"
                  >
                    ×
                  </button>
                </div>
              )}
              <hr className="summary-divider" />
              <div className="summary-row total-row">
                <span>Total</span>
                <span>{currency}{getTotalAfterDiscount().toFixed(2)}</span>
              </div>
            </div>

            <div className="promo-section">
              <Typography variant="h6" className="promo-title">Promo Code</Typography>
              <div className="promo-input-container">
                <input
                  data-qa-locator={"promo-code-input"}
                  type="text"
                  placeholder="Enter discount code"
                  value={discountCode}
                  onChange={(e) => setDiscountCode(e.target.value)}
                  className="promo-input"
                />
                <button
                  id="submit-button"
                  className="apply-promo-btn"
                  onClick={handleDiscountSubmit}
                  disabled={!discountCode.trim()}
                >
                  Apply
                </button>
              </div>
              {discountAppliedMessage && (
                <div className={`promo-message ${
                  discountAppliedMessage.includes("Invalid") || 
                  discountAppliedMessage.includes("already") || 
                  discountAppliedMessage.includes("wrong") 
                    ? "error" : "success"
                }`}>
                  {discountAppliedMessage}
                </div>
              )}
            </div>

            <Button
              variant="contained"
              className="checkout-btn"
              onClick={() => navigate('/checkout')}
              fullWidth
            >
              Proceed to Checkout
            </Button>
            
            <Button
              variant="outlined"
              className="continue-shopping-btn"
              onClick={() => navigate('/')}
              fullWidth
            >
              Continue Shopping
            </Button>
          </div>

          {/* Cart Items - Right Side */}
          <div className="cart-items-section">
            <div className="cart-header">
              <Typography variant="h4" className="cart-title">Shopping Cart</Typography>
              <IconButton 
                className="clear-cart-btn"
                onClick={handleClearCart}
                title="Clear all items"
                aria-label="Clear cart"
              >
                <DeleteOutlineIcon />
              </IconButton>
            </div>

            <div className="cart-items-list">
              {products.map((product) => {
                if (cartItems[product.id] > 0) {
                  return (
                    <div key={product.id} className="cart-item" data-qa-label={"product-item-cart"}>
                      <div className="item-image">
                        <img src={backend_url + product.image} alt={product.name} />
                      </div>
                      <div className="item-details">
                        <h3 className="item-name">{product.name}</h3>
                        <p className="item-price">{currency}{product.new_price}</p>
                        <div className="item-quantity">
                          <span>Quantity: </span>
                          <span className="quantity-badge">{cartItems[product.id]}</span>
                        </div>
                      </div>
                      <div className="item-total">
                        <div className="total-price">{currency}{(product.new_price * cartItems[product.id]).toFixed(2)}</div>
                        <button
                          className="remove-item-btn"
                          onClick={() => handleRemoveFromCart(product.id)}
                          title="Remove item"
                        >
                          <img src={cross_icon} alt="Remove" />
                        </button>
                      </div>
                    </div>
                  );
                }
                return null;
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="empty-cart">
          <ShoppingCartIcon style={{ fontSize: 100, color: "#ccc" }} />
          <Typography variant="h4" gutterBottom>Your cart is empty!</Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/')}
            style={{ marginTop: '20px' }}
          >
            Continue Shopping
          </Button>
        </div>
      )}
      {showToast && (
        <div className="toast-notification">
          <div className="toast-content">
            <CheckCircleIcon className="toast-icon" />
            <p className="toast-message">{toastMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartItems;
