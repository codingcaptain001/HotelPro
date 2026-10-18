import React from 'react';
import { Container, Card, Button } from 'react-bootstrap';
import { AlertCircle, RefreshCw, Hotel } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <Container className="py-5 d-flex align-items-center justify-content-center" style={{ minHeight: '70vh' }}>
          <Card className="card-luxury p-4 p-md-5 text-center shadow-lg border-0 bg-white" style={{ maxWidth: '520px' }}>
            <div className="bg-danger-subtle text-danger p-3 rounded-circle d-inline-flex mx-auto mb-3">
              <AlertCircle size={36} />
            </div>
            <h3 className="fw-bold text-primary font-serif mb-2">Something went wrong</h3>
            <p className="text-muted small mb-3">
              An unexpected error occurred while rendering this view.
            </p>
            {this.state.error?.message && (
              <div className="alert alert-light border small text-start font-monospace py-2 px-3 mb-4 text-danger">
                {this.state.error.message}
              </div>
            )}
            <div className="d-flex gap-2 justify-content-center">
              <Button variant="primary" onClick={this.handleReload} className="rounded-pill px-4 fw-bold d-flex align-items-center gap-2">
                <RefreshCw size={15} /> Reload Page
              </Button>
              <Button variant="outline-secondary" href="/" className="rounded-pill px-4">
                Return to Home
              </Button>
            </div>
          </Card>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
