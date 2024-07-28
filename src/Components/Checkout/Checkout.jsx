import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShopContext } from '../../Context/ShopContext';
import { backend_url, currency } from '../../App';
import {
  Container, Paper, Typography, Button, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, Grid,
  Modal, TextField, IconButton, Box, Snackbar, Alert
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import './Checkout.css';

const Checkout = () => {
  const { getTotalCartAmount, discountPercentage , cartItems} = useContext(ShopContext);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [cards, setCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState('');
  const [isAddAddressOpen, setIsAddAddressOpen] = useState(false);
  const [isAddCardOpen, setIsAddCardOpen] = useState(false);
  const [setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);

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

  const [addressesLoaded, setAddressesLoaded] = useState(false);
  const [cardsLoaded, setCardsLoaded] = useState(false);

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

  const getTotalAfterDiscount = () => {
    const total = getTotalCartAmount();
    return total - (total * discountPercentage / 100);
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
    const userId = localStorage.getItem('user-id');
    const orderDetails = {
      cartItems: cartItems, 
      totalAmount: getTotalCartAmount(),
      discount: discountPercentage,
      finalAmount: getTotalAfterDiscount(),
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
    <Container>
      <Paper className="checkout-paper">
        <Typography variant="h4" gutterBottom>Checkout</Typography>

        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControl component="fieldset" className="checkout-section">
                  <FormLabel component="legend">Delivery Address</FormLabel>
                  {addressesLoaded ? (
                    addresses.length > 0 ? (
                      <RadioGroup value={selectedAddress} onChange={(e) => setSelectedAddress(e.target.value)}>
                        {addresses.map((address) => (
                          <FormControlLabel
                            key={address._id}
                            value={address._id}
                            control={<Radio />}
                            label={
                              <Typography variant="body2">
                              {`${address.street}, ${address.city}, ${address.state}, ${address.zip}`}
                              </Typography>
                            }
                          />
                        ))}
                      </RadioGroup>
                    ) : (
                      <Typography variant="body1">No addresses found. Please add a new address.</Typography>
                    )
                  ) : (
                    <Typography variant="body1">Loading addresses...</Typography>
                  )}
                  <Button variant="contained" color="primary" size="small" style={{ width: '160px' }} onClick={handleAddAddress}>
                    Add New Address
                  </Button>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl component="fieldset" className="checkout-section">
                  <FormLabel component="legend">Payment Method</FormLabel>
                  {cardsLoaded ? (
                    cards.length > 0 ? (
                      <RadioGroup value={selectedCard} onChange={(e) => setSelectedCard(e.target.value)}>
                        {cards.map((card) => (
                          <FormControlLabel
                            key={card._id}
                            value={card._id}
                            control={<Radio />}
              
                            label={
                            <Typography variant="body2">
                            {`Card: ****-****-****-${card.cardNumber.slice(-4)} | Expiration: ${card.expiryDate}`}
                            </Typography>
                            }
                          />
                        ))}
                      </RadioGroup>
                    ) : (
                      <Typography variant="body1">No cards found. Please add a new card.</Typography>
                    )
                  ) : (
                    <Typography variant="body1">Loading cards...</Typography>
                  )}
                  <Button variant="contained" color="primary" size="small" style={{ width: '130px' }} onClick={handleAddCard}>
                    Add New Card
                  </Button>
                </FormControl>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} md={4} className="order-summary-container">
            <div className="checkout-summary">
              <Typography variant="h6">Order Summary</Typography>
              <Typography variant="body1">Subtotal: {currency}{getTotalCartAmount()}</Typography>
              {discountPercentage > 0 && (
                <Typography variant="body1">Discount: {currency}{(getTotalCartAmount() * discountPercentage / 100).toFixed(2)}</Typography>
              )}
              <Typography variant="h5">Total: {currency}{getTotalAfterDiscount().toFixed(2)}</Typography>
              <Button variant="contained" color="secondary" onClick={handlePayment}>
                Make Payment
              </Button>
            </div>
          </Grid>
        </Grid>
        <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
          {errorMessage}
        </Alert>
      </Snackbar>
      </Paper>

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
                onChange={(e) => setNewCard({ ...newCard, cardNumber: e.target.value })}
                fullWidth
                margin="normal"
                required
              />
              <TextField
                label="Expiry Date"
                value={newCard.expiryDate}
                onChange={(e) => setNewCard({ ...newCard, expiryDate: e.target.value })}
                fullWidth
                margin="normal"
                required
              />
              <TextField
                label="CVV"
                value={newCard.cvv}
                onChange={(e) => setNewCard({ ...newCard, cvv: e.target.value })}
                fullWidth
                margin="normal"
                required
              />
            </Box>
            <Box sx={{ display: 'flex', marginTop: '16px', padding: '16px' }}>
              <Button variant="contained" color="primary" onClick={handleSaveCard}>
                Save Card
              </Button>
            </Box>
          </form>
        </Paper>
      </Modal>


    </Container>
  );
};

export default Checkout;
