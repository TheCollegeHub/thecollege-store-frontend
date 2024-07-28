import React, { useEffect, useState } from 'react'
import Hero from '../Components/Hero/Hero'
// import Popular from '../Components/Popular/Popular'
// import Offers from '../Components/Offers/Offers'
import NewCollections from '../Components/NewCollections/NewCollections'
// import NewsLetter from '../Components/NewsLetter/NewsLetter'
import ImageCarousel from '../Components/Carousel/ImageCarousel'
import { backend_url } from "../App"
import { backend_url_2 } from "../index"

const Shop = () => {

  console.log(backend_url);
  console.log(backend_url_2);
  const [setPopular] = useState([]);
  const [newcollection, setNewCollection] = useState([]);

  const fetchInfo = () => { 
    fetch(`${backend_url}/popularinwomen`) 
            .then((res) => res.json()) 
            .then((data) => setPopular(data))
    fetch(`${backend_url}/newcollections`) 
            .then((res) => res.json()) 
            .then((data) => setNewCollection(data))
    }

    useEffect(() => {
      fetchInfo();
    })


  return (
    <div>
      <ImageCarousel />
      <Hero/>
      {/* <Popular data={popular}/> */}
      {/* <Offers/> */}
      <NewCollections data={newcollection}/>
    </div>
  )
}

export default Shop
