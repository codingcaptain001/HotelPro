import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button, Spinner, Alert, Modal, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Calendar, User, Mail, Phone, Shield, DollarSign, Clock, AlertCircle, CheckCircle, Ban, ArrowRight, Bed } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Cancellation modal state
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError('');
      const { data } = await api.get('/bookings/my');
      setBookings(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load booking history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleOpenCancelModal = (booking) => {
    setSelectedBooking(booking);
    setShowCancelModal(true);
    setSuccessMsg('');
    setError('');
  };

  const handleConfirmCancel = async () => {
    if (!selectedBooking) return;
    try {
      setCancelLoading(true);
      await api.put(`/bookings/${selectedBooking._id}/cancel`);
      setSuccessMsg(`Booking ${selectedBooking.bookingReference} has been successfully cancelled.`);
      setShowCancelModal(false);
      setSelectedBooking(null);
      // Refresh list
      await fetchBookings();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to cancel booking');
      setShowCancelModal(false);
    } finally {
      setCancelLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'confirmed':
        return <Badge bg="success" className="px-2 py-1"><CheckCircle size={12} className="me-1" /> Confirmed</Badge>;
      case 'pending':
        return <Badge bg="warning" text="dark" className="px-2 py-1"><Clock size={12} className="me-1" /> Pending</Badge>;
      case 'cancelled':
        return <Badge bg="secondary" className="px-2 py-1"><Ban size={12} className="me-1" /> Cancelled</Badge>;
      default:
        return <Badge bg="info">{status}</Badge>;
    }
  };

  const getPaymentBadge = (status) => {
    switch (status) {
      case 'paid':
        return <Badge bg="success-subtle" className="text-success border border-success-subtle px-2 py-1">Paid</Badge>;
      case 'pending':
        return <Badge bg="warning-subtle" className="text-warning-emphasis border border-warning-subtle px-2 py-1">Pending Payment</Badge>;
      case 'failed':
        return <Badge bg="danger-subtle" className="text-danger border border-danger-subtle px-2 py-1">Failed</Badge>;
      default:
        return <Badge bg="light" text="dark">{status}</Badge>;
    }
  };

  // Check if booking is eligible for cancellation: check-in date >= today AND not already cancelled
  const canCancelBooking = (booking) => {
    if (booking.bookingStatus === 'cancelled') return false;
    const checkIn = new Date(booking.checkInDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return checkIn >= today;
  };

  return (
    <Container className="py-5">
      {/* Header */}
      <div className="mb-4">
        <h1 className="fw-bold text-primary mb-1">Guest Dashboard</h1>
        <p className="text-muted">Manage your stay reservations, view booking history, and review account details.</p>
      </div>

      {successMsg && (
        <Alert variant="success" dismissible onClose={() => setSuccessMsg('')} className="shadow-sm mb-4">
          <CheckCircle size={18} className="me-2" />
          {successMsg}
        </Alert>
      )}

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError('')} className="shadow-sm mb-4">
          <AlertCircle size={18} className="me-2" />
          {error}
        </Alert>
      )}

      <Row className="g-4">
        {/* Left Column: Profile Card */}
        <Col lg={4}>
          <Card className="shadow-sm border-0 mb-4 overflow-hidden">
            <div className="bg-primary text-white p-4">
              <div className="d-flex align-items-center gap-3">
                <div className="bg-white text-primary rounded-circle p-3 d-flex align-items-center justify-content-center shadow-sm" style={{ width: 64, height: 64 }}>
                  <User size={32} />
                </div>
                <div>
                  <h4 className="fw-bold mb-0 text-white">{user?.name}</h4>
                  <span className="badge bg-white text-primary text-uppercase mt-1 px-2 py-1">
                    {user?.role || 'Guest'} Account
                  </span>
                </div>
              </div>
            </div>

            <Card.Body className="p-4">
              <h6 className="fw-bold text-secondary text-uppercase small mb-3">Profile Information</h6>
              
              <div className="d-flex align-items-center gap-3 mb-3">
                <Mail size={18} className="text-primary flex-shrink-0" />
                <div className="overflow-hidden">
                  <div className="text-muted small">Email Address</div>
                  <div className="fw-medium text-dark text-truncate">{user?.email}</div>
                </div>
              </div>

              {user?.phone && (
                <div className="d-flex align-items-center gap-3 mb-3">
                  <Phone size={18} className="text-primary flex-shrink-0" />
                  <div>
                    <div className="text-muted small">Phone Number</div>
                    <div className="fw-medium text-dark">{user.phone}</div>
                  </div>
                </div>
              )}

              <div className="d-flex align-items-center gap-3 mb-3">
                <Shield size={18} className="text-primary flex-shrink-0" />
                <div>
                  <div className="text-muted small">Account Privileges</div>
                  <div className="fw-medium text-dark text-capitalize">{user?.role || 'Guest'} Access</div>
                </div>
              </div>

              <hr className="my-3" />

              <div className="d-grid gap-2">
                <Button as={Link} to="/rooms" variant="primary" className="fw-semibold">
                  Browse Available Rooms
                </Button>
                {user?.role === 'admin' && (
                  <Button as={Link} to="/admin" variant="outline-danger" className="fw-semibold">
                    Go to Admin Management
                  </Button>
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Right Column: Bookings History */}
        <Col lg={8}>
          <Card className="shadow-sm border-0">
            <Card.Header className="bg-white py-3 border-bottom d-flex justify-content-between align-items-center">
              <h5 className="fw-bold mb-0 text-primary d-flex align-items-center gap-2">
                <Calendar size={20} /> My Reservations & History
              </h5>
              <Badge bg="primary-subtle" className="text-primary px-3 py-2 fs-6">
                {bookings.length} {bookings.length === 1 ? 'Booking' : 'Bookings'}
              </Badge>
            </Card.Header>

            <Card.Body className="p-4">
              {loading ? (
                <div className="text-center py-5">
                  <Spinner animation="border" variant="primary" />
                  <p className="text-muted mt-2 mb-0">Retrieving your bookings...</p>
                </div>
              ) : bookings.length === 0 ? (
                <div className="text-center py-5">
                  <div className="bg-light text-primary rounded-circle d-inline-flex p-4 mb-3">
                    <Bed size={40} />
                  </div>
                  <h4 className="fw-bold text-dark">No Bookings Found</h4>
                  <p className="text-muted mb-4" style={{ maxWidth: '400px', margin: '0 auto' }}>
                    You have not reserved any rooms yet. Explore our luxury suites and schedule your next stay.
                  </p>
                  <Button as={Link} to="/rooms" variant="primary" className="px-4 py-2 rounded-pill fw-semibold shadow-sm">
                    Find Your Ideal Room <ArrowRight size={16} className="ms-1" />
                  </Button>
                </div>
              ) : (
                <div className="d-flex flex-column gap-3">
                  {bookings.map((booking) => {
                    const roomInfo = booking.room || {};
                    const roomName = roomInfo.name || 'Room Details Unavailable';
                    const roomType = roomInfo.roomType || '';
                    const roomImg = roomInfo.images && roomInfo.images.length > 0 ? roomInfo.images[0] : null;
                    const eligibleToCancel = canCancelBooking(booking);

                    return (
                      <Card key={booking._id} className="border shadow-none rounded-3 overflow-hidden">
                        <Row className="g-0">
                          <Col md={4} className="bg-light position-relative" style={{ minHeight: '160px' }}>
                            {roomImg ? (
                              <img 
                                src={roomImg} 
                                alt={roomName} 
                                className="w-100 h-100 object-fit-cover position-absolute top-0 start-0" 
                              />
                            ) : (
                              <div className="w-100 h-100 d-flex align-items-center justify-content-center text-muted">
                                <Bed size={32} />
                              </div>
                            )}
                          </Col>

                          <Col md={8}>
                            <Card.Body className="p-3 d-flex flex-column justify-content-between h-100">
                              <div>
                                <div className="d-flex justify-content-between align-items-start gap-2 mb-1">
                                  <div>
                                    <h5 className="fw-bold mb-0 text-dark">{roomName}</h5>
                                    {roomType && <span className="text-muted small">{roomType}</span>}
                                  </div>
                                  <div className="d-flex flex-column align-items-end gap-1">
                                    {getStatusBadge(booking.bookingStatus)}
                                    {getPaymentBadge(booking.paymentStatus)}
                                  </div>
                                </div>

                                <div className="text-muted small mb-2">
                                  Reference: <strong className="text-dark font-monospace">{booking.bookingReference}</strong>
                                </div>

                                <Row className="g-2 small text-secondary mb-2 bg-light p-2 rounded-2">
                                  <Col sm={6}>
                                    <div>Check-In: <strong>{new Date(booking.checkInDate).toLocaleDateString()}</strong></div>
                                    <div>Check-Out: <strong>{new Date(booking.checkOutDate).toLocaleDateString()}</strong></div>
                                  </Col>
                                  <Col sm={6}>
                                    <div>Duration: <strong>{booking.numberOfNights} {booking.numberOfNights === 1 ? 'Night' : 'Nights'}</strong></div>
                                    <div>Guests: <strong>{booking.guestCount}</strong></div>
                                  </Col>
                                </Row>
                              </div>

                              <div className="d-flex justify-content-between align-items-center pt-2 border-top mt-2">
                                <div>
                                  <span className="text-muted small">Total Paid/Due: </span>
                                  <strong className="fs-5 text-primary">${booking.totalAmount}</strong>
                                </div>

                                <div>
                                  {eligibleToCancel ? (
                                    <Button 
                                      variant="outline-danger" 
                                      size="sm" 
                                      onClick={() => handleOpenCancelModal(booking)}
                                      className="fw-semibold"
                                    >
                                      Cancel Reservation
                                    </Button>
                                  ) : booking.bookingStatus === 'cancelled' ? (
                                    <span className="text-muted small fst-italic">Cancelled</span>
                                  ) : (
                                    <span className="text-muted small" title="Cannot cancel a stay that has already started or completed">
                                      Non-refundable / Past
                                    </span>
                                  )}
                                </div>
                              </div>
                            </Card.Body>
                          </Col>
                        </Row>
                      </Card>
                    );
                  })}
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Cancellation Confirmation Modal */}
      <Modal show={showCancelModal} onHide={() => !cancelLoading && setShowCancelModal(false)} centered>
        <Modal.Header closeButton={!cancelLoading}>
          <Modal.Title className="fw-bold text-danger d-flex align-items-center gap-2">
            <AlertCircle size={22} /> Confirm Reservation Cancellation
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedBooking && (
            <>
              <p className="mb-3">
                Are you sure you want to cancel your reservation for{' '}
                <strong>{selectedBooking.room?.name || 'this room'}</strong>?
              </p>
              <div className="bg-light p-3 rounded-3 small mb-3">
                <div>Booking Reference: <strong>{selectedBooking.bookingReference}</strong></div>
                <div>Check-In Date: <strong>{new Date(selectedBooking.checkInDate).toLocaleDateString()}</strong></div>
                <div>Total Amount: <strong>${selectedBooking.totalAmount}</strong></div>
              </div>
              <p className="small text-muted mb-0">
                According to hotel policy, cancelled rooms will be immediately returned to general inventory.
              </p>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCancelModal(false)} disabled={cancelLoading}>
            Keep Reservation
          </Button>
          <Button variant="danger" onClick={handleConfirmCancel} disabled={cancelLoading} className="fw-semibold">
            {cancelLoading ? <Spinner size="sm" animation="border" className="me-2" /> : null}
            Yes, Cancel Booking
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Dashboard;
