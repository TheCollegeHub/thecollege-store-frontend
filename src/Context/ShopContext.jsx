import React, { createContext, useEffect, useState } from "react";
import { backend_url } from "../App";
import LoginDialog from "../Components/LoginDialog/LoginDialog";

export const ShopContext = createContext(null);

const ShopContextProvider = (props) => {
  const [products, setProducts] = useState([]);
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [appliedCouponCode, setAppliedCouponCode] = useState('');
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);

  const getDefaultCart = () => {
    let cart = {};
    for (let i = 0; i < 300; i++) {
      cart[i] = 0;
    }
    return cart;
  };

  const [cartItems, setCartItems] = useState(getDefaultCart());

  useEffect(() => {
    fetch(`${backend_url}/api/allproducts`)
      .then((res) => res.json())
      .then((data) => setProducts(data));

    if (localStorage.getItem("auth-token")) {
      fetch(`${backend_url}/api/getcart`, {
        method: 'POST',
        headers: {
          Accept: 'application/form-data',
          'auth-token': `${localStorage.getItem("auth-token")}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(),
      })
      .then((resp) => resp.json())
      .then((data) => { setCartItems(data) });
    }
  }, []);

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        try {
          let itemInfo = products.find((product) => product.id === Number(item));
          totalAmount += cartItems[item] * itemInfo.new_price;
        } catch (error) {}
      }
    }
    return totalAmount;
  };

  const getTotalCartItems = () => {
    let totalItem = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        try {
          let itemInfo = products.find((product) => product.id === Number(item));
          totalItem += itemInfo ? cartItems[item] : 0 ;
        } catch (error) {}
      }
    }
    return totalItem;
  };

  const clearCart = async () => {
    try {
      const userId = localStorage.getItem('user-id');
      const response = await fetch(`${backend_url}/api/${userId}/cart`, {
        method: "DELETE",
      });
      
      if (response.status === 204) {
        console.log("User cart was cleared successfully");
        setCartItems(getDefaultCart());
      } else {
        console.error("Error clearing user cart:", response.statusText);
      }
    } catch (error) {
      console.error("Error clearing user cart:", error);
    }

    
  };

  const addToCart = async (itemId) => {
    
    try {
      if (!localStorage.getItem("auth-token")) {
        setLoginDialogOpen(true);
        return;
      }
      
      const response = await fetch(`${backend_url}/api/addtocart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': `${localStorage.getItem("auth-token")}`,
        },
        body: JSON.stringify({ itemId }),
      });
  
      if (response.ok) {
        setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
        return { status: 200 };
      } else {
        return { status: response.status };
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      return { status: 500 };
    }
  };
  
  const handleCloseLoginDialog = () => {
    setLoginDialogOpen(false);
  };

  const removeFromCart = (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
    if (localStorage.getItem("auth-token")) {
      fetch(`${backend_url}/api/removefromcart`, {
        method: 'POST',
        headers: {
          Accept: 'application/form-data',
          'auth-token': `${localStorage.getItem("auth-token")}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ "itemId": itemId }),
      });
    }
  };

  const applyDiscount = async (code) => {
    try {
      const response = await fetch(`${backend_url}/api/applydiscount`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });

      if (response.ok) {
        const data = await response.json();
        setDiscountPercentage(data.discountPercentage);
        setAppliedCouponCode(code.toUpperCase());
        return { status: 200, discountPercentage: data.discountPercentage };
      } else {
        return { status: response.status };
      }
    } catch (error) {
      console.error('Error applying discount:', error);
      return { status: 500 };
    }
  };

  const contextValue = {
    products,
    getTotalCartItems,
    cartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    applyDiscount,
    discountPercentage,
    appliedCouponCode,
    clearCart
  };

  return (
    <ShopContext.Provider value={contextValue}>
      {props.children}
      <LoginDialog open={loginDialogOpen} onClose={handleCloseLoginDialog} />
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;
