

import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-dark text-white mt-5 pt-4 pb-3">
      <div className="container">
        <div className="row">
         
          <div className="col-md-4 mb-3">
            <h5>About</h5>
            <p>
              CPUT Marketplace is a safe and trusted platform for students to buy and sell items within their residences.
            </p>
          </div>

          
          <div className="col-md-4 mb-3">
            <h5>Quick Links</h5>
            <ul className="list-unstyled">
              <li><Link to="/buy" className="text-white text-decoration-none">Buy Items</Link></li>
              <li><Link to="/sell" className="text-white text-decoration-none">Sell Items</Link></li>
              <li><Link to="/about" className="text-white text-decoration-none">About Us</Link></li>
              {/* <li><Link to="/contact" className="text-white text-decoration-none">Contact</Link></li> */}
            </ul>
          </div>

         
          <div className="col-md-4 mb-3">
            <h5>Contact & Location</h5>
            <p>Email: southpointstudenttrade@gmail.com</p>
            <p>Phone: +27 21 460 3911</p>

            <div style={{ width: "100%", height: "150px", marginTop: "10px" }}>
              <iframe
                title="CPUT District Six Campus Map"
                src="https://www.google.com/maps?q=CPUT+District+Six+Campus,+Hanover+Street,+Cape+Town&output=embed"
                width="100%"
                height="150"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
            </div>
        </div>
        <hr className="bg-white" />

        <div className="text-center">
          <p className="mb-0">&copy; {new Date().getFullYear()} CPUT Marketplace. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
