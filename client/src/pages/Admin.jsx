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
  InputGroup,
  Offcanvas,
  Dropdown
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
  CalendarCheck,
  CalendarDays,
  Eye,
  Search,
  RefreshCw,
  Edit,
  Trash2,
  XCircle,
  Clock,
  Mail,
  Phone,
  Check,
  X,
  ExternalLink,
  Sparkles,
  Printer,
  LayoutGrid,
  List,
  Crown,
  Hotel,
  LayoutDashboard,
  LogOut,
  Menu,
  ChevronRight,
  TrendingUp,
  Receipt,
  ArrowUpRight
} from 'lucide-react';

const Admin = () => {
  const { user, logout } = useAuth();
  const { tab: urlTab } = useParams();
  const navigate = useNavigate();

  // Active navigation tab: 'overview' | 'bookings' | 'rooms' | 'add-room' | 'users'
  const validTabs = ['overview', 'bookings', 'rooms', 'add-room', 'users'];
  const activeTab = validTabs.includes(urlTab) ? urlTab : 'overview';

  const handleTabChange = (selectedTab) => {
    navigate(selectedTab === 'overview' ? '/admin' : `/admin/${selectedTab}`);
    setShowMobileMenu(false);
  };

  // Mobile drawer state
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Rooms view mode: 'grid' | 'table'
  const [roomViewMode, setRoomViewMode] = useState('grid');

  // Global State from MongoDB Atlas
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [usersList, setUsersList] = useState([]);

  // Loading States
  const [roomsLoading, setRoomsLoading] = useState(false);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [usersLoading, setUsersLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Error & Success Feedback
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // ----------------------------------------------------
  // DATA FETCHING (REAL MONGODB ATLAS API)
  // ----------------------------------------------------
  const fetchRooms = async () => {
    try {
      setRoomsLoading(true);
      const { data } = await api.get('/rooms');
      setRooms(Array.isArray(data) ? data : []);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to load accommodations catalog');
    } finally {
      setRoomsLoading(false);
    }
  };

  const fetchBookings = async () => {
    try {
      setBookingsLoading(true);
      const { data } = await api.get('/bookings');
      setBookings(Array.isArray(data) ? data : []);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to load reservations ledger');
    } finally {
      setBookingsLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      setUsersLoading(true);
      const { data } = await api.get('/users');
      setUsersList(Array.isArray(data) ? data : []);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to load registered accounts directory');
    } finally {
      setUsersLoading(false);
    }
  };

  const handleRefreshAll = async () => {
    setIsRefreshing(true);
    setErrorMsg('');
    try {
      await Promise.all([fetchRooms(), fetchBookings(), fetchUsers()]);
      setSuccessMsg('Live dashboard data synchronized with MongoDB Atlas.');
    } catch {
      setErrorMsg('Error synchronizing live data.');
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchRooms();
    fetchBookings();
    fetchUsers();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  // ----------------------------------------------------
  // BOOKINGS SECTION STATE & FILTERS
  // ----------------------------------------------------
  const [bookingSearch, setBookingSearch] = useState('');
  const [bookingStatusFilter, setBookingStatusFilter] = useState('all');
  const [bookingDateFilter, setBookingDateFilter] = useState('all');
  const [bookingSortFilter, setBookingSortFilter] = useState('newest');

  // Status adjustment modal state
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [targetBookingStatus, setTargetBookingStatus] = useState('');
  const [targetPaymentStatus, setTargetPaymentStatus] = useState('');
  const [statusUpdating, setStatusUpdating] = useState(false);

  // Invoice modal state
  const [invoiceBooking, setInvoiceBooking] = useState(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  const handleOpenStatusModal = (booking, newStatus = null) => {
    setSelectedBooking(booking);
    setTargetBookingStatus(newStatus || booking.bookingStatus || booking.status || 'pending');
    setTargetPaymentStatus(booking.paymentStatus || 'pending');
    setShowStatusModal(true);
  };

  const handleOpenInvoice = (booking) => {
    setInvoiceBooking(booking);
    setShowInvoiceModal(true);
  };

  const handleUpdateBookingStatus = async () => {
    if (!selectedBooking) return;
    try {
      setStatusUpdating(true);
      const payload = {
        bookingStatus: targetBookingStatus,
        paymentStatus: targetPaymentStatus
      };
      await api.put(`/bookings/${selectedBooking._id}/status`, payload);
      setSuccessMsg(`Reservation ${selectedBooking.bookingReference} status updated to ${targetBookingStatus.toUpperCase()}.`);
      setShowStatusModal(false);
      setSelectedBooking(null);
      await fetchBookings();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to update booking status');
    } finally {
      setStatusUpdating(false);
    }
  };

  // Filter bookings logic
  const getFilteredBookingsList = (sourceList) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return sourceList.filter(b => {
      const q = bookingSearch.trim().toLowerCase();
      const matchesSearch = !q ||
        (b.bookingReference && b.bookingReference.toLowerCase().includes(q)) ||
        (b.user?.name && b.user.name.toLowerCase().includes(q)) ||
        (b.user?.email && b.user.email.toLowerCase().includes(q)) ||
        (b.room?.name && b.room.name.toLowerCase().includes(q));

      const statusVal = b.bookingStatus || b.status || 'pending';
      const matchesStatus = bookingStatusFilter === 'all' || statusVal === bookingStatusFilter;

      let matchesDate = true;
      if (bookingDateFilter !== 'all') {
        const checkIn = new Date(b.checkInDate);
        checkIn.setHours(0, 0, 0, 0);
        const checkOut = new Date(b.checkOutDate);
        checkOut.setHours(0, 0, 0, 0);

        if (bookingDateFilter === 'today') {
          matchesDate = checkIn <= today && checkOut >= today;
        } else if (bookingDateFilter === 'upcoming') {
          matchesDate = checkIn >= today;
        } else if (bookingDateFilter === 'past') {
          matchesDate = checkOut < today;
        } else if (bookingDateFilter === 'last30') {
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(today.getDate() - 30);
          matchesDate = new Date(b.createdAt) >= thirtyDaysAgo;
        }
      }

      return matchesSearch && matchesStatus && matchesDate;
    }).sort((a, b) => {
      if (bookingSortFilter === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
      if (bookingSortFilter === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
      if (bookingSortFilter === 'amount-high') return (b.totalAmount || 0) - (a.totalAmount || 0);
      if (bookingSortFilter === 'amount-low') return (a.totalAmount || 0) - (b.totalAmount || 0);
      return 0;
    });
  };

  const filteredBookings = getFilteredBookingsList(bookings);
  const recentBookings = filteredBookings.slice(0, 8);

  // ----------------------------------------------------
  // ROOMS SECTION STATE & HANDLERS
  // ----------------------------------------------------
  const [roomSearch, setRoomSearch] = useState('');
  const [roomTypeFilter, setRoomTypeFilter] = useState('all');
  const [roomStatusFilter, setRoomStatusFilter] = useState('all');

  // Edit room modal state
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

  // Delete room modal state
  const [deleteTargetRoom, setDeleteTargetRoom] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

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
      setSuccessMsg(`Suite "${editFormData.name}" updated successfully.`);
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
      setSuccessMsg(`Room "${room.name}" status changed to ${nextStatus.toUpperCase()}.`);
      await fetchRooms();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to toggle room status');
    }
  };

  const handleOpenDeleteModal = (room) => {
    setDeleteTargetRoom(room);
    setShowDeleteModal(true);
  };

  const handleConfirmDeleteRoom = async () => {
    if (!deleteTargetRoom) return;
    try {
      setDeleteLoading(true);
      await api.delete(`/rooms/${deleteTargetRoom._id}`);
      setSuccessMsg(`Room "${deleteTargetRoom.name}" has been removed from catalog.`);
      setShowDeleteModal(false);
      setDeleteTargetRoom(null);
      await fetchRooms();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to delete room');
    } finally {
      setDeleteLoading(false);
    }
  };

  const filteredRooms = rooms.filter(r => {
    const q = roomSearch.trim().toLowerCase();
    const matchesSearch = !q ||
      r.name.toLowerCase().includes(q) ||
      r.roomType.toLowerCase().includes(q) ||
      (r.description && r.description.toLowerCase().includes(q));

    const matchesType = roomTypeFilter === 'all' || r.roomType.toLowerCase() === roomTypeFilter.toLowerCase();
    const matchesStatus = roomStatusFilter === 'all' || r.status === roomStatusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  const availableRoomTypes = ['all', ...Array.from(new Set(rooms.map(r => r.roomType).filter(Boolean)))];

  // ----------------------------------------------------
  // ADD ROOM SECTION (LUXURY PRESETS & LIVE PREVIEW)
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
    const q = userSearch.trim().toLowerCase();
    const matchesSearch = !q ||
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      (u.phone && u.phone.includes(q));

    const matchesRole = userRoleFilter === 'all' || u.role === userRoleFilter;
    return matchesSearch && matchesRole;
  });

  // ----------------------------------------------------
  // THE 7 EXECUTIVE METRIC CALCULATIONS
  // ----------------------------------------------------
  const totalRoomsCount = (rooms || []).length;
  const availableRoomsCount = (rooms || []).filter(r => r && r.status === 'available').length;
  const totalBookingsCount = (bookings || []).length;
  const confirmedBookingsCount = (bookings || []).filter(b => b && (b.bookingStatus === 'confirmed' || b.status === 'confirmed')).length;
  const cancelledBookingsCount = (bookings || []).filter(b => b && (b.bookingStatus === 'cancelled' || b.status === 'cancelled')).length;
  const pendingBookingsCount = (bookings || []).filter(b => b && (b.bookingStatus === 'pending' || b.status === 'pending')).length;
  const registeredUsersCount = (usersList || []).length;
  const totalBookingRevenue = (bookings || [])
    .filter(b => b && ((b.bookingStatus === 'confirmed' || b.status === 'confirmed') || b.paymentStatus === 'paid'))
    .reduce((acc, curr) => acc + (curr.totalAmount || curr.amount || 0), 0);
  const totalRevenue = totalBookingRevenue;

  // Additional rates
  const occupancyRate = totalRoomsCount > 0 ? Math.round((availableRoomsCount / totalRoomsCount) * 100) : 0;
  const confirmationRate = totalBookingsCount > 0 ? Math.round((confirmedBookingsCount / totalBookingsCount) * 100) : 0;

  // ----------------------------------------------------
  // NAVIGATION LINKS DEFINITION
  // ----------------------------------------------------
  const navItems = [
    {
      key: 'overview',
      label: 'Overview',
      icon: <LayoutDashboard size={18} className="nav-icon" />,
      badge: 'Live',
      badgeClass: 'badge-gold'
    },
    {
      key: 'bookings',
      label: 'Bookings Ledger',
      icon: <CalendarCheck size={18} className="nav-icon" />,
      badge: totalBookingsCount,
      badgeClass: 'bg-light text-secondary'
    },
    {
      key: 'rooms',
      label: 'Accommodations',
      icon: <Bed size={18} className="nav-icon" />,
      badge: totalRoomsCount,
      badgeClass: 'bg-light text-secondary'
    },
    {
      key: 'add-room',
      label: 'Add New Suite',
      icon: <Plus size={18} className="nav-icon" />
    },
    {
      key: 'users',
      label: 'Guest Directory',
      icon: <Users size={18} className="nav-icon" />,
      badge: registeredUsersCount,
      badgeClass: 'bg-light text-secondary'
    }
  ];

  // Helper for Sidebar content
  const renderSidebarContent = () => (
    <div className="d-flex flex-column h-100">
      {/* Brand Header */}
      <div className="admin-sidebar-header">
        <div className="d-flex align-items-center gap-2 mb-2">
          <div className="bg-primary text-white p-2 rounded-3 d-flex align-items-center justify-content-center shadow-sm" style={{ background: 'var(--gold-gradient)' }}>
            <Hotel size={22} className="text-dark" />
          </div>
          <div>
            <div className="fs-5 fw-bold font-display text-white tracking-wide">HotelPro</div>
            <div className="text-gold small fw-bold font-display" style={{ fontSize: '0.65rem', letterSpacing: '0.1em' }}>
              MANAGEMENT PORTAL
            </div>
          </div>
        </div>
      </div>

      {/* Nav Items */}
      <div className="admin-sidebar-body">
        <div className="admin-sidebar-section-title">Navigation Hub</div>
        {navItems.map(item => {
          const isActive = activeTab === item.key;
          return (
            <div
              key={item.key}
              onClick={() => handleTabChange(item.key)}
              className={`admin-nav-item ${isActive ? 'active' : ''}`}
            >
              <div className="d-flex align-items-center gap-2.5">
                {item.icon}
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span className={`badge ${item.badgeClass} rounded-pill px-2 py-0.5`} style={{ fontSize: '0.7rem' }}>
                  {item.badge}
                </span>
              )}
            </div>
          );
        })}

        <div className="admin-sidebar-section-title mt-4">External Navigation</div>
        <Link
          to="/rooms"
          className="admin-nav-item text-secondary"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className="d-flex align-items-center gap-2.5">
            <ExternalLink size={18} className="text-secondary" />
            <span>Public Catalog</span>
          </div>
          <ArrowUpRight size={14} className="text-muted" />
        </Link>
        <Link to="/" className="admin-nav-item text-secondary">
          <div className="d-flex align-items-center gap-2.5">
            <Hotel size={18} className="text-secondary" />
            <span>Guest Home Page</span>
          </div>
        </Link>
      </div>

      {/* Sidebar Footer with Active Admin Card & Logout */}
      <div className="admin-sidebar-footer">
        <div className="p-3 rounded-4" style={{ background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <div className="d-flex align-items-center gap-2.5 mb-2.5">
            <div className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-dark shadow-sm flex-shrink-0" style={{ width: 38, height: 38, background: 'var(--gold-gradient)', fontSize: '1rem' }}>
              {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
            </div>
            <div className="overflow-hidden flex-grow-1" style={{ minWidth: 0 }}>
              <div className="fw-bold text-white small text-truncate" title={user?.name} style={{ fontSize: '0.86rem' }}>
                {user?.name || 'Administrator'}
              </div>
              <div className="d-flex align-items-center gap-1.5 mt-0.5">
                <span className="badge badge-gold py-0.5 px-1.5 text-uppercase font-display" style={{ fontSize: '0.6rem', letterSpacing: '0.06em' }}>
                  Verified Admin
                </span>
              </div>
            </div>
          </div>

          <div className="d-flex align-items-center justify-content-between pt-2 border-top border-secondary border-opacity-25">
            <span className="text-secondary small text-truncate me-2" title={user?.email} style={{ fontSize: '0.73rem' }}>
              {user?.email}
            </span>
            <Button
              variant="outline-danger"
              size="sm"
              onClick={handleLogout}
              className="py-0.5 px-2 rounded-pill d-flex align-items-center gap-1 border-0"
              style={{ fontSize: '0.72rem', background: 'rgba(239, 68, 68, 0.12)' }}
              title="Sign Out of Portal"
            >
              <LogOut size={12} /> Sign Out
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="admin-wrapper">
      {/* ---------------------------------------------------- */}
      {/* 1. DESKTOP PERMANENT SIDEBAR                         */}
      {/* ---------------------------------------------------- */}
      <aside className="admin-sidebar-desktop">
        {renderSidebarContent()}
      </aside>

      {/* ---------------------------------------------------- */}
      {/* 2. RESPONSIVE MOBILE DRAWER / OFFCANVAS              */}
      {/* ---------------------------------------------------- */}
      <Offcanvas
        show={showMobileMenu}
        onHide={() => setShowMobileMenu(false)}
        className="bg-dark text-white p-0 border-end border-gold"
        style={{ width: '290px', background: 'linear-gradient(180deg, #0A1424 0%, #12233D 100%)' }}
      >
        <Offcanvas.Header closeButton closeVariant="white" className="border-bottom border-secondary border-opacity-25 pb-3">
          <Offcanvas.Title className="font-display text-white fs-6">
            <Shield size={16} className="text-warning me-2" /> HotelPro Staff Portal
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className="p-0">
          {renderSidebarContent()}
        </Offcanvas.Body>
      </Offcanvas>

      {/* ---------------------------------------------------- */}
      {/* 3. MAIN DASHBOARD VIEWPORT                           */}
      {/* ---------------------------------------------------- */}
      <div className="admin-main-viewport">
        {/* Top Navbar */}
        <header className="admin-topbar d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-3">
            {/* Hamburger button visible on mobile/tablet */}
            <Button
              variant="light"
              onClick={() => setShowMobileMenu(true)}
              className="d-lg-none p-1.5 border rounded-3 text-primary"
              aria-label="Toggle Navigation Menu"
            >
              <Menu size={20} />
            </Button>

            <div>
              <div className="d-flex align-items-center gap-2">
                <span className="badge badge-gold px-2 py-0.5 font-display text-uppercase" style={{ fontSize: '0.65rem' }}>
                  HotelPro Central Command
                </span>
                <span className="text-muted d-none d-sm-inline" style={{ fontSize: '0.78rem' }}>• MongoDB Atlas Sync</span>
              </div>
              <h5 className="fw-bold text-primary mb-0 font-serif text-capitalize">
                {activeTab === 'overview' && 'Executive Overview & Statistics'}
                {activeTab === 'bookings' && 'Guest Reservations Ledger'}
                {activeTab === 'rooms' && 'Accommodations Inventory Catalog'}
                {activeTab === 'add-room' && 'New Suite Provisioning'}
                {activeTab === 'users' && 'Guest Profiles & Staff Directory'}
              </h5>
            </div>
          </div>

          <div className="d-flex align-items-center gap-2">
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={handleRefreshAll}
              disabled={isRefreshing}
              className="d-flex align-items-center gap-1.5 px-3 py-1.5 rounded-pill small bg-white shadow-sm"
              title="Refresh Atlas Database Data"
            >
              <RefreshCw size={14} className={isRefreshing ? 'spinner-border spinner-border-sm' : ''} />
              <span className="d-none d-md-inline">{isRefreshing ? 'Syncing...' : 'Sync Atlas'}</span>
            </Button>

            <Button
              size="sm"
              onClick={() => handleTabChange('add-room')}
              className="btn-gold d-flex align-items-center gap-1.5 px-3 py-1.5 rounded-pill fw-bold shadow-sm"
            >
              <Plus size={15} />
              <span className="d-none d-sm-inline">Add Room</span>
            </Button>

            <Dropdown align="end">
              <Dropdown.Toggle
                variant="light"
                id="admin-user-menu"
                className="d-flex align-items-center gap-2 px-2 py-1 rounded-pill border bg-white shadow-sm"
              >
                <div className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-white small" style={{ width: 28, height: 28, background: '#12233D' }}>
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
                </div>
                <span className="small fw-bold text-dark d-none d-md-inline">{user?.name?.split(' ')[0]}</span>
              </Dropdown.Toggle>

              <Dropdown.Menu className="shadow-lg border-0 rounded-4 mt-2 p-2" style={{ minWidth: 220 }}>
                <div className="px-3 py-2 border-bottom mb-1">
                  <div className="fw-bold text-dark small">{user?.name}</div>
                  <div className="text-muted small text-truncate" style={{ fontSize: '0.75rem' }}>{user?.email}</div>
                  <span className="badge badge-gold mt-1" style={{ fontSize: '0.62rem' }}>Administrator</span>
                </div>
                <Dropdown.Item as={Link} to="/" className="small py-2 rounded-2">
                  <Hotel size={14} className="me-2 text-primary" /> View Guest Website
                </Dropdown.Item>
                <Dropdown.Item as={Link} to="/rooms" className="small py-2 rounded-2">
                  <Eye size={14} className="me-2 text-primary" /> Public Room Catalog
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={handleLogout} className="small py-2 text-danger rounded-2">
                  <LogOut size={14} className="me-2" /> Sign Out of Portal
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </header>

        {/* Global Feedback Notifications */}
        <Container fluid className="px-3 px-lg-4 pt-3">
          {successMsg && (
            <Alert variant="success" dismissible onClose={() => setSuccessMsg('')} className="shadow-sm mb-3 border-0 rounded-3 small py-2.5">
              <CheckCircle size={16} className="me-2 text-success" />
              {successMsg}
            </Alert>
          )}

          {errorMsg && (
            <Alert variant="danger" dismissible onClose={() => setErrorMsg('')} className="shadow-sm mb-3 border-0 rounded-3 small py-2.5">
              <AlertCircle size={16} className="me-2 text-danger" />
              {errorMsg}
            </Alert>
          )}
        </Container>

        {/* Dashboard Content Container */}
        <div className="admin-content-area flex-grow-1">
          {/* ==================================================== */}
          {/* VIEW 1: OVERVIEW DASHBOARD                           */}
          {/* ==================================================== */}
          {activeTab === 'overview' && (
            <div>
              {/* Executive Welcome Hero Banner */}
              <div
                className="card-luxury p-4 mb-4 border-0 text-white shadow-sm"
                style={{
                  background: 'linear-gradient(135deg, #0A1424 0%, #12233D 60%, #1B355A 100%)',
                  borderRadius: '20px'
                }}
              >
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                  <div>
                    <div className="d-flex align-items-center gap-2 mb-2">
                      <span className="badge badge-gold px-2.5 py-1 text-uppercase tracking-wider font-display">
                        <Crown size={12} className="me-1" /> Grand Executive Desk
                      </span>
                      <span className="badge bg-white-subtle text-light px-2.5 py-1" style={{ fontSize: '0.75rem', backdropFilter: 'blur(8px)' }}>
                        Live Admin: <strong className="text-warning">{user?.name}</strong>
                      </span>
                    </div>
                    <h2 className="fw-bold mb-1 text-white font-serif" style={{ fontSize: '1.9rem' }}>
                      HotelPro Command & Operations
                    </h2>
                    <p className="small mb-0" style={{ color: '#E2E8F0', opacity: 0.85 }}>
                      Comprehensive administrative monitoring for luxury room inventory, bookings, revenue, and accounts.
                    </p>
                  </div>

                  <div className="d-flex flex-wrap gap-2">
                    <Button
                      variant="outline-light"
                      size="sm"
                      onClick={() => handleTabChange('bookings')}
                      className="rounded-pill px-3 py-2 small border-light-subtle d-flex align-items-center gap-1.5"
                    >
                      <Receipt size={14} /> View All Bookings
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleTabChange('add-room')}
                      className="btn-gold rounded-pill px-3 py-2 small fw-bold d-flex align-items-center gap-1.5"
                    >
                      <Plus size={15} /> Add New Suite
                    </Button>
                  </div>
                </div>
              </div>

              {/* -------------------------------------------------- */}
              {/* THE 7 SUMMARY CARDS AS REQUIRED BY SPECIFICATION   */}
              {/* -------------------------------------------------- */}
              <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6 className="text-uppercase fw-bold text-muted small tracking-wider mb-0">
                    Operations Key Performance Indicators
                  </h6>
                  <span className="small text-muted" style={{ fontSize: '0.75rem' }}>
                    Synced live with MongoDB Atlas
                  </span>
                </div>

                <Row className="g-3">
                  {/* Card 1: Total Rooms */}
                  <Col xl={3} lg={4} sm={6}>
                    <div className="admin-stat-card h-100" style={{ '--card-accent': '#12233D' }}>
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <div className="text-muted small fw-bold text-uppercase" style={{ fontSize: '0.7rem', letterSpacing: '0.05em' }}>
                            Total Rooms
                          </div>
                          <h3 className="fw-bold text-primary mt-1 mb-0">{totalRoomsCount}</h3>
                          <div className="small text-muted mt-1" style={{ fontSize: '0.78rem' }}>
                            Catalog accommodations
                          </div>
                        </div>
                        <div className="admin-stat-icon-wrapper" style={{ background: 'rgba(18, 35, 61, 0.08)', color: '#12233D' }}>
                          <Bed size={22} />
                        </div>
                      </div>
                    </div>
                  </Col>

                  {/* Card 2: Available Rooms */}
                  <Col xl={3} lg={4} sm={6}>
                    <div className="admin-stat-card h-100" style={{ '--card-accent': '#10B981' }}>
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <div className="text-muted small fw-bold text-uppercase" style={{ fontSize: '0.7rem', letterSpacing: '0.05em' }}>
                            Available Rooms
                          </div>
                          <h3 className="fw-bold text-success mt-1 mb-0">{availableRoomsCount}</h3>
                          <div className="small text-muted mt-1" style={{ fontSize: '0.78rem' }}>
                            <span className="text-success fw-bold">{occupancyRate}%</span> ready for guests
                          </div>
                        </div>
                        <div className="admin-stat-icon-wrapper" style={{ background: 'rgba(16, 185, 129, 0.12)', color: '#10B981' }}>
                          <CheckCircle size={22} />
                        </div>
                      </div>
                    </div>
                  </Col>

                  {/* Card 3: Total Bookings */}
                  <Col xl={3} lg={4} sm={6}>
                    <div className="admin-stat-card h-100" style={{ '--card-accent': '#3B82F6' }}>
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <div className="text-muted small fw-bold text-uppercase" style={{ fontSize: '0.7rem', letterSpacing: '0.05em' }}>
                            Total Bookings
                          </div>
                          <h3 className="fw-bold text-dark mt-1 mb-0">{totalBookingsCount}</h3>
                          <div className="small text-muted mt-1" style={{ fontSize: '0.78rem' }}>
                            All-time reservations
                          </div>
                        </div>
                        <div className="admin-stat-icon-wrapper" style={{ background: 'rgba(59, 130, 246, 0.12)', color: '#3B82F6' }}>
                          <CalendarDays size={22} />
                        </div>
                      </div>
                    </div>
                  </Col>

                  {/* Card 4: Confirmed Bookings */}
                  <Col xl={3} lg={4} sm={6}>
                    <div className="admin-stat-card h-100" style={{ '--card-accent': '#059669' }}>
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <div className="text-muted small fw-bold text-uppercase" style={{ fontSize: '0.7rem', letterSpacing: '0.05em' }}>
                            Confirmed Bookings
                          </div>
                          <h3 className="fw-bold text-success mt-1 mb-0">{confirmedBookingsCount}</h3>
                          <div className="small text-muted mt-1" style={{ fontSize: '0.78rem' }}>
                            <span className="text-success fw-bold">{confirmationRate}%</span> confirmation rate
                          </div>
                        </div>
                        <div className="admin-stat-icon-wrapper" style={{ background: 'rgba(5, 150, 105, 0.12)', color: '#059669' }}>
                          <CalendarCheck size={22} />
                        </div>
                      </div>
                    </div>
                  </Col>

                  {/* Card 5: Cancelled Bookings */}
                  <Col xl={4} lg={4} sm={6}>
                    <div className="admin-stat-card h-100" style={{ '--card-accent': '#EF4444' }}>
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <div className="text-muted small fw-bold text-uppercase" style={{ fontSize: '0.7rem', letterSpacing: '0.05em' }}>
                            Cancelled Bookings
                          </div>
                          <h3 className="fw-bold text-danger mt-1 mb-0">{cancelledBookingsCount}</h3>
                          <div className="small text-muted mt-1" style={{ fontSize: '0.78rem' }}>
                            {pendingBookingsCount} pending reservations
                          </div>
                        </div>
                        <div className="admin-stat-icon-wrapper" style={{ background: 'rgba(239, 68, 68, 0.12)', color: '#EF4444' }}>
                          <XCircle size={22} />
                        </div>
                      </div>
                    </div>
                  </Col>

                  {/* Card 6: Registered Users */}
                  <Col xl={4} lg={4} sm={6}>
                    <div className="admin-stat-card h-100" style={{ '--card-accent': '#8B5CF6' }}>
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <div className="text-muted small fw-bold text-uppercase" style={{ fontSize: '0.7rem', letterSpacing: '0.05em' }}>
                            Registered Users
                          </div>
                          <h3 className="fw-bold text-dark mt-1 mb-0">{registeredUsersCount}</h3>
                          <div className="small text-muted mt-1" style={{ fontSize: '0.78rem' }}>
                            Guests & elevated staff accounts
                          </div>
                        </div>
                        <div className="admin-stat-icon-wrapper" style={{ background: 'rgba(139, 92, 246, 0.12)', color: '#8B5CF6' }}>
                          <Users size={22} />
                        </div>
                      </div>
                    </div>
                  </Col>

                  {/* Card 7: Total Booking Revenue */}
                  <Col xl={4} lg={4} sm={12}>
                    <div className="admin-stat-card h-100" style={{ '--card-accent': '#D4AF37' }}>
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <div className="text-muted small fw-bold text-uppercase" style={{ fontSize: '0.7rem', letterSpacing: '0.05em' }}>
                            Total Booking Revenue
                          </div>
                          <h3 className="fw-bold text-gold mt-1 mb-0">${(totalRevenue || 0).toLocaleString()}</h3>
                          <div className="small text-muted mt-1" style={{ fontSize: '0.78rem' }}>
                            Realized guest charges
                          </div>
                        </div>
                        <div className="admin-stat-icon-wrapper" style={{ background: 'rgba(212, 175, 55, 0.15)', color: '#B8860B' }}>
                          <DollarSign size={22} />
                        </div>
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>

              {/* -------------------------------------------------- */}
              {/* RECENT BOOKINGS TABLE WITH SEARCH & DATE/STATUS     */}
              {/* -------------------------------------------------- */}
              <div className="card-luxury overflow-hidden bg-white">
                <div className="p-3.5 p-lg-4 border-bottom d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3">
                  <div>
                    <h5 className="fw-bold mb-0 text-primary font-serif d-flex align-items-center gap-2">
                      <CalendarCheck size={20} className="text-warning" /> Recent Bookings Ledger
                    </h5>
                    <span className="text-muted small">Live reservations with guest details, payment status, and quick actions</span>
                  </div>

                  {/* Controls: Search, Status Filter, Date Filter, Sort */}
                  <div className="d-flex flex-wrap gap-2 align-items-center">
                    <InputGroup style={{ maxWidth: '240px' }} size="sm">
                      <InputGroup.Text className="bg-light border-end-0">
                        <Search size={13} className="text-muted" />
                      </InputGroup.Text>
                      <Form.Control
                        placeholder="Search ref, guest, room..."
                        value={bookingSearch}
                        onChange={(e) => setBookingSearch(e.target.value)}
                        className="border-start-0"
                      />
                    </InputGroup>

                    <Form.Select
                      size="sm"
                      value={bookingStatusFilter}
                      onChange={(e) => setBookingStatusFilter(e.target.value)}
                      style={{ width: '135px' }}
                      className="fw-medium"
                    >
                      <option value="all">All Statuses</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="pending">Pending</option>
                      <option value="cancelled">Cancelled</option>
                    </Form.Select>

                    <Form.Select
                      size="sm"
                      value={bookingDateFilter}
                      onChange={(e) => setBookingDateFilter(e.target.value)}
                      style={{ width: '135px' }}
                      className="fw-medium"
                    >
                      <option value="all">All Dates</option>
                      <option value="today">Today's Stays</option>
                      <option value="upcoming">Upcoming</option>
                      <option value="past">Past Stays</option>
                      <option value="last30">Last 30 Days</option>
                    </Form.Select>

                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => handleTabChange('bookings')}
                      className="rounded-pill px-3"
                    >
                      View All
                    </Button>
                  </div>
                </div>

                <div className="p-0">
                  {bookingsLoading ? (
                    <div className="text-center py-5">
                      <Spinner animation="border" variant="primary" />
                      <p className="text-muted mt-2 mb-0 small">Retrieving reservations from MongoDB Atlas...</p>
                    </div>
                  ) : recentBookings.length === 0 ? (
                    <div className="text-center py-5">
                      <CalendarDays size={42} className="text-muted mb-2 opacity-50" />
                      <p className="text-muted mb-2">No reservations match the specified filter criteria.</p>
                      {(bookingSearch || bookingStatusFilter !== 'all' || bookingDateFilter !== 'all') && (
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          onClick={() => { setBookingSearch(''); setBookingStatusFilter('all'); setBookingDateFilter('all'); }}
                          className="rounded-pill px-3"
                        >
                          Clear Filters
                        </Button>
                      )}
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <Table className="table-luxury align-middle mb-0">
                        <thead>
                          <tr>
                            <th>Reference</th>
                            <th>Guest Information</th>
                            <th>Accommodation</th>
                            <th>Schedule</th>
                            <th>Duration</th>
                            <th>Amount</th>
                            <th>Payment</th>
                            <th>Status</th>
                            <th className="text-end">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {recentBookings.map(b => {
                            const statusVal = b.bookingStatus || b.status || 'pending';
                            const isConfirmed = statusVal === 'confirmed';
                            const isCancelled = statusVal === 'cancelled';

                            return (
                              <tr key={b._id}>
                                <td>
                                  <span className="badge bg-light text-primary font-monospace px-2.5 py-1.5 border fw-bold">
                                    {b.bookingReference}
                                  </span>
                                  <div className="small text-muted mt-1" style={{ fontSize: '0.72rem' }}>
                                    {b.createdAt ? new Date(b.createdAt).toLocaleDateString() : 'N/A'}
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
                                    {b.room?.roomType || 'Accommodation'}
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
                                    {b.numberOfNights || b.totalDays || 1} Night(s)
                                  </div>
                                  <div className="small text-muted">
                                    {b.guestCount || 1} Guest(s)
                                  </div>
                                </td>
                                <td>
                                  <span className="fw-bold text-gold fs-6">${b.totalAmount || b.amount}</span>
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
                                <td>
                                  <Badge bg={
                                    isConfirmed ? 'success' :
                                      isCancelled ? 'danger' : 'warning'
                                  } className="text-capitalize px-2.5 py-1.5 rounded-pill">
                                    {statusVal}
                                  </Badge>
                                </td>
                                <td className="text-end">
                                  <div className="d-flex justify-content-end gap-1.5">
                                    <Button
                                      variant="outline-secondary"
                                      size="sm"
                                      onClick={() => handleOpenInvoice(b)}
                                      className="d-flex align-items-center gap-1 px-2.5 py-1 rounded-pill"
                                      title="Print Official Invoice"
                                    >
                                      <Receipt size={13} /> Invoice
                                    </Button>
                                    {!isConfirmed && !isCancelled && (
                                      <Button
                                        variant="outline-success"
                                        size="sm"
                                        onClick={() => handleOpenStatusModal(b, 'confirmed')}
                                        className="d-flex align-items-center gap-1 px-2.5 py-1 rounded-pill"
                                        title="Confirm Reservation"
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
                                        title="Cancel Reservation"
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

                {recentBookings.length > 0 && (
                  <div className="p-3 bg-light border-top d-flex justify-content-between align-items-center">
                    <span className="small text-muted">
                      Showing latest {recentBookings.length} of {filteredBookings.length} reservations
                    </span>
                    <Button
                      variant="link"
                      onClick={() => handleTabChange('bookings')}
                      className="p-0 small fw-bold text-primary text-decoration-none d-flex align-items-center gap-1"
                    >
                      View Full Reservations Ledger &rarr;
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* VIEW 2: ALL BOOKINGS LEDGER                          */}
          {/* ==================================================== */}
          {activeTab === 'bookings' && (
            <div className="card-luxury overflow-hidden bg-white">
              <div className="p-4 border-bottom d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3">
                <div>
                  <h4 className="fw-bold mb-0 text-primary font-serif d-flex align-items-center gap-2">
                    <CalendarCheck size={22} className="text-warning" /> All Guest Reservations
                  </h4>
                  <span className="text-muted small">Complete ledger with search, multi-factor filtering, status updates, and invoice printing</span>
                </div>

                {/* Filters */}
                <div className="d-flex flex-wrap gap-2 align-items-center">
                  <InputGroup style={{ maxWidth: '240px' }} size="sm">
                    <InputGroup.Text className="bg-light border-end-0">
                      <Search size={13} className="text-muted" />
                    </InputGroup.Text>
                    <Form.Control
                      placeholder="Search ref, guest, room..."
                      value={bookingSearch}
                      onChange={(e) => setBookingSearch(e.target.value)}
                      className="border-start-0"
                    />
                  </InputGroup>

                  <Form.Select
                    size="sm"
                    value={bookingStatusFilter}
                    onChange={(e) => setBookingStatusFilter(e.target.value)}
                    style={{ width: '140px' }}
                    className="fw-medium"
                  >
                    <option value="all">All Statuses</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="pending">Pending</option>
                    <option value="cancelled">Cancelled</option>
                  </Form.Select>

                  <Form.Select
                    size="sm"
                    value={bookingDateFilter}
                    onChange={(e) => setBookingDateFilter(e.target.value)}
                    style={{ width: '140px' }}
                    className="fw-medium"
                  >
                    <option value="all">All Dates</option>
                    <option value="today">Today</option>
                    <option value="upcoming">Upcoming</option>
                    <option value="past">Past</option>
                    <option value="last30">Last 30 Days</option>
                  </Form.Select>

                  <Form.Select
                    size="sm"
                    value={bookingSortFilter}
                    onChange={(e) => setBookingSortFilter(e.target.value)}
                    style={{ width: '150px' }}
                    className="fw-medium"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="amount-high">Amount: High &rarr; Low</option>
                    <option value="amount-low">Amount: Low &rarr; High</option>
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
                    <CalendarDays size={48} className="text-muted mb-2 opacity-50" />
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
                          <th>Payment</th>
                          <th>Status</th>
                          <th className="text-end">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredBookings.map(b => {
                          const statusVal = b.bookingStatus || b.status || 'pending';
                          const isConfirmed = statusVal === 'confirmed';
                          const isCancelled = statusVal === 'cancelled';

                          return (
                            <tr key={b._id}>
                              <td>
                                <span className="badge bg-light text-primary font-monospace px-2.5 py-1.5 border fw-bold">
                                  {b.bookingReference}
                                </span>
                                <div className="small text-muted mt-1" style={{ fontSize: '0.72rem' }}>
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
                                  {b.numberOfNights || b.totalDays || 1} Night(s)
                                </div>
                                <div className="small text-muted">
                                  {b.guestCount || 1} Guest(s)
                                </div>
                              </td>
                              <td>
                                <span className="fw-bold text-gold fs-6">${b.totalAmount || b.amount}</span>
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
                              <td>
                                <Badge bg={
                                  isConfirmed ? 'success' :
                                    isCancelled ? 'danger' : 'warning'
                                } className="text-capitalize px-2.5 py-1.5 rounded-pill">
                                  {statusVal}
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
                                    <Receipt size={13} /> Invoice
                                  </Button>
                                  <Button
                                    variant="outline-primary"
                                    size="sm"
                                    onClick={() => handleOpenStatusModal(b)}
                                    className="d-flex align-items-center gap-1 px-2.5 py-1 rounded-pill"
                                    title="Adjust Status"
                                  >
                                    <Edit size={13} /> Status
                                  </Button>
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
          {/* VIEW 3: ALL ROOMS CATALOG                            */}
          {/* ==================================================== */}
          {activeTab === 'rooms' && (
            <div className="card-luxury overflow-hidden bg-white">
              <div className="p-4 border-bottom d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                <div>
                  <h4 className="fw-bold mb-0 text-primary font-serif d-flex align-items-center gap-2">
                    <Bed size={22} className="text-warning" /> Accommodations Catalog
                  </h4>
                  <span className="text-muted small">Manage hotel suites, rates, guest capacity, and operational status</span>
                </div>

                <div className="d-flex flex-wrap gap-2 align-items-center">
                  {/* Grid vs Table toggle */}
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

                  <InputGroup style={{ maxWidth: '220px' }} size="sm">
                    <InputGroup.Text className="bg-light border-end-0">
                      <Search size={13} className="text-muted" />
                    </InputGroup.Text>
                    <Form.Control
                      placeholder="Search suite..."
                      value={roomSearch}
                      onChange={(e) => setRoomSearch(e.target.value)}
                      className="border-start-0"
                    />
                  </InputGroup>

                  <Form.Select
                    size="sm"
                    value={roomTypeFilter}
                    onChange={(e) => setRoomTypeFilter(e.target.value)}
                    style={{ width: '150px' }}
                    className="fw-medium"
                  >
                    {availableRoomTypes.map(t => (
                      <option key={t} value={t}>
                        {t === 'all' ? 'All Suite Types' : t}
                      </option>
                    ))}
                  </Form.Select>

                  <Form.Select
                    size="sm"
                    value={roomStatusFilter}
                    onChange={(e) => setRoomStatusFilter(e.target.value)}
                    style={{ width: '140px' }}
                    className="fw-medium"
                  >
                    <option value="all">All Statuses</option>
                    <option value="available">Available</option>
                    <option value="maintenance">Maintenance</option>
                  </Form.Select>

                  <Button
                    size="sm"
                    onClick={() => handleTabChange('add-room')}
                    className="btn-gold rounded-pill px-3 fw-bold"
                  >
                    <Plus size={15} /> Add Suite
                  </Button>
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
                                  className="rounded-pill px-2.5 py-1 d-flex align-items-center gap-1"
                                >
                                  <Edit size={13} /> Edit
                                </Button>
                                <Button
                                  variant="outline-danger"
                                  size="sm"
                                  onClick={() => handleOpenDeleteModal(room)}
                                  className="rounded-pill p-1.5"
                                  title="Delete Suite"
                                >
                                  <Trash2 size={13} />
                                </Button>
                                <Button
                                  as={Link}
                                  to={`/rooms/${room._id}`}
                                  variant="light"
                                  size="sm"
                                  className="rounded-pill p-1.5 border"
                                  title="Public View"
                                  target="_blank"
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
                          <th>Suite & Photo</th>
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
                                  variant="outline-danger"
                                  size="sm"
                                  onClick={() => handleOpenDeleteModal(room)}
                                  className="rounded-pill p-1.5"
                                  title="Delete Suite"
                                >
                                  <Trash2 size={13} />
                                </Button>
                                <Button
                                  as={Link}
                                  to={`/rooms/${room._id}`}
                                  variant="light"
                                  size="sm"
                                  className="rounded-pill p-1.5 border"
                                  target="_blank"
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
          {/* VIEW 4: ADD ROOM WITH SPLIT VIEW & LIVE PREVIEW      */}
          {/* ==================================================== */}
          {activeTab === 'add-room' && (
            <Row className="g-4">
              {/* Left Column: Form Card */}
              <Col lg={7}>
                <div className="admin-form-card">
                  {/* Section Title Header */}
                  <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-2 mb-4 pb-3 border-bottom">
                    <div>
                      <div className="d-flex align-items-center gap-2 mb-1">
                        <span className="badge badge-gold px-2.5 py-0.5 text-uppercase font-display" style={{ fontSize: '0.62rem' }}>
                          Inventory Management
                        </span>
                        <span className="text-muted small" style={{ fontSize: '0.78rem' }}>• Live Atlas Sync</span>
                      </div>
                      <h4 className="fw-bold mb-0 text-primary font-serif d-flex align-items-center gap-2">
                        <Plus size={22} className="text-warning" /> New Suite Provisioning
                      </h4>
                    </div>
                    <Badge bg="success-subtle" className="text-success border border-success-subtle px-3 py-1.5 align-self-start align-self-sm-auto rounded-pill">
                      ● Ready to Publish
                    </Badge>
                  </div>

                  {/* 1-Click Luxury Presets Bar */}
                  <div className="mb-4 p-3.5 rounded-4 border" style={{ background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.08) 0%, rgba(18, 35, 61, 0.03) 100%)', borderColor: 'rgba(212, 175, 55, 0.25)' }}>
                    <div className="d-flex align-items-center justify-content-between mb-2.5">
                      <span className="small fw-bold text-primary d-flex align-items-center gap-1.5 font-display" style={{ fontSize: '0.8rem', letterSpacing: '0.04em' }}>
                        <Sparkles size={14} className="text-warning" /> 1-Click Curated Luxury Presets
                      </span>
                      <span className="text-muted small" style={{ fontSize: '0.72rem' }}>Click to auto-populate specifications</span>
                    </div>
                    <div className="d-flex flex-wrap gap-2">
                      {luxuryPresets.map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleApplyPreset(preset)}
                          className="luxury-preset-chip"
                        >
                          <Sparkles size={12} className="text-warning" /> {preset.title}
                        </button>
                      ))}
                    </div>
                  </div>

                  {addError && (
                    <Alert variant="danger" dismissible onClose={() => setAddError('')} className="mb-4 small rounded-3 border-0 shadow-sm">
                      <AlertCircle size={16} className="me-2" />
                      {addError}
                    </Alert>
                  )}

                  <Form onSubmit={handleAddRoomSubmit}>
                    {/* SECTION 1: IDENTITY & DESCRIPTION */}
                    <div className="mb-4">
                      <div className="admin-form-section-title d-flex align-items-center gap-2">
                        <Crown size={16} className="text-warning" /> Suite Identity & Architectural Classification
                      </div>
                      <div className="admin-form-section-desc">
                        Define the primary public title, category tier, and hospitality narrative for this suite.
                      </div>

                      <Row className="g-3">
                        <Col md={8}>
                          <Form.Group controlId="addName">
                            <label className="admin-form-label">
                              Suite Title or Identifier <span className="text-danger">*</span>
                            </label>
                            <Form.Control
                              type="text"
                              name="name"
                              placeholder="e.g. Grand Horizon Penthouse 501"
                              value={addFormData.name}
                              onChange={handleAddInputChange}
                              required
                            />
                          </Form.Group>
                        </Col>

                        <Col md={4}>
                          <Form.Group controlId="addRoomType">
                            <label className="admin-form-label">
                              Suite Category <span className="text-danger">*</span>
                            </label>
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
                            <label className="admin-form-label">
                              Suite Description & Narrative <span className="text-danger">*</span>
                            </label>
                            <Form.Control
                              as="textarea"
                              rows={3}
                              name="description"
                              placeholder="Provide evocative details about architectural design, panoramic views, bedding, and bespoke appointments..."
                              value={addFormData.description}
                              onChange={handleAddInputChange}
                              required
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                    </div>

                    <hr className="my-4" style={{ borderColor: '#E2E8F0', opacity: 0.7 }} />

                    {/* SECTION 2: RATES, CAPACITY & STATUS */}
                    <div className="mb-4">
                      <div className="admin-form-section-title d-flex align-items-center gap-2">
                        <DollarSign size={16} className="text-warning" /> Pricing, Capacity & Operational Status
                      </div>
                      <div className="admin-form-section-desc">
                        Configure base nightly rates in USD, guest limits, and inventory booking status.
                      </div>

                      <Row className="g-3">
                        <Col md={4}>
                          <Form.Group controlId="addPrice">
                            <label className="admin-form-label">
                              Nightly Rate ($) <span className="text-danger">*</span>
                            </label>
                            <InputGroup>
                              <InputGroup.Text className="bg-light fw-bold text-muted">$</InputGroup.Text>
                              <Form.Control
                                type="number"
                                min="0"
                                name="pricePerNight"
                                value={addFormData.pricePerNight}
                                onChange={handleAddInputChange}
                                required
                              />
                            </InputGroup>
                          </Form.Group>
                        </Col>

                        <Col md={4}>
                          <Form.Group controlId="addCapacity">
                            <label className="admin-form-label">
                              Max Capacity (Guests) <span className="text-danger">*</span>
                            </label>
                            <InputGroup>
                              <InputGroup.Text className="bg-light text-muted">
                                <Users size={14} />
                              </InputGroup.Text>
                              <Form.Control
                                type="number"
                                min="1"
                                max="12"
                                name="capacity"
                                value={addFormData.capacity}
                                onChange={handleAddInputChange}
                                required
                              />
                            </InputGroup>
                          </Form.Group>
                        </Col>

                        <Col md={4}>
                          <Form.Group controlId="addStatus">
                            <label className="admin-form-label">
                              Operational Status
                            </label>
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
                      </Row>
                    </div>

                    <hr className="my-4" style={{ borderColor: '#E2E8F0', opacity: 0.7 }} />

                    {/* SECTION 3: SIGNATURE AMENITIES */}
                    <div className="mb-4">
                      <div className="admin-form-section-title d-flex align-items-center gap-2">
                        <Sparkles size={16} className="text-warning" /> Signature Amenities & Quick Tags
                      </div>
                      <div className="admin-form-section-desc">
                        Select from curated luxury amenities or customize tags using comma-separated text.
                      </div>

                      <Form.Group controlId="addAmenities">
                        {/* Elegant Luxury Amenity Pill Badges */}
                        <div className="d-flex flex-wrap gap-2 mb-3">
                          {quickAmenitySuggestions.map((amenity, i) => {
                            const isSelected = addFormData.amenitiesInput.includes(amenity);
                            return (
                              <button
                                key={i}
                                type="button"
                                onClick={() => handleToggleAmenity(amenity)}
                                className={`amenity-pill-btn ${isSelected ? 'selected' : ''}`}
                              >
                                {isSelected && <Check size={13} className="text-warning" />}
                                <span>{amenity}</span>
                              </button>
                            );
                          })}
                        </div>

                        <label className="admin-form-label">
                          Custom Amenities Ledger (Comma-separated)
                        </label>
                        <Form.Control
                          type="text"
                          name="amenitiesInput"
                          value={addFormData.amenitiesInput}
                          onChange={handleAddInputChange}
                          placeholder="e.g. Panoramic View, Separate Living Lounge, High-Speed Wi-Fi, In-Room Safe..."
                        />
                      </Form.Group>
                    </div>

                    <hr className="my-4" style={{ borderColor: '#E2E8F0', opacity: 0.7 }} />

                    {/* SECTION 4: PHOTOGRAPHY GALLERY & MEDIA */}
                    <div className="mb-4">
                      <div className="admin-form-section-title d-flex align-items-center gap-2">
                        <Eye size={16} className="text-warning" /> Photography Gallery URLs
                      </div>
                      <div className="admin-form-section-desc">
                        Provide high-resolution image URLs separated by commas. The primary photo serves as card hero.
                      </div>

                      <Form.Group controlId="addImages">
                        <Form.Control
                          type="text"
                          name="imagesInput"
                          placeholder="https://images.unsplash.com/photo-..."
                          value={addFormData.imagesInput}
                          onChange={handleAddInputChange}
                          required
                        />

                        {/* Live Thumbnail Strip for verified image URLs */}
                        {addFormData.imagesInput.split(',').filter(s => s.trim().length > 10).length > 0 && (
                          <div className="mt-3">
                            <span className="small text-muted fw-bold d-block mb-2" style={{ fontSize: '0.72rem' }}>
                              DETECTED PHOTO ASSETS ({addFormData.imagesInput.split(',').filter(s => s.trim().length > 10).length}):
                            </span>
                            <div className="admin-thumbnail-strip">
                              {addFormData.imagesInput.split(',').filter(s => s.trim().length > 10).map((imgUrl, idx) => (
                                <div key={idx} className="position-relative">
                                  <img
                                    src={imgUrl.trim()}
                                    alt={`Suite Preview ${idx + 1}`}
                                    className="admin-thumb-preview"
                                    onError={(e) => { e.target.style.opacity = '0.35'; }}
                                  />
                                  {idx === 0 && (
                                    <span className="badge badge-gold position-absolute bottom-0 start-0 m-1 px-1 py-0" style={{ fontSize: '0.55rem' }}>
                                      Cover
                                    </span>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </Form.Group>
                    </div>

                    {/* Form Action Footer */}
                    <div className="d-flex flex-column flex-sm-row justify-content-end align-items-center gap-3 pt-4 border-top">
                      <Button
                        variant="outline-secondary"
                        onClick={() => handleTabChange('rooms')}
                        className="rounded-pill px-4 py-2.5 w-100 w-sm-auto fw-semibold"
                      >
                        Cancel & Discard
                      </Button>
                      <Button
                        type="submit"
                        disabled={addLoading}
                        className="btn-gold px-5 py-2.5 rounded-pill fw-bold shadow-md d-flex align-items-center justify-content-center gap-2 w-100 w-sm-auto"
                      >
                        {addLoading ? (
                          <>
                            <Spinner size="sm" animation="border" />
                            Publishing Suite...
                          </>
                        ) : (
                          <>
                            <Plus size={16} />
                            Publish Suite to Inventory
                          </>
                        )}
                      </Button>
                    </div>
                  </Form>
                </div>
              </Col>

              {/* Right Column: Sticky Live Room Card Preview */}
              <Col lg={5}>
                <div className="sticky-top" style={{ top: '95px' }}>
                  {/* Live Preview Header */}
                  <div className="d-flex align-items-center justify-content-between mb-3 px-1">
                    <div>
                      <span className="small fw-bold text-dark text-uppercase tracking-wider font-display d-flex align-items-center gap-1.5" style={{ fontSize: '0.8rem' }}>
                        <Eye size={16} className="text-warning" /> Live Guest Card Preview
                      </span>
                      <span className="text-muted small" style={{ fontSize: '0.74rem' }}>
                        Real-time public catalog simulator
                      </span>
                    </div>
                    <Badge bg="success-subtle" className="text-success border border-success-subtle px-2.5 py-1 rounded-pill" style={{ fontSize: '0.72rem' }}>
                      ● Real-time
                    </Badge>
                  </div>

                  {/* Showcase Card */}
                  <div className="preview-card-showcase">
                    <div className="position-relative" style={{ height: '260px', backgroundColor: '#e2e8f0', overflow: 'hidden' }}>
                      <img
                        src={addFormData.imagesInput.split(',')[0].trim() || 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80'}
                        alt="Preview"
                        className="w-100 h-100 object-fit-cover"
                        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80'; }}
                      />

                      {/* Dark Gradient Overlay for Contrast */}
                      <div
                        className="position-absolute bottom-0 start-0 end-0"
                        style={{ height: '50%', background: 'linear-gradient(180deg, rgba(10, 20, 36, 0) 0%, rgba(10, 20, 36, 0.7) 100%)' }}
                      />

                      {/* Status Tag */}
                      <div className="position-absolute top-0 end-0 m-3">
                        <Badge
                          bg={addFormData.status === 'available' ? 'success' : 'secondary'}
                          className="px-3 py-1.5 text-uppercase shadow-sm fw-bold rounded-pill"
                          style={{ letterSpacing: '0.06em', fontSize: '0.72rem' }}
                        >
                          ● {addFormData.status === 'available' ? 'Available' : 'Maintenance'}
                        </Badge>
                      </div>

                      {/* Glassmorphic Price Badge */}
                      <div className="position-absolute bottom-0 start-0 m-3">
                        <div
                          className="d-flex align-items-baseline gap-1.5 px-3 py-1.5 rounded-3 shadow-md"
                          style={{
                            background: 'rgba(10, 20, 36, 0.88)',
                            backdropFilter: 'blur(8px)',
                            border: '1px solid rgba(212, 175, 55, 0.45)'
                          }}
                        >
                          <span className="font-serif fw-bold text-warning fs-5">${addFormData.pricePerNight || 0}</span>
                          <span className="text-white-50 small" style={{ fontSize: '0.75rem' }}>/ night</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4">
                      <div className="d-flex justify-content-between align-items-center mb-2.5">
                        <span className="badge bg-light text-primary border border-secondary border-opacity-25 px-2.5 py-1 small fw-semibold">
                          {addFormData.roomType}
                        </span>
                        <span className="small text-muted d-flex align-items-center gap-1.5">
                          <Users size={14} className="text-muted" /> Up to {addFormData.capacity} Guests
                        </span>
                      </div>

                      <h4 className="fw-bold text-dark mb-2 font-serif" style={{ fontSize: '1.35rem' }}>
                        {addFormData.name || 'Suite Name'}
                      </h4>
                      <p className="text-muted small mb-3 leading-relaxed" style={{ fontSize: '0.86rem', lineHeight: '1.6' }}>
                        {addFormData.description || 'Suite description will appear here as you type in the form...'}
                      </p>

                      {/* Preview Amenities */}
                      <div className="d-flex flex-wrap gap-1.5 pt-3 border-top mb-3">
                        {addFormData.amenitiesInput.split(',').filter(Boolean).slice(0, 5).map((a, i) => (
                          <span key={i} className="badge bg-light text-secondary border small px-2.5 py-1" style={{ fontSize: '0.74rem' }}>
                            {a.trim()}
                          </span>
                        ))}
                        {addFormData.amenitiesInput.split(',').filter(Boolean).length > 5 && (
                          <span className="badge bg-light text-muted border small px-2 py-1" style={{ fontSize: '0.72rem' }}>
                            +{addFormData.amenitiesInput.split(',').filter(Boolean).length - 5} more
                          </span>
                        )}
                      </div>

                      {/* Guest Simulation Action */}
                      <button
                        type="button"
                        disabled
                        className="btn btn-gold w-100 rounded-pill py-2.5 fw-bold shadow-xs d-flex align-items-center justify-content-center gap-2 mt-2"
                        style={{ opacity: 0.95, cursor: 'default' }}
                      >
                        <span>Reserve Suite • Guest Booking Experience</span>
                        <ArrowUpRight size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          )}

          {/* ==================================================== */}
          {/* VIEW 5: REGISTERED USERS DIRECTORY                   */}
          {/* ==================================================== */}
          {activeTab === 'users' && (
            <div className="card-luxury overflow-hidden bg-white">
              <div className="p-4 border-bottom d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                <div>
                  <h4 className="fw-bold mb-0 text-primary font-serif d-flex align-items-center gap-2">
                    <Users size={22} className="text-warning" /> Registered Guests & Staff Directory
                  </h4>
                  <span className="text-muted small">Manage guest accounts, review verification statuses, and promote administrative privileges</span>
                </div>

                <div className="d-flex flex-wrap gap-2">
                  <InputGroup style={{ maxWidth: '240px' }} size="sm">
                    <InputGroup.Text className="bg-light border-end-0">
                      <Search size={13} className="text-muted" />
                    </InputGroup.Text>
                    <Form.Control
                      placeholder="Search name, email..."
                      value={userSearch}
                      onChange={(e) => setUserSearch(e.target.value)}
                      className="border-start-0"
                    />
                  </InputGroup>

                  <Form.Select
                    size="sm"
                    value={userRoleFilter}
                    onChange={(e) => setUserRoleFilter(e.target.value)}
                    style={{ width: '150px' }}
                    className="fw-medium"
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
                    <Users size={48} className="text-muted mb-2 opacity-50" />
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
        </div>
      </div>

      {/* ==================================================== */}
      {/* MODAL 1: LUXURY INVOICE & RECEIPT PREVIEW            */}
      {/* ==================================================== */}
      <Modal show={showInvoiceModal} onHide={() => setShowInvoiceModal(false)} size="lg" centered>
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="fw-bold text-primary font-display fs-5">
            Official Reservation Receipt & Invoice
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
                  <span className="badge badge-gold px-3 py-1 text-uppercase mb-2 font-display">Official Receipt</span>
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
                    <td colSpan={3} className="text-end fw-bold fs-6 text-primary">Total Amount</td>
                    <td className="text-end fw-bold fs-5 text-gold font-monospace">${invoiceBooking.totalAmount}</td>
                  </tr>
                </tbody>
              </Table>

              <div className="text-center text-muted small border-top pt-3">
                Thank you for choosing HotelPro. For questions regarding this reservation, contact concierge@hotelpro.com.
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
      {/* MODAL 2: ADJUST BOOKING STATUS MODAL                 */}
      {/* ==================================================== */}
      <Modal show={showStatusModal} onHide={() => !statusUpdating && setShowStatusModal(false)} centered>
        <Modal.Header closeButton={!statusUpdating}>
          <Modal.Title className="fw-bold text-primary font-serif">
            Adjust Reservation Status
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedBooking && (
            <div>
              <p className="mb-3">
                Update operational status for reservation{' '}
                <strong className="text-primary font-monospace">{selectedBooking.bookingReference}</strong>:
              </p>

              <Form.Group className="mb-3">
                <Form.Label className="small fw-bold text-secondary">Booking Status</Form.Label>
                <Form.Select
                  value={targetBookingStatus}
                  onChange={(e) => setTargetBookingStatus(e.target.value)}
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="cancelled">Cancelled</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="small fw-bold text-secondary">Payment Status</Form.Label>
                <Form.Select
                  value={targetPaymentStatus}
                  onChange={(e) => setTargetPaymentStatus(e.target.value)}
                >
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="refunded">Refunded</option>
                  <option value="failed">Failed</option>
                </Form.Select>
              </Form.Group>

              <div className="bg-light p-3 rounded-3 small border">
                <div><strong>Guest:</strong> {selectedBooking.user?.name || 'Registered Guest'}</div>
                <div><strong>Suite:</strong> {selectedBooking.room?.name || 'Accommodation'}</div>
                <div><strong>Charges:</strong> ${selectedBooking.totalAmount}</div>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowStatusModal(false)} disabled={statusUpdating} className="rounded-pill">
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleUpdateBookingStatus}
            disabled={statusUpdating}
            className="rounded-pill px-4 fw-bold"
          >
            {statusUpdating ? <Spinner size="sm" animation="border" className="me-2" /> : null}
            Save Status Changes
          </Button>
        </Modal.Footer>
      </Modal>

      {/* ==================================================== */}
      {/* MODAL 3: EDIT SUITE MODAL                            */}
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

      {/* ==================================================== */}
      {/* MODAL 4: DELETE SUITE CONFIRMATION MODAL             */}
      {/* ==================================================== */}
      <Modal show={showDeleteModal} onHide={() => !deleteLoading && setShowDeleteModal(false)} centered>
        <Modal.Header closeButton={!deleteLoading}>
          <Modal.Title className="fw-bold text-danger font-serif d-flex align-items-center gap-2">
            <Trash2 size={20} /> Delete Accommodation
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {deleteTargetRoom && (
            <div>
              <p>
                Are you sure you want to permanently remove <strong className="text-dark">{deleteTargetRoom.name}</strong> from the catalog?
              </p>
              <div className="bg-light p-3 rounded-3 small border">
                <div><strong>Category:</strong> {deleteTargetRoom.roomType}</div>
                <div><strong>Nightly Rate:</strong> ${deleteTargetRoom.pricePerNight}</div>
                <div><strong>Capacity:</strong> {deleteTargetRoom.capacity} Guests</div>
              </div>
              <p className="text-danger small mt-2 mb-0">
                Warning: This action will permanently delete this room from the database.
              </p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)} disabled={deleteLoading} className="rounded-pill">
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleConfirmDeleteRoom}
            disabled={deleteLoading}
            className="rounded-pill px-4 fw-bold"
          >
            {deleteLoading ? <Spinner size="sm" animation="border" className="me-2" /> : null}
            Confirm Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Admin;
