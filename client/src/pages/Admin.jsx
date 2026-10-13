import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, Button, Modal, Form, Spinner, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { 
  Shield, 
  Plus, 
  Bed, 
  DollarSign, 
  Users, 
  CheckCircle, 
  AlertCircle, 
  Layers, 
  Sparkles, 
  Info,
  CalendarCheck,
  Eye
} from 'lucide-react';

const Admin = () => {
  const { user } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Add Room Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    roomType: 'Deluxe Suite',
    description: '',
    pricePerNight: '',
    capacity: 2,
    amenitiesInput: 'High-speed Wi-Fi, Air Conditioning, Smart TV, Luxury Linens',
    imagesInput: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
    status: 'available'
  });

  const fetchRooms = async () => {
    try {
      setLoading(true);
      setError('');
      const { data } = await api.get('/rooms');
      setRooms(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch rooms inventory');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddRoom = async (e) => {
    e.preventDefault();
    setAddError('');
    setAddLoading(true);

    try {
      // Parse comma-separated amenities and images
      const amenities = formData.amenitiesInput
        .split(',')
        .map(a => a.trim())
        .filter(Boolean);

      const images = formData.imagesInput
        .split(',')
        .map(img => img.trim())
        .filter(Boolean);

      const payload = {
        name: formData.name,
        roomType: formData.roomType,
        description: formData.description,
        pricePerNight: Number(formData.pricePerNight),
        capacity: Number(formData.capacity),
        amenities,
        images,
        status: formData.status
      };

      await api.post('/rooms', payload);
      setSuccessMsg(`Room "${formData.name}" was successfully added to the inventory!`);
      setShowAddModal(false);
      // Reset form
      setFormData({
        name: '',
        roomType: 'Deluxe Suite',
        description: '',
        pricePerNight: '',
        capacity: 2,
        amenitiesInput: 'High-speed Wi-Fi, Air Conditioning, Smart TV, Luxury Linens',
        imagesInput: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
        status: 'available'
      });
      await fetchRooms();
    } catch (err) {
      setAddError(err.response?.data?.message || 'Failed to create room. Please check inputs.');
    } finally {
      setAddLoading(false);
    }
  };

  const availableCount = rooms.filter(r => r.status === 'available').length;
  const maintenanceCount = rooms.filter(r => r.status === 'maintenance').length;

  return (
    <Container className="py-5">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <div className="d-flex align-items-center gap-2">
            <span className="badge bg-danger text-uppercase px-2 py-1">Administrator Control</span>
            <span className="text-muted small">Logged in as {user?.name}</span>
          </div>
          <h1 className="fw-bold text-primary mt-1 mb-0">Management Portal</h1>
        </div>

        <Button 
          variant="primary" 
          onClick={() => setShowAddModal(true)} 
          className="d-flex align-items-center gap-2 px-4 py-2 rounded-pill shadow-sm fw-semibold"
        >
          <Plus size={18} /> Add New Room
        </Button>
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

      {/* Metrics Row */}
      <Row className="g-3 mb-4">
        <Col md={4}>
          <Card className="border-0 shadow-sm p-3 bg-white">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <div className="text-muted small text-uppercase fw-semibold">Total Room Inventory</div>
                <h3 className="fw-bold text-primary mb-0 mt-1">{rooms.length}</h3>
              </div>
              <div className="bg-primary text-white p-3 rounded-circle d-flex align-items-center justify-content-center">
                <Bed size={24} />
              </div>
            </div>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="border-0 shadow-sm p-3 bg-white">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <div className="text-muted small text-uppercase fw-semibold">Available for Booking</div>
                <h3 className="fw-bold text-success mb-0 mt-1">{availableCount}</h3>
              </div>
              <div className="bg-success text-white p-3 rounded-circle d-flex align-items-center justify-content-center">
                <CheckCircle size={24} />
              </div>
            </div>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="border-0 shadow-sm p-3 bg-white">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <div className="text-muted small text-uppercase fw-semibold">Under Maintenance</div>
                <h3 className="fw-bold text-secondary mb-0 mt-1">{maintenanceCount}</h3>
              </div>
              <div className="bg-secondary text-white p-3 rounded-circle d-flex align-items-center justify-content-center">
                <Layers size={24} />
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Room Inventory Table */}
      <Card className="border-0 shadow-sm mb-5">
        <Card.Header className="bg-white py-3 border-bottom d-flex justify-content-between align-items-center">
          <h5 className="fw-bold mb-0 text-primary d-flex align-items-center gap-2">
            <Bed size={20} /> Current Rooms Inventory
          </h5>
          <span className="text-muted small">Live catalog from MongoDB</span>
        </Card.Header>

        <Card.Body className="p-0">
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <p className="text-muted mt-2 mb-0">Loading inventory...</p>
            </div>
          ) : rooms.length === 0 ? (
            <div className="text-center py-5">
              <p className="text-muted mb-3">No rooms currently defined in the database.</p>
              <Button variant="primary" size="sm" onClick={() => setShowAddModal(true)}>
                Add the First Room
              </Button>
            </div>
          ) : (
            <div className="table-responsive">
              <Table hover className="align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Room Name / Identifier</th>
                    <th>Type</th>
                    <th>Nightly Rate</th>
                    <th>Max Guests</th>
                    <th>Status</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rooms.map(room => (
                    <tr key={room._id}>
                      <td>
                        <div className="d-flex align-items-center gap-3">
                          {room.images && room.images.length > 0 ? (
                            <img 
                              src={room.images[0]} 
                              alt={room.name} 
                              className="rounded-2 object-fit-cover" 
                              style={{ width: 48, height: 48 }}
                            />
                          ) : (
                            <div className="bg-light rounded-2 d-flex align-items-center justify-content-center text-muted" style={{ width: 48, height: 48 }}>
                              <Bed size={20} />
                            </div>
                          )}
                          <div>
                            <div className="fw-bold text-dark">{room.name}</div>
                            <div className="text-muted small text-truncate" style={{ maxWidth: 220 }}>
                              {room.description}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <Badge bg="info" className="px-2 py-1">{room.roomType}</Badge>
                      </td>
                      <td>
                        <span className="fw-semibold text-primary">${room.pricePerNight}</span>
                        <span className="text-muted small"> / night</span>
                      </td>
                      <td>
                        <span className="d-flex align-items-center gap-1 text-muted">
                          <Users size={16} /> {room.capacity}
                        </span>
                      </td>
                      <td>
                        <Badge bg={room.status === 'available' ? 'success' : 'secondary'}>
                          {room.status}
                        </Badge>
                      </td>
                      <td className="text-end">
                        <Button 
                          as={Link} 
                          to={`/rooms/${room._id}`} 
                          variant="outline-secondary" 
                          size="sm"
                          className="d-inline-flex align-items-center gap-1"
                        >
                          <Eye size={14} /> View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Backend API Capabilities Notice */}
      <Card className="border-0 shadow-sm bg-light-subtle">
        <Card.Body className="p-4">
          <div className="d-flex align-items-start gap-3">
            <Info size={24} className="text-primary mt-1 flex-shrink-0" />
            <div>
              <h5 className="fw-bold text-dark mb-1">Backend Integration Note</h5>
              <p className="text-secondary small mb-2">
                The current Express backend exposes room creation (<code>POST /api/rooms</code>) and room listing (<code>GET /api/rooms</code>) for administrators.
              </p>
              <p className="text-secondary small mb-0">
                Global booking administration across all guests (<code>GET /api/bookings/all</code>) is not yet exposed by the current backend contract. Guests can view and cancel their own individual reservations via the authenticated <strong>Guest Dashboard</strong>.
              </p>
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Add Room Modal */}
      <Modal show={showAddModal} onHide={() => !addLoading && setShowAddModal(false)} size="lg" centered>
        <Modal.Header closeButton={!addLoading}>
          <Modal.Title className="fw-bold text-primary d-flex align-items-center gap-2">
            <Plus size={22} /> Add New Hotel Room
          </Modal.Title>
        </Modal.Header>

        <Form onSubmit={handleAddRoom}>
          <Modal.Body className="p-4">
            {addError && <Alert variant="danger" className="mb-3">{addError}</Alert>}

            <Row className="g-3">
              <Col md={8}>
                <Form.Group controlId="name">
                  <Form.Label className="fw-semibold">Room Name or Number <span className="text-danger">*</span></Form.Label>
                  <Form.Control 
                    type="text" 
                    name="name" 
                    placeholder="e.g., Oceanfront Penthouse Suite 401" 
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group controlId="roomType">
                  <Form.Label className="fw-semibold">Room Type <span className="text-danger">*</span></Form.Label>
                  <Form.Select 
                    name="roomType" 
                    value={formData.roomType}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="Deluxe Suite">Deluxe Suite</option>
                    <option value="Executive Suite">Executive Suite</option>
                    <option value="Ocean Villa">Ocean Villa</option>
                    <option value="Single Room">Single Room</option>
                    <option value="Standard Room">Standard Room</option>
                    <option value="Family Suite">Family Suite</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={12}>
                <Form.Group controlId="description">
                  <Form.Label className="fw-semibold">Description <span className="text-danger">*</span></Form.Label>
                  <Form.Control 
                    as="textarea" 
                    rows={3} 
                    name="description" 
                    placeholder="Provide a detailed description of the room, views, furnishings, and features..." 
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group controlId="pricePerNight">
                  <Form.Label className="fw-semibold">Nightly Rate ($) <span className="text-danger">*</span></Form.Label>
                  <Form.Control 
                    type="number" 
                    min="0"
                    step="1"
                    name="pricePerNight" 
                    placeholder="250" 
                    value={formData.pricePerNight}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group controlId="capacity">
                  <Form.Label className="fw-semibold">Max Guests <span className="text-danger">*</span></Form.Label>
                  <Form.Control 
                    type="number" 
                    min="1"
                    max="10"
                    name="capacity" 
                    value={formData.capacity}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group controlId="status">
                  <Form.Label className="fw-semibold">Operational Status</Form.Label>
                  <Form.Select 
                    name="status" 
                    value={formData.status}
                    onChange={handleInputChange}
                  >
                    <option value="available">Available</option>
                    <option value="maintenance">Maintenance</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={12}>
                <Form.Group controlId="amenitiesInput">
                  <Form.Label className="fw-semibold">Amenities (Comma-separated)</Form.Label>
                  <Form.Control 
                    type="text" 
                    name="amenitiesInput" 
                    placeholder="Wi-Fi, Air Conditioning, Balcony, Minibar" 
                    value={formData.amenitiesInput}
                    onChange={handleInputChange}
                  />
                  <Form.Text className="text-muted">Separate multiple amenities with commas.</Form.Text>
                </Form.Group>
              </Col>

              <Col md={12}>
                <Form.Group controlId="imagesInput">
                  <Form.Label className="fw-semibold">Image URLs (Comma-separated)</Form.Label>
                  <Form.Control 
                    type="text" 
                    name="imagesInput" 
                    placeholder="https://example.com/room1.jpg, https://example.com/room2.jpg" 
                    value={formData.imagesInput}
                    onChange={handleInputChange}
                  />
                  <Form.Text className="text-muted">Direct image URLs for room gallery.</Form.Text>
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowAddModal(false)} disabled={addLoading}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={addLoading} className="fw-semibold">
              {addLoading ? <Spinner size="sm" animation="border" className="me-2" /> : null}
              Save Room to Inventory
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default Admin;
