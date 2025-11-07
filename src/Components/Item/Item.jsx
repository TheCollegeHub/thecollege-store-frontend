import React, { useContext, useState } from 'react'
import './Item.css'
import { Link } from 'react-router-dom'
import { backend_url, currency } from '../../App'
import { FavoritesContext } from '../../Context/FavoritesContext'
import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'

const Item = (props) => {
  const { toggleFavorite, isFavorite } = useContext(FavoritesContext);
  const [isToggling, setIsToggling] = useState(false);
  
  // Use _id for favorites API, id for navigation
  const favorite = isFavorite(props._id || props.id);

  const handleFavoriteClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isToggling) return;
    
    setIsToggling(true);
    // Use _id for the favorites API
    await toggleFavorite(props._id || props.id);
    setIsToggling(false);
  };

  return (
    <div data-qa-locator={"product-item"} className='item'>
      <Link to={`/product/${props.id}`} className="item-link-wrapper">
        <div className="item-image-wrapper">
          <img onClick={window.scrollTo(0, 0)} src={backend_url+props.image} alt="products" />
          <button 
            className={`favorite-btn ${favorite ? 'favorited' : ''}`}
            onClick={handleFavoriteClick}
            disabled={isToggling}
            aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            {favorite ? (
              <FavoriteIcon className="favorite-icon" />
            ) : (
              <FavoriteBorderIcon className="favorite-icon" />
            )}
          </button>
        </div>
        <p>{props.name}</p>
        <div className="item-prices">
          <div className="item-price-new">{currency}{props.new_price}</div>
          <div className="item-price-old">{currency}{props.old_price}</div>
        </div>
      </Link>
    </div>
  )
}

export default Item
