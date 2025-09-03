import React from "react";
import { Link, useNavigate } from "react-router-dom"; 
import { Button } from "react-bootstrap";
import { FaSignOutAlt} from "react-icons/fa";


const Header = () => {

  const navigate = useNavigate(); 
  const user = JSON.parse(localStorage.getItem("user")); // get logged-in user


const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/"); 
  };


  return (
    <header className="bg-light shadow-sm">
      <div className="container-fluid d-flex flex-column flex-md-row align-items-center justify-content-between py-3">
        <h1 className="h1 text-primary mb-3">Student Marketplace</h1>

        <nav>
          <ul className="nav nav-tabs nav-fill">
            <li className="nav-item">
              <Link className="nav-link" to="/home">
                <i className="bi bi-house-door me-1"></i>Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/buy">
                <i className="bi bi-cart me-1"></i>Buy
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/sell">
                <i className="bi bi-cash me-1"></i>Sell
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/profile">
                <i className="bi bi-person me-1"></i>
                Profile
              </Link>
            </li>
            <li className="nav-item">
              <Button variant="danger" onClick={handleLogout}>Logout</Button>
              </li> 
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;