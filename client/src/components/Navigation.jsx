import React from 'react';
import { Navbar, Nav, Container, Button, Dropdown } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Hotel, User, LogOut, LayoutDashboard, Shield, CalendarDays } from 'lucide-react';

const Navigation = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <Navbar bg="white" expand="lg" className="shadow-sm sticky-top py-3 border-bottom" style={{ zIndex: 1040 }}>
      <Container>
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center gap-2 fw-bold text-primary">
          <div className="bg-primary text-white p-2 rounded-3 d-flex align-items-center justify-content-center shadow-sm">
            <Hotel size={22} />
          </div>
          <span className="fs-4 tracking-wide">HotelPro</span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="navbar-nav" className="border-0 shadow-none" />

        <Navbar.Collapse id="navbar-nav">
          <Nav className="me-auto ms-lg-4 gap-lg-3">
            <Nav.Link 
              as={Link} 
              to="/" 
              className={`fw-medium px-2 ${isActive('/') ? 'text-primary fw-bold active' : 'text-secondary'}`}
            >
              Home
            </Nav.Link>
            <Nav.Link 
              as={Link} 
              to="/rooms" 
              className={`fw-medium px-2 ${isActive('/rooms') ? 'text-primary fw-bold active' : 'text-secondary'}`}
            >
              Rooms & Suites
            </Nav.Link>
            <Nav.Link 
              as={Link} 
              to="/about" 
              className={`fw-medium px-2 ${isActive('/about') ? 'text-primary fw-bold active' : 'text-secondary'}`}
            >
              About
            </Nav.Link>
            <Nav.Link 
              as={Link} 
              to="/admin" 
              className={`fw-medium px-2 d-flex align-items-center gap-1 ${isActive('/admin') ? 'text-primary fw-bold active' : 'text-secondary'}`}
            >
              <Shield size={16} className="text-warning" />
              <span>Admin Portal</span>
              <span className="badge badge-gold px-1.5 py-0.5 ms-1" style={{ fontSize: '0.62rem' }}>VIP</span>
            </Nav.Link>
          </Nav>

          <Nav className="ms-auto align-items-lg-center gap-2 mt-3 mt-lg-0">
            {user ? (
              <Dropdown align="end">
                <Dropdown.Toggle 
                  variant="outline-primary" 
                  id="user-dropdown" 
                  className="d-flex align-items-center gap-2 px-3 py-2 rounded-pill shadow-sm"
                >
                  <User size={18} />
                  <span className="fw-semibold">{user.name}</span>
                  {(user.role === 'admin' || user.isAdmin === true) && (
                    <span className="badge badge-gold text-uppercase ms-1 px-2 py-0.5" style={{ fontSize: '0.65rem' }}>
                      Admin
                    </span>
                  )}
                </Dropdown.Toggle>

                <Dropdown.Menu className="shadow border-0 rounded-3 mt-2 p-2">
                  <div className="px-3 py-2 border-bottom mb-1">
                    <div className="fw-bold text-dark small">{user.name}</div>
                    <div className="text-muted small text-truncate" style={{ maxWidth: '200px' }}>{user.email}</div>
                  </div>

                  <Dropdown.Item 
                    as={Link} 
                    to="/dashboard" 
                    className="d-flex align-items-center gap-2 py-2 rounded-2"
                  >
                    <CalendarDays size={16} className="text-primary" />
                    <span>My Bookings</span>
                  </Dropdown.Item>

                  <Dropdown.Item 
                    as={Link} 
                    to="/admin" 
                    className="d-flex align-items-center gap-2 py-2 rounded-2 text-primary fw-medium"
                  >
                    <Shield size={16} className="text-warning" />
                    <span>Admin Portal</span>
                  </Dropdown.Item>

                  <Dropdown.Divider />

                  <Dropdown.Item 
                    onClick={handleLogout} 
                    className="d-flex align-items-center gap-2 py-2 text-danger rounded-2"
                  >
                    <LogOut size={16} />
                    <span>Sign Out</span>
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              <div className="d-flex align-items-center gap-2">
                <Button 
                  as={Link} 
                  to="/login" 
                  variant="outline-primary" 
                  className="px-4 py-2 rounded-pill fw-medium"
                >
                  Sign In
                </Button>
                <Button 
                  as={Link} 
                  to="/register" 
                  variant="primary" 
                  className="px-4 py-2 rounded-pill fw-medium shadow-sm"
                >
                  Register
                </Button>
              </div>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;
