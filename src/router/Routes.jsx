import React from "react";
import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import HomePage from "../pages/Home/HomePage";
import CollectionPage from "../pages/Collection/CollectionPage";
import ProductsPage from "../pages/Products/ProductsPage";
import ProductDetailPage from "../pages/Productdetails/ProductDetailPage";
import CartPage from "../pages/cart/CartPage";
import CheckoutPage from "../pages/Checkout/CheckoutPage";
import OrderHistoryPage from "../pages/Orderhistory/OrderHistoryPage";
import OrderTrackingPage from "../pages/Ordertracking/OrderTrackingPage";
import LoginPage from "../pages/auth/Loginpage";
import ProfilePage from "../pages/Profile/ProfilePage";
import PaymentPage from "../pages/Payment/PaymetPage";
import CarpetFinder from "../pages/Carpetfinder/CarpetFinder";
import AboutPage from "../pages/Aboutpage/AboutPage";
import ContactUs from "../pages/Contactus/ContactUs";
import Faq from "../pages/Faq/Faq";
import BlogPost from "../components/Blogpage/BlogPost";
import ScrollToTop from "./ScrollToTop";
import ScrollToTopWrapper from "./ScrollToTopWrapper";
import Carpetfinderserch from "../pages/Carpetfinder/Carpetfinderserch";
import Successpage from "../pages/Payment/Successpage";
import Searchlist from "../pages/Searchlist/Searchlist";


  const AppRoutes = () => {
  return (
      <ScrollToTopWrapper>
      <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="collection" element={<CollectionPage />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="productsdetails" element={<ProductDetailPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="checkout" element={<CheckoutPage />} />
        <Route path="orderhistory" element={<OrderHistoryPage />} />
        <Route path="OrderTrackingPage" element={<OrderTrackingPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="OrderTrackingPage" element={<OrderTrackingPage />} />
        <Route path="ProfilePage" element={<ProfilePage />} />
        <Route path="paymentgetway" element={<PaymentPage />} />
        <Route path="ordersuccess" element={<Successpage />} />
        <Route path="carpetfinder" element={<CarpetFinder />} />
        <Route path="searchlist" element={<Searchlist />} />
        <Route path="carpetfinderserch" element={<Carpetfinderserch/>} />
        <Route path="aboutpage" element={<AboutPage />} />
        <Route path="contactus" element={<ContactUs />} />
        <Route path="faq" element={<Faq/>} />
        <Route path="blog" element={<BlogPost/>} />
      </Route>
      </Routes>
      </ScrollToTopWrapper>
  
  );
};

export default AppRoutes;
