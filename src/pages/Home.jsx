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

  useEffect(() => {
    getAllProducts()
      .then((response) => {
        const apiProductsResponse = response.data.map((product, index) => ({
          id: product.id || product.productId || index,
          name: product.productName || "Unnamed Product",
          price: product.price || 0,
          image: product.imageData
            ? `data:${product.imageType};base64,${product.imageData}`
            : placeholder,
        }));

        const lowestProducts = apiProductsResponse
          .sort((a, b) => a.price - b.price)
          .slice(0, 4);

        setProducts(lowestProducts);
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

  const hotDealsContainerStyle = {
    padding: "60px 0",
    textAlign: "center",
    background: "linear-gradient(to bottom, #ffffff 0%, #f0f2f5 100%)",
  };

  const hotDealsTitleStyle = {
    fontSize: "2.5rem",
    fontWeight: "800",
    color: "#ff6a00",
    textTransform: "uppercase",
    letterSpacing: "2px",
    borderBottom: "4px solid #2575fc",
    display: "inline-block",
    paddingBottom: "8px",
    marginBottom: "50px",
  };

  const productCardStyle = {
    backgroundColor: "#ffffff",
    borderRadius: "10px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    border: "1px solid #dee2e6",
    overflow: "hidden",
    transition:
      "transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94), box-shadow 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
    height: "100%",
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
              "linear-gradient(to top, rgba(55, 117, 241, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%)",
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
            style={{ textShadow: "0 0 10px rgba(0,0,0,0.9)", color: "white" }}
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
        </div>
      </div>

      <div className="container py-5 text-center">
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

      <div className="container-fluid" style={hotDealsContainerStyle}>
        <div className="container">
          <h2 style={hotDealsTitleStyle}>Hot Deals 🔥</h2>

          {products.length === 0 ? (
            <div
              className="alert alert-info"
              role="alert"
              style={{ borderRadius: "10px" }}
            >
              No hot deals available right now. Be the first to list an item!
            </div>
          ) : (
            <>
              <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4 mb-5">
                {products.map((product) => (
                  <div className="col d-flex" key={product.id}>
                    <Link
                      to={`/transaction/${product.id}`}
                      className="d-block w-100 text-decoration-none"
                      style={productCardStyle}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-8px)";
                        e.currentTarget.style.boxShadow =
                          "0 18px 30px rgba(37, 117, 252, 0.25)";
                        e.currentTarget.style.border = "1px solid #2575fc";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow =
                          "0 4px 12px rgba(0,0,0,0.08)";
                        e.currentTarget.style.border = "1px solid #dee2e6";
                      }}
                    >
                      <div
                        className="card-img-top p-3"
                        style={{
                          backgroundColor: "#fefefe",
                          height: "230px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          style={{
                            maxHeight: "100%",
                            maxWidth: "100%",
                            objectFit: "contain",
                            borderRadius: "5px",
                          }}
                        />
                      </div>

                      <div
                        className="p-3 text-center"
                        style={{
                          borderTop: "1px solid #f8f9fa",
                        }}
                      >
                        <span
                          className="badge rounded-pill text-bg-danger mb-2"
                          style={{
                            fontSize: "0.85rem",
                            padding: "0.4em 0.8em",
                          }}
                        >
                          HOT DEAL
                        </span>
                        <h5
                          className="mb-2 fw-bolder text-truncate"
                          style={{ color: "#343a40" }}
                        >
                          {product.name}
                        </h5>
                        <p
                          className="h4 fw-bolder mb-0"
                          style={{ color: "#ff6a00" }}
                        >
                          R {product.price}
                        </p>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>

              <div className="mt-4 text-center">
                <Link
                  to="/buy"
                  className="btn btn-outline-primary btn-lg rounded-pill px-5 py-3 fw-bold"
                >
                  View All Products
                </Link>
              </div>
            </>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Home;
