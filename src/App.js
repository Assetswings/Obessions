import React from 'react';
import { HashRouter as Router } from 'react-router-dom';
import AppRoutes from './router/Routes';
import ScrollRestoration from './router/ScrollRestoration';


function App() {
  return (
      <Router>
        <ScrollRestoration />
      <AppRoutes />
      </Router>
  );
}

export default App;
