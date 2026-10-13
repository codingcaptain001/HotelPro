import React, { useState } from 'react';
import { Form, Button, Container, Card, Alert, Spinner } from 'react-bootstrap';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Hotel, Lock, Mail, ArrowRight } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get return path if user was redirected from protected action
  const from = location.state?.from?.pathname || location.state?.from || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }

    try {
      setError('');
      setLoading(true);
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="d-flex align-items-center justify-content-center py-5" style={{ minHeight: '75vh' }}>
      <Card style={{ width: '100%', maxWidth: '440px' }} className="p-4 p-md-5 border-0 shadow-sm rounded-4 bg-white">
        <div className="text-center mb-4">
          <div className="bg-primary text-white p-3 rounded-circle d-inline-flex mb-2 shadow-sm">
            <Hotel size={28} />
          </div>
          <h2 className="fw-bold text-primary mb-1">Welcome Back</h2>
          <p className="text-muted small">Sign in to manage your reservations and profile.</p>
        </div>

        {error && (
          <Alert variant="danger" dismissible onClose={() => setError('')} className="small py-2 mb-3">
            {error}
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="email">
            <Form.Label className="small fw-bold text-secondary">
              <Mail size={14} className="me-1" /> Email Address
            </Form.Label>
            <Form.Control 
              type="email" 
              placeholder="name@example.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
              className="py-2"
            />
          </Form.Group>

          <Form.Group className="mb-4" controlId="password">
            <Form.Label className="small fw-bold text-secondary">
              <Lock size={14} className="me-1" /> Password
            </Form.Label>
            <Form.Control 
              type="password" 
              placeholder="Enter your password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
              className="py-2"
            />
          </Form.Group>

          <Button 
            variant="primary" 
            type="submit" 
            disabled={loading}
            className="w-100 py-3 mb-3 fw-bold rounded-pill shadow-sm d-flex align-items-center justify-content-center gap-2"
          >
            {loading ? (
              <>
                <Spinner size="sm" animation="border" />
                Signing In...
              </>
            ) : (
              <>
                Sign In to HotelPro <ArrowRight size={18} />
              </>
            )}
          </Button>
        </Form>

        <div className="text-center text-muted small mt-2">
          New to HotelPro? <Link to="/register" className="fw-semibold text-primary text-decoration-none">Create an account</Link>
        </div>
      </Card>
    </Container>
  );
};

export default Login;
