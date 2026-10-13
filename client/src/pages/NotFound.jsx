import React from 'react';
import { Container, Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Compass, Home, Bed } from 'lucide-react';

const NotFound = () => {
  return (
    <Container className="py-5 text-center d-flex align-items-center justify-content-center" style={{ minHeight: '70vh' }}>
      <Card className="border-0 shadow-sm p-5" style={{ maxWidth: '540px' }}>
        <div className="bg-primary text-white rounded-circle d-inline-flex p-4 mx-auto mb-3 shadow-sm">
          <Compass size={48} />
        </div>
        <h1 className="display-4 fw-bold text-primary mb-2">404</h1>
        <h3 className="fw-bold text-dark mb-3">Page Not Found</h3>
        <p className="text-muted mb-4">
          The page or reservation path you are trying to access does not exist or may have been relocated.
        </p>
        <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center">
          <Button as={Link} to="/" variant="primary" className="d-flex align-items-center justify-content-center gap-2 fw-semibold px-4 py-2 rounded-pill shadow-sm">
            <Home size={18} /> Return to Home
          </Button>
          <Button as={Link} to="/rooms" variant="outline-primary" className="d-flex align-items-center justify-content-center gap-2 fw-semibold px-4 py-2 rounded-pill">
            <Bed size={18} /> Browse Rooms
          </Button>
        </div>
      </Card>
    </Container>
  );
};

export default NotFound;
