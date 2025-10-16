import React, { useState, useEffect } from "react";
import Header from "../components/Header.jsx";
import Footer from "../components/footer.jsx";
import { getAllProducts } from "../service/ProductService";
import placeholder from "../assets/placeholder.png";
import logoSt from "../assets/logoSt.png";
import { Link } from "react-router-dom";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [student, setStudent] = useState({ firstName: "" });
  const [isHoveringBuy, setIsHoveringBuy] = useState(false);

  useEffect(() => {
    getAllProducts()
      .then((response) => {
        console.log("API Response:", response.data); // Debug log
        const apiProductsResponse = response.data.map((product, index) => ({
          id: product.id || product.productId || index, // Use fallback if id is undefined
          name: product.productName || 'Unnamed Product',
          price: product.price || 0,
          image: product.imageData
            ? `data:${product.imageType};base64,${product.imageData}`
            : placeholder,
        }));
        console.log("Processed products:", apiProductsResponse); // Debug log
        setProducts(apiProductsResponse);
      })
      .catch((err) => console.error("Failed to fetch products:", err));
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setStudent({ firstName: parsedUser.firstName });
    }
  }, []);

  const buyButtonStyle = {
    background: isHoveringBuy
      ? "linear-gradient(90deg, #1e64e0, #5ca0f0)"
      : "linear-gradient(90deg, #2575fc, #6fb1fc)",
    border: "none",
    transform: isHoveringBuy ? "translateY(-2px)" : "translateY(0)",
    transition: "all 0.2s ease-in-out",
    boxShadow: isHoveringBuy
      ? "0 6px 15px rgba(37, 117, 252, 0.6)"
      : "0 2px 5px rgba(0,0,0,0.2)",
  };

  const sellButtonStyle = {
    background: "linear-gradient(90deg,#28a745,#5dd17c)",
    border: "none",
  };

  return (
    <>
      <Header />

      <div
        style={{
          height: "35vh",
          backgroundImage: `url(${placeholder})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background:
              "linear-gradient(to top, rgb(55, 117, 241) 0%, rgba(255, 255, 255, 0.9) 100%)",
            zIndex: 1,
          }}
        ></div>

        <div
          className="position-relative text-center p-3"
          style={{ zIndex: 2, color: "white" }}
        >
          <img
            src={logoSt}
            alt="Logo"
            style={{
              width: "120px",
              marginBottom: "15px",
            }}
          />
          <h1
            className="fw-bold display-5"
            style={{
              textShadow: "0 0 10px rgba(0,0,0,0.9)",
              color: "white",
            }}
          >
            Welcome, {student.firstName || "Student"}!
          </h1>
          <p
            className="lead text-white-75"
            style={{
              textShadow: "0 0 5px rgba(0,0,0,0.9)",
              maxWidth: "500px",
              margin: "0 auto 1.5rem auto",
            }}
          >
            Your campus marketplace for great deals and easy sales.
          </p>

          <div className="mt-3">
            <Link
              className="btn btn-lg rounded-pill me-3"
              style={buyButtonStyle}
              to="/buy"
              onMouseEnter={() => setIsHoveringBuy(true)}
              onMouseLeave={() => setIsHoveringBuy(false)}
            >
              Browse & Buy Items
            </Link>
            <Link
              className="btn btn-lg rounded-pill"
              style={sellButtonStyle}
              to="/sell"
            >
              Start Selling
            </Link>
          </div>
        </div>
      </div>

      <div className="container py-4 text-center">
        <div className="row justify-content-center">
          <div className="col-md-10">
            <h2 className="fw-light mb-4 text-muted">
              A Safer Way to Trade in Residence
            </h2>
            <div className="row">
              <div className="col-md-4 mb-3">
                <h5 className="fw-bold text-primary">01. Verified</h5>
                <p className="small text-secondary">
                  Only students in your residence can participate.
                </p>
              </div>
              <div className="col-md-4 mb-3">
                <h5 className="fw-bold text-success">02. Quick</h5>
                <p className="small text-secondary">
                  No shipping delays, meetups are just down the hall.
                </p>
              </div>
              <div className="col-md-4 mb-3">
                <h5 className="fw-bold text-warning">03. Local</h5>
                <p className="small text-secondary">
                  Find items you actually need in your direct community.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className="container my-5"
        style={{
          padding: "30px",
          textAlign: "center",
          backgroundColor: "#f8f9fa",
          borderRadius: "15px",
          boxShadow: "0 5px 15px rgba(0,0,0,0.05)",
        }}
      >
        <h2
          className="fw-bold mb-5"
          style={{
            borderBottom: "4px solid #ff6a00",
            display: "inline-block",
            paddingBottom: "8px",
          }}
        >
          Featured Hot Picks 🔥
        </h2>

        {products.length === 0 ? (
          <div className="alert alert-info" role="alert">
            No hot picks available right now. Be the first to list an item!
          </div>
        ) : (
          <div
            id="productSlideshow"
            className="carousel slide"
            data-bs-ride="carousel"
            data-bs-interval="4000"
          >
            <div className="carousel-inner" style={{ borderRadius: "10px" }}>
              {products.map((product, index) => (
                <div
                  className={`carousel-item ${index === 0 ? "active" : ""}`}
                  key={product.id ? `product-${product.id}` : `product-index-${index}`}
                >
                  <Link
                    to={`/transaction/${product.id}`}
                    className="d-block w-100 position-relative"
                  >
                    <img
                      src={product.image}
                      className="d-block w-100"
                      alt={product.name}
                      style={{
                        height: "400px",
                        objectFit: "contain",
                        borderRadius: "10px",
                      }}
                    />

                    <div
                      className="carousel-caption d-none d-md-block bg-dark bg-opacity-75 rounded p-3"
                      style={{
                        bottom: "20px",
                        backdropFilter: "blur(4px)",
                        maxWidth: "80%",
                        left: "50%",
                        transform: "translateX(-50%)",
                      }}
                    >
                      <h4 className="text-white mb-1 fw-bold">{product.name}</h4>
                      <p className="text-warning h3 fw-bolder">R {product.price}</p>
                    </div>
                  </Link>
                </div>
              ))}
            </div>

            {products.length > 1 && (
              <>
                {/* <button
                  className="carousel-control-prev"
                  type="button"
                  data-bs-target="#productSlideshow"
                  data-bs-slide="prev"
                >
                  <span
                    className="carousel-control-prev-icon"
                    style={{
                      backgroundColor: "rgba(37, 117, 252, 0.9)",
                      borderRadius: "50%",
                      padding: "20px",
                    }}
                  ></span>
                </button>
                <button
                  className="carousel-control-next"
                  type="button"
                  data-bs-target="#productSlideshow"
                  data-bs-slide="next"
                >
                  <span
                    className="carousel-control-next-icon"
                    style={{
                      backgroundColor: "rgba(37, 117, 252, 0.9)",
                      borderRadius: "50%",
                      padding: "20px",
                    }}
                  ></span>
                </button> */}
              </>
            )}

            <div className="col-12 mt-4">
              <Link
                to="/buy"
                className="btn btn-outline-primary btn-lg rounded-pill"
              >
                View All {products.length > 0 ? products.length + "+" : ""} Items
              </Link>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
};

export default Home;
