import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header.jsx";
import placeholder from "../assets/placeholder.png";

const Transaction = () => {
  const { id } = useParams();
  const [transaction, setTransaction] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/transactions/${id}`)
      .then((res) => setTransaction(res.data))
      .catch((err) => console.error("Error fetching transaction:", err));
  }, [id]);

  if (!transaction) return <p className="text-center mt-5">Loading...</p>;

  return (
    <>
      <Header />
      <div className="container my-5">
        <div className="card shadow-lg rounded-4 p-4 mx-auto" style={{ maxWidth: "700px" }}>
          <h2 className="text-2xl font-bold mb-4 text-center">Transaction Receipt</h2>

          <div className="mb-3">
            <p><strong>Transaction ID:</strong> {transaction?.transactionId || "N/A"}</p>
            <p>
              <strong>Date:</strong>{" "}
              {transaction?.transactionDate
                ? new Date(transaction.transactionDate).toLocaleString()
                : "N/A"}
            </p>
          </div>

          <h4 className="mt-4 mb-2">Buyer Details</h4>
          <div className="mb-3">
            <p><strong>ID:</strong> {transaction?.buyer?.studentId || "N/A"}</p>
            <p>
              <strong>Name:</strong>{" "}
              {transaction?.buyer?.firstName || ""}{" "}
              {transaction?.buyer?.lastName || ""}
            </p>
            <p><strong>Email:</strong> {transaction?.buyer?.email || "N/A"}</p>
          </div>

          <h4 className="mt-4 mb-2">Product Details</h4>
          <div className="mb-3">
            <p><strong>ID:</strong> {transaction?.product?.productId || "N/A"}</p>
            <p><strong>Name:</strong> {transaction?.product?.productName || "N/A"}</p>
            <p><strong>Description:</strong> {transaction?.productDescription || "N/A"}</p>
            <p><strong>Condition:</strong> {transaction?.productCondition || "N/A"}</p>
            <p><strong>Price:</strong> R{transaction?.price ?? "N/A"}</p>
          </div>

          {transaction?.imageOfProduct ? (
            <img
              src={transaction.imageOfProduct}
              alt={transaction?.productLabel || "Product"}
              className="img-fluid rounded shadow mb-3"
              style={{ maxHeight: "400px", objectFit: "cover" }}
            />
          ) : (
            <img
              src={placeholder}
              alt="No product image"
              className="img-fluid rounded shadow mb-3"
              style={{ maxHeight: "400px", objectFit: "cover" }}
            />
          )}

          <div className="d-flex justify-content-between mt-4">
            <button
              className="btn btn-primary"
              onClick={() => window.print()}
            >
              Print Transaction
            </button>

            <Link to="/home" className="btn btn-secondary">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Transaction;
