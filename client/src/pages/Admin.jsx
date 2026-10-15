import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Table, 
  Badge, 
  Button, 
  Modal, 
  Form, 
  Spinner, 
  Alert, 
  Nav,
  InputGroup
} from 'react-bootstrap';
import { Link, useParams, useNavigate } from 'react-router-dom';
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
  CalendarCheck, 
  CalendarDays,
  Calendar,
  Eye,
  Search,
  Filter,
  RefreshCw,
  Edit,
  Trash2,
  XCircle,
  Clock,
  Mail,
  Phone,
  UserCheck,
  Check,
  X,
  ExternalLink,
  Sparkles,
  Image as ImageIcon
} from 'lucide-react';

const Admin = () => {
  const { user } = useAuth();
  const { tab: urlTab } = useParams();
  const navigate = useNavigate();

  // Active navigation tab: 'bookings' | 'rooms' | 'add-room' | 'users'
  const validTabs = ['bookings', 'rooms', 'add-room', 'users'];
  const activeTab = validTabs.includes(urlTab) ? urlTab : 'bookings';

  const handleTabChange = (selectedTab) => {
    navigate(`/admin/${selectedTab}`);
  };

  // Global State
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [usersList, setUsersList] = useState([]);

  // Loading States
  const [roomsLoading, setRoomsLoading] = useState(false);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [usersLoading, setUsersLoading] = useState(false);

  // Error & Success Feedback
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // ----------------------------------------------------
  // DATA FETCHING
  // ----------------------------------------------------
  const fetchRooms = async () => {
    try {
      setRoomsLoading(true);
      const { data } = await api.get('/rooms');
      setRooms(data);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to load rooms inventory');
    } finally {
      setRoomsLoading(false);
    }
  };

  const fetchBookings = async () => {
    try {
      setBookingsLoading(true);
      const { data } = await api.get('/bookings');
      setBookings(data);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to load reservations list');
    } finally {
      setBookingsLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      setUsersLoading(true);
      const { data } = await api.get('/users');
      setUsersList(data);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to load users list');
    } finally {
      setUsersLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
    fetchBookings();
    fetchUsers();
  }, []);

  // ----------------------------------------------------
  // BOOKINGS SECTION STATE & HANDLERS
  // ----------------------------------------------------
  const [bookingSearch, setBookingSearch] = useState('');
  const [bookingStatusFilter, setBookingStatusFilter] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [statusUpdating, setStatusUpdating] = useState(false);

  const handleOpenStatusModal = (booking, targetStatus) => {
    setSelectedBooking(booking);
    setNewStatus(targetStatus);
    setShowStatusModal(true);
  };

  const handleUpdateBookingStatus = async () => {
    if (!selectedBooking || !newStatus) return;
    try {
      setStatusUpdating(true);
      await api.put(`/bookings/${selectedBooking._id}/status`, {
        bookingStatus: newStatus
      });
      setSuccessMsg(`Reservation ${selectedBooking.bookingReference} status updated to ${newStatus}.`);
      setShowStatusModal(false);
      setSelectedBooking(null);
      await fetchBookings();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to update booking status');
    } finally {
      setStatusUpdating(false);
    }
  };

  const filteredBookings = bookings.filter(b => {
    const matchesSearch = 
      (b.bookingReference && b.bookingReference.toLowerCase().includes(bookingSearch.toLowerCase())) ||
      (b.user?.name && b.user.name.toLowerCase().includes(bookingSearch.toLowerCase())) ||
      (b.user?.email && b.user.email.toLowerCase().includes(bookingSearch.toLowerCase())) ||
      (b.room?.name && b.room.name.toLowerCase().includes(bookingSearch.toLowerCase()));

    const statusVal = b.bookingStatus || b.status || 'pending';
    const matchesStatus = bookingStatusFilter === 'all' || statusVal === bookingStatusFilter;

    return matchesSearch && matchesStatus;
  });

  // ----------------------------------------------------
  // ROOMS SECTION STATE & HANDLERS
  // ----------------------------------------------------
  const [roomSearch, setRoomSearch] = useState('');
  const [roomTypeFilter, setRoomTypeFilter] = useState('all');
  const [editRoom, setEditRoom] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: '',
    roomType: '',
    description: '',
    pricePerNight: '',
    capacity: 2,
    status: 'available',
    amenitiesInput: '',
    imagesInput: ''
  });

  const handleOpenEditRoom = (room) => {
    setEditRoom(room);
    setEditFormData({
      name: room.name || '',
      roomType: room.roomType || 'Deluxe Suite',
      description: room.description || '',
      pricePerNight: room.pricePerNight || room.rentPerDay || 0,
      capacity: room.capacity || room.maxCount || 2,
      status: room.status || 'available',
      amenitiesInput: (room.amenities || []).join(', '),
      imagesInput: (room.images || room.photos || []).join(', ')
    });
    setShowEditModal(true);
  };

  const handleSaveEditRoom = async (e) => {
    e.preventDefault();
    if (!editRoom) return;

    try {
      setEditLoading(true);
      const amenities = editFormData.amenitiesInput
        .split(',')
        .map(a => a.trim())
        .filter(Boolean);

      const images = editFormData.imagesInput
        .split(',')
        .map(img => img.trim())
        .filter(Boolean);

      const payload = {
        name: editFormData.name,
        roomType: editFormData.roomType,
        description: editFormData.description,
        pricePerNight: Number(editFormData.pricePerNight),
        capacity: Number(editFormData.capacity),
        status: editFormData.status,
        amenities,
        images
      };

      await api.put(`/rooms/${editRoom._id}`, payload);
      setSuccessMsg(`Room "${editFormData.name}" updated successfully.`);
      setShowEditModal(false);
      setEditRoom(null);
      await fetchRooms();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to update room');
    } finally {
      setEditLoading(false);
    }
  };

  const handleToggleRoomStatus = async (room) => {
    const nextStatus = room.status === 'available' ? 'maintenance' : 'available';
    try {
      await api.put(`/rooms/${room._id}`, { status: nextStatus });
      setSuccessMsg(`Room "${room.name}" status changed to ${nextStatus}.`);
      await fetchRooms();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to toggle room status');
    }
  };

  const filteredRooms = rooms.filter(r => {
    const matchesSearch = 
      r.name.toLowerCase().includes(roomSearch.toLowerCase()) ||
      r.roomType.toLowerCase().includes(roomSearch.toLowerCase()) ||
      (r.description && r.description.toLowerCase().includes(roomSearch.toLowerCase()));

    const matchesType = roomTypeFilter === 'all' || r.roomType.toLowerCase() === roomTypeFilter.toLowerCase();
    return matchesSearch && matchesType;
  });

  const availableRoomTypes = ['all', ...Array.from(new Set(rooms.map(r => r.roomType).filter(Boolean)))];

  // ----------------------------------------------------
  // ADD ROOM SECTION STATE & HANDLERS
  // ----------------------------------------------------
  const [addFormData, setAddFormData] = useState({
    name: '',
    roomType: 'Deluxe Suite',
    description: '',
    pricePerNight: '',
    capacity: 2,
    status: 'available',
    amenitiesInput: 'High-speed Wi-Fi, Air Conditioning, Smart TV, Premium Linens, In-Room Safe',
    imagesInput: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80'
  });
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState('');

  const handleAddInputChange = (e) => {
    const { name, value } = e.target;
    setAddFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddRoomSubmit = async (e) => {
    e.preventDefault();
    setAddError('');

    if (Number(addFormData.pricePerNight) < 0) {
      return setAddError('Nightly rate must be a non-negative number.');
    }
    if (Number(addFormData.capacity) < 1) {
      return setAddError('Room capacity must be at least 1 guest.');
    }

    try {
      setAddLoading(true);
      const amenities = addFormData.amenitiesInput
        .split(',')
        .map(a => a.trim())
        .filter(Boolean);

      const images = addFormData.imagesInput
        .split(',')
        .map(img => img.trim())
        .filter(Boolean);

      const payload = {
        name: addFormData.name,
        roomType: addFormData.roomType,
        description: addFormData.description,
        pricePerNight: Number(addFormData.pricePerNight),
        capacity: Number(addFormData.capacity),
        status: addFormData.status,
        amenities,
        images
      };

      await api.post('/rooms', payload);
      setSuccessMsg(`Room "${addFormData.name}" was successfully added to inventory!`);
      // Reset form
      setAddFormData({
        name: '',
        roomType: 'Deluxe Suite',
        description: '',
        pricePerNight: '',
        capacity: 2,
        status: 'available',
        amenitiesInput: 'High-speed Wi-Fi, Air Conditioning, Smart TV, Premium Linens, In-Room Safe',
        imagesInput: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80'
      });
      await fetchRooms();
      // Switch tab to all rooms
      navigate('/admin/rooms');
    } catch (err) {
      setAddError(err.response?.data?.message || 'Failed to create room. Please verify inputs.');
    } finally {
      setAddLoading(false);
    }
  };

  // ----------------------------------------------------
  // USERS SECTION STATE & HANDLERS
  // ----------------------------------------------------
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('all');

  const filteredUsers = usersList.filter(u => {
    const matchesSearch = 
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      (u.phone && u.phone.includes(userSearch));

    const matchesRole = userRoleFilter === 'all' || u.role === userRoleFilter;
    return matchesSearch && matchesRole;
  });

  // Global Metric Counts
  const availableCount = rooms.filter(r => r.status === 'available').length;
  const confirmedBookingsCount = bookings.filter(b => (b.bookingStatus || b.status) === 'confirmed').length;
  const pendingBookingsCount = bookings.filter(b => (b.bookingStatus || b.status) === 'pending').length;

  return (
    <Container className="py-5">
      {/* Admin Portal Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <div className="d-flex align-items-center gap-2">
            <span className="badge bg-danger text-uppercase px-2 py-1">Administrator Portal</span>
            <span className="text-muted small">Logged in as <strong>{user?.name}</strong></span>
          </div>
          <h1 className="fw-bold text-primary mt-1 mb-0">Management Portal</h1>
        </div>

        <div className="d-flex gap-2">
          <Button 
            variant="outline-primary" 
            onClick={() => { fetchRooms(); fetchBookings(); fetchUsers(); }} 
            className="d-flex align-items-center gap-2 px-3 py-2 rounded-pill shadow-sm"
          >
            <RefreshCw size={16} /> Refresh Data
          </Button>
          <Button 
            variant="primary" 
            onClick={() => handleTabChange('add-room')} 
            className="d-flex align-items-center gap-2 px-4 py-2 rounded-pill shadow-sm fw-semibold"
          >
            <Plus size={18} /> Add New Room
          </Button>
        </div>
      </div>

      {/* Global Alerts */}
      {successMsg && (
        <Alert variant="success" dismissible onClose={() => setSuccessMsg('')} className="shadow-sm mb-4">
          <CheckCircle size={18} className="me-2" />
          {successMsg}
        </Alert>
      )}

      {errorMsg && (
        <Alert variant="danger" dismissible onClose={() => setErrorMsg('')} className="shadow-sm mb-4">
          <AlertCircle size={18} className="me-2" />
          {errorMsg}
        </Alert>
      )}

      {/* Overview Metric Cards */}
      <Row className="g-3 mb-4">
        <Col lg={3} sm={6}>
          <Card className="border-0 shadow-sm p-3 bg-white h-100">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <div className="text-muted small text-uppercase fw-semibold">Total Reservations</div>
                <h3 className="fw-bold text-primary mb-0 mt-1">{bookings.length}</h3>
                <div className="small text-muted mt-1">{confirmedBookingsCount} Confirmed, {pendingBookingsCount} Pending</div>
              </div>
              <div className="bg-primary text-white p-3 rounded-circle d-flex align-items-center justify-content-center">
                <CalendarCheck size={24} />
              </div>
            </div>
          </Card>
        </Col>

        <Col lg={3} sm={6}>
          <Card className="border-0 shadow-sm p-3 bg-white h-100">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <div className="text-muted small text-uppercase fw-semibold">Total Inventory</div>
                <h3 className="fw-bold text-primary mb-0 mt-1">{rooms.length}</h3>
                <div className="small text-muted mt-1">{availableCount} Available for Guests</div>
              </div>
              <div className="bg-success text-white p-3 rounded-circle d-flex align-items-center justify-content-center">
                <Bed size={24} />
              </div>
            </div>
          </Card>
        </Col>

        <Col lg={3} sm={6}>
          <Card className="border-0 shadow-sm p-3 bg-white h-100">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <div className="text-muted small text-uppercase fw-semibold">Under Maintenance</div>
                <h3 className="fw-bold text-secondary mb-0 mt-1">{rooms.length - availableCount}</h3>
                <div className="small text-muted mt-1">Service & Housekeeping</div>
              </div>
              <div className="bg-secondary text-white p-3 rounded-circle d-flex align-items-center justify-content-center">
                <Layers size={24} />
              </div>
            </div>
          </Card>
        </Col>

        <Col lg={3} sm={6}>
          <Card className="border-0 shadow-sm p-3 bg-white h-100">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <div className="text-muted small text-uppercase fw-semibold">Registered Users</div>
                <h3 className="fw-bold text-dark mb-0 mt-1">{usersList.length}</h3>
                <div className="small text-muted mt-1">Guests & Staff Accounts</div>
              </div>
              <div className="bg-info text-white p-3 rounded-circle d-flex align-items-center justify-content-center">
                <Users size={24} />
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Admin Navigation Pills */}
      <Nav variant="pills" className="bg-white p-2 rounded-4 shadow-sm mb-4 border d-flex gap-2">
        <Nav.Item>
          <Nav.Link 
            active={activeTab === 'bookings'} 
            onClick={() => handleTabChange('bookings')}
            className="d-flex align-items-center gap-2 px-4 py-2 rounded-pill fw-semibold cursor-pointer"
          >
            <CalendarCheck size={18} /> All Bookings 
            <Badge bg={activeTab === 'bookings' ? 'light' : 'primary'} text={activeTab === 'bookings' ? 'primary' : 'light'} className="rounded-pill">
              {bookings.length}
            </Badge>
          </Nav.Link>
        </Nav.Item>

        <Nav.Item>
          <Nav.Link 
            active={activeTab === 'rooms'} 
            onClick={() => handleTabChange('rooms')}
            className="d-flex align-items-center gap-2 px-4 py-2 rounded-pill fw-semibold cursor-pointer"
          >
            <Bed size={18} /> All Rooms
            <Badge bg={activeTab === 'rooms' ? 'light' : 'primary'} text={activeTab === 'rooms' ? 'primary' : 'light'} className="rounded-pill">
              {rooms.length}
            </Badge>
          </Nav.Link>
        </Nav.Item>

        <Nav.Item>
          <Nav.Link 
            active={activeTab === 'add-room'} 
            onClick={() => handleTabChange('add-room')}
            className="d-flex align-items-center gap-2 px-4 py-2 rounded-pill fw-semibold cursor-pointer"
          >
            <Plus size={18} /> Add Room
          </Nav.Link>
        </Nav.Item>

        <Nav.Item>
          <Nav.Link 
            active={activeTab === 'users'} 
            onClick={() => handleTabChange('users')}
            className="d-flex align-items-center gap-2 px-4 py-2 rounded-pill fw-semibold cursor-pointer"
          >
            <Users size={18} /> All Users
            <Badge bg={activeTab === 'users' ? 'light' : 'primary'} text={activeTab === 'users' ? 'primary' : 'light'} className="rounded-pill">
              {usersList.length}
            </Badge>
          </Nav.Link>
        </Nav.Item>
      </Nav>

      {/* ==================================================== */}
      {/* SECTION 1: ALL BOOKINGS                              */}
      {/* ==================================================== */}
      {activeTab === 'bookings' && (
        <Card className="border-0 shadow-sm">
          <Card.Header className="bg-white py-3 border-bottom d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
            <div>
              <h5 className="fw-bold mb-0 text-primary d-flex align-items-center gap-2">
                <CalendarCheck size={20} /> Guest Reservations Management
              </h5>
              <span className="text-muted small">Live customer bookings from MongoDB Atlas</span>
            </div>

            {/* Filter & Search Bar */}
            <div className="d-flex flex-wrap gap-2">
              <InputGroup style={{ maxWidth: '260px' }}>
                <InputGroup.Text className="bg-light border-end-0">
                  <Search size={14} className="text-muted" />
                </InputGroup.Text>
                <Form.Control 
                  placeholder="Search ref, guest, room..." 
                  value={bookingSearch}
                  onChange={(e) => setBookingSearch(e.target.value)}
                  className="border-start-0"
                />
              </InputGroup>

              <Form.Select 
                value={bookingStatusFilter} 
                onChange={(e) => setBookingStatusFilter(e.target.value)}
                style={{ width: '150px' }}
              >
                <option value="all">All Statuses</option>
                <option value="confirmed">Confirmed</option>
                <option value="pending">Pending</option>
                <option value="cancelled">Cancelled</option>
              </Form.Select>
            </div>
          </Card.Header>

          <Card.Body className="p-0">
            {bookingsLoading ? (
              <div className="text-center py-5">
                <Spinner animation="border" variant="primary" />
                <p className="text-muted mt-2 mb-0">Loading reservations...</p>
              </div>
            ) : filteredBookings.length === 0 ? (
              <div className="text-center py-5">
                <CalendarDays size={48} className="text-muted mb-2" />
                <p className="text-muted mb-0">No reservations match the specified filter criteria.</p>
              </div>
            ) : (
              <div className="table-responsive">
                <Table hover className="align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Booking Ref</th>
                      <th>Guest Details</th>
                      <th>Room</th>
                      <th>Stay Schedule</th>
                      <th>Guests & Nights</th>
                      <th>Total Amount</th>
                      <th>Booking Status</th>
                      <th>Payment</th>
                      <th className="text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBookings.map(b => {
                      const statusVal = b.bookingStatus || b.status || 'pending';
                      const isCancelled = statusVal === 'cancelled';
                      const isConfirmed = statusVal === 'confirmed';

                      return (
                        <tr key={b._id}>
                          <td>
                            <strong className="font-monospace text-primary">{b.bookingReference}</strong>
                            <div className="small text-muted">
                              {new Date(b.createdAt).toLocaleDateString()}
                            </div>
                          </td>
                          <td>
                            <div className="fw-bold text-dark">{b.user?.name || b.guestName || b.customerName || 'Registered Guest'}</div>
                            <div className="small text-muted d-flex align-items-center gap-1">
                              <Mail size={12} /> {b.user?.email || b.email || 'N/A'}
                            </div>
                            {(b.user?.phone || b.phone) && (
                              <div className="small text-muted d-flex align-items-center gap-1">
                                <Phone size={12} /> {b.user?.phone || b.phone}
                              </div>
                            )}
                          </td>
                          <td>
                            <div className="fw-semibold text-dark">{b.room?.name || 'Standard Room'}</div>
                            <Badge bg="secondary-subtle" className="text-secondary small">
                              {b.room?.roomType || 'Accommodation'}
                            </Badge>
                          </td>
                          <td>
                            <div className="small fw-semibold text-dark">
                              {new Date(b.checkInDate).toLocaleDateString()}
                            </div>
                            <div className="small text-muted">
                              to {new Date(b.checkOutDate).toLocaleDateString()}
                            </div>
                          </td>
                          <td>
                            <div className="small text-dark fw-medium">
                              {b.numberOfNights || b.totalDays || 1} {(b.numberOfNights === 1) ? 'Night' : 'Nights'}
                            </div>
                            <div className="small text-muted">
                              {b.guestCount || 1} {(b.guestCount === 1) ? 'Guest' : 'Guests'}
                            </div>
                          </td>
                          <td>
                            <span className="fw-bold text-primary fs-6">${b.totalAmount || b.amount}</span>
                          </td>
                          <td>
                            <Badge bg={
                              isConfirmed ? 'success' :
                              isCancelled ? 'danger' : 'warning'
                            } className="text-capitalize px-2 py-1">
                              {statusVal}
                            </Badge>
                          </td>
                          <td>
                            <Badge bg={
                              b.paymentStatus === 'paid' ? 'success' :
                              b.paymentStatus === 'refunded' ? 'info' :
                              b.paymentStatus === 'failed' ? 'danger' : 'secondary'
                            } className="text-capitalize px-2 py-1">
                              {b.paymentStatus || 'pending'}
                            </Badge>
                          </td>
                          <td className="text-end">
                            <div className="d-flex justify-content-end gap-1">
                              {!isConfirmed && !isCancelled && (
                                <Button 
                                  variant="outline-success" 
                                  size="sm"
                                  onClick={() => handleOpenStatusModal(b, 'confirmed')}
                                  title="Confirm Reservation"
                                  className="d-flex align-items-center gap-1"
                                >
                                  <Check size={14} /> Confirm
                                </Button>
                              )}
                              {!isCancelled && (
                                <Button 
                                  variant="outline-danger" 
                                  size="sm"
                                  onClick={() => handleOpenStatusModal(b, 'cancelled')}
                                  title="Cancel Reservation"
                                  className="d-flex align-items-center gap-1"
                                >
                                  <X size={14} /> Cancel
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </div>
            )}
          </Card.Body>
        </Card>
      )}

      {/* ==================================================== */}
      {/* SECTION 2: ALL ROOMS                                 */}
      {/* ==================================================== */}
      {activeTab === 'rooms' && (
        <Card className="border-0 shadow-sm">
          <Card.Header className="bg-white py-3 border-bottom d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
            <div>
              <h5 className="fw-bold mb-0 text-primary d-flex align-items-center gap-2">
                <Bed size={20} /> Current Rooms Catalog
              </h5>
              <span className="text-muted small">Manage hotel rooms, prices, availability, and capacity</span>
            </div>

            <div className="d-flex flex-wrap gap-2">
              <InputGroup style={{ maxWidth: '240px' }}>
                <InputGroup.Text className="bg-light border-end-0">
                  <Search size={14} className="text-muted" />
                </InputGroup.Text>
                <Form.Control 
                  placeholder="Search room name or type..." 
                  value={roomSearch}
                  onChange={(e) => setRoomSearch(e.target.value)}
                  className="border-start-0"
                />
              </InputGroup>

              <Form.Select 
                value={roomTypeFilter} 
                onChange={(e) => setRoomTypeFilter(e.target.value)}
                style={{ width: '160px' }}
              >
                {availableRoomTypes.map(t => (
                  <option key={t} value={t}>
                    {t === 'all' ? 'All Room Types' : t}
                  </option>
                ))}
              </Form.Select>
            </div>
          </Card.Header>

          <Card.Body className="p-0">
            {roomsLoading ? (
              <div className="text-center py-5">
                <Spinner animation="border" variant="primary" />
                <p className="text-muted mt-2 mb-0">Loading inventory...</p>
              </div>
            ) : filteredRooms.length === 0 ? (
              <div className="text-center py-5">
                <p className="text-muted mb-3">No rooms match your search query.</p>
                <Button variant="primary" size="sm" onClick={() => handleTabChange('add-room')}>
                  Add New Room
                </Button>
              </div>
            ) : (
              <div className="table-responsive">
                <Table hover className="align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Room & Photo</th>
                      <th>Room Type</th>
                      <th>Nightly Rate</th>
                      <th>Capacity</th>
                      <th>Availability</th>
                      <th>Amenities</th>
                      <th className="text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRooms.map(room => (
                      <tr key={room._id}>
                        <td>
                          <div className="d-flex align-items-center gap-3">
                            {room.images && room.images.length > 0 ? (
                              <img 
                                src={room.images[0]} 
                                alt={room.name} 
                                className="rounded-3 object-fit-cover shadow-sm" 
                                style={{ width: 56, height: 56 }}
                              />
                            ) : (
                              <div className="bg-light rounded-3 d-flex align-items-center justify-content-center text-muted" style={{ width: 56, height: 56 }}>
                                <Bed size={22} />
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
                          <Badge bg="primary-subtle" className="text-primary px-2 py-1 fw-medium">
                            {room.roomType}
                          </Badge>
                        </td>
                        <td>
                          <span className="fw-bold text-primary fs-6">${room.pricePerNight}</span>
                          <span className="text-muted small"> / night</span>
                        </td>
                        <td>
                          <span className="d-flex align-items-center gap-1 text-dark small fw-medium">
                            <Users size={15} className="text-muted" /> Up to {room.capacity}
                          </span>
                        </td>
                        <td>
                          <Badge 
                            bg={room.status === 'available' ? 'success' : 'secondary'}
                            className="cursor-pointer text-capitalize"
                            onClick={() => handleToggleRoomStatus(room)}
                            title="Click to toggle status"
                            style={{ cursor: 'pointer' }}
                          >
                            {room.status}
                          </Badge>
                        </td>
                        <td>
                          <div className="small text-muted text-truncate" style={{ maxWidth: '180px' }}>
                            {(room.amenities || []).slice(0, 3).join(', ')}
                            {(room.amenities || []).length > 3 && ` +${room.amenities.length - 3}`}
                          </div>
                        </td>
                        <td className="text-end">
                          <div className="d-flex justify-content-end gap-1">
                            <Button 
                              variant="outline-primary" 
                              size="sm"
                              onClick={() => handleOpenEditRoom(room)}
                              className="d-flex align-items-center gap-1"
                              title="Edit Room"
                            >
                              <Edit size={14} /> Edit
                            </Button>
                            <Button 
                              as={Link} 
                              to={`/rooms/${room._id}`} 
                              variant="outline-secondary" 
                              size="sm"
                              className="d-flex align-items-center gap-1"
                              title="View Public Page"
                            >
                              <Eye size={14} />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            )}
          </Card.Body>
        </Card>
      )}

      {/* ==================================================== */}
      {/* SECTION 3: ADD ROOM                                  */}
      {/* ==================================================== */}
      {activeTab === 'add-room' && (
        <Card className="border-0 shadow-sm">
          <Card.Header className="bg-white py-3 border-bottom">
            <h5 className="fw-bold mb-0 text-primary d-flex align-items-center gap-2">
              <Plus size={20} /> Add New Room to Inventory
            </h5>
            <span className="text-muted small">Create a new hotel room listing conforming to the Room schema</span>
          </Card.Header>

          <Card.Body className="p-4">
            {addError && <Alert variant="danger" className="mb-4">{addError}</Alert>}

            <Form onSubmit={handleAddRoomSubmit}>
              <Row className="g-3">
                <Col md={8}>
                  <Form.Group controlId="addName">
                    <Form.Label className="fw-semibold">Room Name or Identifier <span className="text-danger">*</span></Form.Label>
                    <Form.Control 
                      type="text" 
                      name="name" 
                      placeholder="e.g., Royal Oceanfront Penthouse 501" 
                      value={addFormData.name}
                      onChange={handleAddInputChange}
                      required
                    />
                    <Form.Text className="text-muted">Unique descriptive name or room number.</Form.Text>
                  </Form.Group>
                </Col>

                <Col md={4}>
                  <Form.Group controlId="addRoomType">
                    <Form.Label className="fw-semibold">Room Type <span className="text-danger">*</span></Form.Label>
                    <Form.Select 
                      name="roomType" 
                      value={addFormData.roomType}
                      onChange={handleAddInputChange}
                      required
                    >
                      <option value="Deluxe Suite">Deluxe Suite</option>
                      <option value="Executive Suite">Executive Suite</option>
                      <option value="Ocean Villa">Ocean Villa</option>
                      <option value="Single Room">Single Room</option>
                      <option value="Standard Room">Standard Room</option>
                      <option value="Family Suite">Family Suite</option>
                      <option value="Presidential Suite">Presidential Suite</option>
                    </Form.Select>
                  </Form.Group>
                </Col>

                <Col md={12}>
                  <Form.Group controlId="addDescription">
                    <Form.Label className="fw-semibold">Room Description <span className="text-danger">*</span></Form.Label>
                    <Form.Control 
                      as="textarea" 
                      rows={4} 
                      name="description" 
                      placeholder="Enter a rich, engaging description highlighting the views, bed dimensions, living space, furnishings, and unique highlights..." 
                      value={addFormData.description}
                      onChange={handleAddInputChange}
                      required
                    />
                  </Form.Group>
                </Col>

                <Col md={4}>
                  <Form.Group controlId="addPrice">
                    <Form.Label className="fw-semibold">Nightly Rate ($) <span className="text-danger">*</span></Form.Label>
                    <Form.Control 
                      type="number" 
                      min="0"
                      step="1"
                      name="pricePerNight" 
                      placeholder="e.g. 299" 
                      value={addFormData.pricePerNight}
                      onChange={handleAddInputChange}
                      required
                    />
                  </Form.Group>
                </Col>

                <Col md={4}>
                  <Form.Group controlId="addCapacity">
                    <Form.Label className="fw-semibold">Max Guests / Capacity <span className="text-danger">*</span></Form.Label>
                    <Form.Control 
                      type="number" 
                      min="1"
                      max="12"
                      name="capacity" 
                      value={addFormData.capacity}
                      onChange={handleAddInputChange}
                      required
                    />
                  </Form.Group>
                </Col>

                <Col md={4}>
                  <Form.Group controlId="addStatus">
                    <Form.Label className="fw-semibold">Initial Status</Form.Label>
                    <Form.Select 
                      name="status" 
                      value={addFormData.status}
                      onChange={handleAddInputChange}
                    >
                      <option value="available">Available for Booking</option>
                      <option value="maintenance">Under Maintenance</option>
                    </Form.Select>
                  </Form.Group>
                </Col>

                <Col md={12}>
                  <Form.Group controlId="addAmenities">
                    <Form.Label className="fw-semibold">Amenities (Comma-separated)</Form.Label>
                    <Form.Control 
                      type="text" 
                      name="amenitiesInput" 
                      placeholder="Wi-Fi, Ocean View, King Bed, Smart TV, Minibar, Soaking Tub" 
                      value={addFormData.amenitiesInput}
                      onChange={handleAddInputChange}
                    />
                    <Form.Text className="text-muted">Enter hotel amenities separated by commas.</Form.Text>
                  </Form.Group>
                </Col>

                <Col md={12}>
                  <Form.Group controlId="addImages">
                    <Form.Label className="fw-semibold">Gallery Image URLs (Comma-separated) <span className="text-danger">*</span></Form.Label>
                    <Form.Control 
                      type="text" 
                      name="imagesInput" 
                      placeholder="https://images.unsplash.com/..., https://images.unsplash.com/..." 
                      value={addFormData.imagesInput}
                      onChange={handleAddInputChange}
                      required
                    />
                    <Form.Text className="text-muted">Direct HTTP/HTTPS URLs for room photography.</Form.Text>
                  </Form.Group>

                  {/* Image Preview Thumbnail */}
                  {addFormData.imagesInput && (
                    <div className="mt-2 d-flex align-items-center gap-2">
                      <ImageIcon size={16} className="text-muted" />
                      <span className="small text-muted">Preview Thumbnail:</span>
                      <img 
                        src={addFormData.imagesInput.split(',')[0].trim()} 
                        alt="Preview" 
                        className="rounded-2 border object-fit-cover" 
                        style={{ width: 80, height: 50 }}
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    </div>
                  )}
                </Col>
              </Row>

              <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
                <Button variant="outline-secondary" onClick={() => handleTabChange('rooms')}>
                  Cancel
                </Button>
                <Button variant="primary" type="submit" disabled={addLoading} className="px-4 fw-semibold">
                  {addLoading ? (
                    <>
                      <Spinner size="sm" animation="border" className="me-2" />
                      Publishing Room...
                    </>
                  ) : (
                    'Add Room to Inventory'
                  )}
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      )}

      {/* ==================================================== */}
      {/* SECTION 4: ALL USERS                                 */}
      {/* ==================================================== */}
      {activeTab === 'users' && (
        <Card className="border-0 shadow-sm">
          <Card.Header className="bg-white py-3 border-bottom d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
            <div>
              <h5 className="fw-bold mb-0 text-primary d-flex align-items-center gap-2">
                <Users size={20} /> Registered User Accounts
              </h5>
              <span className="text-muted small">Access-controlled guest and staff directories (sensitive credentials securely omitted)</span>
            </div>

            <div className="d-flex flex-wrap gap-2">
              <InputGroup style={{ maxWidth: '240px' }}>
                <InputGroup.Text className="bg-light border-end-0">
                  <Search size={14} className="text-muted" />
                </InputGroup.Text>
                <Form.Control 
                  placeholder="Search user name or email..." 
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="border-start-0"
                />
              </InputGroup>

              <Form.Select 
                value={userRoleFilter} 
                onChange={(e) => setUserRoleFilter(e.target.value)}
                style={{ width: '150px' }}
              >
                <option value="all">All Roles</option>
                <option value="admin">Administrators</option>
                <option value="guest">Guests</option>
              </Form.Select>
            </div>
          </Card.Header>

          <Card.Body className="p-0">
            {usersLoading ? (
              <div className="text-center py-5">
                <Spinner animation="border" variant="primary" />
                <p className="text-muted mt-2 mb-0">Loading accounts directory...</p>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-5">
                <Users size={48} className="text-muted mb-2" />
                <p className="text-muted mb-0">No accounts match the specified criteria.</p>
              </div>
            ) : (
              <div className="table-responsive">
                <Table hover className="align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Account Name</th>
                      <th>Email Address</th>
                      <th>Phone Number</th>
                      <th>System Role</th>
                      <th>Registration Date</th>
                      <th>Security Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map(u => (
                      <tr key={u._id}>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <div className="bg-primary-subtle text-primary p-2 rounded-circle d-flex align-items-center justify-content-center fw-bold" style={{ width: 36, height: 36 }}>
                              {u.name ? u.name.charAt(0).toUpperCase() : 'U'}
                            </div>
                            <div>
                              <div className="fw-bold text-dark">{u.name}</div>
                              {u._id === user?._id && (
                                <span className="badge bg-secondary-subtle text-secondary" style={{ fontSize: '0.65rem' }}>Current Session</span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="d-flex align-items-center gap-1 text-dark">
                            <Mail size={14} className="text-muted" /> {u.email}
                          </div>
                        </td>
                        <td>
                          <div className="d-flex align-items-center gap-1 text-muted">
                            <Phone size={14} /> {u.phone || 'Not provided'}
                          </div>
                        </td>
                        <td>
                          <Badge bg={u.role === 'admin' ? 'danger' : 'primary'} className="text-uppercase px-2 py-1">
                            {u.role || 'guest'}
                          </Badge>
                        </td>
                        <td>
                          <div className="small text-muted">
                            {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}
                          </div>
                        </td>
                        <td>
                          <Badge bg="success-subtle" className="text-success border border-success-subtle">
                            Verified Active
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            )}
          </Card.Body>
        </Card>
      )}

      {/* ==================================================== */}
      {/* MODAL 1: UPDATE BOOKING STATUS CONFIRMATION          */}
      {/* ==================================================== */}
      <Modal show={showStatusModal} onHide={() => !statusUpdating && setShowStatusModal(false)} centered>
        <Modal.Header closeButton={!statusUpdating}>
          <Modal.Title className="fw-bold text-primary">
            Confirm Booking Status Change
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedBooking && (
            <div>
              <p>
                Are you sure you want to change the status of reservation{' '}
                <strong className="text-primary font-monospace">{selectedBooking.bookingReference}</strong> to{' '}
                <Badge bg={newStatus === 'confirmed' ? 'success' : 'danger'} className="text-uppercase">
                  {newStatus}
                </Badge>
                ?
              </p>
              <div className="bg-light p-3 rounded-3 small">
                <div><strong>Guest:</strong> {selectedBooking.user?.name || 'Registered Guest'}</div>
                <div><strong>Room:</strong> {selectedBooking.room?.name || 'Room'}</div>
                <div><strong>Total Amount:</strong> ${selectedBooking.totalAmount}</div>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowStatusModal(false)} disabled={statusUpdating}>
            Cancel
          </Button>
          <Button 
            variant={newStatus === 'confirmed' ? 'success' : 'danger'} 
            onClick={handleUpdateBookingStatus}
            disabled={statusUpdating}
            className="fw-semibold"
          >
            {statusUpdating ? <Spinner size="sm" animation="border" className="me-2" /> : null}
            Yes, Set to {newStatus}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* ==================================================== */}
      {/* MODAL 2: EDIT ROOM MODAL                             */}
      {/* ==================================================== */}
      <Modal show={showEditModal} onHide={() => !editLoading && setShowEditModal(false)} size="lg" centered>
        <Modal.Header closeButton={!editLoading}>
          <Modal.Title className="fw-bold text-primary d-flex align-items-center gap-2">
            <Edit size={20} /> Edit Room Details
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSaveEditRoom}>
          <Modal.Body className="p-4">
            <Row className="g-3">
              <Col md={8}>
                <Form.Group controlId="editName">
                  <Form.Label className="fw-semibold">Room Name / Identifier <span className="text-danger">*</span></Form.Label>
                  <Form.Control 
                    type="text" 
                    value={editFormData.name}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group controlId="editType">
                  <Form.Label className="fw-semibold">Room Type <span className="text-danger">*</span></Form.Label>
                  <Form.Select 
                    value={editFormData.roomType}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, roomType: e.target.value }))}
                    required
                  >
                    <option value="Deluxe Suite">Deluxe Suite</option>
                    <option value="Executive Suite">Executive Suite</option>
                    <option value="Ocean Villa">Ocean Villa</option>
                    <option value="Single Room">Single Room</option>
                    <option value="Standard Room">Standard Room</option>
                    <option value="Family Suite">Family Suite</option>
                    <option value="Presidential Suite">Presidential Suite</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={12}>
                <Form.Group controlId="editDesc">
                  <Form.Label className="fw-semibold">Description <span className="text-danger">*</span></Form.Label>
                  <Form.Control 
                    as="textarea"
                    rows={3}
                    value={editFormData.description}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, description: e.target.value }))}
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group controlId="editPrice">
                  <Form.Label className="fw-semibold">Nightly Rate ($) <span className="text-danger">*</span></Form.Label>
                  <Form.Control 
                    type="number"
                    min="0"
                    value={editFormData.pricePerNight}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, pricePerNight: e.target.value }))}
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group controlId="editCapacity">
                  <Form.Label className="fw-semibold">Capacity (Guests) <span className="text-danger">*</span></Form.Label>
                  <Form.Control 
                    type="number"
                    min="1"
                    value={editFormData.capacity}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, capacity: e.target.value }))}
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group controlId="editStatus">
                  <Form.Label className="fw-semibold">Operational Status</Form.Label>
                  <Form.Select 
                    value={editFormData.status}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, status: e.target.value }))}
                  >
                    <option value="available">Available</option>
                    <option value="maintenance">Maintenance</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={12}>
                <Form.Group controlId="editAmenities">
                  <Form.Label className="fw-semibold">Amenities (Comma-separated)</Form.Label>
                  <Form.Control 
                    type="text" 
                    value={editFormData.amenitiesInput}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, amenitiesInput: e.target.value }))}
                  />
                </Form.Group>
              </Col>

              <Col md={12}>
                <Form.Group controlId="editImages">
                  <Form.Label className="fw-semibold">Image URLs (Comma-separated)</Form.Label>
                  <Form.Control 
                    type="text" 
                    value={editFormData.imagesInput}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, imagesInput: e.target.value }))}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEditModal(false)} disabled={editLoading}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={editLoading} className="fw-semibold">
              {editLoading ? <Spinner size="sm" animation="border" className="me-2" /> : null}
              Save Changes
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default Admin;
