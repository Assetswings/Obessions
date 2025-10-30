import React from 'react';
import { HashRouter as Router } from 'react-router-dom';
import AppRoutes from './router/Routes';
import ScrollRestoration from './router/ScrollRestoration';
import { CartWishlistProvider } from './app/CartWishlistContext';


function App() {
  return (
    <CartWishlistProvider>
      <Router>
        <ScrollRestoration />
        <AppRoutes />
      </Router>

    </CartWishlistProvider>
  );
}

export default App;
