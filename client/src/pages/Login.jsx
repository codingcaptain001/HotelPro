import React, { useState } from 'react';
import { Form, Button, Container, Card, Alert, Spinner } from 'react-bootstrap';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Hotel, Lock, Mail, ArrowRight, Shield } from 'lucide-react';

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

        {/* 1-Click Demo Guest Account Card */}
        <div className="mb-4 p-3 rounded-3 border bg-light d-flex align-items-center justify-content-between">
          <div>
            <div className="fw-bold text-dark small" style={{ fontSize: '0.78rem' }}>Demo Guest Account</div>
            <div className="text-muted font-monospace" style={{ fontSize: '0.73rem' }}>guest@hotelpro.com • guest123</div>
          </div>
          <Button 
            variant="outline-primary" 
            size="sm"
            type="button"
            onClick={() => {
              setEmail('guest@hotelpro.com');
              setPassword('guest123');
            }}
            className="rounded-pill px-3 py-1 small fw-semibold"
            style={{ fontSize: '0.74rem' }}
          >
            Auto-fill
          </Button>
        </div>

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

        <div className="mt-4 pt-3 border-top text-center">
          <div className="text-muted small mb-2">HotelPro Staff or Administrator?</div>
          <Link 
            to="/admin/login" 
            className="btn btn-outline-secondary btn-sm rounded-pill px-3 py-1.5 small fw-semibold d-inline-flex align-items-center gap-1.5 border-gold text-dark text-decoration-none"
          >
            <Shield size={14} className="text-warning" /> Staff & Management Portal Login &rarr;
          </Link>
        </div>
      </Card>
    </Container>
  );
};

export default Login;
