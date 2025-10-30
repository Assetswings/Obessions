// CartWishlistContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import API from "./api";

const CartWishlistContext = createContext();

export const CartWishlistProvider = ({ children }) => {
  const [countData, setCountData] = useState({ cart_count: 0, wishlist_count: 0 });

  const getCartWishlistCount = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const res = await API.get("/cart-wishlist/count");
        if (res.data.status === 200) {
          setCountData(res.data.data);
          console.log('call',res.data.data);
          
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  useEffect(() => {
    getCartWishlistCount(); // initial load
  }, []);

  return (
    <CartWishlistContext.Provider value={{ countData, getCartWishlistCount }}>
      {children}
    </CartWishlistContext.Provider>
  );
};

export const useCartWishlist = () => useContext(CartWishlistContext);
