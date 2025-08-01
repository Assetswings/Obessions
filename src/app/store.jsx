import { configureStore } from '@reduxjs/toolkit';
import homeReducer from '../pages/Home/homeSlice';
import megamenuReducer from '../components/Navbars/megamenuSlice';
import productReducer from '../pages/Products/productsSlice';
import productDetailReducer from '../pages/Productdetails/productDetailSlice';
import authReducer from "../pages/auth/authSlice"; 
import  cartReducer from '../pages/cart/cartSlice'; 
import wishlistReducer from "../components/Wishtlist/WishlistSlice"; 

export const store = configureStore({
    reducer: {
    home: homeReducer,
    megamenu: megamenuReducer,
    products: productReducer,
    productDetail: productDetailReducer,
    auth:authReducer,
    cart: cartReducer, 
    wishlist: wishlistReducer, 
  },
  });