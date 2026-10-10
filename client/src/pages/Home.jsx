import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <Container className="py-5 text-center">
      <div className="py-5 mt-5">
        <h1 className="display-4 fw-bold mb-4">Experience Premium Hospitality</h1>
        <p className="lead text-muted mb-5 w-75 mx-auto">
          Discover handpicked luxury rooms and effortless booking at HotelPro. Your perfect getaway is just a click away.
        </p>
        <Button variant="primary" size="lg" className="px-5 py-3 rounded-pill fw-bold" onClick={() => navigate('/rooms')}>
          Explore Rooms
        </Button>
      </div>
      
      {/* Demonstration sections */}
      <div className="mt-5 pt-5 row">
        <div className="col-md-4 mb-4">
          <div className="p-4 bg-white rounded shadow-sm h-100">
            <h3 className="h5 fw-bold text-primary">Luxury Rooms</h3>
            <p className="text-muted">Impeccably designed spaces to relax and unwind.</p>
          </div>
        </div>
        <div className="col-md-4 mb-4">
          <div className="p-4 bg-white rounded shadow-sm h-100">
            <h3 className="h5 fw-bold text-primary">Seamless Booking</h3>
            <p className="text-muted">Book instantly with our intelligent double-booking prevention system.</p>
          </div>
        </div>
        <div className="col-md-4 mb-4">
          <div className="p-4 bg-white rounded shadow-sm h-100">
            <h3 className="h5 fw-bold text-primary">Secure Payments</h3>
            <p className="text-muted">Your transactions are safely encrypted and handled.</p>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default Home;
