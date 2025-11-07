import React, { createContext, useState, useEffect } from 'react';
import { backend_url } from '../App';

export const FavoritesContext = createContext(null);

const FavoritesProvider = (props) => {
  const [favorites, setFavorites] = useState([]);
  const [favoritesLoading, setFavoritesLoading] = useState(true);

  // Fetch favorites on mount
  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    const userId = localStorage.getItem('user-id');
    if (!userId) {
      setFavoritesLoading(false);
      return;
    }

    try {
      const response = await fetch(`${backend_url}/api/v2/favorites/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': localStorage.getItem('auth-token'),
        },
      });

      if (response.ok) {
        const data = await response.json();
        setFavorites(data.products || []);
      }
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setFavoritesLoading(false);
    }
  };

  const toggleFavorite = async (product) => {
    const userId = localStorage.getItem('user-id');
    if (!userId) {
      console.error('User not logged in');
      return { success: false, message: 'Please login to add favorites' };
    }

    // Handle both direct ID values and product objects
    const productId = typeof product === 'object' ? (product._id || product.id) : product;

    try {
      const response = await fetch(`${backend_url}/api/v2/favorites/toggle`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': localStorage.getItem('auth-token'),
        },
        body: JSON.stringify({
          userId: userId,
          productId: productId,
        }),
      });

      if (response.ok) {
        // Refresh favorites list
        await fetchFavorites();
        return { success: true };
      } else {
        return { success: false, message: 'Failed to update favorites' };
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      return { success: false, message: 'An error occurred' };
    }
  };

  const isFavorite = (productId) => {
    return favorites.some(fav => fav.id === productId || fav._id === productId);
  };

  const contextValue = {
    favorites,
    favoritesLoading,
    toggleFavorite,
    isFavorite,
    fetchFavorites,
  };

  return (
    <FavoritesContext.Provider value={contextValue}>
      {props.children}
    </FavoritesContext.Provider>
  );
};

export default FavoritesProvider;
