import React from "react";
import { Link } from "react-router-dom";
import { XCircle, ArrowLeft } from "react-bootstrap-icons";

const Cancel = () => {
  return (
    <div className="min-vh-100 bg-light d-flex justify-content-center align-items-center">
      <div className="text-center p-4">
        {/* Icon */}
        <div className="mb-3">
          <XCircle size={80} className="text-danger" />
        </div>

        {/* Message */}
        <h2 className="fw-bold text-dark mb-2">Transaction Cancelled</h2>
        <p className="text-muted fs-5 mb-4">
          Your payment was not completed. No worries — you can try again anytime!
        </p>

        {/* Buttons */}
        <div className="d-flex justify-content-center gap-3">
          <Link to="/buy" className="btn btn-outline-secondary rounded-pill">
            <ArrowLeft size={16} className="me-2" />
            Back to Marketplace
          </Link>

          <Link to="/home" className="btn btn-primary rounded-pill px-4">
            Go to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cancel;
