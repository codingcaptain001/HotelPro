import React, { useState } from 'react';
import { Form, Button, Container, Card, Alert, Spinner, Row, Col } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Shield, User, Mail, Lock, Phone, ArrowRight, KeyRound, CheckCircle } from 'lucide-react';

const AdminRegister = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [secretKey, setSecretKey] = useState('HOTELPRO_ADMIN');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { updateUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return setError('Passwords do not match.');
    }
    if (password.length < 6) {
      return setError('Password must be at least 6 characters in length.');
    }
    if (!secretKey) {
      return setError('Management Passcode is required to register an administrator.');
    }

    try {
      setError('');
      setLoading(true);
      const { data } = await api.post('/auth/admin/register', {
        name,
        email,
        password,
        phone,
        secretKey
      });

      if (updateUser) {
        updateUser(data);
      } else {
        localStorage.setItem('userInfo', JSON.stringify(data));
      }

      // Navigate straight to admin portal
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register administrator account. Verify your security passcode.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-5 d-flex align-items-center justify-content-center" style={{ minHeight: '85vh', background: 'radial-gradient(circle at 50% 20%, rgba(212, 175, 55, 0.08) 0%, rgba(10, 20, 36, 0.02) 70%)' }}>
      <Container className="d-flex align-items-center justify-content-center">
        <Card style={{ width: '100%', maxWidth: '540px' }} className="card-luxury p-4 p-md-5 border-0 shadow-lg bg-white">
          <div className="text-center mb-4">
            <div className="p-3 rounded-circle d-inline-flex mb-3 shadow-sm border border-gold" style={{ background: 'linear-gradient(135deg, #12233D 0%, #0A1424 100%)' }}>
              <Shield size={32} className="text-warning" />
            </div>
            <span className="badge badge-gold px-3 py-1 mb-2 text-uppercase tracking-wider font-display">Staff Provisioning</span>
            <h2 className="fw-bold text-primary mb-1 font-serif">Register Administrator</h2>
            <p className="text-muted small">Create an elevated management account with full portal access.</p>
          </div>

          {error && (
            <Alert variant="danger" dismissible onClose={() => setError('')} className="small py-2 mb-3">
              {error}
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="adminName">
              <Form.Label className="small fw-bold text-secondary">
                <User size={14} className="me-1" /> Full Staff Name <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control 
                type="text" 
                placeholder="e.g. Director Alexander Wright" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                required 
                className="py-2"
              />
            </Form.Group>

            <Row className="g-3 mb-3">
              <Col sm={6}>
                <Form.Group controlId="adminEmail">
                  <Form.Label className="small fw-bold text-secondary">
                    <Mail size={14} className="me-1" /> Staff Email <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control 
                    type="email" 
                    placeholder="alex@hotelpro.com" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                    className="py-2"
                  />
                </Form.Group>
              </Col>

              <Col sm={6}>
                <Form.Group controlId="adminPhone">
                  <Form.Label className="small fw-bold text-secondary">
                    <Phone size={14} className="me-1" /> Contact Phone
                  </Form.Label>
                  <Form.Control 
                    type="tel" 
                    placeholder="+1 (800) 555-0199" 
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value)} 
                    className="py-2"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="g-3 mb-3">
              <Col sm={6}>
                <Form.Group controlId="adminPassword">
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
                <Form.Group controlId="adminConfirmPassword">
                  <Form.Label className="small fw-bold text-secondary">
                    <Lock size={14} className="me-1" /> Confirm Password <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control 
                    type="password" 
                    placeholder="Repeat password" 
                    value={confirmPassword} 
                    onChange={(e) => setConfirmPassword(e.target.value)} 
                    required 
                    className="py-2"
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* Management Security Passcode */}
            <Form.Group className="mb-4" controlId="secretKey">
              <Form.Label className="small fw-bold text-primary d-flex align-items-center justify-content-between">
                <span><KeyRound size={14} className="me-1 text-warning" /> Management Security Passcode <span className="text-danger">*</span></span>
                <span className="badge bg-light text-muted border font-monospace" style={{ fontSize: '0.7rem' }}>Default: HOTELPRO_ADMIN</span>
              </Form.Label>
              <Form.Control 
                type="text" 
                value={secretKey} 
                onChange={(e) => setSecretKey(e.target.value)} 
                required 
                className="py-2 font-monospace"
              />
              <Form.Text className="text-muted" style={{ fontSize: '0.75rem' }}>
                Required authorization token to provision administrative permissions.
              </Form.Text>
            </Form.Group>

            <Button 
              type="submit" 
              disabled={loading}
              className="btn-gold w-100 py-3 mb-3 fw-bold rounded-pill shadow-sm d-flex align-items-center justify-content-center gap-2"
            >
              {loading ? (
                <>
                  <Spinner size="sm" animation="border" />
                  Registering Staff Account...
                </>
              ) : (
                <>
                  Provision Administrator Account <ArrowRight size={18} />
                </>
              )}
            </Button>
          </Form>

          <div className="text-center text-muted small mt-2">
            Already have an administrator account?{' '}
            <Link to="/admin/login" className="fw-semibold text-primary text-decoration-none">
              Sign In to Admin Portal
            </Link>
          </div>

          <div className="text-center text-muted small mt-2 pt-2 border-top">
            Looking for guest registration?{' '}
            <Link to="/register" className="text-secondary fw-medium">
              Guest Registration
            </Link>
          </div>
        </Card>
      </Container>
    </div>
  );
};

export default AdminRegister;
