import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import CreateUser from './pages/CreateUser';
import HelpRequest from './pages/HelpRequest';
import HelperDashboard from './pages/HelperDashboard';
import Header from './components/Header';

const App = () => (
  <Router>
    <Header />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/create-user" element={<CreateUser />} />
      <Route path="/help-request" element={<HelpRequest />} />
      <Route path="/helper-dashboard" element={<HelperDashboard />} />
    </Routes>
  </Router>
);

export default App;
