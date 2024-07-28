import React, { useContext, useState } from "react";
import { useNavigate } from 'react-router-dom';
import "./CartItems.css";
import cross_icon from "../Assets/cart_cross_icon.png";
import { ShopContext } from "../../Context/ShopContext";
import { backend_url, currency } from "../../App";
import { Button, Container, Typography } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

const CartItems = () => {
  const { products, cartItems, removeFromCart, getTotalCartAmount, applyDiscount } = useContext(ShopContext);
  const [showModal, setShowModal] = useState(false);
  const [discountCode, setDiscountCode] = useState("");
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [discountAppliedMessage, setDiscountAppliedMessage] = useState("");
  const navigate = useNavigate();

  const handleRemoveFromCart = (itemId) => {
    removeFromCart(itemId);
    setShowModal(true);
    setTimeout(() => setShowModal(false), 3000); // Modal will disappear after 3 seconds
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
    <Container className="cartitems">
      {hasCartItems ? (
        <>
          <div className="cartitems-format-main">
            <p>Products</p>
            <p>Title</p>
            <p>Price</p>
            <p>Quantity</p>
            <p>Total</p>
            <p>Remove</p>
          </div>
          <hr />
          {products.map((e) => {
            if (cartItems[e.id] > 0) {
              return (
                <div key={e.id}>
                  <div className="cartitems-format-main cartitems-format">
                    <img className="cartitems-product-icon" src={backend_url + e.image} alt="" />
                    <p className="cartitems-product-title">{e.name}</p>
                    <p>{currency}{e.new_price}</p>
                    <button className="cartitems-quantity">{cartItems[e.id]}</button>
                    <p>{currency}{e.new_price * cartItems[e.id]}</p>
                    <img onClick={() => handleRemoveFromCart(e.id)} className="cartitems-remove-icon" src={cross_icon} alt="" />
                  </div>
                  <hr />
                </div>
              );
            }
            return null;
          })}

          <div className="cartitems-down">
            <div className="cartitems-total">
              <Typography variant="h4">Cart Totals</Typography>
              <div>
                <div className="cartitems-total-item">
                  <p>Subtotal</p>
                  <p>{currency}{getTotalCartAmount()}</p>
                </div>
                <hr />
                <div className="cartitems-total-item">
                  <p>Shipping Fee</p>
                  <p>Free</p>
                </div>
                <hr />
                {discountPercentage > 0 && (
                  <div className="cartitems-total-item">
                    <p>Discount ({discountPercentage}%)</p>
                    <p>-{currency}{getTotalCartAmount() * discountPercentage / 100}</p>
                    <Button
                      variant="contained"
                      color="secondary"
                      className="remove-discount-button"
                      onClick={handleRemoveDiscount}
                      sx={{ borderRadius: '20px', backgroundColor: '#D1C4E9' }}
                    >
                      Remove Discount
                    </Button>
                  </div>
                )}
                <div className="cartitems-total-item">
                  <h3>Total</h3>
                  <h3>{currency}{getTotalAfterDiscount()}</h3>
                </div>
              </div>
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate('/checkout')}
              >
                PROCEED TO CHECKOUT
              </Button>
            </div>
            <div className="cartitems-promocode">
              <p>If you have a promo code, enter it here</p>
              <div className="cartitems-promobox">
                <input 
                  type="text" 
                  placeholder="Promo code" 
                  value={discountCode}
                  onChange={(e) => setDiscountCode(e.target.value)}
                />
                <Button variant="contained" color="primary" onClick={handleDiscountSubmit}>Submit</Button>
              </div>
              {discountAppliedMessage && (
                <p className={discountAppliedMessage.includes("Invalid") || discountAppliedMessage.includes("already") ? "invalid-code" : ""}>{discountAppliedMessage}</p>
              )}
            </div>
          </div>
        </>
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
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <p>Product removed from cart successfully!</p>
          </div>
        </div>
      )}
    </Container>
  );
};

export default CartItems;
