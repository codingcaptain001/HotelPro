import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Hotel } from 'lucide-react';

const Navigation = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  return (
    <Navbar bg="light" expand="lg" className="shadow-sm mb-4 py-3">
      <Container>
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center gap-2">
          <Hotel size={28} /> HotelPro
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/rooms">Rooms</Nav.Link>
          </Nav>
          <Nav className="ms-auto align-items-center">
            {user ? (
              <>
                <span className="me-3 text-muted">Welcome, {user.name}</span>
                <Button variant="outline-primary" size="sm" className="me-2" onClick={() => navigate(user.role === 'admin' ? '/admin' : '/dashboard')}>
                  Dashboard
                </Button>
                <Button variant="danger" size="sm" onClick={handleLogout}>Logout</Button>
              </>
            ) : (
              <>
                <Button variant="outline-primary" size="sm" className="me-2" onClick={() => navigate('/login')}>Login</Button>
                <Button variant="primary" size="sm" onClick={() => navigate('/register')}>Register</Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;
