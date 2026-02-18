import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./router/Routes";
import ScrollRestoration from "./router/ScrollRestoration";
import { CartWishlistProvider, HeaderProvider } from "./app/CartWishlistContext";
import MetaListener from "./app/MetaListener";
import OfflineGuard from "./app/OfflineGuard";

function AppContent() {
  return (
    <OfflineGuard>
      <MetaListener />
      <ScrollRestoration />
      <AppRoutes />
    </OfflineGuard>
  );
}

function App() {
  return (
    <HeaderProvider>
      <CartWishlistProvider>
        <Router>
          <AppContent />
        </Router>
      </CartWishlistProvider>
    </HeaderProvider>
  );
}

export default App;
