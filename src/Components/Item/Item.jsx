import React, { useContext, useState } from 'react'
import './Item.css'
import { Link } from 'react-router-dom'
import { backend_url, currency } from '../../App'
import { ShopContext } from '../../Context/ShopContext'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { FavoritesContext } from '../../Context/FavoritesContext'
import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'

const Item = (props) => {
  const { addToCart } = useContext(ShopContext)
  const [isAdding, setIsAdding] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const { toggleFavorite, isFavorite } = useContext(FavoritesContext);
  const [isToggling, setIsToggling] = useState(false);
  const favorite = isFavorite(props._id || props.id);

  const handleAddToCart = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (isAdding) return
    
    setIsAdding(true)
    const result = await addToCart(props.id)
    
    if (result && result.status === 200) {
      setShowToast(true)
      setTimeout(() => setShowToast(false), 3000)
    }
    
    setIsAdding(false)
  }

  const handleFavoriteClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isToggling) return;
    
    setIsToggling(true);
    // Use _id for the favorites API
    await toggleFavorite(props._id || props.id);
    setIsToggling(false);
  }

  return (
    <>
      <div data-qa-locator={"product-item"} className="item">
        <Link to={`/product/${props.id}`} className="item-link">
          <div className="item-image-container">
            
            {/* Imagem */}
            <img 
              onClick={() => window.scrollTo(0, 0)} 
              src={backend_url + "/api" + props.image} 
              alt="products" 
            />

            {/* Botão de Favorito */}
            <button
              className={`favorite-btn ${favorite ? "favorited" : ""}`}
              onClick={handleFavoriteClick}
              disabled={isToggling}
              aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
            >
              {favorite ? (
                <FavoriteIcon className="favorite-icon" />
              ) : (
                <FavoriteBorderIcon className="favorite-icon" />
              )}
            </button>

            {/* Botão de Add to Cart */}
            <button
              className={`add-to-cart-btn ${isAdding ? "adding" : ""}`}
              onClick={handleAddToCart}
              disabled={isAdding}
            >
              <ShoppingCartIcon sx={{ fontSize: 18 }} />
              <span>{isAdding ? "Adding..." : "Add to Cart"}</span>
            </button>
          </div>

          {/* Info do Produto */}
          <div className="item-info">
            <p>{props.name}</p>
            <div className="item-prices">
              <div className="item-price-new">
                {currency}
                {props.new_price}
              </div>
              <div className="item-price-old">
                {currency}
                {props.old_price}
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* Toast */}
      {showToast && (
        <div className="toast-notification">
          <div className="toast-content">
            <CheckCircleIcon className="toast-icon" />
            <p className="toast-message">Product added to cart successfully!</p>
          </div>
        </div>
      )}
    </>
  );
};

export default Item;
