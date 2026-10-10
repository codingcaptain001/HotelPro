import React, { useState } from 'react';
import { Form, Button, Container, Card, Alert } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loadingState, setLoadingState] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }
    try {
      setError('');
      setLoadingState(true);
      await register(name, email, password, phone);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register');
    } finally {
      setLoadingState(false);
    }
  };

  return (
    <Container className="d-flex align-items-center justify-content-center py-5">
      <Card style={{ width: '500px' }} className="p-4 shadow-sm mt-4">
        <h3 className="text-center mb-4 text-primary fw-bold">Create an Account</h3>
        {error && <Alert variant="danger">{error}</Alert>}
        
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="name">
            <Form.Label>Full Name</Form.Label>
            <Form.Control type="text" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} required />
          </Form.Group>

          <Form.Group className="mb-3" controlId="email">
            <Form.Label>Email Address</Form.Label>
            <Form.Control type="email" placeholder="john@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </Form.Group>
          
          <Form.Group className="mb-3" controlId="phone">
            <Form.Label>Phone Number (Optional)</Form.Label>
            <Form.Control type="tel" placeholder="+1234567890" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </Form.Group>

          <Form.Group className="mb-3" controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
          </Form.Group>
          
          <Form.Group className="mb-4" controlId="confirmPassword">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
          </Form.Group>

          <Button variant="primary" type="submit" className="w-100 mb-3 fw-bold" disabled={loadingState}>
            {loadingState ? 'Registering...' : 'Sign Up'}
          </Button>
        </Form>
        <div className="text-center text-muted">
          Already have an account? <Link to="/login">Sign in</Link>
        </div>
      </Card>
    </Container>
  );
};

export default Register;
