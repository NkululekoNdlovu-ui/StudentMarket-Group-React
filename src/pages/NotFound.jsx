import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "react-bootstrap-icons";

const NotFound = () => {
  return (
    <div className="min-vh-100 bg-light d-flex align-items-center">
      <div className="container text-center py-5">
        <h1 className="display-1 text-muted">404</h1>
        <h2 className="mb-4">Page Not Found</h2>
        <p className="lead text-muted mb-5">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Link to="/home" className="btn btn-primary">
          <ArrowLeft className="me-2" size={16} />
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
