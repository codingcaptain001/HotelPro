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
  Image as ImageIcon,
  FileText,
  Printer,
  LayoutGrid,
  List,
  Crown,
  KeyRound,
  SlidersHorizontal,
  Hotel
} from 'lucide-react';

const Admin = () => {
  const { user, login } = useAuth();
  const { tab: urlTab } = useParams();
  const navigate = useNavigate();

  // Active navigation tab: 'bookings' | 'rooms' | 'add-room' | 'users'
  const validTabs = ['bookings', 'rooms', 'add-room', 'users'];
  const activeTab = validTabs.includes(urlTab) ? urlTab : 'bookings';

  const handleTabChange = (selectedTab) => {
    navigate(`/admin/${selectedTab}`);
  };

  // Rooms view mode: 'table' | 'grid'
  const [roomViewMode, setRoomViewMode] = useState('grid');

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
      setErrorMsg(err.response?.data?.message || 'Failed to load rooms catalog');
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
      setErrorMsg(err.response?.data?.message || 'Failed to load users directory');
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

  // Invoice / Receipt Modal State
  const [invoiceBooking, setInvoiceBooking] = useState(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  const handleOpenStatusModal = (booking, targetStatus) => {
    setSelectedBooking(booking);
    setNewStatus(targetStatus);
    setShowStatusModal(true);
  };

  const handleOpenInvoice = (booking) => {
    setInvoiceBooking(booking);
    setShowInvoiceModal(true);
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
      setSuccessMsg(`Room "${room.name}" status switched to ${nextStatus}.`);
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
  // ADD ROOM SECTION (WITH PRESETS & LIVE PREVIEW)
  // ----------------------------------------------------
  const [addFormData, setAddFormData] = useState({
    name: 'Presidential Ocean Villa 701',
    roomType: 'Ocean Villa',
    description: 'An extraordinary sanctuary suspended above the azure coastline, featuring a private infinity plunge pool, marble master bathroom with soaking tub, and bespoke butler service.',
    pricePerNight: 550,
    capacity: 4,
    status: 'available',
    amenitiesInput: 'Private Pool, Oceanfront Balcony, Soaking Tub, King Bed, Smart TV, High-speed Wi-Fi, Butler Service',
    imagesInput: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80'
  });
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState('');

  // Luxury Template Presets
  const luxuryPresets = [
    {
      title: 'Ocean Villa Suite',
      data: {
        name: 'The Royal Oceanfront Villa',
        roomType: 'Ocean Villa',
        description: 'Spectacular panoramic horizon views with a private sun terrace, lavish Italian marble bathroom, and dedicated concierge service.',
        pricePerNight: 620,
        capacity: 4,
        amenitiesInput: 'Private Terrace, Ocean View, King Bed, Soaking Tub, Smart TV, Minibar, Espresso Bar',
        imagesInput: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80'
      }
    },
    {
      title: 'Executive Penthouse',
      data: {
        name: 'Grand Horizon Penthouse',
        roomType: 'Deluxe Suite',
        description: 'Perched on the highest floor, this duplex suite boasts double-height ceilings, a private sitting lounge, and curated artisan furnishings.',
        pricePerNight: 480,
        capacity: 3,
        amenitiesInput: 'Panoramic View, Separate Living Lounge, High-Speed Wi-Fi, In-Room Safe, Luxury Linens',
        imagesInput: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80'
      }
    },
    {
      title: 'Garden Botanical Suite',
      data: {
        name: 'Botanical Courtyard Residence',
        roomType: 'Executive Suite',
        description: 'Surrounded by lush private manicured flora with an open-air stone bath, handcrafted teak furnishings, and serene privacy.',
        pricePerNight: 340,
        capacity: 2,
        amenitiesInput: 'Private Garden, Outdoor Stone Tub, King Bed, Breakfast Included, Rain Shower',
        imagesInput: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80'
      }
    }
  ];

  const handleApplyPreset = (preset) => {
    setAddFormData(prev => ({
      ...prev,
      ...preset.data
    }));
  };

  const handleAddInputChange = (e) => {
    const { name, value } = e.target;
    setAddFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleToggleAmenity = (amenity) => {
    const current = addFormData.amenitiesInput
      .split(',')
      .map(a => a.trim())
      .filter(Boolean);

    let updated;
    if (current.includes(amenity)) {
      updated = current.filter(a => a !== amenity);
    } else {
      updated = [...current, amenity];
    }
    setAddFormData(prev => ({ ...prev, amenitiesInput: updated.join(', ') }));
  };

  const quickAmenitySuggestions = [
    'Ocean View', 'Private Balcony', 'King Bed', 'Soaking Tub', 
    'Smart TV', 'High-Speed Wi-Fi', 'Breakfast Included', 'Minibar', 
    'Espresso Machine', 'Air Conditioning', 'In-Room Safe', 'Butler Service'
  ];

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
      setSuccessMsg(`Room "${addFormData.name}" was successfully added to the catalog!`);
      await fetchRooms();
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
  const [updatingUserId, setUpdatingUserId] = useState(null);

  const handleToggleUserRole = async (targetUser) => {
    const nextRole = targetUser.role === 'admin' ? 'guest' : 'admin';
    try {
      setUpdatingUserId(targetUser._id);
      await api.put(`/users/${targetUser._id}/role`, { role: nextRole });
      setSuccessMsg(`User ${targetUser.name} role changed to ${nextRole.toUpperCase()}.`);
      await fetchUsers();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to update user role');
    } finally {
      setUpdatingUserId(null);
    }
  };

  const filteredUsers = usersList.filter(u => {
    const matchesSearch = 
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      (u.phone && u.phone.includes(userSearch));

    const matchesRole = userRoleFilter === 'all' || u.role === userRoleFilter;
    return matchesSearch && matchesRole;
  });

  // Global Metric Calculations
  const availableCount = rooms.filter(r => r.status === 'available').length;
  const confirmedBookingsCount = bookings.filter(b => (b.bookingStatus || b.status) === 'confirmed').length;
  const pendingBookingsCount = bookings.filter(b => (b.bookingStatus || b.status) === 'pending').length;
  const totalRevenue = bookings
    .filter(b => (b.bookingStatus || b.status) === 'confirmed')
    .reduce((acc, curr) => acc + (curr.totalAmount || curr.amount || 0), 0);

  return (
    <div className="py-4" style={{ minHeight: '90vh' }}>
      <Container>
        {/* Executive Luxury Header */}
        <div className="card-luxury p-4 mb-4 border-0 shadow-sm" style={{ background: 'linear-gradient(135deg, #12233D 0%, #0A1424 100%)', color: '#fff' }}>
          <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3">
            <div>
              <div className="d-flex align-items-center gap-2 mb-2">
                <span className="badge badge-gold px-2.5 py-1 text-uppercase tracking-wider font-display">
                  <Crown size={13} className="me-1" /> Grand Executive Suite
                </span>
                <span className="badge bg-white-subtle text-light px-2 py-1" style={{ fontSize: '0.75rem', backdropFilter: 'blur(8px)' }}>
                  Active Administrator: <strong className="text-warning">{user?.name}</strong>
                </span>
              </div>
              <h1 className="fw-bold mb-1 text-white font-serif" style={{ fontSize: '2.1rem' }}>
                HotelPro Management Portal
              </h1>
              <p className="text-light-subtle small mb-0" style={{ color: '#E2E8F0', opacity: 0.85 }}>
                Real-time central command for luxury accommodations, live reservations, revenue, and accounts.
              </p>
            </div>

            <div className="d-flex flex-wrap gap-2">
              <Button 
                variant="outline-light" 
                onClick={() => { fetchRooms(); fetchBookings(); fetchUsers(); }} 
                className="d-flex align-items-center gap-2 px-3 py-2 rounded-pill small border-light-subtle"
                title="Refresh Live Data"
              >
                <RefreshCw size={15} /> Refresh Live Data
              </Button>
              <Button 
                onClick={() => handleTabChange('add-room')} 
                className="btn-gold d-flex align-items-center gap-2 px-4 py-2 rounded-pill fw-bold"
              >
                <Plus size={18} /> Add New Room
              </Button>
            </div>
          </div>
        </div>

        {/* Global Feedback Notifications */}
        {successMsg && (
          <Alert variant="success" dismissible onClose={() => setSuccessMsg('')} className="shadow-sm mb-4 border-0 rounded-3">
            <CheckCircle size={18} className="me-2 text-success" />
            {successMsg}
          </Alert>
        )}

        {errorMsg && (
          <Alert variant="danger" dismissible onClose={() => setErrorMsg('')} className="shadow-sm mb-4 border-0 rounded-3">
            <AlertCircle size={18} className="me-2 text-danger" />
            {errorMsg}
          </Alert>
        )}

        {/* Executive Metric KPI Row */}
        <Row className="g-3 mb-4">
          <Col lg={3} sm={6}>
            <div className="card-luxury p-3.5 bg-white h-100">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <div className="text-muted small text-uppercase fw-bold tracking-wider" style={{ fontSize: '0.7rem' }}>
                    Live Reservations
                  </div>
                  <h2 className="fw-bold text-primary mb-0 mt-1">{bookings.length}</h2>
                  <div className="small text-muted mt-1">
                    <span className="text-success fw-bold">{confirmedBookingsCount}</span> Confirmed • <span className="text-warning fw-bold">{pendingBookingsCount}</span> Pending
                  </div>
                </div>
                <div className="p-3 rounded-circle d-flex align-items-center justify-content-center" style={{ background: 'rgba(212, 175, 55, 0.15)', color: '#B8860B' }}>
                  <CalendarCheck size={24} />
                </div>
              </div>
            </div>
          </Col>

          <Col lg={3} sm={6}>
            <div className="card-luxury p-3.5 bg-white h-100">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <div className="text-muted small text-uppercase fw-bold tracking-wider" style={{ fontSize: '0.7rem' }}>
                    Accommodations Catalog
                  </div>
                  <h2 className="fw-bold text-primary mb-0 mt-1">{rooms.length}</h2>
                  <div className="small text-muted mt-1">
                    <span className="text-success fw-bold">{availableCount}</span> Ready • <span className="text-secondary">{rooms.length - availableCount}</span> Service
                  </div>
                </div>
                <div className="p-3 rounded-circle d-flex align-items-center justify-content-center" style={{ background: 'rgba(18, 35, 61, 0.1)', color: '#12233D' }}>
                  <Bed size={24} />
                </div>
              </div>
            </div>
          </Col>

          <Col lg={3} sm={6}>
            <div className="card-luxury p-3.5 bg-white h-100">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <div className="text-muted small text-uppercase fw-bold tracking-wider" style={{ fontSize: '0.7rem' }}>
                    Gross Booking Volume
                  </div>
                  <h2 className="fw-bold text-gold mb-0 mt-1">${totalRevenue.toLocaleString()}</h2>
                  <div className="small text-muted mt-1">Confirmed guest receipts</div>
                </div>
                <div className="p-3 rounded-circle d-flex align-items-center justify-content-center" style={{ background: 'rgba(46, 125, 50, 0.12)', color: '#2E7D32' }}>
                  <DollarSign size={24} />
                </div>
              </div>
            </div>
          </Col>

          <Col lg={3} sm={6}>
            <div className="card-luxury p-3.5 bg-white h-100">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <div className="text-muted small text-uppercase fw-bold tracking-wider" style={{ fontSize: '0.7rem' }}>
                    Registered Accounts
                  </div>
                  <h2 className="fw-bold text-dark mb-0 mt-1">{usersList.length}</h2>
                  <div className="small text-muted mt-1">Guests & VIP Members</div>
                </div>
                <div className="p-3 rounded-circle d-flex align-items-center justify-content-center" style={{ background: 'rgba(33, 150, 243, 0.12)', color: '#1976D2' }}>
                  <Users size={24} />
                </div>
              </div>
            </div>
          </Col>
        </Row>

        {/* Classy Navigation Tabs */}
        <Nav className="card-luxury p-2 mb-4 border d-flex gap-2 bg-white" style={{ borderRadius: '40px' }}>
          <Nav.Item>
            <Button 
              variant={activeTab === 'bookings' ? 'primary' : 'light'} 
              onClick={() => handleTabChange('bookings')}
              className={`d-flex align-items-center gap-2 px-4 py-2 rounded-pill fw-bold border-0 ${activeTab === 'bookings' ? 'shadow-sm' : 'text-secondary bg-transparent'}`}
            >
              <CalendarCheck size={18} className={activeTab === 'bookings' ? 'text-warning' : 'text-muted'} /> All Bookings 
              <span className={`badge ${activeTab === 'bookings' ? 'badge-gold' : 'bg-light text-secondary'} rounded-pill ms-1`}>
                {bookings.length}
              </span>
            </Button>
          </Nav.Item>

          <Nav.Item>
            <Button 
              variant={activeTab === 'rooms' ? 'primary' : 'light'} 
              onClick={() => handleTabChange('rooms')}
              className={`d-flex align-items-center gap-2 px-4 py-2 rounded-pill fw-bold border-0 ${activeTab === 'rooms' ? 'shadow-sm' : 'text-secondary bg-transparent'}`}
            >
              <Bed size={18} className={activeTab === 'rooms' ? 'text-warning' : 'text-muted'} /> All Rooms
              <span className={`badge ${activeTab === 'rooms' ? 'badge-gold' : 'bg-light text-secondary'} rounded-pill ms-1`}>
                {rooms.length}
              </span>
            </Button>
          </Nav.Item>

          <Nav.Item>
            <Button 
              variant={activeTab === 'add-room' ? 'primary' : 'light'} 
              onClick={() => handleTabChange('add-room')}
              className={`d-flex align-items-center gap-2 px-4 py-2 rounded-pill fw-bold border-0 ${activeTab === 'add-room' ? 'shadow-sm' : 'text-secondary bg-transparent'}`}
            >
              <Plus size={18} className={activeTab === 'add-room' ? 'text-warning' : 'text-muted'} /> Add Room
            </Button>
          </Nav.Item>

          <Nav.Item>
            <Button 
              variant={activeTab === 'users' ? 'primary' : 'light'} 
              onClick={() => handleTabChange('users')}
              className={`d-flex align-items-center gap-2 px-4 py-2 rounded-pill fw-bold border-0 ${activeTab === 'users' ? 'shadow-sm' : 'text-secondary bg-transparent'}`}
            >
              <Users size={18} className={activeTab === 'users' ? 'text-warning' : 'text-muted'} /> All Users
              <span className={`badge ${activeTab === 'users' ? 'badge-gold' : 'bg-light text-secondary'} rounded-pill ms-1`}>
                {usersList.length}
              </span>
            </Button>
          </Nav.Item>
        </Nav>

        {/* ==================================================== */}
        {/* SECTION 1: ALL BOOKINGS                              */}
        {/* ==================================================== */}
        {activeTab === 'bookings' && (
          <div className="card-luxury overflow-hidden">
            <div className="p-4 bg-white border-bottom d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
              <div>
                <h4 className="fw-bold mb-0 text-primary font-serif d-flex align-items-center gap-2">
                  <CalendarCheck size={22} className="text-warning" /> Guest Reservations Ledger
                </h4>
                <span className="text-muted small">Real-time room bookings synced with MongoDB Atlas</span>
              </div>

              {/* Filter & Search Bar */}
              <div className="d-flex flex-wrap gap-2">
                <InputGroup style={{ maxWidth: '280px' }}>
                  <InputGroup.Text className="bg-light border-end-0">
                    <Search size={14} className="text-muted" />
                  </InputGroup.Text>
                  <Form.Control 
                    placeholder="Search ref, guest, room..." 
                    value={bookingSearch}
                    onChange={(e) => setBookingSearch(e.target.value)}
                    className="border-start-0 small"
                  />
                </InputGroup>

                <Form.Select 
                  value={bookingStatusFilter} 
                  onChange={(e) => setBookingStatusFilter(e.target.value)}
                  style={{ width: '150px' }}
                  className="small fw-medium"
                >
                  <option value="all">All Statuses</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="pending">Pending</option>
                  <option value="cancelled">Cancelled</option>
                </Form.Select>
              </div>
            </div>

            <div className="p-0">
              {bookingsLoading ? (
                <div className="text-center py-5">
                  <Spinner animation="border" variant="primary" />
                  <p className="text-muted mt-2 mb-0">Synchronizing reservations ledger...</p>
                </div>
              ) : filteredBookings.length === 0 ? (
                <div className="text-center py-5">
                  <CalendarDays size={48} className="text-muted mb-2" />
                  <p className="text-muted mb-0">No reservations match the selected search criteria.</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <Table className="table-luxury align-middle mb-0">
                    <thead>
                      <tr>
                        <th>Booking Ref</th>
                        <th>Guest Details</th>
                        <th>Accommodations</th>
                        <th>Stay Schedule</th>
                        <th>Guests & Nights</th>
                        <th>Total Charges</th>
                        <th>Status</th>
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
                              <span className="badge bg-light text-primary font-monospace px-2.5 py-1.5 border fw-bold">
                                {b.bookingReference}
                              </span>
                              <div className="small text-muted mt-1" style={{ fontSize: '0.75rem' }}>
                                Booked: {new Date(b.createdAt).toLocaleDateString()}
                              </div>
                            </td>
                            <td>
                              <div className="fw-bold text-dark">{b.user?.name || b.guestName || b.customerName || 'Registered Guest'}</div>
                              <div className="small text-muted d-flex align-items-center gap-1">
                                <Mail size={12} className="text-secondary" /> {b.user?.email || b.email || 'N/A'}
                              </div>
                              {(b.user?.phone || b.phone) && (
                                <div className="small text-muted d-flex align-items-center gap-1">
                                  <Phone size={12} className="text-secondary" /> {b.user?.phone || b.phone}
                                </div>
                              )}
                            </td>
                            <td>
                              <div className="fw-semibold text-dark">{b.room?.name || 'Standard Room'}</div>
                              <span className="badge bg-light text-secondary border small mt-1">
                                {b.room?.roomType || 'Deluxe Room'}
                              </span>
                            </td>
                            <td>
                              <div className="small fw-bold text-dark">
                                {new Date(b.checkInDate).toLocaleDateString()}
                              </div>
                              <div className="small text-muted">
                                to {new Date(b.checkOutDate).toLocaleDateString()}
                              </div>
                            </td>
                            <td>
                              <div className="small fw-semibold text-dark">
                                {b.numberOfNights || b.totalDays || 1} Night{(b.numberOfNights === 1) ? '' : 's'}
                              </div>
                              <div className="small text-muted">
                                {b.guestCount || 1} Guest{(b.guestCount === 1) ? '' : 's'}
                              </div>
                            </td>
                            <td>
                              <span className="fw-bold text-gold fs-6">${b.totalAmount || b.amount}</span>
                            </td>
                            <td>
                              <Badge bg={
                                isConfirmed ? 'success' :
                                isCancelled ? 'danger' : 'warning'
                              } className="text-capitalize px-2.5 py-1.5 rounded-pill">
                                {statusVal}
                              </Badge>
                            </td>
                            <td>
                              <Badge bg={
                                b.paymentStatus === 'paid' ? 'success' :
                                b.paymentStatus === 'refunded' ? 'info' :
                                b.paymentStatus === 'failed' ? 'danger' : 'secondary'
                              } className="text-capitalize px-2 py-1 rounded-pill">
                                {b.paymentStatus || 'pending'}
                              </Badge>
                            </td>
                            <td className="text-end">
                              <div className="d-flex justify-content-end gap-1.5">
                                <Button 
                                  variant="outline-secondary" 
                                  size="sm"
                                  onClick={() => handleOpenInvoice(b)}
                                  className="d-flex align-items-center gap-1 px-2.5 py-1 rounded-pill"
                                  title="View Printable Guest Invoice"
                                >
                                  <FileText size={13} /> Invoice
                                </Button>
                                {!isConfirmed && !isCancelled && (
                                  <Button 
                                    variant="outline-success" 
                                    size="sm"
                                    onClick={() => handleOpenStatusModal(b, 'confirmed')}
                                    className="d-flex align-items-center gap-1 px-2.5 py-1 rounded-pill"
                                  >
                                    <Check size={13} /> Confirm
                                  </Button>
                                )}
                                {!isCancelled && (
                                  <Button 
                                    variant="outline-danger" 
                                    size="sm"
                                    onClick={() => handleOpenStatusModal(b, 'cancelled')}
                                    className="d-flex align-items-center gap-1 px-2.5 py-1 rounded-pill"
                                  >
                                    <X size={13} /> Cancel
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
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* SECTION 2: ALL ROOMS                                 */}
        {/* ==================================================== */}
        {activeTab === 'rooms' && (
          <div className="card-luxury overflow-hidden">
            <div className="p-4 bg-white border-bottom d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
              <div>
                <h4 className="fw-bold mb-0 text-primary font-serif d-flex align-items-center gap-2">
                  <Bed size={22} className="text-warning" /> Accommodations Catalog
                </h4>
                <span className="text-muted small">Manage hotel suites, pricing, room status, and guest capacity</span>
              </div>

              <div className="d-flex flex-wrap gap-2 align-items-center">
                {/* View Mode Switcher */}
                <div className="btn-group border rounded-pill p-1 bg-light">
                  <Button 
                    size="sm" 
                    variant={roomViewMode === 'grid' ? 'primary' : 'light'} 
                    onClick={() => setRoomViewMode('grid')}
                    className="rounded-pill px-3 d-flex align-items-center gap-1 border-0"
                  >
                    <LayoutGrid size={14} /> Cards
                  </Button>
                  <Button 
                    size="sm" 
                    variant={roomViewMode === 'table' ? 'primary' : 'light'} 
                    onClick={() => setRoomViewMode('table')}
                    className="rounded-pill px-3 d-flex align-items-center gap-1 border-0"
                  >
                    <List size={14} /> Table
                  </Button>
                </div>

                <InputGroup style={{ maxWidth: '220px' }}>
                  <InputGroup.Text className="bg-light border-end-0">
                    <Search size={14} className="text-muted" />
                  </InputGroup.Text>
                  <Form.Control 
                    placeholder="Search suite name..." 
                    value={roomSearch}
                    onChange={(e) => setRoomSearch(e.target.value)}
                    className="border-start-0 small"
                  />
                </InputGroup>

                <Form.Select 
                  value={roomTypeFilter} 
                  onChange={(e) => setRoomTypeFilter(e.target.value)}
                  style={{ width: '160px' }}
                  className="small fw-medium"
                >
                  {availableRoomTypes.map(t => (
                    <option key={t} value={t}>
                      {t === 'all' ? 'All Suite Types' : t}
                    </option>
                  ))}
                </Form.Select>
              </div>
            </div>

            <div className="p-4">
              {roomsLoading ? (
                <div className="text-center py-5">
                  <Spinner animation="border" variant="primary" />
                  <p className="text-muted mt-2 mb-0">Loading accommodations catalog...</p>
                </div>
              ) : filteredRooms.length === 0 ? (
                <div className="text-center py-5">
                  <p className="text-muted mb-3">No suites match your search query.</p>
                  <Button variant="primary" size="sm" onClick={() => handleTabChange('add-room')} className="rounded-pill px-4">
                    Add New Suite
                  </Button>
                </div>
              ) : roomViewMode === 'grid' ? (
                /* Card Grid View */
                <Row className="g-4">
                  {filteredRooms.map(room => (
                    <Col lg={4} md={6} key={room._id}>
                      <Card className="card-luxury h-100 overflow-hidden border">
                        <div className="position-relative" style={{ height: '200px', backgroundColor: '#e2e8f0' }}>
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
                          <div className="position-absolute top-0 end-0 m-2.5">
                            <Badge 
                              bg={room.status === 'available' ? 'success' : 'secondary'}
                              className="px-2.5 py-1 text-uppercase shadow-sm"
                            >
                              {room.status}
                            </Badge>
                          </div>
                          <div className="position-absolute bottom-0 start-0 m-2.5">
                            <span className="badge badge-gold px-2.5 py-1 shadow-sm font-monospace fs-6">
                              ${room.pricePerNight} <span className="small fw-normal">/ night</span>
                            </span>
                          </div>
                        </div>

                        <Card.Body className="p-3.5 d-flex flex-column">
                          <div className="d-flex justify-content-between align-items-start mb-1">
                            <span className="badge bg-light text-primary border small">{room.roomType}</span>
                            <span className="small text-muted d-flex align-items-center gap-1">
                              <Users size={14} /> Up to {room.capacity} Guests
                            </span>
                          </div>

                          <h5 className="fw-bold text-dark mt-2 mb-1">{room.name}</h5>
                          <p className="text-muted small text-truncate-2 flex-grow-1 mb-3" style={{ fontSize: '0.85rem' }}>
                            {room.description}
                          </p>

                          <div className="d-flex flex-wrap gap-1 mb-3">
                            {(room.amenities || []).slice(0, 3).map((a, i) => (
                              <span key={i} className="badge bg-light text-muted border" style={{ fontSize: '0.7rem' }}>
                                {a}
                              </span>
                            ))}
                            {(room.amenities || []).length > 3 && (
                              <span className="badge bg-light text-muted border" style={{ fontSize: '0.7rem' }}>
                                +{room.amenities.length - 3} more
                              </span>
                            )}
                          </div>

                          <div className="d-flex justify-content-between align-items-center pt-2 border-top mt-auto">
                            <Button 
                              variant={room.status === 'available' ? 'outline-secondary' : 'outline-success'}
                              size="sm"
                              onClick={() => handleToggleRoomStatus(room)}
                              className="rounded-pill px-2.5 py-1 small"
                            >
                              {room.status === 'available' ? 'Set Maintenance' : 'Set Available'}
                            </Button>

                            <div className="d-flex gap-1">
                              <Button 
                                variant="outline-primary" 
                                size="sm"
                                onClick={() => handleOpenEditRoom(room)}
                                className="rounded-pill px-3 py-1 d-flex align-items-center gap-1"
                              >
                                <Edit size={13} /> Edit
                              </Button>
                              <Button 
                                as={Link} 
                                to={`/rooms/${room._id}`} 
                                variant="light" 
                                size="sm"
                                className="rounded-pill p-1.5 border"
                                title="Public View"
                              >
                                <Eye size={14} className="text-muted" />
                              </Button>
                            </div>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              ) : (
                /* Table View */
                <div className="table-responsive">
                  <Table className="table-luxury align-middle mb-0">
                    <thead>
                      <tr>
                        <th>Suite & Photography</th>
                        <th>Category</th>
                        <th>Nightly Rate</th>
                        <th>Capacity</th>
                        <th>Operational Status</th>
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
                                  className="rounded-3 object-fit-cover shadow-sm border" 
                                  style={{ width: 56, height: 56 }}
                                />
                              ) : (
                                <div className="bg-light rounded-3 d-flex align-items-center justify-content-center text-muted border" style={{ width: 56, height: 56 }}>
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
                            <span className="badge bg-light text-primary border px-2.5 py-1.5 fw-semibold">
                              {room.roomType}
                            </span>
                          </td>
                          <td>
                            <span className="fw-bold text-gold fs-6">${room.pricePerNight}</span>
                            <span className="text-muted small"> / night</span>
                          </td>
                          <td>
                            <span className="d-flex align-items-center gap-1 text-dark small fw-medium">
                              <Users size={14} className="text-muted" /> {room.capacity} Guests
                            </span>
                          </td>
                          <td>
                            <Badge 
                              bg={room.status === 'available' ? 'success' : 'secondary'}
                              className="cursor-pointer text-capitalize px-2.5 py-1.5 rounded-pill"
                              onClick={() => handleToggleRoomStatus(room)}
                              title="Click to toggle status"
                              style={{ cursor: 'pointer' }}
                            >
                              {room.status}
                            </Badge>
                          </td>
                          <td>
                            <div className="small text-muted text-truncate" style={{ maxWidth: '180px' }}>
                              {(room.amenities || []).join(', ')}
                            </div>
                          </td>
                          <td className="text-end">
                            <div className="d-flex justify-content-end gap-1.5">
                              <Button 
                                variant="outline-primary" 
                                size="sm"
                                onClick={() => handleOpenEditRoom(room)}
                                className="d-flex align-items-center gap-1 rounded-pill px-3 py-1"
                              >
                                <Edit size={13} /> Edit
                              </Button>
                              <Button 
                                as={Link} 
                                to={`/rooms/${room._id}`} 
                                variant="light" 
                                size="sm"
                                className="rounded-pill p-1.5 border"
                              >
                                <Eye size={14} className="text-muted" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* SECTION 3: ADD ROOM (SPLIT VIEW & LIVE PREVIEW)      */}
        {/* ==================================================== */}
        {activeTab === 'add-room' && (
          <Row className="g-4">
            {/* Left Column: Input Form */}
            <Col lg={7}>
              <div className="card-luxury p-4">
                <div className="d-flex justify-content-between align-items-center mb-3 pb-3 border-bottom">
                  <div>
                    <h4 className="fw-bold mb-0 text-primary font-serif d-flex align-items-center gap-2">
                      <Plus size={22} className="text-warning" /> New Suite Listing
                    </h4>
                    <span className="text-muted small">Specify luxury hotel suite attributes for guest bookings</span>
                  </div>
                  <Badge bg="primary-subtle" className="text-primary px-2.5 py-1 border">
                    Live Catalog Integration
                  </Badge>
                </div>

                {/* 1-Click Luxury Presets Bar */}
                <div className="mb-4 p-3 bg-light rounded-4 border">
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <span className="small fw-bold text-primary d-flex align-items-center gap-1">
                      <Sparkles size={14} className="text-warning" /> 1-Click Luxury Room Presets:
                    </span>
                    <span className="small text-muted" style={{ fontSize: '0.75rem' }}>Auto-fills data</span>
                  </div>
                  <div className="d-flex flex-wrap gap-2">
                    {luxuryPresets.map((preset, idx) => (
                      <Button 
                        key={idx} 
                        variant="outline-secondary" 
                        size="sm" 
                        onClick={() => handleApplyPreset(preset)}
                        className="rounded-pill px-3 py-1 small fw-semibold bg-white border"
                      >
                        {preset.title}
                      </Button>
                    ))}
                  </div>
                </div>

                {addError && <Alert variant="danger" className="mb-4">{addError}</Alert>}

                <Form onSubmit={handleAddRoomSubmit}>
                  <Row className="g-3">
                    <Col md={8}>
                      <Form.Group controlId="addName">
                        <Form.Label className="small fw-bold text-secondary">Suite Title or Identifier <span className="text-danger">*</span></Form.Label>
                        <Form.Control 
                          type="text" 
                          name="name" 
                          placeholder="e.g. Royal Oceanfront Penthouse 501" 
                          value={addFormData.name}
                          onChange={handleAddInputChange}
                          required
                        />
                      </Form.Group>
                    </Col>

                    <Col md={4}>
                      <Form.Group controlId="addRoomType">
                        <Form.Label className="small fw-bold text-secondary">Suite Category <span className="text-danger">*</span></Form.Label>
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
                        <Form.Label className="small fw-bold text-secondary">Description <span className="text-danger">*</span></Form.Label>
                        <Form.Control 
                          as="textarea" 
                          rows={3} 
                          name="description" 
                          placeholder="Provide evocative details about the ocean views, architectural styling, bed specifications, and luxury appointments..." 
                          value={addFormData.description}
                          onChange={handleAddInputChange}
                          required
                        />
                      </Form.Group>
                    </Col>

                    <Col md={4}>
                      <Form.Group controlId="addPrice">
                        <Form.Label className="small fw-bold text-secondary">Nightly Rate ($) <span className="text-danger">*</span></Form.Label>
                        <Form.Control 
                          type="number" 
                          min="0"
                          name="pricePerNight" 
                          value={addFormData.pricePerNight}
                          onChange={handleAddInputChange}
                          required
                        />
                      </Form.Group>
                    </Col>

                    <Col md={4}>
                      <Form.Group controlId="addCapacity">
                        <Form.Label className="small fw-bold text-secondary">Capacity (Guests) <span className="text-danger">*</span></Form.Label>
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
                        <Form.Label className="small fw-bold text-secondary">Status</Form.Label>
                        <Form.Select 
                          name="status" 
                          value={addFormData.status}
                          onChange={handleAddInputChange}
                        >
                          <option value="available">Available</option>
                          <option value="maintenance">Maintenance</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>

                    <Col md={12}>
                      <Form.Group controlId="addAmenities">
                        <Form.Label className="small fw-bold text-secondary">Amenities (Quick Click Tags)</Form.Label>
                        <div className="d-flex flex-wrap gap-1.5 mb-2">
                          {quickAmenitySuggestions.map((amenity, i) => {
                            const isSelected = addFormData.amenitiesInput.includes(amenity);
                            return (
                              <Button
                                key={i}
                                type="button"
                                size="sm"
                                variant={isSelected ? 'primary' : 'outline-secondary'}
                                onClick={() => handleToggleAmenity(amenity)}
                                className="rounded-pill px-2.5 py-0.5 small"
                                style={{ fontSize: '0.75rem' }}
                              >
                                {isSelected && <Check size={12} className="me-1" />}
                                {amenity}
                              </Button>
                            );
                          })}
                        </div>
                        <Form.Control 
                          type="text" 
                          name="amenitiesInput" 
                          value={addFormData.amenitiesInput}
                          onChange={handleAddInputChange}
                          placeholder="Comma-separated amenities..."
                        />
                      </Form.Group>
                    </Col>

                    <Col md={12}>
                      <Form.Group controlId="addImages">
                        <Form.Label className="small fw-bold text-secondary">Photography Gallery URLs <span className="text-danger">*</span></Form.Label>
                        <Form.Control 
                          type="text" 
                          name="imagesInput" 
                          placeholder="https://images.unsplash.com/..." 
                          value={addFormData.imagesInput}
                          onChange={handleAddInputChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
                    <Button variant="outline-secondary" onClick={() => handleTabChange('rooms')} className="rounded-pill px-4">
                      Cancel
                    </Button>
                    <Button type="submit" disabled={addLoading} className="btn-gold px-4 rounded-pill fw-bold">
                      {addLoading ? (
                        <>
                          <Spinner size="sm" animation="border" className="me-2" />
                          Publishing Suite...
                        </>
                      ) : (
                        'Publish Suite to Inventory'
                      )}
                    </Button>
                  </div>
                </Form>
              </div>
            </Col>

            {/* Right Column: Live Room Card Preview */}
            <Col lg={5}>
              <div className="sticky-top" style={{ top: '100px' }}>
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <span className="small fw-bold text-muted text-uppercase tracking-wider">
                    <Eye size={14} className="me-1" /> Live Guest Card Preview
                  </span>
                  <Badge bg="success-subtle" className="text-success border border-success-subtle">
                    Real-time
                  </Badge>
                </div>

                <Card className="card-luxury overflow-hidden border shadow-sm">
                  <div className="position-relative" style={{ height: '220px', backgroundColor: '#e2e8f0' }}>
                    <img 
                      src={addFormData.imagesInput.split(',')[0].trim() || 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80'} 
                      alt="Preview" 
                      className="w-100 h-100 object-fit-cover"
                      onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80'; }}
                    />
                    <div className="position-absolute top-0 end-0 m-2.5">
                      <Badge bg={addFormData.status === 'available' ? 'success' : 'secondary'} className="px-2.5 py-1 text-uppercase">
                        {addFormData.status}
                      </Badge>
                    </div>
                    <div className="position-absolute bottom-0 start-0 m-2.5">
                      <span className="badge badge-gold px-3 py-1.5 shadow-sm font-monospace fs-6">
                        ${addFormData.pricePerNight || 0} <span className="small fw-normal">/ night</span>
                      </span>
                    </div>
                  </div>

                  <Card.Body className="p-4">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <Badge bg="primary-subtle" className="text-primary px-2.5 py-1">{addFormData.roomType}</Badge>
                      <span className="small text-muted d-flex align-items-center gap-1">
                        <Users size={14} /> Up to {addFormData.capacity} Guests
                      </span>
                    </div>

                    <h4 className="fw-bold text-dark mt-2 mb-2 font-serif">{addFormData.name || 'Suite Name'}</h4>
                    <p className="text-muted small mb-3 leading-relaxed">
                      {addFormData.description || 'Description will appear here...'}
                    </p>

                    <div className="d-flex flex-wrap gap-1.5 pt-2 border-top">
                      {addFormData.amenitiesInput.split(',').filter(Boolean).slice(0, 4).map((a, i) => (
                        <span key={i} className="badge bg-light text-secondary border small">
                          {a.trim()}
                        </span>
                      ))}
                    </div>
                  </Card.Body>
                </Card>
              </div>
            </Col>
          </Row>
        )}

        {/* ==================================================== */}
        {/* SECTION 4: ALL USERS (WITH ROLE PROMOTION TOGGLE)    */}
        {/* ==================================================== */}
        {activeTab === 'users' && (
          <div className="card-luxury overflow-hidden">
            <div className="p-4 bg-white border-bottom d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
              <div>
                <h4 className="fw-bold mb-0 text-primary font-serif d-flex align-items-center gap-2">
                  <Users size={22} className="text-warning" /> Registered Guests & Staff Directory
                </h4>
                <span className="text-muted small">Manage hotel guest profiles and staff permissions securely</span>
              </div>

              <div className="d-flex flex-wrap gap-2">
                <InputGroup style={{ maxWidth: '240px' }}>
                  <InputGroup.Text className="bg-light border-end-0">
                    <Search size={14} className="text-muted" />
                  </InputGroup.Text>
                  <Form.Control 
                    placeholder="Search name, email..." 
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    className="border-start-0 small"
                  />
                </InputGroup>

                <Form.Select 
                  value={userRoleFilter} 
                  onChange={(e) => setUserRoleFilter(e.target.value)}
                  style={{ width: '150px' }}
                  className="small fw-medium"
                >
                  <option value="all">All Roles</option>
                  <option value="admin">Administrators</option>
                  <option value="guest">Guests</option>
                </Form.Select>
              </div>
            </div>

            <div className="p-0">
              {usersLoading ? (
                <div className="text-center py-5">
                  <Spinner animation="border" variant="primary" />
                  <p className="text-muted mt-2 mb-0">Loading directory...</p>
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="text-center py-5">
                  <Users size={48} className="text-muted mb-2" />
                  <p className="text-muted mb-0">No registered accounts match your filter.</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <Table className="table-luxury align-middle mb-0">
                    <thead>
                      <tr>
                        <th>Guest Profile</th>
                        <th>Email Address</th>
                        <th>Phone</th>
                        <th>Role & Privileges</th>
                        <th>Member Since</th>
                        <th className="text-end">Role Management</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map(u => (
                        <tr key={u._id}>
                          <td>
                            <div className="d-flex align-items-center gap-2.5">
                              <div className="bg-primary text-white p-2 rounded-circle d-flex align-items-center justify-content-center fw-bold shadow-sm" style={{ width: 38, height: 38, background: 'linear-gradient(135deg, #12233D 0%, #1B355A 100%)' }}>
                                {u.name ? u.name.charAt(0).toUpperCase() : 'U'}
                              </div>
                              <div>
                                <div className="fw-bold text-dark">{u.name}</div>
                                {u._id === user?._id && (
                                  <span className="badge badge-gold" style={{ fontSize: '0.62rem' }}>Current Session</span>
                                )}
                              </div>
                            </div>
                          </td>
                          <td>
                            <div className="d-flex align-items-center gap-1.5 text-dark small">
                              <Mail size={13} className="text-secondary" /> {u.email}
                            </div>
                          </td>
                          <td>
                            <div className="d-flex align-items-center gap-1.5 text-muted small">
                              <Phone size={13} className="text-secondary" /> {u.phone || 'Not provided'}
                            </div>
                          </td>
                          <td>
                            <Badge bg={u.role === 'admin' ? 'danger' : 'primary'} className="text-uppercase px-2.5 py-1.5 rounded-pill">
                              {u.role || 'guest'}
                            </Badge>
                          </td>
                          <td>
                            <div className="small text-muted">
                              {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}
                            </div>
                          </td>
                          <td className="text-end">
                            <Button 
                              variant={u.role === 'admin' ? 'outline-secondary' : 'outline-primary'}
                              size="sm"
                              disabled={updatingUserId === u._id || u._id === user?._id}
                              onClick={() => handleToggleUserRole(u)}
                              className="rounded-pill px-3 py-1 small fw-semibold"
                            >
                              {updatingUserId === u._id ? (
                                <Spinner size="sm" animation="border" />
                              ) : u.role === 'admin' ? (
                                'Demote to Guest'
                              ) : (
                                'Promote to Admin'
                              )}
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* MODAL 1: LUXURY INVOICE & RECEIPT PREVIEW            */}
        {/* ==================================================== */}
        <Modal show={showInvoiceModal} onHide={() => setShowInvoiceModal(false)} size="lg" centered>
          <Modal.Header closeButton className="border-0 pb-0">
            <Modal.Title className="fw-bold text-primary font-display fs-5">
              Official Reservation Receipt
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="p-4 p-md-5">
            {invoiceBooking && (
              <div id="hotelpro-invoice" className="p-4 rounded-4 border bg-white shadow-sm">
                {/* Invoice Letterhead */}
                <div className="d-flex justify-content-between align-items-start border-bottom pb-4 mb-4">
                  <div>
                    <div className="d-flex align-items-center gap-2 mb-1">
                      <div className="bg-primary text-white p-2 rounded-2 d-flex align-items-center justify-content-center">
                        <Hotel size={22} className="text-warning" />
                      </div>
                      <span className="fs-3 fw-bold font-display text-primary">HotelPro</span>
                    </div>
                    <div className="small text-muted">Luxury Hospitality & Coastal Resorts</div>
                    <div className="small text-muted">100 Ocean Avenue, Seaside Boulevard, CA 90210</div>
                  </div>

                  <div className="text-end">
                    <span className="badge badge-gold px-3 py-1 text-uppercase mb-2 font-display">Paid Invoice</span>
                    <div className="text-muted small">Ref: <strong className="text-dark font-monospace">{invoiceBooking.bookingReference}</strong></div>
                    <div className="text-muted small">Issued: {new Date(invoiceBooking.createdAt || Date.now()).toLocaleDateString()}</div>
                  </div>
                </div>

                {/* Billed To / Stay Details */}
                <Row className="mb-4 text-start">
                  <Col sm={6}>
                    <div className="small text-muted text-uppercase fw-bold mb-1">Guest Information</div>
                    <div className="fw-bold text-dark fs-6">{invoiceBooking.user?.name || invoiceBooking.guestName || 'Valued Guest'}</div>
                    <div className="small text-muted">{invoiceBooking.user?.email || invoiceBooking.email || 'guest@example.com'}</div>
                    <div className="small text-muted">{invoiceBooking.user?.phone || invoiceBooking.phone || '+1 (555) 000-0000'}</div>
                  </Col>
                  <Col sm={6} className="text-sm-end mt-3 mt-sm-0">
                    <div className="small text-muted text-uppercase fw-bold mb-1">Stay Period</div>
                    <div className="fw-bold text-dark">{new Date(invoiceBooking.checkInDate).toLocaleDateString()} – {new Date(invoiceBooking.checkOutDate).toLocaleDateString()}</div>
                    <div className="small text-muted">{invoiceBooking.numberOfNights || 1} Night(s) • {invoiceBooking.guestCount || 1} Guest(s)</div>
                    <div className="small text-success fw-bold">Status: {invoiceBooking.bookingStatus || 'Confirmed'}</div>
                  </Col>
                </Row>

                {/* Line Items Table */}
                <Table className="mb-4">
                  <thead className="table-light">
                    <tr>
                      <th>Description</th>
                      <th className="text-center">Rate</th>
                      <th className="text-center">Duration</th>
                      <th className="text-end">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <div className="fw-bold text-dark">{invoiceBooking.room?.name || 'Luxury Suite'}</div>
                        <div className="small text-muted">{invoiceBooking.room?.roomType || 'Accommodation'}</div>
                      </td>
                      <td className="text-center">${invoiceBooking.room?.pricePerNight || (invoiceBooking.totalAmount / (invoiceBooking.numberOfNights || 1))}</td>
                      <td className="text-center">{invoiceBooking.numberOfNights || 1} night(s)</td>
                      <td className="text-end fw-bold text-dark">${invoiceBooking.totalAmount}</td>
                    </tr>
                    <tr>
                      <td colSpan={3} className="text-end text-muted small">Taxes & Hospitality Surcharges</td>
                      <td className="text-end text-muted small">Included</td>
                    </tr>
                    <tr className="table-light">
                      <td colSpan={3} className="text-end fw-bold fs-6 text-primary">Total Paid / Charged</td>
                      <td className="text-end fw-bold fs-5 text-gold font-monospace">${invoiceBooking.totalAmount}</td>
                    </tr>
                  </tbody>
                </Table>

                <div className="text-center text-muted small border-top pt-3">
                  Thank you for staying with HotelPro. For concierge inquiries, please contact concierge@hotelpro.com.
                </div>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer className="border-0 pt-0">
            <Button variant="outline-secondary" onClick={() => window.print()} className="rounded-pill px-3 d-flex align-items-center gap-1">
              <Printer size={15} /> Print Invoice
            </Button>
            <Button variant="primary" onClick={() => setShowInvoiceModal(false)} className="rounded-pill px-4">
              Close
            </Button>
          </Modal.Footer>
        </Modal>

        {/* ==================================================== */}
        {/* MODAL 2: CONFIRM STATUS CHANGE MODAL                 */}
        {/* ==================================================== */}
        <Modal show={showStatusModal} onHide={() => !statusUpdating && setShowStatusModal(false)} centered>
          <Modal.Header closeButton={!statusUpdating}>
            <Modal.Title className="fw-bold text-primary font-serif">
              Confirm Status Adjustment
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedBooking && (
              <div>
                <p>
                  Are you sure you wish to set reservation{' '}
                  <strong className="text-primary font-monospace">{selectedBooking.bookingReference}</strong> to{' '}
                  <Badge bg={newStatus === 'confirmed' ? 'success' : 'danger'} className="text-uppercase">
                    {newStatus}
                  </Badge>
                  ?
                </p>
                <div className="bg-light p-3 rounded-3 small border">
                  <div><strong>Guest:</strong> {selectedBooking.user?.name || 'Registered Guest'}</div>
                  <div><strong>Accommodations:</strong> {selectedBooking.room?.name || 'Suite'}</div>
                  <div><strong>Total Charges:</strong> ${selectedBooking.totalAmount}</div>
                </div>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowStatusModal(false)} disabled={statusUpdating} className="rounded-pill">
              Cancel
            </Button>
            <Button 
              variant={newStatus === 'confirmed' ? 'success' : 'danger'} 
              onClick={handleUpdateBookingStatus}
              disabled={statusUpdating}
              className="rounded-pill px-4 fw-bold"
            >
              {statusUpdating ? <Spinner size="sm" animation="border" className="me-2" /> : null}
              Confirm Status Change
            </Button>
          </Modal.Footer>
        </Modal>

        {/* ==================================================== */}
        {/* MODAL 3: EDIT ROOM MODAL                             */}
        {/* ==================================================== */}
        <Modal show={showEditModal} onHide={() => !editLoading && setShowEditModal(false)} size="lg" centered>
          <Modal.Header closeButton={!editLoading}>
            <Modal.Title className="fw-bold text-primary font-serif d-flex align-items-center gap-2">
              <Edit size={20} className="text-warning" /> Edit Suite Details
            </Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleSaveEditRoom}>
            <Modal.Body className="p-4">
              <Row className="g-3">
                <Col md={8}>
                  <Form.Group controlId="editName">
                    <Form.Label className="small fw-bold text-secondary">Suite Title / Identifier <span className="text-danger">*</span></Form.Label>
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
                    <Form.Label className="small fw-bold text-secondary">Suite Category <span className="text-danger">*</span></Form.Label>
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
                    <Form.Label className="small fw-bold text-secondary">Description <span className="text-danger">*</span></Form.Label>
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
                    <Form.Label className="small fw-bold text-secondary">Nightly Rate ($) <span className="text-danger">*</span></Form.Label>
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
                    <Form.Label className="small fw-bold text-secondary">Capacity (Guests) <span className="text-danger">*</span></Form.Label>
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
                    <Form.Label className="small fw-bold text-secondary">Status</Form.Label>
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
                    <Form.Label className="small fw-bold text-secondary">Amenities (Comma-separated)</Form.Label>
                    <Form.Control 
                      type="text" 
                      value={editFormData.amenitiesInput}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, amenitiesInput: e.target.value }))}
                    />
                  </Form.Group>
                </Col>

                <Col md={12}>
                  <Form.Group controlId="editImages">
                    <Form.Label className="small fw-bold text-secondary">Gallery Image URLs</Form.Label>
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
              <Button variant="secondary" onClick={() => setShowEditModal(false)} disabled={editLoading} className="rounded-pill">
                Cancel
              </Button>
              <Button type="submit" disabled={editLoading} className="btn-gold rounded-pill px-4 fw-bold">
                {editLoading ? <Spinner size="sm" animation="border" className="me-2" /> : null}
                Save Suite Changes
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </Container>
    </div>
  );
};

export default Admin;
