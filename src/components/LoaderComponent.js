import React from 'react';
import { Spinner } from 'react-bootstrap';

const LoadingSpinner = () => {
  return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh', position: 'fixed', top: 0, left: 0, width: '100%', backgroundColor: 'rgba(255, 255, 255, 0.8)', zIndex: 9999 }}>
      <Spinner animation="border" variant="primary" />
    </div>
  );
};

export default LoadingSpinner;