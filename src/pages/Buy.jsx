import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Search } from "react-bootstrap-icons";
import { getAllProducts } from "../service/ProductService";

import Footer from "../components/footer";

import { Modal, Button } from "react-bootstrap";  


const Buy = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const formatPrice = (price) => {
    if (price == null) return "";
    return new Intl.NumberFormat("en-ZA", {
      style: "currency",
      currency: "ZAR",
      minimumFractionDigits: 2,
    }).format(price);
  };

  useEffect(() => {
    getAllProducts()
      .then((response) => {
        
     const apiProductsResponse = response.data.map((product) => ({
          productId: product.productId,
          productName: product.productName,
          productDescription: product.productDescription,
          condition: product.condition,
          price: product.price,
          productCategory: product.productCategory,
          seller: product.seller,
          imageData: product.imageData,
          imageType: product.imageType,
          
          
          status: (() => {
            if (!product.condition) return "good";
            const c = product.condition.toLowerCase();
            if (c.includes("like-new")) return "like-new";
            if (c.includes("new")) return "new";
            if (c.includes("good")) return "good";
            if (c.includes("fair")) return "fair";
            if (c.includes("poor")) return "poor";
            return "secondary";
          })(),
          category: product.productCategory?.toLowerCase() || "misc",
          sellerName: product.seller
            ? `${product.seller.firstName} ${product.seller.lastName}`
            : "Unknown Seller",
          image: product.imageData
            ? `data:${product.imageType};base64,${product.imageData}`
            : "https://via.placeholder.com/500x300?text=No+Image",
        }));

        setProducts(apiProductsResponse);
        setFilteredProducts(apiProductsResponse);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch products:", error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    let filtered = [...products];

    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.productDescription?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (product) => product.category === selectedCategory
      );
    }

    setFilteredProducts(filtered);
  }, [searchTerm, selectedCategory, products]);

  const getStatusColor = (status) => {
    switch (status) {
      case "new":
        return "success";
      case "like-new":
        return "primary";
      case "good":
        return "warning";
      case "fair":
        return "secondary";
      case "poor":
        return "danger";
      default:
        return "secondary";
    }
  };

  return (
    <div className="min-vh-100 bg-light">
      <div className="container py-4">
        <div className="mb-4">
          <Link to="/home" className="btn btn-outline-secondary btn-sm">
            <ArrowLeft className="me-2" size={16} />
            Back to Home
          </Link>
        </div>

        <h1 className="h2 mb-4 text-primary">Student Marketplace</h1>

        <div className="row g-3 mb-4">
          <div className="col-md-8">
            <div className="input-group">
              <span className="input-group-text">
                <Search size={16} />
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Search for items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="col-md-4">
            <select
              className="form-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="all">All Categories</option>
              <option value="laptops">Laptops</option>
              <option value="cellphones">Cell Phones</option>
              <option value="appliances">Appliances</option>
              <option value="textbooks">Textbooks</option>
              <option value="furniture">Furniture</option>
              <option value="electronics">Electronics</option>
              <option value="screens">Screens</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-5 text-muted">
            <div className="spinner-border me-2" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            Loading products...
          </div>
        ) : (
          <>
            <div className="row g-4">
              {filteredProducts.map((product) => (
                <div className="col-md-6 col-lg-4" key={product.productId}>
                  <div className="card h-100 shadow-sm">
                    {product.image && (
                      <div className="ratio ratio-16x9 d-flex justify-content-center align-items-center bg-light">
                        <img
                          src={product.image}
                          alt={product.productName}
                          style={{
                            objectFit: "contain",
                            maxHeight: "100%",
                            maxWidth: "100%",
                          }}
                          className="card-img-top"
                          onError={(e) => {
                            e.currentTarget.src =
                              "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=500&h=300&fit=crop";
                          }}
                        />
                      </div>
                    )}
                    <div className="card-body d-flex flex-column">
                      <div className="d-flex justify-content-between mb-2">
                        <h5 className="card-title mb-0">
                          {product.productName}
                        </h5>
                        <span
                          className={`badge bg-${getStatusColor(
                            product.status
                          )} text-capitalize`}
                        >
                          {product.status.replace("-", " ")}
                        </span>
                      </div>
                      <p className="card-text text-muted small flex-grow-1">
                        {product.productDescription
                          ? product.productDescription.length > 100
                            ? `${product.productDescription.substring(0, 100)}...`
                            : product.productDescription
                          : "No description available"}
                      </p>
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <span className="h5 text-success mb-0">
                          {formatPrice(product.price)}
                        </span>
                        <span className="text-muted small">
                          by {product.sellerName}
                        </span>
                      </div>
                    

                      <div className="d-flex gap-2">
                        <Link
                          to={`/transaction/${product.productId}`}
                          className="btn btn-primary flex-fill"
                        >
                          Buy Now
                        </Link>
                        <Button
                          variant="outline-secondary"
                          className="flex-fill"
                          onClick={() => {
                            setSelectedProduct(product);
                            setShowModal(true);
                          }}
                        >
                          View More
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-5">
                <p className="text-muted">No items found matching your criteria.</p>
                <p className="text-muted small">
                  Try adjusting your search or category filter.
                </p>
              </div>
            )}
          </>
        )}
      </div>

      <Footer />

      
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        size="lg"
        centered
      >
        {selectedProduct && (
          <div className="p-3 position-relative">
            <button
              type="button"
              className="btn-close position-absolute top-0 end-0 m-3"
              aria-label="Close"
              onClick={() => setShowModal(false)}
            ></button>

            <h5 className="fw-bold mb-3">{selectedProduct.productName}</h5>

            <div className="ratio ratio-16x9 d-flex justify-content-center align-items-center bg-light">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.productName}
                style={{
                  objectFit: "contain",
                  maxHeight: "100%",
                  maxWidth: "100%",
                }}
                className="card-img-top"
                onError={(e) => {
                  e.currentTarget.src =
                    "https://via.placeholder.com/500x300?text=No+Image";
                }}
              />
            </div>

            <h4 className="fw-bold mb-2 mt-3">{formatPrice(selectedProduct.price)}</h4>

            <div className="mb-3">
              <h6>Description</h6>
              <p className="text-muted">
                {selectedProduct.productDescription || "No description available."}
              </p>
            </div>

            <div className="border-top pt-3">
              <h6>Owner Information</h6>
              <div className="d-flex align-items-center gap-3">
                {selectedProduct.seller?.profileImage ? (
                  <img
                    src={
                      selectedProduct.seller.profileImage.startsWith("data:image")
                        ? selectedProduct.seller.profileImage
                        : `data:image/jpeg;base64,${selectedProduct.seller.profileImage}`
                    }
                    alt="Seller avatar"
                    className="rounded-circle"
                    width="60"
                    height="60"
                    style={{
                      objectFit: "cover",
                      border: "1px solid #ccc",
                    }}
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://via.placeholder.com/60?text=No+Img";
                    }}
                  />
                ) : (

                  <div
                    className="d-flex align-items-center justify-content-center"
                    style={{
                      width: "60px",
                      height: "60px",
                      borderRadius: "50%",
                      backgroundColor: "#616868ff",
                      color: "white",
                      fontWeight: "bold",
                      fontSize: "18px",
                      textTransform: "uppercase",
                      border: "1px solid #ccc",
                    }}
                  >
                    {`${selectedProduct.seller?.firstName?.[0] || ""}${
                      selectedProduct.seller?.lastName?.[0] || ""
                    }`}
                  </div>
                )}

                <div>
                  <p className="mb-1 fw-semibold">
                    {selectedProduct.seller
                      ? `${selectedProduct.seller.firstName} ${selectedProduct.seller.lastName}`
                      : "Community Member"}
                  </p>
                  <small className="text-muted">
                    {selectedProduct.seller?.email || "Member since Jan 2024"}
                  </small>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <Link
                to={`/transaction/${selectedProduct.productId}`}
                className="btn btn-primary w-100"
                onClick={() => setShowModal(false)}
              >
                Buy Now
              </Link>
            </div>
          </div>
        )}
      </Modal>


    </div>
  );
};

export default Buy;
