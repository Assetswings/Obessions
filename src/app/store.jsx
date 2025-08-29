import { configureStore } from "@reduxjs/toolkit";
import homeReducer from "../pages/Home/homeSlice";
import megamenuReducer from "../components/Navbars/megamenuSlice";
import productReducer from "../pages/Products/productsSlice";
import productDetailReducer from "../pages/Productdetails/productDetailSlice";
import authReducer from "../pages/auth/authSlice";
import cartReducer from "../pages/cart/cartSlice";
import wishlistReducer from "../components/Wishtlist/WishlistSlice";
import profileReducer from "../pages/Profile/profileSlice";
import addressReducer from "../pages/Profile/addressSlice";
import carpetFinderReducer from "../pages/Carpetfinder/carpetFinderSlice";
import pincodeReducer from "../pages/Productdetails/pincodeSlice";
import checkoutReducer from "../pages/Checkout/checkoutSlice";
import searchReducer from "../pages/Home/searchSlice";
import orderHistoryReducer from "../pages/Orderhistory/orderhistorySlice";
import topPicksReducer from "../pages/Products/otherproductSlice"; 
import collectionsReducer from "../pages/Collection/collectionsSlice";
import contactReducer from "../pages/Contactus/contactUsSlice";
import aboutReducer from "../pages/Aboutpage/aboutSlice";
import faqReducer from "../pages/Faq/faqSlice"; 

export const store = configureStore({
  reducer: {
    home: homeReducer,
    megamenu: megamenuReducer,
    products: productReducer,
    productDetail: productDetailReducer,
    auth: authReducer,
    cart: cartReducer,
    wishlist: wishlistReducer,
    profile: profileReducer,
    address: addressReducer,
    carpetFinder: carpetFinderReducer,
    pincode: pincodeReducer,
    checkout: checkoutReducer,
    search: searchReducer,
    orders: orderHistoryReducer,
    toppick: topPicksReducer,
    collections: collectionsReducer, 
    contact: contactReducer,
    about: aboutReducer,
    faq : faqReducer,
  },
  });



