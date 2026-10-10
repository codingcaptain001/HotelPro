import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Spinner, Alert, Button, Form } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { Users, DollarSign, Calendar, CheckCircle } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const RoomDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const { data } = await api.get(`/rooms/${id}`);
        setRoom(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch room details');
      } finally {
        setLoading(false);
      }
    };
    fetchRoom();
  }, [id]);

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    
    setBookingError('');
    setBookingLoading(true);
    
    try {
      await api.post('/bookings', {
        room: id,
        checkInDate: checkIn,
        checkOutDate: checkOut,
        guestCount: Number(guests)
      });
      setBookingSuccess(true);
      setCheckIn('');
      setCheckOut('');
    } catch (err) {
      setBookingError(err.response?.data?.message || 'Booking failed');
    } finally {
      setBookingLoading(false);
    }
  };

  // Calculate estimated price
  let estimatedPrice = 0;
  if (checkIn && checkOut && room) {
    const inDate = new Date(checkIn);
    const outDate = new Date(checkOut);
    if (inDate < outDate) {
      const nights = Math.ceil((outDate - inDate) / (1000 * 60 * 60 * 24));
      estimatedPrice = nights * room.pricePerNight;
    }
  }

  if (loading) return <div className="text-center py-5"><Spinner animation="border" variant="primary" /></div>;
  if (error) return <Container className="py-5"><Alert variant="danger">{error}</Alert></Container>;
  if (!room) return <Container className="py-5"><Alert variant="info">Room not found</Alert></Container>;

  return (
    <Container className="py-5">
      <Button variant="link" onClick={() => navigate('/rooms')} className="mb-4 ps-0 text-decoration-none">
        &larr; Back to Rooms
      </Button>
      
      <Row>
        <Col md={8}>
          <div style={{ height: '400px', backgroundColor: '#e2e8f0', borderRadius: '12px', overflow: 'hidden' }} className="mb-4">
             {room.images && room.images.length > 0 ? (
                <img src={room.images[0]} alt={room.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
             ) : (
                <div className="d-flex h-100 align-items-center justify-content-center text-muted">No Image Available</div>
             )}
          </div>
          
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h1 className="fw-bold mb-0 text-primary">{room.name}</h1>
            <Badge bg={room.status === 'available' ? 'success' : 'secondary'} className="fs-6 px-3 py-2">
              {room.status.toUpperCase()}
            </Badge>
          </div>
          
          <Badge bg="info" className="mb-4">{room.roomType}</Badge>
          
          <h4 className="fw-bold mb-3">Description</h4>
          <p className="text-muted fs-5 mb-5">{room.description}</p>
          
          <h4 className="fw-bold mb-3">Amenities</h4>
          <Row className="mb-5">
            {room.amenities && room.amenities.length > 0 ? room.amenities.map((item, idx) => (
              <Col xs={6} md={4} key={idx} className="mb-2 text-muted">
                <CheckCircle size={16} className="me-2 text-success" /> {item}
              </Col>
            )) : <Col className="text-muted">No amenities listed</Col>}
          </Row>
        </Col>
        
        <Col md={4}>
          <Card className="shadow-sm border-0 sticky-top" style={{ top: '20px' }}>
            <Card.Body className="p-4">
              <h3 className="fw-bold text-primary mb-1">
                <DollarSign size={24} />{room.pricePerNight}
              </h3>
              <p className="text-muted small mb-4">per night (taxes and fees included)</p>
              
              <div className="d-flex align-items-center mb-4 text-muted">
                <Users size={18} className="me-2" />
                <span>Maximum {room.capacity} guests</span>
              </div>
              
              {bookingSuccess ? (
                <Alert variant="success" className="text-center">
                  <h5 className="alert-heading mb-2">Booking Confirmed!</h5>
                  <p className="small mb-3">Your reservation has been successfully created.</p>
                  <Button variant="success" className="w-100" onClick={() => navigate('/dashboard')}>
                    View My Bookings
                  </Button>
                </Alert>
              ) : (
                <Form onSubmit={handleBooking}>
                  {bookingError && <Alert variant="danger" className="small">{bookingError}</Alert>}
                  
                  <Form.Group className="mb-3">
                    <Form.Label className="small fw-bold text-muted">Check-in Date</Form.Label>
                    <Form.Control type="date" value={checkIn} onChange={e => setCheckIn(e.target.value)} required min={new Date().toISOString().split('T')[0]} />
                  </Form.Group>
                  
                  <Form.Group className="mb-3">
                    <Form.Label className="small fw-bold text-muted">Check-out Date</Form.Label>
                    <Form.Control type="date" value={checkOut} onChange={e => setCheckOut(e.target.value)} required min={checkIn || new Date().toISOString().split('T')[0]} />
                  </Form.Group>
                  
                  <Form.Group className="mb-4">
                    <Form.Label className="small fw-bold text-muted">Guests</Form.Label>
                    <Form.Control type="number" min="1" max={room.capacity} value={guests} onChange={e => setGuests(e.target.value)} required />
                  </Form.Group>
                  
                  {estimatedPrice > 0 && (
                    <div className="d-flex justify-content-between align-items-center mb-4 pt-3 border-top fw-bold">
                      <span>Total Estimated</span>
                      <span className="text-primary fs-5">${estimatedPrice}</span>
                    </div>
                  )}
                  
                  <Button variant="primary" type="submit" className="w-100 fw-bold py-2" disabled={bookingLoading || room.status !== 'available'}>
                    {bookingLoading ? 'Processing...' : user ? 'Book Now' : 'Login to Book'}
                  </Button>
                </Form>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default RoomDetails;
