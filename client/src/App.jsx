import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { AuthProvider } from './context/AuthContext';
import Navigation from './components/Navigation';
import Home from './pages/Home';

import Login from './pages/Login';
const Register = () => <div className="container mt-5"><h2>Register (To be implemented)</h2></div>;
const Rooms = () => <div className="container mt-5"><h2>Rooms Listing (To be implemented)</h2></div>;
const Dashboard = () => <div className="container mt-5"><h2>Guest Dashboard (To be implemented)</h2></div>;
const Admin = () => <div className="container mt-5"><h2>Admin Dashboard (To be implemented)</h2></div>;

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navigation />
        <main style={{ minHeight: '80vh' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/rooms" element={<Rooms />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </main>
        <footer className="text-center py-4 bg-white mt-auto border-top">
          <p className="mb-0 text-muted">© 2026 HotelPro. All rights reserved.</p>
        </footer>
      </Router>
    </AuthProvider>
  );
}

export default App;
