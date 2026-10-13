import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Spinner, Container, Alert, Button } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert } from 'lucide-react';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (!user) {
    // Redirect to login page and preserve attempted path
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (adminOnly && user.role !== 'admin') {
    return (
      <Container className="py-5 text-center" style={{ maxWidth: '600px' }}>
        <Alert variant="danger" className="p-4 shadow-sm">
          <ShieldAlert size={48} className="text-danger mb-3" />
          <Alert.Heading className="fw-bold">Access Denied</Alert.Heading>
          <p className="mb-4">
            You do not have administrator permissions to view this page. This area is restricted to HotelPro staff.
          </p>
          <Button variant="primary" href="/dashboard">
            Return to Guest Dashboard
          </Button>
        </Alert>
      </Container>
    );
  }

  return children;
};

export default ProtectedRoute;
