import React, { useEffect, useState } from "react";
import "./CSS/ShopCategory.css";
import { FaSort } from "react-icons/fa";
import Item from "../Components/Item/Item";
import { Link } from "react-router-dom";
import { backend_url } from "../App"

const ShopCategory = (props) => {
  const [allproducts, setAllProducts] = useState([]);
  const [sortCriteria, setSortCriteria] = useState("default");

  const fetchInfo = () => {
    fetch(`${backend_url}/api/allproducts`)
      .then((res) => res.json())
      .then((data) => setAllProducts(data));
  };

  useEffect(() => {
    fetchInfo();
  }, []);

  const handleSortChange = (event) => {
    setSortCriteria(event.target.value);
  };

  const sortProducts = (products) => {
    switch (sortCriteria) {
      case "priceLowToHigh":
        return products.sort((a, b) => a.new_price - b.new_price);
      case "priceHighToLow":
        return products.sort((a, b) => b.new_price - a.new_price);
      default:
        return products;
    }
  };

  const filteredAndSortedProducts = sortProducts(
    allproducts.filter(item => item.category === props.category)
  );

  return (
    <div className="shopcategory">
      <img src={props.banner} className="shopcategory-banner" alt="" />
      <div className="shopcategory-indexSort">
        <p><span>Showing 1 - 12</span> out of {filteredAndSortedProducts.length} Products</p>
        <div className="shopcategory-sort-container">
          <FaSort className="shopcategory-sort-icon" />
          <label htmlFor="sort" className="shopcategory-sort-label">Sort by</label>
          <select
            id="sort"
            onChange={handleSortChange}
            value={sortCriteria}
            className="shopcategory-sort-select"
          >
            <option value="default">Default</option>
            <option value="priceLowToHigh">Price: Low to High</option>
            <option value="priceHighToLow">Price: High to Low</option>
          </select>
        </div>
      </div>
      <div className="shopcategory-products">
        {filteredAndSortedProducts.slice(0, 12).map((item, i) => (
          <Item
            id={item.id}
            key={i}
            name={item.name}
            image={item.image}
            new_price={item.new_price}
            old_price={item.old_price}
          />
        ))}
      </div>
      <div className="shopcategory-loadmore">
        <Link to='/' style={{ textDecoration: 'none' }}>Explore More</Link>
      </div>
    </div>
  );
};

export default ShopCategory;
