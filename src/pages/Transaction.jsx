import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Clock,
  Shield,
  Truck,
  ExclamationTriangle,
} from "react-bootstrap-icons";
import { getProductById, payForProduct } from "../service/ProductService";
import { createTransaction } from "../service/TransactionService";
import { useAuth } from "../context/AuthContext";
import { getValidToken } from "../utils/authUtils";
import PayQrCode from "../assets/PayQrCode.jpeg";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  "pk_test_51S6IAIKvzaquBxnBmz1NTRBTJPfw5eTwRYKekVDxShaMSzPKGBpaKQ9lAcyBtDHGix7PPaLuvQJbvgPWZlLwYohF00USTba4Xm"
);

const Transaction = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        if (!id || id === "undefined") throw new Error("Invalid product ID");

        const productResponse = await getProductById(id);
        setProduct(productResponse.data);
      } catch (err) {
        setError(
          err.message ||
            "Failed to load product details. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const formatPrice = (price) => {
    if (price == null || isNaN(price)) return "R 0.00";
    return new Intl.NumberFormat("en-ZA", {
      style: "currency",
      currency: "ZAR",
      minimumFractionDigits: 2,
    }).format(price);
  };

  const handlePurchase = async () => {
    try {
      setProcessing(true);
      setError(null);

      // Authentication checks
      if (!isAuthenticated() || !user || !user.data) {
        setError("You must be logged in to make a purchase");
        setProcessing(false);
        navigate("/login");
        return;
      }

      if (!product) {
        setError("No product loaded");
        setProcessing(false);
        return;
      }

      // Check if user is trying to buy their own product
      if (product.seller && user.data.studentId === product.seller.studentId) {
        setError("You cannot purchase your own product");
        setProcessing(false);
        return;
      }

      console.log("Creating transaction for product:", id, "buyer:", user.data.studentId);
      
      // Create transaction record
      await createTransaction(id, user.data.studentId);
      console.log("Transaction created successfully");

      // Create Stripe checkout session using the correct endpoint and port
      console.log("Creating Stripe checkout session for product:", product.productId || id);
      
      const checkoutResponse = await payForProduct(product);
      console.log("Stripe checkout response:", checkoutResponse.data);

      if (checkoutResponse.data.status !== "Success" || !checkoutResponse.data.sessionId) {
        throw new Error(checkoutResponse.data.message || "Failed to create Stripe session");
      }

      // Redirect to Stripe checkout
      const stripe = await stripePromise;
      const { error } = await stripe.redirectToCheckout({
        sessionId: checkoutResponse.data.sessionId,
      });

      if (error) {
        console.error("Stripe checkout error:", error);
        setError(error.message);
        setProcessing(false);
      } else {
        setSuccess(true);
        setTimeout(() => navigate("/home"), 5000);
      }
    } catch (err) {
      console.error("Purchase failed:", err);
      setError(err.response?.data?.message || err.message || "Payment failed. Please try again.");
      setProcessing(false);
    }
  };

  if (loading) return <Loading productId={id} />;
  if (error) return <Error productId={id} message={error} />;
  if (success) return <Success />;

  return (
    <div className="min-vh-100 bg-light">
      <div className="container py-4">
        <BackButton />
        <h1 className="h2 mb-4 text-primary">Complete Your Purchase</h1>
        <div className="row">
          <ItemDetails product={product} formatPrice={formatPrice} />
          <OrderSummary
            product={product}
            formatPrice={formatPrice}
            handlePurchase={handlePurchase}
            processing={processing}
          />
        </div>
      </div>
    </div>
  );
};

export default Transaction;

const Loading = ({ productId }) => (
  <div className="min-vh-100 bg-light d-flex justify-content-center align-items-center">
    <div className="text-center">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className="mt-2 text-muted">Loading product details...</p>
      <p className="text-muted small">Product ID: {productId}</p>
    </div>
  </div>
);

