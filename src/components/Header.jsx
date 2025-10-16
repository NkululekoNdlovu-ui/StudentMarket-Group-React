import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logoSt from "../assets/logoSt.png";

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <img src={logoSt} alt="Logo" width="40" className="me-2" />
          <span style={{ color: "#333", fontWeight: "bold", fontSize: "1.2rem" }}>
            CPUT Marketplace
          </span>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-lg-center">
            <li className="nav-item me-2">
              <NavLink className="nav-link fw-semibold" to="/home" end>
                Home
              </NavLink>
            </li>
            <li className="nav-item me-2">
              <Link className="btn btn-primary rounded-pill px-4" to="/buy">
                Buy
              </Link>
            </li>
            <li className="nav-item me-3">
              <Link className="btn btn-success rounded-pill px-4" to="/sell">
                Sell
              </Link>
            </li>

            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle btn btn-outline-secondary rounded-pill px-3"
                href="#!"
                id="profileDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                {user?.data?.firstName || "Profile"}
              </a>
              <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="profileDropdown">
                <li>
                  <Link className="dropdown-item" to="/profile">
                    My Account
                  </Link>
                </li>
                <li>
                  <button
                    className="dropdown-item"
                    onClick={handleLogout}
                    style={{ cursor: "pointer", border: "none", background: "none", padding: 0 }}
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
