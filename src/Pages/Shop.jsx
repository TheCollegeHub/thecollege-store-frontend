import React, { useEffect, useState } from 'react'
// import Popular from '../Components/Popular/Popular'
// import Offers from '../Components/Offers/Offers'
import NewCollections from '../Components/NewCollections/NewCollections'
// import NewsLetter from '../Components/NewsLetter/NewsLetter'
import ImageCarousel from '../Components/Carousel/ImageCarousel'
import './CSS/Shop.css'
import { backend_url } from "../App"

const Shop = () => {

  const [newcollection, setNewCollection] = useState([]);

  const fetchInfo = () => { 
    fetch(`${backend_url}/api/newcollections`) 
            .then((res) => res.json()) 
            .then((data) => setNewCollection(data))
    }

    useEffect(() => {
      fetchInfo();
    }, [])


  return (
    <div className="shop-page">
      <ImageCarousel />
      <div className="shop-content">
        <NewCollections data={newcollection}/>
      </div>
    </div>
  )
}

export default Shop
