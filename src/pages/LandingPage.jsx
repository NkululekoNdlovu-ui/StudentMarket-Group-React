import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import logoSt from "../assets/logoSt.png";
import bg from "../assets/bg.png";
import { getAllProducts } from "../service/ProductService";
import placeholder from "../assets/placeholder.png";

const LandingPage = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getAllProducts()
      .then((response) => {
        const apiProductsResponse = response.data.map((product) => ({
          id: product.id,
          name: product.productName,
          image: product.imageData
            ? `data:${product.imageType};base64,${product.imageData}`
            : placeholder,
        }));
        setProducts(apiProductsResponse);
      })
      .catch((err) => console.error("Failed to fetch products:", err));
  }, []);

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top">
        <div className="container">
          <Link className="navbar-brand d-flex align-items-center" to="/">
            <img
              src={logoSt}
              alt="Logo"
              width="60"
              className="me-2"
              style={{ filter: "drop-shadow(1px 1px 2px rgba(0,0,0,0.6))" }}
            />
            <span
              style={{ color: "#333", fontWeight: "bold", fontSize: "1.4rem" }}
            >
              CPUT Marketplace
            </span>
          </Link>

          <div className="ms-auto">
            <Link
              to="/login"
              className="btn btn-primary rounded-pill me-2"
              style={{ backgroundColor: "#2575fc", border: "none" }}
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="btn btn-success rounded-pill"
              style={{ backgroundColor: "#28a745", border: "none" }}
            >
              Register
            </Link>
          </div>
        </div>
      </nav>

      <div className="position-relative" style={{ height: "80vh" }}>
        <div
          className="position-absolute w-100 h-100"
          style={{
            backgroundImage: `url(${bg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "blur(6px)",
            zIndex: 1,
          }}
        ></div>

        <div
          className="position-relative d-flex flex-column justify-content-center align-items-center text-center h-100"
          style={{
            background: "rgba(0,0,0,0.4)",
            color: "#fff",
            textShadow: "1px 1px 5px rgba(0,0,0,0.7)",
            zIndex: 2,
          }}
        >
          <img
            src={logoSt}
            alt="CPUT Marketplace Logo"
            width="150"
            className="mb-4"
            style={{
              filter: "drop-shadow(3px 3px 8px rgba(0,0,0,0.7))",
              zIndex: 3,
            }}
          />

          <h1 className="display-4 fw-bold">Welcome to CPUT Marketplace</h1>
          <p className="lead mt-3">
            A safe and trusted marketplace for CPUT students. Buy, sell, and
            discover great deals within your residence.
          </p>

          <div className="mt-4">
            <Link
              to="/login"
              className="btn btn-primary btn-lg rounded-pill me-3"
              style={{
                backgroundColor: "#2575fc",
                border: "none",
                transition: "all 0.3s",
              }}
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="btn btn-success btn-lg rounded-pill"
              style={{
                backgroundColor: "#28a745",
                border: "none",
                transition: "all 0.3s",
              }}
            >
              Register
            </Link>
          </div>
        </div>
      </div>

      <div className="container text-center my-5">
        <h2 className="mb-4">Why Join?</h2>
        <div className="row">
          {[
            {
              title: "Safe & Trusted",
              desc: "Trade confidently within your residence with fellow students.",
            },
            {
              title: "Quick Deals",
              desc: "Buy or sell items quickly without leaving your residence.",
            },
            {
              title: "Hot Picks",
              desc: "Discover trending items and great deals from fellow students.",
            },
          ].map((feature, idx) => (
            <div className="col-md-4 mb-3" key={idx}>
              <div
                className="p-4 border rounded shadow-sm h-100"
                style={{ transition: "transform 0.3s" }}
              >
                <h5>{feature.title}</h5>
                <p>{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="container my-5">
        <h3 className="mb-4 text-center fw-bold">Hot Picks from Students 🔥</h3>
        <div className="row flex-row flex-nowrap overflow-auto">
          {products.length === 0 ? (
            <p className="text-center text-muted">No products available</p>
          ) : (
            products.slice(0, 6).map((product) => (
              <div className="col-8 col-md-3 me-3" key={product.id}>
                <div className="card shadow-sm h-100">
                  <img
                    src={product.image}
                    className="card-img-top"
                    alt={product.name}
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default LandingPage;
