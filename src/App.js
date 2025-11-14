import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './router/Routes';
import ScrollRestoration from './router/ScrollRestoration';
import { CartWishlistProvider, HeaderProvider } from './app/CartWishlistContext';
import MetaListener from './app/MetaListener';


function App() {
  return (
    <HeaderProvider>
      <CartWishlistProvider>
        <Router>
          <MetaListener />
          <ScrollRestoration />
          <AppRoutes />
        </Router>

      </CartWishlistProvider>
    </HeaderProvider>
  );
}

export default App;
