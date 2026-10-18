import React, { useState } from 'react';
import { Form, Button, Container, Card, Alert, Spinner, Row, Col } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Hotel, User, Mail, Lock, Phone, ArrowRight, Shield } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return setError('Passwords do not match. Please re-enter.');
    }
    if (password.length < 6) {
      return setError('Password must be at least 6 characters in length.');
    }

    try {
      setError('');
      setLoading(true);
      await register(name, email, password, phone);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create account. Email may already be in use.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="d-flex align-items-center justify-content-center py-5" style={{ minHeight: '80vh' }}>
      <Card style={{ width: '100%', maxWidth: '520px' }} className="p-4 p-md-5 border-0 shadow-sm rounded-4 bg-white">
        <div className="text-center mb-4">
          <div className="bg-primary text-white p-3 rounded-circle d-inline-flex mb-2 shadow-sm">
            <Hotel size={28} />
          </div>
          <h2 className="fw-bold text-primary mb-1">Create an Account</h2>
          <p className="text-muted small">Join HotelPro for exclusive guest rates and instant reservations.</p>
        </div>

        {error && (
          <Alert variant="danger" dismissible onClose={() => setError('')} className="small py-2 mb-3">
            {error}
          </Alert>
        )}
        
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="name">
            <Form.Label className="small fw-bold text-secondary">
              <User size={14} className="me-1" /> Full Name <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control 
              type="text" 
              placeholder="e.g. John Doe" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required 
              className="py-2"
            />
          </Form.Group>

          <Row className="g-3 mb-3">
            <Col sm={6}>
              <Form.Group controlId="email">
                <Form.Label className="small fw-bold text-secondary">
                  <Mail size={14} className="me-1" /> Email Address <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control 
                  type="email" 
                  placeholder="john@example.com" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                  className="py-2"
                />
              </Form.Group>
            </Col>

            <Col sm={6}>
              <Form.Group controlId="phone">
                <Form.Label className="small fw-bold text-secondary">
                  <Phone size={14} className="me-1" /> Phone Number
                </Form.Label>
                <Form.Control 
                  type="tel" 
                  placeholder="+1 (555) 000-0000" 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)} 
                  className="py-2"
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="g-3 mb-4">
            <Col sm={6}>
              <Form.Group controlId="password">
                <Form.Label className="small fw-bold text-secondary">
                  <Lock size={14} className="me-1" /> Password <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control 
                  type="password" 
                  placeholder="Min 6 characters" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                  minLength={6} 
                  className="py-2"
                />
              </Form.Group>
            </Col>

            <Col sm={6}>
              <Form.Group controlId="confirmPassword">
                <Form.Label className="small fw-bold text-secondary">
                  <Lock size={14} className="me-1" /> Confirm Password <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control 
                  type="password" 
                  placeholder="Re-enter password" 
                  value={confirmPassword} 
                  onChange={(e) => setConfirmPassword(e.target.value)} 
                  required 
                  className="py-2"
                />
              </Form.Group>
            </Col>
          </Row>

          <Button 
            variant="primary" 
            type="submit" 
            disabled={loading}
            className="w-100 py-3 mb-3 fw-bold rounded-pill shadow-sm d-flex align-items-center justify-content-center gap-2"
          >
            {loading ? (
              <>
                <Spinner size="sm" animation="border" />
                Creating Your Account...
              </>
            ) : (
              <>
                Complete Registration <ArrowRight size={18} />
              </>
            )}
          </Button>
        </Form>

        <div className="text-center text-muted small mt-2">
          Already have an account? <Link to="/login" className="fw-semibold text-primary text-decoration-none">Sign in</Link>
        </div>

        <div className="mt-4 pt-3 border-top text-center">
          <div className="text-muted small mb-2">Hotel Staff or General Manager?</div>
          <Link 
            to="/admin/register" 
            className="btn btn-outline-secondary btn-sm rounded-pill px-3 py-1.5 small fw-semibold d-inline-flex align-items-center gap-1.5 border-gold text-dark text-decoration-none"
          >
            <Shield size={14} className="text-warning" /> Staff Administrator Registration &rarr;
          </Link>
        </div>
      </Card>
    </Container>
  );
};

export default Register;
