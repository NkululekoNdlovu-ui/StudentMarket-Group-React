import React, { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { CheckCircleFill } from "react-bootstrap-icons";

const SuccessPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => navigate("/home"), 6000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-vh-100 bg-light d-flex align-items-center justify-content-center p-3">
      <div className="card shadow-lg border-0 text-center p-5" style={{ maxWidth: "500px" }}>
        <CheckCircleFill size={70} className="text-success mb-3" />
        <h2 className="fw-bold text-success mb-2">Payment Successful!</h2>
        <p className="text-muted mb-4">
          🎉 Thank you for your purchase! Your transaction was successfully
          completed. You’ll be redirected to the home page shortly.
        </p>

        <div className="d-flex justify-content-center align-items-center mb-3">
          <div
            className="spinner-border text-primary me-2"
            role="status"
            style={{ width: "1.5rem", height: "1.5rem" }}
          ></div>
          <small className="text-muted">Redirecting...</small>
        </div>

        <Link to="/home" className="btn btn-primary w-100 mt-3">
          Go to Home Now
        </Link>
      </div>
    </div>
  );
};

export default SuccessPage;
