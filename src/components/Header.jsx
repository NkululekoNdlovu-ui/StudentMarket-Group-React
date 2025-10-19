import React, { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logoSt from "../assets/logoSt.png";

const Header = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const { logout } = useAuth();

  // Check login status on mount
  useEffect(() => {
    const checkLoginStatus = () => {
      // Login stores user info in 'userData'
      const storedUser = localStorage.getItem("userData");
      const studentId = localStorage.getItem("studentId");

      if (storedUser && studentId) {
        setUser(JSON.parse(storedUser));
      } else {
        setUser(null);
      }
    };

    checkLoginStatus();

    const handleStorageChange = (e) => {
      if (e.key === "userData" || e.key === "studentId") {
        checkLoginStatus();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    logout();
    localStorage.removeItem("userData");
    localStorage.removeItem("studentId");
    localStorage.removeItem("token");
    setUser(null);
    navigate("/");
  };

  const ProfileDropdown = () => {
    if (user) {
      return (
        <li className="nav-item dropdown">
          <a
            className="nav-link dropdown-toggle btn btn-outline-secondary rounded-pill px-3 fw-semibold"
            href="#!"
            id="profileDropdown"
            role="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            {user.firstName || "Profile"}
          </a>
          <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="profileDropdown">
            <li>
              <Link className="dropdown-item" to="/profile">
                My Account
              </Link>
            </li>
            <li>
              <button className="dropdown-item" onClick={handleLogout}>
                Logout
              </button>
            </li>
          </ul>
        </li>
      );
    }

    return (
      <li className="nav-item me-2">
        <Link className="btn btn-outline-primary rounded-pill px-4" to="/">
          Login / Register
        </Link>
      </li>
    );
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center" to="/home">
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

            {user && (
              <>
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
              </>
            )}

            <ProfileDropdown />
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
