import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Spinner, Alert, Button, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Users, DollarSign } from 'lucide-react';
import api from '../services/api';

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const { data } = await api.get('/rooms');
        setRooms(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch rooms');
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  const filteredRooms = rooms.filter(room => 
    room.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    room.roomType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container className="py-5">
      <h2 className="mb-4 fw-bold text-primary">Available Rooms</h2>
      
      <Form className="mb-4">
        <Form.Control 
          type="text" 
          placeholder="Search by room name or type..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Form>

      {loading ? (
        <div className="text-center py-5"><Spinner animation="border" variant="primary" /></div>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : filteredRooms.length === 0 ? (
        <Alert variant="info">No rooms found matching your criteria.</Alert>
      ) : (
        <Row>
          {filteredRooms.map(room => (
            <Col md={4} className="mb-4" key={room._id}>
              <Card className="h-100 shadow-sm border-0">
                <div style={{ height: '200px', backgroundColor: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {room.images && room.images.length > 0 ? (
                    <img src={room.images[0]} alt={room.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <span className="text-muted">No Image</span>
                  )}
                </div>
                <Card.Body className="d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <Card.Title className="fw-bold mb-0">{room.name}</Card.Title>
                    <Badge bg={room.status === 'available' ? 'success' : 'secondary'}>{room.status}</Badge>
                  </div>
                  <Badge bg="info" className="mb-3 align-self-start">{room.roomType}</Badge>
                  <Card.Text className="text-muted small flex-grow-1">
                    {room.description.length > 100 ? `${room.description.substring(0, 100)}...` : room.description}
                  </Card.Text>
                  
                  <div className="d-flex justify-content-between align-items-center mt-3 pt-3 border-top">
                    <div className="d-flex align-items-center text-primary fw-bold">
                      <DollarSign size={18} /> {room.pricePerNight} <span className="text-muted fw-normal ms-1">/ night</span>
                    </div>
                    <div className="d-flex align-items-center text-muted small">
                      <Users size={16} className="me-1" /> Up to {room.capacity}
                    </div>
                  </div>
                  
                  <Button 
                    as={Link} 
                    to={`/rooms/${room._id}`} 
                    variant="outline-primary" 
                    className="w-100 mt-3"
                    disabled={room.status !== 'available'}
                  >
                    View Details
                  </Button>
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
