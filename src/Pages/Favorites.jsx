import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './Favorites.css';
import { FavoritesContext } from '../../Context/FavoritesContext';
import Item from '../../Components/Item/Item';
import { Button, Typography, CircularProgress } from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

const Favorites = () => {
  const { favorites, favoritesLoading } = useContext(FavoritesContext);
  const navigate = useNavigate();

  if (favoritesLoading) {
    return (
      <div className="favorites-loading">
        <CircularProgress size={60} />
        <Typography variant="h6" style={{ marginTop: '20px' }}>
          Loading your favorites...
        </Typography>
      </div>
    );
  }

  return (
    <div className="favorites-container">
      <div className="favorites-header">
        <Typography variant="h3" className="favorites-title">
          My Favorites
        </Typography>
        {favorites.length > 0 && (
          <Typography variant="body1" className="favorites-count">
            {favorites.length} {favorites.length === 1 ? 'item' : 'items'}
          </Typography>
        )}
      </div>

      {favorites.length > 0 ? (
        <div className="favorites-grid">
          {favorites.map((product) => (
            <Item
              key={product.id || product._id}
              id={product.id || product._id}
              name={product.name}
              image={product.image}
              new_price={product.new_price}
              old_price={product.old_price}
            />
          ))}
        </div>
      ) : (
        <div className="empty-favorites">
          <div className="empty-icon">
            <FavoriteBorderIcon style={{ fontSize: 120, color: '#D1D1D6' }} />
          </div>
          <Typography variant="h4" className="empty-title">
            No Favorites Yet
          </Typography>
          <Typography variant="body1" className="empty-description">
            Start adding products to your favorites by clicking the heart icon on items you love!
          </Typography>
          <Button
            variant="contained"
            className="go-shopping-btn"
            onClick={() => navigate('/')}
            size="large"
          >
            Start Shopping
          </Button>
        </div>
      )}
    </div>
  );
};

export default Favorites;
