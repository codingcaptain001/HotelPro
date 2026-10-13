import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Spinner, Alert, Button, Form } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Users, 
  DollarSign, 
  Calendar, 
  CheckCircle, 
  Bed, 
  ShieldCheck, 
  Sparkles, 
  ArrowLeft, 
  AlertCircle, 
  Clock, 
  Info,
  CalendarCheck
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const RoomDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  // Booking Form State
  const todayStr = new Date().toISOString().split('T')[0];
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState('');
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        setLoading(true);
        setError(null);
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

  // Compute stay details
  let numberOfNights = 0;
  let estimatedTotal = 0;
  let dateValidationError = '';

  if (checkIn && checkOut) {
    const inDate = new Date(checkIn);
    const outDate = new Date(checkOut);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (inDate < today) {
      dateValidationError = 'Check-in date cannot be in the past.';
    } else if (inDate >= outDate) {
      dateValidationError = 'Check-out date must be strictly after check-in date.';
    } else if (room) {
      numberOfNights = Math.ceil((outDate - inDate) / (1000 * 60 * 60 * 24));
      estimatedTotal = numberOfNights * room.pricePerNight;
    }
  }

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login', { state: { from: `/rooms/${id}` } });
      return;
    }

    if (dateValidationError) {
      setBookingError(dateValidationError);
      return;
    }

    setBookingError('');
    setBookingLoading(true);

    try {
      const payload = {
        room: id,
        checkInDate: checkIn,
        checkOutDate: checkOut,
        guestCount: Number(guests)
      };

      const { data } = await api.post('/bookings', payload);
      setConfirmedBooking(data);
      setCheckIn('');
      setCheckOut('');
    } catch (err) {
      setBookingError(err.response?.data?.message || 'Reservation failed. Please try different dates.');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="text-muted mt-2">Loading room details...</p>
      </Container>
    );
  }

  if (error || !room) {
    return (
      <Container className="py-5" style={{ maxWidth: '600px' }}>
        <Alert variant="danger" className="text-center p-4 shadow-sm">
          <AlertCircle size={36} className="mb-2" />
          <Alert.Heading className="fw-bold">Room Unavailable</Alert.Heading>
          <p className="mb-3">{error || 'The requested room could not be found.'}</p>
          <Button as={Link} to="/rooms" variant="outline-danger">
            &larr; Return to Rooms Catalog
          </Button>
        </Alert>
      </Container>
    );
  }

  const imagesList = room.images && room.images.length > 0 ? room.images : [];

  return (
    <Container className="py-5">
      {/* Back button */}
      <Button 
        as={Link} 
        to="/rooms" 
        variant="link" 
        className="ps-0 mb-4 text-decoration-none text-muted d-inline-flex align-items-center gap-1"
      >
        <ArrowLeft size={16} /> Back to Rooms & Suites
      </Button>

      <Row className="g-5">
        {/* Left Column: Gallery & Details */}
        <Col lg={8}>
          {/* Main Photo Gallery */}
          <div className="rounded-4 overflow-hidden shadow-sm mb-3 position-relative" style={{ height: '420px', backgroundColor: '#e2e8f0' }}>
            {imagesList.length > 0 ? (
              <img 
                src={imagesList[activeImageIdx] || imagesList[0]} 
                alt={room.name} 
                className="w-100 h-100 object-fit-cover" 
              />
            ) : (
              <div className="w-100 h-100 d-flex align-items-center justify-content-center text-muted">
                <Bed size={48} />
              </div>
            )}
            <Badge 
              bg={room.status === 'available' ? 'success' : 'secondary'} 
              className="position-absolute top-0 end-0 m-3 px-3 py-2 rounded-pill shadow-sm text-uppercase"
            >
              {room.status}
            </Badge>
          </div>

          {/* Thumbnails */}
          {imagesList.length > 1 && (
            <div className="d-flex gap-2 mb-4 overflow-auto pb-2">
              {imagesList.map((img, idx) => (
                <div 
                  key={idx}
                  onClick={() => setActiveImageIdx(idx)}
                  className={`rounded-3 overflow-hidden border cursor-pointer ${activeImageIdx === idx ? 'border-primary border-3 shadow-sm' : 'border-transparent'}`}
                  style={{ width: 80, height: 60, flexShrink: 0, cursor: 'pointer' }}
                >
                  <img src={img} alt={`${room.name} ${idx + 1}`} className="w-100 h-100 object-fit-cover" />
                </div>
              ))}
            </div>
          )}

          {/* Room Title & Type Header */}
          <div className="d-flex flex-wrap justify-content-between align-items-start gap-2 mb-3">
            <div>
              <Badge bg="primary-subtle" className="text-primary px-3 py-1 mb-2 fs-6">
                {room.roomType}
              </Badge>
              <h1 className="fw-bold text-primary mb-1">{room.name}</h1>
            </div>
            <div className="text-lg-end">
              <span className="fs-3 fw-bold text-primary">${room.pricePerNight}</span>
              <span className="text-muted"> / night</span>
            </div>
          </div>

          <hr className="my-4 border-light-subtle" />

          {/* Quick Specifications */}
          <Row className="g-3 mb-4 text-center">
            <Col sm={4} xs={6}>
              <div className="p-3 bg-light rounded-3 h-100 border">
                <Users size={20} className="text-primary mb-1" />
                <div className="small text-muted">Occupancy</div>
                <div className="fw-bold text-dark">Up to {room.capacity} Guests</div>
              </div>
            </Col>

            <Col sm={4} xs={6}>
              <div className="p-3 bg-light rounded-3 h-100 border">
                <Bed size={20} className="text-primary mb-1" />
                <div className="small text-muted">Accommodations</div>
                <div className="fw-bold text-dark">{room.roomType}</div>
              </div>
            </Col>

            <Col sm={4} xs={12}>
              <div className="p-3 bg-light rounded-3 h-100 border">
                <ShieldCheck size={20} className="text-primary mb-1" />
                <div className="small text-muted">Assurance</div>
                <div className="fw-bold text-dark">Instant Confirmation</div>
              </div>
            </Col>
          </Row>

          {/* Description */}
          <div className="mb-4">
            <h4 className="fw-bold text-dark mb-3">About This Room</h4>
            <p className="text-secondary leading-relaxed" style={{ whiteSpace: 'pre-line' }}>
              {room.description}
            </p>
          </div>

          {/* Amenities */}
          {room.amenities && room.amenities.length > 0 && (
            <div className="mb-4">
              <h4 className="fw-bold text-dark mb-3">Included Amenities</h4>
              <Row className="g-2">
                {room.amenities.map((amenity, idx) => (
                  <Col md={6} key={idx}>
                    <div className="d-flex align-items-center gap-2 p-2 bg-white border rounded-2">
                      <CheckCircle size={16} className="text-success flex-shrink-0" />
                      <span className="text-dark small fw-medium">{amenity}</span>
                    </div>
                  </Col>
                ))}
              </Row>
            </div>
          )}
        </Col>

        {/* Right Column: Reservation Widget */}
        <Col lg={4}>
          <div className="sticky-top" style={{ top: '90px' }}>
            {confirmedBooking ? (
              <Card className="border-0 shadow-lg p-4 rounded-4 bg-white text-center">
                <div className="bg-success text-white rounded-circle d-inline-flex p-3 mx-auto mb-3 shadow-sm">
                  <CalendarCheck size={36} />
                </div>
                <h4 className="fw-bold text-success mb-1">Reservation Confirmed!</h4>
                <p className="text-muted small mb-3">
                  Your booking has been recorded. A confirmation has been registered to your account.
                </p>

                <div className="bg-light p-3 rounded-3 text-start small mb-3">
                  <div className="d-flex justify-content-between mb-1">
                    <span className="text-muted">Booking Reference:</span>
                    <strong className="text-dark font-monospace">{confirmedBooking.bookingReference}</strong>
                  </div>
                  <div className="d-flex justify-content-between mb-1">
                    <span className="text-muted">Check-In:</span>
                    <strong>{new Date(confirmedBooking.checkInDate).toLocaleDateString()}</strong>
                  </div>
                  <div className="d-flex justify-content-between mb-1">
                    <span className="text-muted">Check-Out:</span>
                    <strong>{new Date(confirmedBooking.checkOutDate).toLocaleDateString()}</strong>
                  </div>
                  <div className="d-flex justify-content-between pt-2 border-top mt-2">
                    <span className="text-muted">Total Charged:</span>
                    <strong className="text-primary fs-6">${confirmedBooking.totalAmount}</strong>
                  </div>
                </div>

                <div className="d-grid gap-2">
                  <Button as={Link} to="/dashboard" variant="primary" className="fw-semibold">
                    View in My Bookings
                  </Button>
                  <Button variant="outline-secondary" onClick={() => setConfirmedBooking(null)}>
                    Book Another Room
                  </Button>
                </div>
              </Card>
            ) : (
              <Card className="border-0 shadow-lg p-4 rounded-4 bg-white">
                <div className="d-flex justify-content-between align-items-baseline mb-3">
                  <div>
                    <span className="fs-3 fw-bold text-primary">${room.pricePerNight}</span>
                    <span className="text-muted small"> / night</span>
                  </div>
                  <Badge bg={room.status === 'available' ? 'success-subtle' : 'secondary'} className="text-success border border-success-subtle">
                    {room.status === 'available' ? 'Instant Booking' : 'Not Available'}
                  </Badge>
                </div>

                {bookingError && (
                  <Alert variant="danger" dismissible onClose={() => setBookingError('')} className="small py-2 mb-3">
                    {bookingError}
                  </Alert>
                )}

                <Form onSubmit={handleBookingSubmit}>
                  {/* Check In Date */}
                  <Form.Group className="mb-3" controlId="checkInDate">
                    <Form.Label className="small fw-bold text-secondary mb-1">
                      <Calendar size={14} className="me-1" /> Check-In Date
                    </Form.Label>
                    <Form.Control 
                      type="date" 
                      min={todayStr}
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      required
                      disabled={room.status !== 'available'}
                    />
                  </Form.Group>

                  {/* Check Out Date */}
                  <Form.Group className="mb-3" controlId="checkOutDate">
                    <Form.Label className="small fw-bold text-secondary mb-1">
                      <Calendar size={14} className="me-1" /> Check-Out Date
                    </Form.Label>
                    <Form.Control 
                      type="date" 
                      min={checkIn || tomorrowStr}
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      required
                      disabled={room.status !== 'available'}
                    />
                  </Form.Group>

                  {/* Guests */}
                  <Form.Group className="mb-4" controlId="guestCount">
                    <Form.Label className="small fw-bold text-secondary mb-1">
                      <Users size={14} className="me-1" /> Guests
                    </Form.Label>
                    <Form.Select 
                      value={guests} 
                      onChange={(e) => setGuests(e.target.value)}
                      disabled={room.status !== 'available'}
                    >
                      {Array.from({ length: room.capacity }, (_, i) => i + 1).map(num => (
                        <option key={num} value={num}>
                          {num} {num === 1 ? 'Guest' : 'Guests'} (Max {room.capacity})
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>

                  {/* Price Calculation Summary */}
                  {numberOfNights > 0 && !dateValidationError && (
                    <div className="bg-light p-3 rounded-3 small mb-4">
                      <div className="d-flex justify-content-between mb-1">
                        <span>${room.pricePerNight} &times; {numberOfNights} {numberOfNights === 1 ? 'night' : 'nights'}</span>
                        <span>${estimatedTotal}</span>
                      </div>
                      <div className="d-flex justify-content-between mb-1 text-muted">
                        <span>Taxes & Service Fees</span>
                        <span>Included</span>
                      </div>
                      <div className="d-flex justify-content-between pt-2 border-top mt-2 fw-bold text-dark fs-6">
                        <span>Total Estimated Amount:</span>
                        <span className="text-primary">${estimatedTotal}</span>
                      </div>
                    </div>
                  )}

                  {room.status === 'available' ? (
                    user ? (
                      <Button 
                        variant="primary" 
                        type="submit" 
                        className="w-100 py-3 rounded-pill fw-bold shadow-sm"
                        disabled={bookingLoading || Boolean(dateValidationError)}
                      >
                        {bookingLoading ? (
                          <>
                            <Spinner size="sm" animation="border" className="me-2" />
                            Processing Reservation...
                          </>
                        ) : (
                          'Confirm & Reserve Room'
                        )}
                      </Button>
                    ) : (
                      <Button 
                        variant="outline-primary" 
                        onClick={() => navigate('/login', { state: { from: `/rooms/${id}` } })}
                        className="w-100 py-3 rounded-pill fw-bold"
                      >
                        Sign In to Reserve
                      </Button>
                    )
                  ) : (
                    <Button variant="secondary" disabled className="w-100 py-3 rounded-pill fw-bold">
                      Room Currently Unavailable
                    </Button>
                  )}
                </Form>

                <div className="text-center text-muted small mt-3 d-flex align-items-center justify-content-center gap-1">
                  <ShieldCheck size={14} className="text-success" /> Free cancellation before check-in date
                </div>
              </Card>
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default RoomDetails;
