import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./router/Routes";
import ScrollRestoration from "./router/ScrollRestoration";
import { CartWishlistProvider, HeaderProvider } from "./app/CartWishlistContext";
import MetaListener from "./app/MetaListener";
import useNetworkStatus from "./app/useNetworkStatus";
import OfflineGuard from "./app/OfflineGuard";

function AppContent() {
  useNetworkStatus();

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