const Error = ({ productId, message }) => (
  <div className="min-vh-100 bg-light">
    <div className="container py-4">
      <div className="mb-4">
        <Link to="/buy" className="btn btn-outline-secondary btn-sm">
          <ArrowLeft className="me-2" size={16} />
          Back to Marketplace
        </Link>
      </div>
      <div
        className="alert alert-danger d-flex align-items-center"
        role="alert"
      >
        <ExclamationTriangle className="me-2" size={20} />
        <div>
          <h5>Error Loading Product</h5>
          <p className="mb-0">{message}</p>
          <small className="text-muted">Product ID: {productId}</small>
        </div>
      </div>
    </div>
  </div>
);

const Success = () => (
  <div className="min-vh-100 bg-light d-flex justify-content-center align-items-center">
    <div className="text-center">
      <div
        className="ratio ratio-1x1 mb-3"
        style={{ maxWidth: "200px", margin: "0 auto" }}
      >
        <img src={PayQrCode} alt="QR Code" className="img-fluid" />
      </div>
      <p className="mb-3">
        Thank you for your purchase 🎉 You will be redirected to the homepage
        shortly...
      </p>
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Redirecting...</span>
      </div>
    </div>
  </div>
);

const BackButton = () => (
  <div className="mb-4">
    <Link to="/buy" className="btn btn-outline-secondary btn-sm">
      <ArrowLeft className="me-2" size={16} />
      Back to Marketplace
    </Link>
  </div>
);

const ItemDetails = ({ product, formatPrice }) => (
  <div className="col-lg-8">
    <div className="card mb-4 shadow-sm">
      <div className="card-header bg-white">
        <h3 className="h5 mb-0">Item Details</h3>
      </div>
      <div className="card-body">
        <div className="row">
          <div className="col-md-5">
            <img
              src={
                product.imageData
                  ? `data:${product.imageType};base64,${product.imageData}`
                  : "https://via.placeholder.com/300x200?text=No+Image"
              }
              alt={product.productName}
              className="img-fluid rounded"
              onError={(e) =>
                (e.currentTarget.src =
                  "https://via.placeholder.com/300x200?text=No+Image")
              }
            />
          </div>
          <div className="col-md-7">
            <h4 className="text-primary">{product.productName}</h4>
            <p className="text-muted">{product.productDescription}</p>
            <div className="mb-3">
              <span className="badge bg-secondary text-capitalize">
                {product.condition?.toLowerCase() || "Good condition"}
              </span>
            </div>
            <h3 className="text-success">{formatPrice(product.price)}</h3>
            <p className="text-muted small">
              Sold by:{" "}
              {product.seller
                ? `${product.seller.firstName} ${product.seller.lastName}`
                : "Unknown Seller"}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const OrderSummary = ({ product, formatPrice, handlePurchase, processing }) => (
  <div className="col-lg-4">
    <div className="card shadow-sm">
      <div className="card-header bg-white">
        <h3 className="h5 mb-0">Order Summary</h3>
      </div>
      <div className="card-body">
        <div className="d-flex justify-content-between mb-2">
          <span>Item price:</span>
          <span>{formatPrice(product.price)}</span>
        </div>
        <div className="d-flex justify-content-between mb-2">
          <span>Platform fee:</span>
          <span>{formatPrice(product.price * 0.05)}</span>
        </div>
        <hr />
        <div className="d-flex justify-content-between mb-3">
          <strong>Total:</strong>
          <strong>{formatPrice(product.price * 1.05)}</strong>
        </div>

        <button
          className="btn btn-primary w-100 mb-3"
          onClick={handlePurchase}
          disabled={processing}
        >
          {processing ? (
            <>
              <span
                className="spinner-border spinner-border-sm me-2"
                role="status"
                aria-hidden="true"
              ></span>
              Processing...
            </>
          ) : (
            "Confirm Purchase"
          )}
        </button>

        <div className="bg-light p-3 rounded small">
          <div className="d-flex align-items-center mb-2">
            <Shield size={16} className="text-success me-2" />
            <span>Secure payment</span>
          </div>
          <div className="d-flex align-items-center mb-2">
            <Truck size={16} className="text-success me-2" />
            <span>Arrange pickup with seller</span>
          </div>
          <div className="d-flex align-items-center">
            <Clock size={16} className="text-success me-2" />
            <span>Usually completed within 24 hours</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);
