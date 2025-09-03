import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header.jsx";
import { getAllProducts } from "../service/ProductService";
import placeholder from "../assets/placeholder.png";

const Home = () => {
  const [products, setProducts] = useState([]);

  
  useEffect(() => {
    getAllProducts()
      .then((response) => {
       
        const apiProductsResponse = response.data.map((product) => ({
          id: product.id,
          name: product.productName,
          price: product.price,
          image: product.imageData
            ? `data:${product.imageType};base64,${product.imageData}`
            : placeholder.png, 
        }));

        setProducts(apiProductsResponse);
      })
      .catch((err) => console.error("Failed to fetch products:", err));
  }, []);

  return (
    <>
      <Header />
      <br />
      <div className="container my-5">
        <div className="row row-cols-2 align-items-center">
          <div className="container">
            <h1>
              Buy & Sell <small className="text-muted"><br />within your residence</small>
            </h1>
            <p className="lead">
              A safe trusted marketplace for CPUT students <br />
              where you can get great deals or turn your unused items into cash,<br />
              without having to leave your respective residence
            </p>

            <Link className="btn btn-primary btn-lg me-3" to="/buy">
              Buy items
            </Link>
            <Link className="btn btn-primary btn-lg" to="/sell">
              Sell items
            </Link>
          </div>

          <div id="carouselSlide" className="carousel slide" data-bs-ride="carousel" data-bs-interval="2000"style={{ maxWidth: "700px" }}>
            <div className="carousel-inner">
              {products.length === 0 && (
                <div className="carousel-item active">
                  <img src={placeholder}
                    className="d-block w-100"
                    alt="No products"
                  />
                  <div className="carousel-caption">
                    <h5>No products available</h5>
                  </div>
                </div>
              )}

              {products.map((product, index) => (
                <div
                  className={"carousel-item" + (index === 0 ? " active" : "")}
                  key={product.id}
                >
                  <Link to={`/transaction/${product.id}`}>
                    <img
                      src={product.image}
                      className="d-block w-100"
                      alt={product.name}
                      style={{ height: "400px", objectFit: "cover" }}
                    />
                    <div className="carousel-caption">
                      <h5>{product.name}</h5>
                      <p>R {product.price}</p>
                    </div>
                  </Link>
                </div>
              ))}
            </div>

           
            <button
              className="carousel-control-prev"
              type="button"
              data-bs-target="#carouselSlide"
              data-bs-slide="prev"
            >
              <span className="carousel-control-prev-icon"></span>
            </button>
            <button
              className="carousel-control-next"
              type="button"
              data-bs-target="#carouselSlide"
              data-bs-slide="next"
            >
              <span className="carousel-control-next-icon"></span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
