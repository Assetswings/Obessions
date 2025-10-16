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
import PaymentCheck from "../pages/Payment/paymentcheck";
import Searchlist from "../pages/Searchlist/Searchlist";
import Blog from "../pages/blogpage/Blog";
import TermsAndConditions from "../pages/Terms&Condition/TermsConditionPage";
import Cancellation from "../pages/CancellationPolicy/Cancellation";
import Returnrefund from "../pages/ReturnRefundPolicy/Returnrefund";
import FeesPaymentsPolicy from "../pages/FeesPaymentsPolicy/FeesPaymentsPolicy";
import Privacypolicy from "../pages/PrivacyPolicy/Privacypolicy";
import CancelOrder from "../pages/CancelOrder/Cancelorder";
import ReturnExchange from "../pages/ReturnExchange/Returnexchange";
import Otherpage from "../pages/Otherproductlist/Otherpage";
import VideoGallery from "../pages/VideoGallery/VideoGallery";
import Failedpage from "../pages/Payment/Failedpage";
import SizeGuide from "../pages/Sizeguid/SizeGuide";
import StyleGuide from "../pages/Styleguid/StyleGuide";
const AppRoutes = () => {
  return (
    // <ScrollToTopWrapper>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="collections" element={<CollectionPage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="/products/:categorySlug" element={<ProductsPage />} />
          <Route path="/products/:categorySlug/:subcategorySlug" element={<ProductsPage />} />
          <Route path="productsdetails" element={<ProductDetailPage />} />
          <Route path="/productsdetails/:itemSlug" element={<ProductDetailPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="orderhistory" element={<OrderHistoryPage />} />
          <Route path="OrderTrackingPage" element={<OrderTrackingPage />} />
          <Route path="OrderTrackingPage/:orderNo" element={<OrderTrackingPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="ProfilePage" element={<ProfilePage />} />
          <Route path="paymentgetway" element={<PaymentPage />} />
          <Route path="ordersuccess" element={<Successpage />} />
          <Route path="orderfailed" element={<Failedpage />} />
          <Route path="paymentcheck" element={<PaymentCheck />} />
          <Route path="cancelorder" element={<CancelOrder />} />
          <Route path="returnexchange" element={<ReturnExchange />} />
          <Route path="carpet-finder" element={<CarpetFinder />} />
          <Route path="searchlist" element={<Searchlist />} />
          <Route path="carpetfinderserch" element={<Carpetfinderserch />} />
          <Route path="about-us" element={<AboutPage />} />
          <Route path="contactus" element={<ContactUs />} />
          <Route path="faq" element={<Faq />} />
          <Route path="blog" element={<Blog />} />
          <Route path="blog-details" element={<BlogPost />} />
          <Route path="tc-of-sale" element={<TermsAndConditions />} />
          <Route path="cancellation-return-refund-policy" element={<Cancellation />} />
          <Route path="terms-of-use" element={<Returnrefund />} />
          <Route path="fees-payments-policy" element={<FeesPaymentsPolicy />} />
          <Route path="privacy-policy" element={<Privacypolicy />} />
          <Route path="new-arrivals" element={<Otherpage />} />
          <Route path="bestseller" element={<Otherpage />} />
          <Route path="offer-spot" element={<Otherpage />} />
          <Route path="videogallery" element={<VideoGallery />} />
          <Route path="style-guide" element={<SizeGuide/>} />
          <Route path="size-guide" element={<StyleGuide/>} />
        </Route>
      </Routes>
    // </ScrollToTopWrapper>
  );
};

export default AppRoutes;
