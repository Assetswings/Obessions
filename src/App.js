import React from 'react';
import { HashRouter as Router } from 'react-router-dom';
import AppRoutes from './router/Routes';
import ScrollRestoration from './router/ScrollRestoration';
import { CartWishlistProvider } from './app/CartWishlistContext';
import MetaListener from './app/MetaListener';


function App() {
  return (
    <CartWishlistProvider>
      <Router>
        <MetaListener />
        <ScrollRestoration />
        <AppRoutes />
      </Router>

    </CartWishlistProvider>
  );
}

export default App;
