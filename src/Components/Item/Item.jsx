import React, { useContext, useState } from 'react'
import './Item.css'
import { Link } from 'react-router-dom'
import { backend_url, currency } from '../../App'
import { ShopContext } from '../../Context/ShopContext'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'

const Item = (props) => {
  const { addToCart } = useContext(ShopContext)
  const [isAdding, setIsAdding] = useState(false)
  const [showToast, setShowToast] = useState(false)

  const handleAddToCart = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (isAdding) return
    
    setIsAdding(true)
    const result = await addToCart(props.id)
    
    if (result && result.status === 200) {
      setShowToast(true)
      setTimeout(() => setShowToast(false), 2000)
    }
    
    setIsAdding(false)
  }

  return (
    <div data-qa-locator={"product-item"} className='item'>
      <Link to={`/product/${props.id}`} className="item-link">
        <div className="item-image-container">
          <img onClick={window.scrollTo(0, 0)} src={backend_url+props.image} alt="products" />
          <button 
            className={`add-to-cart-btn ${isAdding ? 'adding' : ''} ${showToast ? 'added' : ''}`}
            onClick={handleAddToCart}
            disabled={isAdding}
          >
            {showToast ? (
              <>
                <CheckCircleIcon sx={{ fontSize: 18 }} />
                <span>Added!</span>
              </>
            ) : (
              <>
                <ShoppingCartIcon sx={{ fontSize: 18 }} />
                <span>Add to Cart</span>
              </>
            )}
          </button>
        </div>
        <div className="item-info">
          <p>{props.name}</p>
          <div className="item-prices">
            <div className="item-price-new">{currency}{props.new_price}</div>
            <div className="item-price-old">{currency}{props.old_price}</div>
          </div>
        </div>
      </Link>
    </div>
  )
}

export default Item
