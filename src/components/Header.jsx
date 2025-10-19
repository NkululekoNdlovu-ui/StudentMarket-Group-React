import React, { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logoSt from "../assets/logoSt.png";

const Header = () => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();

  // Check login status on mount and listen for localStorage changes
  useEffect(() => {
    const checkLoginStatus = () => {
      const storedUser = localStorage.getItem("user");
      const studentId = localStorage.getItem("studentId");

      if (storedUser && studentId) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsLoggedIn(true);
      } else {
        setUser(null);
        setIsLoggedIn(false);
      }
    };

    checkLoginStatus();

    const handleStorageChange = (e) => {
      if (e.key === "user" || e.key === null) {
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
    localStorage.removeItem("user");
    localStorage.removeItem("studentId");
    setUser(null);
    setIsLoggedIn(false);
    navigate("/");
  };

  // Profile dropdown based on login status
  const ProfileDropdown = () => {
    if (isLoggedIn) {
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
            {user?.firstName || "Profile"}
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
        {/* Logo */}
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

            {isLoggedIn && (
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

            {/* Profile/Login Dropdown */}
            <ProfileDropdown />
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
