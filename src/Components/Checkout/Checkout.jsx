/* eslint-disable */
import React, { useContext, useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShopContext } from '../../Context/ShopContext';
import { backend_url, currency } from '../../App';
import {
  Container, Paper, Typography, Button, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, Grid,
  Modal, TextField, IconButton, Box, Snackbar, Alert, InputAdornment
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import './Checkout.css';

const Checkout = () => {
  const { getTotalCartAmount, discountPercentage , cartItems} = useContext(ShopContext);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [cards, setCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState('');
  const [isAddAddressOpen, setIsAddAddressOpen] = useState(false);
  const [isAddCardOpen, setIsAddCardOpen] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [cartTotal, setCartTotal] = useState(0);

const handleCloseSnackbar = () => {
  setOpenSnackbar(false);
};
  const navigate = useNavigate();

  const [newAddress, setNewAddress] = useState({
    street: '',
    city: '',
    state: '',
    zip: ''
  });

  const [newCard, setNewCard] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });

  const [cardValidation, setCardValidation] = useState({
    isValid: false,
    cardType: null,
    error: ''
  });

  const [addressesLoaded, setAddressesLoaded] = useState(false);
  const [cardsLoaded, setCardsLoaded] = useState(false);

  // Update cart total whenever cartItems changes
  useEffect(() => {
    const total = getTotalCartAmount();
    setCartTotal(total);
  }, [cartItems, getTotalCartAmount]);

  useEffect(() => {
    // Fetch addresses and cards from backend
    const fetchAddresses = async () => {
      const authToken = localStorage.getItem('auth-token');
      const userId = localStorage.getItem('user-id');
      
      try {
        const response = await fetch(`${backend_url}/api/user/${userId}/addresses`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'auth-token': authToken,
          },
        });
    
        if (!response.ok) {
          throw new Error('Failed to fetch addresses');
        }
    
        const data = await response.json();
        setAddresses(data.addresses);
        setSelectedAddress(data.addresses[0]?._id);
        setAddressesLoaded(true);
      } catch (error) {
        console.error('Error fetching addresses:', error);
      }
    };
    

    const fetchCards = async () => {
      const userId = localStorage.getItem('user-id');
      const authToken = localStorage.getItem('auth-token');
    
      const response = await fetch(`${backend_url}/api/user/${userId}/cards`, {
        headers: {
          'auth-token': authToken,
        },
      });
    
      if (response.ok) {
        const data = await response.json();
        setCards(data);
        setSelectedCard(data[0]?._id);
      }
      setCardsLoaded(true);
    };

    fetchAddresses();
    fetchCards();
  }, []);

  // Memoize cart calculations to ensure they update when cartTotal changes
  const subtotal = useMemo(() => cartTotal, [cartTotal]);
  
  const shippingCost = useMemo(() => {
    if (cartTotal >= 200) {
      return 0; // Free shipping
    } else if (cartTotal >= 100 && cartTotal < 200) {
      return 25; // $25 shipping
    } else {
      return 50; // $50 shipping
    }
  }, [cartTotal]);

  const totalAfterDiscount = useMemo(() => {
    const discount = cartTotal * discountPercentage / 100;
    return cartTotal - discount + shippingCost;
  }, [cartTotal, discountPercentage, shippingCost]);

  const getTotalCartItemsCount = () => {
    return Object.values(cartItems).reduce((total, quantity) => total + quantity, 0);
  };

  const getShippingCost = () => {
    return shippingCost;
  };

  const getTotalAfterDiscount = () => {
    return totalAfterDiscount;
  };

  const validateWelcomeCoupon = () => {
    const MINIMUM_VALUE = 150;
    const MINIMUM_ITEMS = 3;
    
    const totalAmount = subtotal;
    const totalItems = getTotalCartItemsCount();
    
    const requirements = [];
    
    if (totalAmount < MINIMUM_VALUE) {
      requirements.push(`Add ${currency}${(MINIMUM_VALUE - totalAmount).toFixed(2)} more to reach minimum order value of ${currency}${MINIMUM_VALUE}`);
    }
    
    if (totalItems < MINIMUM_ITEMS) {
      requirements.push(`Add ${MINIMUM_ITEMS - totalItems} more item${MINIMUM_ITEMS - totalItems > 1 ? 's' : ''} (minimum ${MINIMUM_ITEMS} items required)`);
    }
    
    return {
      isValid: requirements.length === 0,
      requirements: requirements
    };
  };

  const validateCardNumber = (cardNumber) => {
    // Remove all spaces and non-numeric characters
    const cleanNumber = cardNumber.replace(/\s/g, '');
    
    // Check if contains only numbers
    if (!/^\d*$/.test(cleanNumber)) {
      return {
        isValid: false,
        cardType: null,
        error: 'Card number must contain only digits'
      };
    }

    // Check if empty
    if (cleanNumber.length === 0) {
      return {
        isValid: false,
        cardType: null,
        error: ''
      };
    }

    // Check if less than 16 digits
    if (cleanNumber.length < 16) {
      return {
        isValid: false,
        cardType: null,
        error: 'Card number must be 16 digits'
      };
    }

    // Check if more than 16 digits
    if (cleanNumber.length > 16) {
      return {
        isValid: false,
        cardType: null,
        error: 'Card number must be exactly 16 digits'
      };
    }

    // Check if it's exactly 16 digits
    if (cleanNumber.length === 16) {
      // Check if starts with 4 (Visa)
      if (cleanNumber.startsWith('4')) {
        return {
          isValid: true,
          cardType: 'visa',
          error: ''
        };
      }
      // Check if starts with 5 (Mastercard)
      else if (cleanNumber.startsWith('5')) {
        return {
          isValid: true,
          cardType: 'mastercard',
          error: ''
        };
      }
      // Invalid card type
      else {
        return {
          isValid: false,
          cardType: null,
          error: 'Card must be Visa (starts with 4) or Mastercard (starts with 5)'
        };
      }
    }

    return {
      isValid: false,
      cardType: null,
      error: 'Invalid card number'
    };
  };

  const handleCardNumberChange = (e) => {
    const value = e.target.value;
    // Remove all non-numeric characters
    const numericValue = value.replace(/\D/g, '');
    
    // Limit to 16 digits
    const limitedValue = numericValue.slice(0, 16);
    
    // Add spaces every 4 digits for display
    const formattedValue = limitedValue.replace(/(\d{4})(?=\d)/g, '$1 ');
    
    setNewCard({ ...newCard, cardNumber: formattedValue });
    
    // Validate the card number
    const validation = validateCardNumber(formattedValue);
    setCardValidation(validation);
  };

  const handleAddAddress = () => {
    setIsAddAddressOpen(true);
  };

  const handleAddCard = () => {
    setIsAddCardOpen(true);
  };

  const handleCloseAddAddress = () => {
    setIsAddAddressOpen(false);
    // Limpar os campos do novo endereço se necessário
    setNewAddress({
      street: '',
      city: '',
      state: '',
      zip: ''
    });
  };

  const handleCloseAddCard = () => {
    setIsAddCardOpen(false);
    // Limpar os campos do novo cartão se necessário
    setNewCard({
      cardNumber: '',
      expiryDate: '',
      cvv: ''
    });
    setCardValidation({
      isValid: false,
      cardType: null,
      error: ''
    });
  };

  const handleSaveAddress = async (event) => {
    event.preventDefault();

    const userId = localStorage.getItem('user-id');
    const authToken = localStorage.getItem('auth-token');
    
    try {
      const response = await fetch(`${backend_url}/api/user/${userId}/addresses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': authToken,
        },
        body: JSON.stringify(newAddress),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setAddresses((prevAddresses) => [...prevAddresses, data.address]);
        setSelectedAddress(data.address._id);
        setIsAddAddressOpen(false);
        setNewAddress({ street: '', city: '', state: '', zip: '' }); // Clear form fields after saving
      } else {
        console.error('Failed to save address');
      }
    } catch (error) {
      console.error('Error saving address:', error);
    }
  };

  const handleSaveCard = async (event) => {
    event.preventDefault();

    // Validate card before saving
    if (!cardValidation.isValid) {
      setError(true);
      setErrorMessage(cardValidation.error || 'Please enter a valid card number');
      setOpenSnackbar(true);
      return;
    }
  
    const userId = localStorage.getItem('user-id');
    const authToken = localStorage.getItem('auth-token');
  
    try {
      const response = await fetch(`${backend_url}/api/user/${userId}/cards`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': authToken,
        },
        body: JSON.stringify(newCard),
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log('New card data:', data); // Verifique a resposta aqui
        setCards((prevCards) => [...prevCards, data.card]);
        setSelectedCard(data.card._id);
        setIsAddCardOpen(false);
        setNewCard({ cardNumber: '', expiryDate: '', cvv: '' }); // Clear form fields after saving
      } else {
        console.error('Failed to save card');
      }
    } catch (error) {
      console.error('Error saving card:', error);
    }
  };

  const handlePayment = async () => {
    // Validate WELCOME coupon if discount is applied
    if (discountPercentage > 0) {
      const validation = validateWelcomeCoupon();
      
      if (!validation.isValid) {
        const requirementsMessage = validation.requirements.join('\n• ');
        setError(true);
        setErrorMessage(`Cannot apply WELCOME coupon. Requirements not met:\n• ${requirementsMessage}`);
        setOpenSnackbar(true);
        return;
      }
    }

    const userId = localStorage.getItem('user-id');
    const orderDetails = {
      cartItems: cartItems, 
      totalAmount: subtotal,
      discount: discountPercentage,
      shipping: shippingCost,
      finalAmount: totalAfterDiscount,
      address: addresses.find(address => address._id === selectedAddress),
      paymentMethod: cards.find(card => card._id === selectedCard)
    };
    
    console.log(orderDetails)
    const response = await fetch(`${backend_url}/api/user/${userId}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': localStorage.getItem('auth-token')
      },
      body: JSON.stringify(orderDetails)
    });
  
    if (response.ok) {
      const data = await response.json();
      navigate('/order-completed', { state: { order: data.order } });
    } else {
      console.error('Failed to create order');
      setError(true);
      setErrorMessage('Failed to create order. Please try again.');
      setOpenSnackbar(true);
    }
  };
  

  return (
    <>
      <div className="modern-checkout-container">
        <div className="checkout-layout">
        {/* Order Summary - Left Side */}
        <div className="checkout-summary-panel">
          <div className="summary-header">
            <Typography variant="h4" className="checkout-title">Order Summary</Typography>
            <Typography variant="body2" className="summary-items">
              {Object.values(cartItems).reduce((a, b) => a + b, 0)} items
            </Typography>
          </div>

          <div className="summary-details">
            <div className="summary-row">
              <span>Subtotal</span>
              <span>{currency}{subtotal.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              {shippingCost === 0 ? (
                <span className="free-shipping">Free</span>
              ) : (
                <span>{currency}{shippingCost.toFixed(2)}</span>
              )}
            </div>
            {discountPercentage > 0 && (
              <>
                <div className="summary-row discount-row">
                  <span>Discount ({discountPercentage}%)</span>
                  <span className="discount-amount">-{currency}{(subtotal * discountPercentage / 100).toFixed(2)}</span>
                </div>
                {(() => {
                  const validation = validateWelcomeCoupon();
                  if (!validation.isValid) {
                    return (
                      <div className="coupon-warning">
                        <div className="warning-icon">⚠️</div>
                        <div className="warning-content">
                          <strong>WELCOME Coupon Requirements:</strong>
                          <ul>
                            {validation.requirements.map((req, index) => (
                              <li key={index}>{req}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    );
                  }
                  return null;
                })()}
              </>
            )}
            <hr className="summary-divider" />
            <div className="summary-row total-row">
              <span>Total</span>
              <span>{currency}{totalAfterDiscount.toFixed(2)}</span>
            </div>
          </div>

          <div className="payment-actions">
            <Button
              variant="contained"
              className="payment-btn checkout-btn"
              onClick={handlePayment}
              fullWidth
            >
              Complete Payment
            </Button>
            <Button
              variant="outlined"
              className="back-to-cart-btn continue-shopping-btn"
              onClick={() => navigate('/cart')}
              fullWidth
            >
              Back to Cart
            </Button>
          </div>
        </div>

        {/* Checkout Form - Right Side */}
        <div className="checkout-form-section">
          <div className="checkout-header">
            <div className="header-content">
              <div className="header-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="header-text">
                <h2 className="form-title">Checkout Details</h2>
                <p className="form-subtitle">Secure and fast checkout process</p>
              </div>
            </div>
          </div>

          {/* Delivery Address Section */}
          <div className="checkout-section address-section">
            <div className="section-header">
              <div className="section-title-container">
                <div className="section-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 21C15.5 17.4 19 14.1764 19 10.2C19 6.22355 15.7764 3 12 3C8.22355 3 5 6.22355 5 10.2C5 14.1764 8.5 17.4 12 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="section-title">Delivery Address</h3>
              </div>
              <Button 
                variant="outlined" 
                className="add-btn modern-add-btn"
                onClick={handleAddAddress}
              >
                <span className="btn-icon">+</span>
                Add New
              </Button>
            </div>
            
            <div className="options-container modern-options">
              {addressesLoaded ? (
                addresses.length > 0 ? (
                  <RadioGroup value={selectedAddress} onChange={(e) => setSelectedAddress(e.target.value)} className="radio-group-modern">
                    {addresses.map((address) => (
                      <div key={address._id} className="modern-option-card address-card">
                        <div className="card-content">
                          <div className="card-header">
                            <div className="address-icon">
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M9 22V12H15V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            </div>
                            <div className="card-title">Home Address</div>
                            <FormControlLabel
                              value={address._id}
                              control={<Radio className="modern-radio" />}
                              label=""
                              className="card-radio"
                            />
                          </div>
                          <div className="card-details">
                            <p className="address-line">{address.street}</p>
                            <p className="address-line">{address.city}, {address.state} {address.zip}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </RadioGroup>
                ) : (
                  <div className="modern-empty-state">
                    <div className="empty-icon">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                        <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <h4 className="empty-title">No addresses found</h4>
                    <p className="empty-message">Add your first delivery address to continue</p>
                    <Button variant="contained" onClick={handleAddAddress} className="empty-action-btn">
                      Add Address
                    </Button>
                  </div>
                )
              ) : (
                <div className="modern-loading-state">
                  <div className="loading-spinner"></div>
                  <p className="loading-text">Loading addresses...</p>
                </div>
              )}
            </div>
          </div>

          {/* Payment Method Section */}
          <div className="checkout-section payment-section">
            <div className="section-header">
              <div className="section-title-container">
                <div className="section-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="2" y="4" width="20" height="16" rx="3" stroke="currentColor" strokeWidth="2"/>
                    <path d="M2 10H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M6 14H6.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M10 14H12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="section-title">Payment Method</h3>
              </div>
              <Button 
                variant="outlined" 
                className="add-btn modern-add-btn"
                onClick={handleAddCard}
              >
                <span className="btn-icon">+</span>
                Add New
              </Button>
            </div>
            
            <div className="options-container modern-options">
              {cardsLoaded ? (
                cards.length > 0 ? (
                  <RadioGroup value={selectedCard} onChange={(e) => setSelectedCard(e.target.value)} className="radio-group-modern">
                    {cards.map((card) => (
                      <div key={card._id} className="modern-option-card payment-card">
                        <div className="card-content">
                          <div className="card-header">
                            <div className="payment-icon">
                              <svg width="24" height="16" viewBox="0 0 24 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect x="0" y="0" width="24" height="16" rx="3" fill="currentColor"/>
                                <rect x="0" y="5" width="24" height="2" fill="white"/>
                                <rect x="2" y="9" width="4" height="1" fill="white"/>
                                <rect x="2" y="11" width="6" height="1" fill="white"/>
                              </svg>
                            </div>
                            <div className="card-title">
                              {card.cardType || 'Credit Card'}
                              <span className="card-brand">Visa</span>
                            </div>
                            <FormControlLabel
                              value={card._id}
                              control={<Radio className="modern-radio" />}
                              label=""
                              className="card-radio"
                            />
                          </div>
                          <div className="card-details">
                            <p className="card-number">•••• •••• •••• {card.cardNumber.slice(-4)}</p>
                            <div className="card-meta">
                              <span className="expiry">Exp: {card.expiryDate}</span>
                              <span className="cardholder">{card.cardHolderName || 'Card Holder'}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </RadioGroup>
                ) : (
                  <div className="modern-empty-state">
                    <div className="empty-icon">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="2" y="4" width="20" height="16" rx="3" stroke="currentColor" strokeWidth="2"/>
                        <path d="M2 10H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        <circle cx="12" cy="14" r="1" fill="currentColor"/>
                      </svg>
                    </div>
                    <h4 className="empty-title">No payment methods</h4>
                    <p className="empty-message">Add a payment method to complete your purchase</p>
                    <Button variant="contained" onClick={handleAddCard} className="empty-action-btn">
                      Add Payment Method
                    </Button>
                  </div>
                )
              ) : (
                <div className="modern-loading-state">
                  <div className="loading-spinner"></div>
                  <p className="loading-text">Loading payment methods...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>

    <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
          {errorMessage}
        </Alert>
      </Snackbar>

      <Modal
        open={isAddAddressOpen}
        onClose={handleCloseAddAddress}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        className="modal"
      >
        <Paper className="modal-paper">
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' , }}>
            <IconButton aria-label="close" onClick={handleCloseAddAddress}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Typography variant="h6" id="modal-title" sx={{ padding: '16px' }}>Add New Address</Typography>
          <form className="modal-form">
            <Box sx={{ padding: '16px' }}>
              <TextField
                label="Street"
                value={newAddress.street}
                onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                fullWidth
                margin="normal"
                required
              />
              <TextField
                label="City"
                value={newAddress.city}
                onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                fullWidth
                margin="normal"
                required
              />
              <TextField
                label="State"
                value={newAddress.state}
                onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                fullWidth
                margin="normal"
                required
              />
              <TextField
                label="ZIP"
                value={newAddress.zip}
                onChange={(e) => setNewAddress({ ...newAddress, zip: e.target.value })}
                fullWidth
                margin="normal"
                required
              />
            </Box>
            <Box sx={{ display: 'flex', marginTop: '16px', padding: '16px'}}>
              <Button variant="contained" color="primary" onClick={handleSaveAddress}>
                Save Address
              </Button>
            </Box>
          </form>
        </Paper>
      </Modal>

      {/* Modal para adicionar novo cartão */}
      <Modal
        open={isAddCardOpen}
        onClose={handleCloseAddCard}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        className="modal"
      >
        <Paper className="modal-paper">
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <IconButton aria-label="close" onClick={handleCloseAddCard}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Typography variant="h6" id="modal-title" sx={{ padding: '16px' }}>Add New Card</Typography>
          <form className="modal-form">
            <Box sx={{ padding: '16px' }}>
              <TextField
                label="Card Number"
                value={newCard.cardNumber}
                onChange={handleCardNumberChange}
                fullWidth
                margin="normal"
                required
                error={!!cardValidation.error}
                helperText={cardValidation.error}
                placeholder="1234 5678 9012 3456"
                inputProps={{
                  maxLength: 19, // 16 digits + 3 spaces
                  inputMode: 'numeric'
                }}
                InputProps={{
                  endAdornment: cardValidation.cardType && (
                    <InputAdornment position="end">
                      {cardValidation.cardType === 'visa' ? (
                        <div className="card-icon visa-icon">
                          <svg width="48" height="32" viewBox="0 0 48 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect width="48" height="32" rx="4" fill="#1434CB"/>
                            <text x="24" y="21" fontFamily="Arial, sans-serif" fontSize="12" fontWeight="bold" fill="white" textAnchor="middle">VISA</text>
                          </svg>
                        </div>
                      ) : cardValidation.cardType === 'mastercard' ? (
                        <div className="card-icon mastercard-icon">
                          <svg width="48" height="32" viewBox="0 0 48 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect width="48" height="32" rx="4" fill="#EB001B"/>
                            <circle cx="19" cy="16" r="8" fill="#FF5F00" opacity="0.8"/>
                            <circle cx="29" cy="16" r="8" fill="#F79E1B" opacity="0.8"/>
                          </svg>
                        </div>
                      ) : null}
                    </InputAdornment>
                  )
                }}
              />
              <TextField
                label="Expiry Date"
                value={newCard.expiryDate}
                onChange={(e) => setNewCard({ ...newCard, expiryDate: e.target.value })}
                fullWidth
                margin="normal"
                required
                placeholder="MM/YY"
              />
              <TextField
                label="CVV"
                value={newCard.cvv}
                onChange={(e) => setNewCard({ ...newCard, cvv: e.target.value })}
                fullWidth
                margin="normal"
                required
                type="password"
                placeholder="123"
                inputProps={{
                  maxLength: 3,
                  inputMode: 'numeric'
                }}
              />
            </Box>
            <Box sx={{ display: 'flex', marginTop: '16px', padding: '16px' }}>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={handleSaveCard}
                disabled={!cardValidation.isValid}
              >
                Save Card
              </Button>
            </Box>
          </form>
        </Paper>
      </Modal>
    </>
  );
};

export default Checkout;
