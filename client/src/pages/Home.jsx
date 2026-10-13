import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Badge, Spinner } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { 
  Bed, 
  Calendar, 
  Users, 
  DollarSign, 
  ShieldCheck, 
  Coffee, 
  Wifi, 
  Sparkles, 
  MapPin, 
  Star, 
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const [featuredRooms, setFeaturedRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  // Quick search form state
  const [roomType, setRoomType] = useState('all');
  const [guests, setGuests] = useState('1');

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        setLoading(true);
        const { data } = await api.get('/rooms');
        // Filter available rooms and take top 3
        const available = data.filter(r => r.status === 'available').slice(0, 3);
        setFeaturedRooms(available);
      } catch (err) {
        console.error('Failed to load featured rooms', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate(`/rooms?type=${roomType}&guests=${guests}`);
  };

  return (
    <div>
      {/* Hero Section */}
      <div 
        className="position-relative text-white py-5 d-flex align-items-center"
        style={{
          minHeight: '520px',
          background: 'linear-gradient(135deg, rgba(26, 54, 93, 0.92) 0%, rgba(43, 108, 176, 0.85) 100%), url(https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1600&q=80) center/cover no-repeat'
        }}
      >
        <Container className="py-5">
          <Row className="align-items-center">
            <Col lg={8} className="mx-auto text-center">
              <span className="badge bg-warning text-dark text-uppercase px-3 py-2 fw-semibold mb-3 tracking-wide">
                Welcome to HotelPro Resort & Suites
              </span>
              <h1 className="display-3 fw-bold mb-3 text-white">
                Experience Handcrafted Hospitality & Luxury
              </h1>
              <p className="lead mb-4 text-light opacity-90 mx-auto" style={{ maxWidth: '650px' }}>
                Discover our curated collection of luxury suites and oceanfront rooms. Enjoy seamless bookings, transparent pricing, and unforgettable stays.
              </p>
              <div className="d-flex flex-wrap gap-3 justify-content-center">
                <Button 
                  as={Link} 
                  to="/rooms" 
                  variant="warning" 
                  size="lg" 
                  className="px-4 py-3 rounded-pill fw-bold text-dark shadow-sm d-flex align-items-center gap-2"
                >
                  <Bed size={20} /> Explore Available Rooms
                </Button>
                <Button 
                  as={Link} 
                  to="/about" 
                  variant="outline-light" 
                  size="lg" 
                  className="px-4 py-3 rounded-pill fw-semibold"
                >
                  Learn More
                </Button>
              </div>
            </Col>
          </Row>

          {/* Quick Search Floating Bar */}
          <div className="mt-5 mx-auto" style={{ maxWidth: '900px' }}>
            <Card className="border-0 shadow-lg p-3 p-md-4 rounded-4 bg-white text-dark">
              <Form onSubmit={handleSearchSubmit}>
                <Row className="g-3 align-items-end">
                  <Col md={5}>
                    <Form.Label className="small fw-bold text-secondary mb-1">
                      <Bed size={16} className="me-1 text-primary" /> Preferred Room Type
                    </Form.Label>
                    <Form.Select 
                      value={roomType} 
                      onChange={(e) => setRoomType(e.target.value)}
                      className="py-2"
                    >
                      <option value="all">All Room Types</option>
                      <option value="Deluxe Suite">Deluxe Suite</option>
                      <option value="Executive Suite">Executive Suite</option>
                      <option value="Ocean Villa">Ocean Villa</option>
                      <option value="Single Room">Single Room</option>
                    </Form.Select>
                  </Col>

                  <Col md={4}>
                    <Form.Label className="small fw-bold text-secondary mb-1">
                      <Users size={16} className="me-1 text-primary" /> Guest Count
                    </Form.Label>
                    <Form.Select 
                      value={guests} 
                      onChange={(e) => setGuests(e.target.value)}
                      className="py-2"
                    >
                      <option value="1">1 Guest</option>
                      <option value="2">2 Guests</option>
                      <option value="3">3 Guests</option>
                      <option value="4">4+ Guests</option>
                    </Form.Select>
                  </Col>

                  <Col md={3}>
                    <Button type="submit" variant="primary" className="w-100 py-2 fw-semibold rounded-3 shadow-sm">
                      Search Rooms
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Card>
          </div>
        </Container>
      </div>

      {/* Featured Rooms Section */}
      <Container className="py-5 my-4">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-4">
          <div>
            <span className="text-primary text-uppercase fw-bold small tracking-wide">Handpicked Selection</span>
            <h2 className="fw-bold text-primary mb-1">Featured Rooms & Suites</h2>
            <p className="text-muted mb-0">Impeccably detailed suites available for immediate reservation.</p>
          </div>
          <Button as={Link} to="/rooms" variant="link" className="text-primary fw-semibold p-0 mt-2 mt-md-0 text-decoration-none">
            View All Rooms ({featuredRooms.length > 0 ? `${featuredRooms.length}+ Available` : 'Browse Catalog'}) &rarr;
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <p className="text-muted mt-2">Loading featured suites...</p>
          </div>
        ) : featuredRooms.length === 0 ? (
          <Card className="border-0 shadow-sm p-5 text-center bg-light">
            <Bed size={40} className="text-primary mx-auto mb-2" />
            <h5 className="fw-bold text-dark">No Available Rooms At The Moment</h5>
            <p className="text-muted small mb-3">Check back soon or browse our full catalog.</p>
            <div>
              <Button as={Link} to="/rooms" variant="primary" size="sm">Browse Room Catalog</Button>
            </div>
          </Card>
        ) : (
          <Row className="g-4">
            {featuredRooms.map(room => (
              <Col md={4} key={room._id}>
                <Card className="h-100 border-0 shadow-sm rounded-4 overflow-hidden d-flex flex-column">
                  <div style={{ height: '220px', backgroundColor: '#e2e8f0', position: 'relative' }}>
                    {room.images && room.images.length > 0 ? (
                      <img 
                        src={room.images[0]} 
                        alt={room.name} 
                        className="w-100 h-100 object-fit-cover"
                      />
                    ) : (
                      <div className="w-100 h-100 d-flex align-items-center justify-content-center text-muted">
                        <Bed size={32} />
                      </div>
                    )}
                    <Badge 
                      bg="success" 
                      className="position-absolute top-0 end-0 m-3 px-3 py-2 rounded-pill shadow-sm text-uppercase"
                    >
                      {room.status}
                    </Badge>
                  </div>

                  <Card.Body className="p-4 d-flex flex-column flex-grow-1">
                    <Badge bg="primary-subtle" className="text-primary align-self-start mb-2 px-2 py-1">
                      {room.roomType}
                    </Badge>
                    <h5 className="fw-bold mb-2 text-dark">{room.name}</h5>
                    <p className="text-muted small flex-grow-1 mb-3">
                      {room.description && room.description.length > 90 
                        ? `${room.description.substring(0, 90)}...` 
                        : room.description}
                    </p>

                    <div className="d-flex justify-content-between align-items-center pt-3 border-top mt-auto">
                      <div>
                        <span className="fs-4 fw-bold text-primary">${room.pricePerNight}</span>
                        <span className="text-muted small"> / night</span>
                      </div>
                      <span className="text-muted small d-flex align-items-center gap-1">
                        <Users size={16} /> Max {room.capacity}
                      </span>
                    </div>

                    <Button 
                      as={Link} 
                      to={`/rooms/${room._id}`} 
                      variant="outline-primary" 
                      className="w-100 mt-3 rounded-pill fw-semibold"
                    >
                      View Details & Reserve
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Container>

      {/* Core Highlights / Why Choose Us */}
      <div className="bg-white py-5 border-top border-bottom">
        <Container className="py-4">
          <div className="text-center mb-5">
            <span className="text-primary text-uppercase fw-bold small tracking-wide">Signature Amenities</span>
            <h2 className="fw-bold text-primary mb-2">Designed for Your Utmost Comfort</h2>
            <p className="text-muted mx-auto" style={{ maxWidth: '600px' }}>
              Every detail at HotelPro is crafted to provide a tranquil and unforgettable guest experience.
            </p>
          </div>

          <Row className="g-4">
            <Col md={4} sm={6}>
              <div className="p-4 rounded-3 h-100 border bg-light-subtle text-center">
                <div className="bg-primary text-white rounded-circle d-inline-flex p-3 mb-3">
                  <Wifi size={24} />
                </div>
                <h5 className="fw-bold text-dark mb-2">High-Speed Wi-Fi</h5>
                <p className="text-muted small mb-0">Complimentary gigabit fiber connectivity throughout all suites and common areas.</p>
              </div>
            </Col>

            <Col md={4} sm={6}>
              <div className="p-4 rounded-3 h-100 border bg-light-subtle text-center">
                <div className="bg-primary text-white rounded-circle d-inline-flex p-3 mb-3">
                  <Coffee size={24} />
                </div>
                <h5 className="fw-bold text-dark mb-2">Artisan Breakfast</h5>
                <p className="text-muted small mb-0">Daily farm-to-table breakfast served fresh in the dining pavilion or via room service.</p>
              </div>
            </Col>

            <Col md={4} sm={6}>
              <div className="p-4 rounded-3 h-100 border bg-light-subtle text-center">
                <div className="bg-primary text-white rounded-circle d-inline-flex p-3 mb-3">
                  <ShieldCheck size={24} />
                </div>
                <h5 className="fw-bold text-dark mb-2">Double-Booking Shield</h5>
                <p className="text-muted small mb-0">Direct real-time date verification against MongoDB Atlas prevents scheduling conflicts.</p>
              </div>
            </Col>

            <Col md={4} sm={6}>
              <div className="p-4 rounded-3 h-100 border bg-light-subtle text-center">
                <div className="bg-primary text-white rounded-circle d-inline-flex p-3 mb-3">
                  <Sparkles size={24} />
                </div>
                <h5 className="fw-bold text-dark mb-2">Daily Housekeeping</h5>
                <p className="text-muted small mb-0">Meticulous cleaning standards with eco-conscious toiletries and luxury plush linens.</p>
              </div>
            </Col>

            <Col md={4} sm={6}>
              <div className="p-4 rounded-3 h-100 border bg-light-subtle text-center">
                <div className="bg-primary text-white rounded-circle d-inline-flex p-3 mb-3">
                  <MapPin size={24} />
                </div>
                <h5 className="fw-bold text-dark mb-2">Prime Coastal Location</h5>
                <p className="text-muted small mb-0">Overlooking the Pacific Ocean, moments from coastal trails and fine dining.</p>
              </div>
            </Col>

            <Col md={4} sm={6}>
              <div className="p-4 rounded-3 h-100 border bg-light-subtle text-center">
                <div className="bg-primary text-white rounded-circle d-inline-flex p-3 mb-3">
                  <CheckCircle2 size={24} />
                </div>
                <h5 className="fw-bold text-dark mb-2">Flexible Cancellation</h5>
                <p className="text-muted small mb-0">Easily manage and cancel bookings from your guest dashboard before your stay begins.</p>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Guest Reviews / Testimonials */}
      <Container className="py-5 my-4">
        <div className="text-center mb-5">
          <span className="text-primary text-uppercase fw-bold small tracking-wide">Guest Feedback</span>
          <h2 className="fw-bold text-primary mb-2">Loved by Discerning Travelers</h2>
          <p className="text-muted">Here is what guests say about their stays with us.</p>
        </div>

        <Row className="g-4">
          <Col md={4}>
            <Card className="p-4 border-0 shadow-sm h-100 rounded-3">
              <div className="d-flex gap-1 text-warning mb-3">
                <Star size={16} fill="#ffc107" /><Star size={16} fill="#ffc107" /><Star size={16} fill="#ffc107" /><Star size={16} fill="#ffc107" /><Star size={16} fill="#ffc107" />
              </div>
              <p className="text-secondary small fst-italic mb-3">
                "The oceanfront view from our Deluxe Suite was breathtaking. Check-in was effortless, and the online guest dashboard made managing our itinerary so simple!"
              </p>
              <div className="mt-auto fw-bold text-dark small">&mdash; Sarah Jenkins, San Francisco</div>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="p-4 border-0 shadow-sm h-100 rounded-3">
              <div className="d-flex gap-1 text-warning mb-3">
                <Star size={16} fill="#ffc107" /><Star size={16} fill="#ffc107" /><Star size={16} fill="#ffc107" /><Star size={16} fill="#ffc107" /><Star size={16} fill="#ffc107" />
              </div>
              <p className="text-secondary small fst-italic mb-3">
                "HotelPro exceeded all expectations. The rooms are spotless, Wi-Fi was blazingly fast for my remote work meetings, and the staff was immensely welcoming."
              </p>
              <div className="mt-auto fw-bold text-dark small">&mdash; Marcus Vance, New York</div>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="p-4 border-0 shadow-sm h-100 rounded-3">
              <div className="d-flex gap-1 text-warning mb-3">
                <Star size={16} fill="#ffc107" /><Star size={16} fill="#ffc107" /><Star size={16} fill="#ffc107" /><Star size={16} fill="#ffc107" /><Star size={16} fill="#ffc107" />
              </div>
              <p className="text-secondary small fst-italic mb-3">
                "A true five-star boutique experience. From the luxury linens to the handcrafted breakfast, we will certainly be returning for our anniversary next year."
              </p>
              <div className="mt-auto fw-bold text-dark small">&mdash; Elena Rostova, London</div>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Call to Action Banner */}
      <div className="bg-primary text-white py-5">
        <Container className="py-4 text-center">
          <h2 className="display-5 fw-bold mb-3 text-white">Ready for an Unforgettable Getaway?</h2>
          <p className="lead text-light opacity-90 mb-4 mx-auto" style={{ maxWidth: '600px' }}>
            Book direct for the guaranteed best rates, complimentary breakfast, and flexible cancellation.
          </p>
          <Button 
            as={Link} 
            to="/rooms" 
            variant="warning" 
            size="lg" 
            className="px-5 py-3 rounded-pill fw-bold text-dark shadow-sm"
          >
            Reserve Your Room Today <ArrowRight size={18} className="ms-1" />
          </Button>
        </Container>
      </div>
    </div>
  );
};

export default Home;
