import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Spinner, Alert, Button, Form, InputGroup } from 'react-bootstrap';
import { Link, useSearchParams } from 'react-router-dom';
import { Users, DollarSign, Bed, Search, Filter, Sparkles, X, CheckCircle } from 'lucide-react';
import api from '../services/api';

const Rooms = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialType = searchParams.get('type') || 'all';
  const initialGuests = searchParams.get('guests') || 'all';

  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState(initialType);
  const [selectedGuests, setSelectedGuests] = useState(initialGuests);
  const [sortBy, setSortBy] = useState('recommended');

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        const { data } = await api.get('/rooms');
        setRooms(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch rooms from server');
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  // Update filter when query param changes
  useEffect(() => {
    const t = searchParams.get('type');
    const g = searchParams.get('guests');
    if (t) setSelectedType(t);
    if (g) setSelectedGuests(g);
  }, [searchParams]);

  // Unique room types from inventory
  const roomTypes = ['all', ...Array.from(new Set(rooms.map(r => r.roomType).filter(Boolean)))];

  // Filtering & Sorting logic
  let filteredRooms = rooms.filter(room => {
    const matchesSearch = 
      room.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      room.roomType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (room.description && room.description.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesType = selectedType === 'all' || room.roomType.toLowerCase() === selectedType.toLowerCase();

    const matchesGuests = selectedGuests === 'all' || room.capacity >= Number(selectedGuests);

    return matchesSearch && matchesType && matchesGuests;
  });

  if (sortBy === 'price-low') {
    filteredRooms.sort((a, b) => a.pricePerNight - b.pricePerNight);
  } else if (sortBy === 'price-high') {
    filteredRooms.sort((a, b) => b.pricePerNight - a.pricePerNight);
  } else if (sortBy === 'capacity') {
    filteredRooms.sort((a, b) => b.capacity - a.capacity);
  }

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedType('all');
    setSelectedGuests('all');
    setSortBy('recommended');
    setSearchParams({});
  };

  return (
    <Container className="py-5">
      {/* Header */}
      <div className="mb-4">
        <span className="badge bg-primary text-uppercase px-3 py-1 mb-2">Room Inventory</span>
        <h1 className="fw-bold text-primary mb-1">Available Rooms & Suites</h1>
        <p className="text-muted">Choose your desired accommodations from our handpicked catalog.</p>
      </div>

      {/* Filter and Search Bar Card */}
      <Card className="border-0 shadow-sm p-4 mb-4 rounded-4 bg-white">
        <Row className="g-3">
          {/* Keyword Search */}
          <Col lg={4} md={6}>
            <Form.Label className="small fw-bold text-secondary mb-1">Search by Keyword</Form.Label>
            <InputGroup>
              <InputGroup.Text className="bg-white border-end-0">
                <Search size={18} className="text-muted" />
              </InputGroup.Text>
              <Form.Control 
                type="text" 
                placeholder="Search room name or type..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border-start-0"
              />
            </InputGroup>
          </Col>

          {/* Room Type */}
          <Col lg={3} md={6} xs={6}>
            <Form.Label className="small fw-bold text-secondary mb-1">Room Type</Form.Label>
            <Form.Select 
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option value="all">All Room Types</option>
              {roomTypes.filter(t => t !== 'all').map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </Form.Select>
          </Col>

          {/* Min Capacity */}
          <Col lg={2} md={6} xs={6}>
            <Form.Label className="small fw-bold text-secondary mb-1">Minimum Guests</Form.Label>
            <Form.Select 
              value={selectedGuests}
              onChange={(e) => setSelectedGuests(e.target.value)}
            >
              <option value="all">Any Capacity</option>
              <option value="1">1+ Guest</option>
              <option value="2">2+ Guests</option>
              <option value="3">3+ Guests</option>
              <option value="4">4+ Guests</option>
            </Form.Select>
          </Col>

          {/* Sorting */}
          <Col lg={3} md={6}>
            <Form.Label className="small fw-bold text-secondary mb-1">Sort Results</Form.Label>
            <Form.Select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="recommended">Featured / Default</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="capacity">Capacity: High to Low</option>
            </Form.Select>
          </Col>
        </Row>

        {(searchTerm || selectedType !== 'all' || selectedGuests !== 'all') && (
          <div className="d-flex align-items-center justify-content-between mt-3 pt-3 border-top">
            <span className="small text-muted">
              Showing <strong>{filteredRooms.length}</strong> matching rooms
            </span>
            <Button 
              variant="link" 
              size="sm" 
              onClick={handleResetFilters} 
              className="text-danger p-0 text-decoration-none d-flex align-items-center gap-1"
            >
              <X size={14} /> Clear Active Filters
            </Button>
          </div>
        )}
      </Card>

      {/* Main Results */}
      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="text-muted mt-2">Loading available rooms...</p>
        </div>
      ) : error ? (
        <Alert variant="danger" className="shadow-sm">
          {error}
        </Alert>
      ) : filteredRooms.length === 0 ? (
        <Card className="border-0 shadow-sm p-5 text-center bg-white rounded-4">
          <Bed size={48} className="text-primary mx-auto mb-3 opacity-50" />
          <h4 className="fw-bold text-dark mb-2">No Rooms Match Your Criteria</h4>
          <p className="text-muted small mb-4" style={{ maxWidth: '400px', margin: '0 auto' }}>
            Try broadening your search keyword, selecting a different room type, or clearing active filters.
          </p>
          <div>
            <Button variant="primary" onClick={handleResetFilters} className="rounded-pill px-4">
              Reset Filters
            </Button>
          </div>
        </Card>
      ) : (
        <Row className="g-4">
          {filteredRooms.map(room => (
            <Col lg={4} md={6} key={room._id}>
              <Card className="h-100 border-0 shadow-sm rounded-4 overflow-hidden d-flex flex-column bg-white">
                <div style={{ height: '220px', backgroundColor: '#e2e8f0', position: 'relative' }}>
                  {room.images && room.images.length > 0 ? (
                    <img 
                      src={room.images[0]} 
                      alt={room.name} 
                      className="w-100 h-100 object-fit-cover" 
                    />
                  ) : (
                    <div className="w-100 h-100 d-flex align-items-center justify-content-center text-muted">
                      <Bed size={36} />
                    </div>
                  )}
                  <Badge 
                    bg={room.status === 'available' ? 'success' : 'secondary'} 
                    className="position-absolute top-0 end-0 m-3 px-3 py-2 rounded-pill shadow-sm text-uppercase"
                  >
                    {room.status}
                  </Badge>
                </div>

                <Card.Body className="p-4 d-flex flex-column flex-grow-1">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <Badge bg="primary-subtle" className="text-primary px-2 py-1">
                      {room.roomType}
                    </Badge>
                    <span className="small text-muted d-flex align-items-center gap-1">
                      <Users size={14} /> Up to {room.capacity} {room.capacity === 1 ? 'Guest' : 'Guests'}
                    </span>
                  </div>

                  <h5 className="fw-bold mb-2 text-dark">{room.name}</h5>

                  <p className="text-muted small flex-grow-1 mb-3">
                    {room.description && room.description.length > 100 
                      ? `${room.description.substring(0, 100)}...` 
                      : room.description}
                  </p>

                  {room.amenities && room.amenities.length > 0 && (
                    <div className="d-flex flex-wrap gap-1 mb-3">
                      {room.amenities.slice(0, 3).map((amenity, idx) => (
                        <span key={idx} className="badge bg-light text-secondary border small fw-normal">
                          {amenity}
                        </span>
                      ))}
                      {room.amenities.length > 3 && (
                        <span className="badge bg-light text-secondary border small fw-normal">
                          +{room.amenities.length - 3} more
                        </span>
                      )}
                    </div>
                  )}

                  <div className="d-flex justify-content-between align-items-center pt-3 border-top mt-auto">
                    <div>
                      <span className="fs-4 fw-bold text-primary">${room.pricePerNight}</span>
                      <span className="text-muted small"> / night</span>
                    </div>

                    <Button 
                      as={Link} 
                      to={`/rooms/${room._id}`} 
                      variant={room.status === 'available' ? 'primary' : 'secondary'} 
                      className="px-3 py-2 rounded-pill fw-semibold shadow-sm"
                      disabled={room.status !== 'available'}
                    >
                      {room.status === 'available' ? 'View & Reserve' : 'Unavailable'}
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default Rooms;
