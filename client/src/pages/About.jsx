import React from 'react';
import { Container, Row, Col, Card, Accordion, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Hotel, Award, ShieldCheck, HeartHandshake, MapPin, Phone, Mail, Clock, Sparkles } from 'lucide-react';

const About = () => {
  return (
    <Container className="py-5">
      {/* Hero Section */}
      <div className="text-center py-5 mb-4">
        <span className="badge bg-primary text-uppercase px-3 py-2 mb-3">Our Story & Heritage</span>
        <h1 className="display-4 fw-bold text-primary mb-3">Welcome to HotelPro</h1>
        <p className="lead text-muted mx-auto" style={{ maxWidth: '750px' }}>
          Founded on a commitment to timeless elegance and bespoke hospitality, HotelPro blends contemporary architectural beauty with attentive, personalized service.
        </p>
      </div>

      {/* Values Grid */}
      <Row className="g-4 mb-5">
        <Col md={4}>
          <Card className="h-100 border-0 shadow-sm p-4 text-center">
            <div className="bg-primary text-white rounded-circle d-inline-flex p-3 mx-auto mb-3">
              <Award size={32} />
            </div>
            <h4 className="fw-bold text-primary mb-2">Excellence in Comfort</h4>
            <p className="text-muted small mb-0">
              Every suite is curated with premium acoustic insulation, handcrafted beds, ergonomic workspaces, and custom Italian linens.
            </p>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="h-100 border-0 shadow-sm p-4 text-center">
            <div className="bg-primary text-white rounded-circle d-inline-flex p-3 mx-auto mb-3">
              <ShieldCheck size={32} />
            </div>
            <h4 className="fw-bold text-primary mb-2">Seamless Assurance</h4>
            <p className="text-muted small mb-0">
              Guaranteed reservations with intelligent double-booking prevention, automated confirmations, and transparent cancellation terms.
            </p>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="h-100 border-0 shadow-sm p-4 text-center">
            <div className="bg-primary text-white rounded-circle d-inline-flex p-3 mx-auto mb-3">
              <HeartHandshake size={32} />
            </div>
            <h4 className="fw-bold text-primary mb-2">Personalized Service</h4>
            <p className="text-muted small mb-0">
              From curbside airport reception to bespoke dining itineraries, our dedicated 24/7 concierge team caters to every nuance of your stay.
            </p>
          </Card>
        </Col>
      </Row>

      {/* Detailed Story Section */}
      <Row className="align-items-center g-5 my-5">
        <Col lg={6}>
          <div className="rounded-4 overflow-hidden shadow-lg" style={{ height: '380px', backgroundColor: '#cbd5e1' }}>
            <img 
              src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80" 
              alt="HotelPro Property" 
              className="w-100 h-100 object-fit-cover"
            />
          </div>
        </Col>

        <Col lg={6}>
          <span className="text-uppercase fw-bold text-secondary small tracking-wide">A Sanctuary of Serenity</span>
          <h2 className="fw-bold text-primary mb-3">Designed for the Modern Traveler</h2>
          <p className="text-muted mb-3">
            HotelPro was established to reimagine boutique luxury. We combine intuitive digital convenience with the warmth of traditional hotelier hospitality.
          </p>
          <p className="text-muted mb-4">
            Whether visiting for an executive retreat, romantic weekend, or extended coastal getaway, each guest experiences curated amenities, panoramic ocean vistas, and farm-to-table culinary experiences.
          </p>
          <Button as={Link} to="/rooms" variant="primary" size="lg" className="px-4 py-2 rounded-pill fw-semibold shadow-sm">
            Discover Our Rooms & Suites
          </Button>
        </Col>
      </Row>

      {/* Contact & Location Info */}
      <Card className="border-0 shadow-sm p-4 p-md-5 my-5 bg-white">
        <Row className="g-4">
          <Col md={4} className="border-end-md">
            <div className="d-flex align-items-center gap-3 mb-2">
              <div className="bg-light text-primary p-2 rounded-circle">
                <MapPin size={24} />
              </div>
              <h5 className="fw-bold text-dark mb-0">Location</h5>
            </div>
            <p className="text-muted small ps-5 mb-0">
              100 Ocean Avenue, Seaside Boulevard, CA 90210<br />
              Minutes from Seaside Promenade and Coastal Trails
            </p>
          </Col>

          <Col md={4} className="border-end-md">
            <div className="d-flex align-items-center gap-3 mb-2">
              <div className="bg-light text-primary p-2 rounded-circle">
                <Clock size={24} />
              </div>
              <h5 className="fw-bold text-dark mb-0">Reception Hours</h5>
            </div>
            <p className="text-muted small ps-5 mb-0">
              Check-in: 3:00 PM &bull; Check-out: 11:00 AM<br />
              Front Desk & Concierge: 24 Hours Daily
            </p>
          </Col>

          <Col md={4}>
            <div className="d-flex align-items-center gap-3 mb-2">
              <div className="bg-light text-primary p-2 rounded-circle">
                <Phone size={24} />
              </div>
              <h5 className="fw-bold text-dark mb-0">Direct Inquiries</h5>
            </div>
            <p className="text-muted small ps-5 mb-0">
              Phone: +1 (800) 555-HOTEL<br />
              Email: reservations@hotelpro.com
            </p>
          </Col>
        </Row>
      </Card>

      {/* Frequently Asked Questions */}
      <div className="my-5">
        <h3 className="fw-bold text-primary text-center mb-4">Frequently Asked Questions</h3>
        <Row className="justify-content-center">
          <Col lg={8}>
            <Accordion defaultActiveKey="0" className="shadow-sm border-0 rounded-3 overflow-hidden">
              <Accordion.Item eventKey="0">
                <Accordion.Header className="fw-semibold">What is the reservation cancellation policy?</Accordion.Header>
                <Accordion.Body className="text-muted small">
                  Reservations can be freely cancelled from your <strong>Guest Dashboard</strong> up until the check-in date. Once a stay has started or completed, cancellation is locked to safeguard room availability.
                </Accordion.Body>
              </Accordion.Item>

              <Accordion.Item eventKey="1">
                <Accordion.Header className="fw-semibold">How is double-booking prevented?</Accordion.Header>
                <Accordion.Body className="text-muted small">
                  HotelPro uses server-side date collision verification directly against MongoDB Atlas, ensuring that overlapping date windows are rejected before a booking reference is granted.
                </Accordion.Body>
              </Accordion.Item>

              <Accordion.Item eventKey="2">
                <Accordion.Header className="fw-semibold">Are payment cards securely handled?</Accordion.Header>
                <Accordion.Body className="text-muted small">
                  Yes. HotelPro enforces strict security compliance: raw credit card numbers, CVVs, and magnetic stripe data are never stored in the database. Transactions rely on tokenized gateway identifiers.
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </Col>
        </Row>
      </div>
    </Container>
  );
};

export default About;
