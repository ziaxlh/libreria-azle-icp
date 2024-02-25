import React from 'react';
import { BrowserRouter as Router, Route, Routes as ReactRoutes } from 'react-router-dom';
import App from './awa';
import BorrowForm from './borrow/formulario';

const Routes = () => {
  return (
    <Router>
      <ReactRoutes>
        <Route path="/" element={<App />} />
        <Route path="/borrow/:id" element={<BorrowForm />} />
      </ReactRoutes>
    </Router>
  );
};

export default Routes;