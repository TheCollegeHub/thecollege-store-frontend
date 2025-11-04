import React from 'react'
import './Item.css'
import { Link } from 'react-router-dom'
import { backend_url, currency } from '../../App'

const Item = (props) => {
  return (
    <div data-qa-locator={"product-item"} className='item'>
      <Link to={`/product/${props.id}`}>
        <img onClick={window.scrollTo(0, 0)} src={backend_url+props.image} alt="products" />
      </Link>
      <div className="item-content">
        <p>{props.name}</p>
        <div className="item-prices">
          <div className="item-price-new">{currency}{props.new_price}</div>
          {props.old_price && props.old_price !== props.new_price && (
            <div className="item-price-old">{currency}{props.old_price}</div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Item
