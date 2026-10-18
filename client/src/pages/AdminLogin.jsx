import React, { useState } from 'react';
import { Form, Button, Container, Card, Alert, Spinner } from 'react-bootstrap';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, Lock, Mail, ArrowRight, KeyRound, Hotel, CheckCircle } from 'lucide-react';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/admin';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide both administrative email and password.');
      return;
    }

    try {
      setError('');
      setLoading(true);
      await login(email, password);
      // Navigate straight to admin portal
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid administrator credentials. Access denied.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoFill = () => {
    setEmail('admin@hotelpro.com');
    setPassword('admin123');
  };

  return (
    <div className="py-5 d-flex align-items-center justify-content-center" style={{ minHeight: '85vh', background: 'radial-gradient(circle at 50% 20%, rgba(212, 175, 55, 0.08) 0%, rgba(10, 20, 36, 0.02) 70%)' }}>
      <Container className="d-flex align-items-center justify-content-center">
        <Card style={{ width: '100%', maxWidth: '480px' }} className="card-luxury p-4 p-md-5 border-0 shadow-lg bg-white">
          <div className="text-center mb-4">
            <div className="p-3 rounded-circle d-inline-flex mb-3 shadow-sm border border-gold" style={{ background: 'linear-gradient(135deg, #12233D 0%, #0A1424 100%)' }}>
              <Shield size={32} className="text-warning" />
            </div>
            <span className="badge badge-gold px-3 py-1 mb-2 text-uppercase tracking-wider font-display">Staff & Management Access</span>
            <h2 className="fw-bold text-primary mb-1 font-serif">Admin Portal Login</h2>
            <p className="text-muted small">Enter your verified HotelPro administrator credentials.</p>
          </div>

          {error && (
            <Alert variant="danger" dismissible onClose={() => setError('')} className="small py-2 mb-3">
              {error}
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="email">
              <Form.Label className="small fw-bold text-secondary">
                <Mail size={14} className="me-1" /> Staff Email Address
              </Form.Label>
              <Form.Control 
                type="email" 
                placeholder="admin@hotelpro.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
                className="py-2.5"
              />
            </Form.Group>

            <Form.Group className="mb-4" controlId="password">
              <Form.Label className="small fw-bold text-secondary">
                <Lock size={14} className="me-1" /> Master Password
              </Form.Label>
              <Form.Control 
                type="password" 
                placeholder="Enter administrator password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
                className="py-2.5"
              />
            </Form.Group>

            <Button 
              type="submit" 
              disabled={loading}
              className="btn-gold w-100 py-3 mb-3 fw-bold rounded-pill shadow-sm d-flex align-items-center justify-content-center gap-2"
            >
              {loading ? (
                <>
                  <Spinner size="sm" animation="border" />
                  Verifying Security Clearance...
                </>
              ) : (
                <>
                  <KeyRound size={18} /> Authenticate Administrator
                </>
              )}
            </Button>
          </Form>

          {/* Quick Demo Credentials Assistant */}
          <div className="p-3 bg-light rounded-4 border text-center mb-3">
            <div className="small fw-bold text-primary mb-1 d-flex align-items-center justify-content-center gap-1">
              <KeyRound size={14} className="text-warning" /> Evaluator / Demo Admin Credentials
            </div>
            <div className="text-muted small mb-2 font-monospace" style={{ fontSize: '0.8rem' }}>
              admin@hotelpro.com • admin123
            </div>
            <Button 
              variant="outline-secondary" 
              size="sm"
              onClick={handleQuickDemoFill}
              className="rounded-pill px-3 py-1 small fw-semibold bg-white border"
            >
              Auto-Fill Credentials
            </Button>
          </div>

          <div className="text-center text-muted small mt-2">
            Need a new management account?{' '}
            <Link to="/admin/register" className="fw-semibold text-primary text-decoration-none">
              Register Administrator
            </Link>
          </div>

          <div className="text-center text-muted small mt-2 pt-2 border-top">
            Are you a hotel guest?{' '}
            <Link to="/login" className="text-secondary fw-medium">
              Guest Sign-In
            </Link>
          </div>
        </Card>
      </Container>
    </div>
  );
};

export default AdminLogin;
