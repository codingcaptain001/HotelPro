import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Hotel, Mail, Phone, MapPin, ShieldCheck, Award, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-top mt-auto pt-5 pb-4 text-muted">
      <Container>
        <Row className="gy-4 mb-4">
          <Col lg={4} md={6}>
            <div className="d-flex align-items-center gap-2 mb-3">
              <div className="bg-primary text-white p-2 rounded-3 d-flex align-items-center justify-content-center">
                <Hotel size={22} />
              </div>
              <span className="fs-4 fw-bold text-primary">HotelPro</span>
            </div>
            <p className="small mb-3 text-secondary" style={{ maxWidth: '320px' }}>
              Experience authentic luxury, handcrafted comfort, and seamless reservations. Providing world-class hospitality and unforgettable stays.
            </p>
            <div className="d-flex align-items-center gap-2 text-primary small fw-semibold">
              <ShieldCheck size={16} /> Verified Security & Safe Booking
            </div>
          </Col>

          <Col lg={2} md={6} xs={6}>
            <h6 className="fw-bold text-dark text-uppercase small mb-3 tracking-wide">Quick Links</h6>
            <ul className="list-unstyled small mb-0 d-flex flex-column gap-2">
              <li><Link to="/" className="text-decoration-none text-muted hover-primary">Home</Link></li>
              <li><Link to="/rooms" className="text-decoration-none text-muted hover-primary">Rooms & Suites</Link></li>
              <li><Link to="/about" className="text-decoration-none text-muted hover-primary">About HotelPro</Link></li>
              <li><Link to="/login" className="text-decoration-none text-muted hover-primary">Guest Sign In</Link></li>
              <li><Link to="/register" className="text-decoration-none text-muted hover-primary">Register Account</Link></li>
            </ul>
          </Col>

          <Col lg={3} md={6} xs={6}>
            <h6 className="fw-bold text-dark text-uppercase small mb-3 tracking-wide">Guest Services</h6>
            <ul className="list-unstyled small mb-0 d-flex flex-column gap-2">
              <li><Link to="/dashboard" className="text-decoration-none text-muted hover-primary">My Bookings</Link></li>
              <li><span className="text-muted">24/7 Front Desk Support</span></li>
              <li><span className="text-muted">Complimentary Airport Shuttle</span></li>
              <li><span className="text-muted">Fine Dining & Room Service</span></li>
              <li><span className="text-muted">Wellness & Spa Packages</span></li>
            </ul>
          </Col>

          <Col lg={3} md={6}>
            <h6 className="fw-bold text-dark text-uppercase small mb-3 tracking-wide">Contact & Location</h6>
            <ul className="list-unstyled small mb-0 d-flex flex-column gap-2">
              <li className="d-flex align-items-start gap-2">
                <MapPin size={16} className="text-primary mt-1 flex-shrink-0" />
                <span>100 Ocean Avenue, Seaside Boulevard, CA 90210</span>
              </li>
              <li className="d-flex align-items-center gap-2">
                <Phone size={16} className="text-primary flex-shrink-0" />
                <span>+1 (800) 555-HOTEL</span>
              </li>
              <li className="d-flex align-items-center gap-2">
                <Mail size={16} className="text-primary flex-shrink-0" />
                <span>concierge@hotelpro.com</span>
              </li>
            </ul>
          </Col>
        </Row>

        <hr className="my-4 border-light-subtle" />

        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center small text-secondary gap-2">
          <div>
            &copy; {new Date().getFullYear()} HotelPro Resort & Management. All rights reserved.
          </div>
          <div className="d-flex gap-3">
            <Link to="/about" className="text-decoration-none text-muted">Privacy Policy</Link>
            <span>&bull;</span>
            <Link to="/about" className="text-decoration-none text-muted">Terms of Service</Link>
            <span>&bull;</span>
            <Link to="/about" className="text-decoration-none text-muted">Support</Link>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
