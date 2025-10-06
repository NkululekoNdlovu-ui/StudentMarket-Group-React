import React, { useState } from "react";
import {
  FaUsers,
  FaBoxOpen,
  FaSignOutAlt,
  FaChartBar,
  FaDatabase,
  FaUser,
  FaTrash,
  FaSync,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import {
  listRegisteredStudents,
  deleteStudent as deleteStudentService,
} from "../service/StudentService";
import {
  getAllProducts,
  deleteProduct as deleteProductService,
} from "../service/ProductService";

const AdminDashboard = () => {
  const [students, setStudents] = useState([]);
  const [products, setProducts] = useState([]);
  const [studentsCount, setStudentsCount] = useState(null);
  const [productsCount, setProductsCount] = useState(null);
  const [loading, setLoading] = useState({
    students: false,
    products: false,
  });
  const [error, setError] = useState({
    students: null,
    products: null,
  });

  const navigate = useNavigate();

  const fetchStudents = async () => {
    setLoading((prev) => ({ ...prev, students: true }));
    setError((prev) => ({ ...prev, students: null }));

    try {
      const response = await listRegisteredStudents();
      const data = response.data;

      setStudents(data);
      setStudentsCount(data.length);
    } catch (error) {
      console.error("Error fetching students:", error);
      setError((prev) => ({ ...prev, students: error.message }));
      setStudents([]);
      setStudentsCount(0);
    } finally {
      setLoading((prev) => ({ ...prev, students: false }));
    }
  };

  const fetchProducts = async () => {
    setLoading((prev) => ({ ...prev, products: true }));
    setError((prev) => ({ ...prev, products: null }));

    try {
      const response = await getAllProducts();
      const data = response.data;

      setProducts(data);
      setProductsCount(data.length);
    } catch (error) {
      console.error("Error fetching products:", error);
      setError((prev) => ({ ...prev, products: error.message }));
      setProducts([]);
      setProductsCount(0);
    } finally {
      setLoading((prev) => ({ ...prev, products: false }));
    }
  };

  const deleteStudent = async (studentId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this student? This will also delete all their products."
      )
    ) {
      return;
    }

    try {
      await deleteStudentService(studentId);

      setStudents((prev) =>
        prev.filter((student) => student.studentId !== studentId)
      );
      setStudentsCount((prev) => prev - 1);

      const deletedProductsCount = products.filter(
        (product) => product.seller?.studentId === studentId
      ).length;

      setProducts((prev) =>
        prev.filter((product) => product.seller?.studentId !== studentId)
      );
      setProductsCount((prev) => prev - deletedProductsCount);

      alert("Student and their products deleted successfully");
    } catch (error) {
      console.error("Error deleting student:", error);
      alert("Error deleting student");
    }
  };

  const deleteProduct = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      await deleteProductService(productId);

      setProducts((prev) =>
        prev.filter((product) => product.productId !== productId)
      );
      setProductsCount((prev) => prev - 1);
      alert("Product deleted successfully");
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Error deleting product");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-ZA", {
      style: "currency",
      currency: "ZAR",
    }).format(price);
  };

  const getConditionColor = (condition) => {
    switch (condition?.toLowerCase()) {
      case "new":
        return "#22c55e";
      case "like new":
        return "#3b82f6";
      case "good":
        return "#06b6d4";
      case "fair":
        return "#f59e0b";
      case "poor":
        return "#ef4444";
      default:
        return "#6b7280";
    }
  };

  const getCategoryIcon = (category) => {
    // Return placeholder text instead of emojis
    switch (category?.toLowerCase()) {
      case "electronics":
        return "ELEC";
      case "books":
        return "BOOK";
      case "clothing":
        return "CLTH";
      case "furniture":
        return "FURN";
      case "sports":
        return "SPRT";
      case "laptop":
        return "LAPT";
      case "laptops":
        return "LAPT";
      case "speaker":
        return "SPKR";
      case "textbooks":
        return "TXTB";
      case "cellphones":
        return "CELL";
      case "appliances":
        return "APPL";
      case "screens":
        return "SCRN";
      default:
        return "PROD";
    }
  };

  return (
    <div className="min-vh-100" style={{ backgroundColor: "#f8fafc" }}>
      <div className="border-bottom bg-white shadow-sm">
        <div className="container-fluid px-4 py-3">
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <div
                className="d-flex align-items-center justify-content-center me-3"
                style={{
                  width: "40px",
                  height: "40px",
                  backgroundColor: "#3b82f6",
                  borderRadius: "8px",
                }}
              >
                <FaChartBar className="text-white" size={20} />
              </div>
              <div>
                <h5 className="mb-0 text-dark fw-semibold">Admin Dashboard</h5>
                <small className="text-muted">Student Trade Management</small>
              </div>
            </div>
            <button
              className="btn btn-outline-secondary"
              onClick={handleLogout}
              style={{ borderRadius: "8px" }}
            >
              <FaSignOutAlt className="me-2" size={14} />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      <div className="container-fluid px-4 py-4">
        <div className="row g-3 mb-4">
          <div className="col-lg-6 col-md-6">
            <div
              className="card border-0 h-100"
              style={{
                backgroundColor: "white",
                borderRadius: "12px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              }}
            >
              <div className="card-body p-4">
                <div className="d-flex align-items-center">
                  <div
                    className="p-2 rounded"
                    style={{ backgroundColor: "#eff6ff" }}
                  >
                    <FaUsers className="text-primary" size={20} />
                  </div>
                  <div className="ms-3">
                    <h6 className="text-muted mb-0 small">Active Students</h6>
                    <h4 className="mb-0 fw-bold text-dark">
                      {studentsCount !== null
                        ? studentsCount.toLocaleString()
                        : "--"}
                    </h4>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-6 col-md-6">
            <div
              className="card border-0 h-100"
              style={{
                backgroundColor: "white",
                borderRadius: "12px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              }}
            >
              <div className="card-body p-4">
                <div className="d-flex align-items-center">
                  <div
                    className="p-2 rounded"
                    style={{ backgroundColor: "#eff6ff" }}
                  >
                    <FaBoxOpen className="text-primary" size={20} />
                  </div>
                  <div className="ms-3">
                    <h6 className="text-muted mb-0 small">
                      Number of Products
                    </h6>
                    <h4 className="mb-0 fw-bold text-dark">
                      {productsCount !== null
                        ? productsCount.toLocaleString()
                        : "--"}
                    </h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row g-4 mb-4">
          <div className="col-md-6">
            <div
              className="card border-0"
              style={{
                backgroundColor: "white",
                borderRadius: "12px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              }}
            >
              <div className="card-body p-4">
                <div className="d-flex align-items-center mb-3">
                  <FaUsers className="text-primary me-2" size={18} />
                  <h6 className="mb-0 fw-semibold">Student Management</h6>
                </div>
                <p className="text-muted small mb-3">
                  View and manage all registered students in the system
                </p>
                <button
                  className={`btn btn-primary w-100 ${
                    loading.students ? "disabled" : ""
                  }`}
                  onClick={fetchStudents}
                  disabled={loading.students}
                  style={{ borderRadius: "8px", padding: "12px" }}
                >
                  {loading.students ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                      ></span>
                      Refreshing Students...
                    </>
                  ) : (
                    <>
                      <FaSync className="me-2" size={16} />
                      Refresh
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div
              className="card border-0"
              style={{
                backgroundColor: "white",
                borderRadius: "12px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              }}
            >
              <div className="card-body p-4">
                <div className="d-flex align-items-center mb-3">
                  <FaBoxOpen className="text-primary me-2" size={18} />
                  <h6 className="mb-0 fw-semibold">
                    Product & Owner Management
                  </h6>
                </div>
                <p className="text-muted small mb-3">
                  Browse all products with their owner information
                </p>
                <button
                  className={`btn btn-primary w-100 ${
                    loading.products ? "disabled" : ""
                  }`}
                  onClick={fetchProducts}
                  disabled={loading.products}
                  style={{ borderRadius: "8px", padding: "12px" }}
                >
                  {loading.products ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                      ></span>
                      Refreshing Products...
                    </>
                  ) : (
                    <>
                      <FaSync className="me-2" size={16} />
                      Refresh
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {error.students && (
          <div
            className="alert alert-danger border-0 mb-4"
            style={{
              borderRadius: "12px",
              backgroundColor: "#fef2f2",
              color: "#dc2626",
              border: "1px solid #fecaca",
            }}
          >
            <strong>Unable to load students:</strong> {error.students}
          </div>
        )}

        {error.products && (
          <div
            className="alert alert-danger border-0 mb-4"
            style={{
              borderRadius: "12px",
              backgroundColor: "#fef2f2",
              color: "#dc2626",
              border: "1px solid #fecaca",
            }}
          >
            <strong>Unable to load products:</strong> {error.products}
          </div>
        )}

        <div className="row g-4">
          {students.length > 0 && (
            <div className="col-lg-6">
              <div
                className="card border-0"
                style={{
                  backgroundColor: "white",
                  borderRadius: "12px",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                }}
              >
                <div className="card-body p-0">
                  <div className="p-4 border-bottom">
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="d-flex align-items-center">
                        <FaUsers className="text-primary me-2" size={18} />
                        <h6 className="mb-0 fw-semibold">Active Students</h6>
                      </div>
                      <span
                        className="badge bg-primary px-2 py-1"
                        style={{ borderRadius: "6px" }}
                      >
                        {students.length}
                      </span>
                    </div>
                  </div>
                  <div
                    className="p-4"
                    style={{ maxHeight: "400px", overflowY: "auto" }}
                  >
                    <div className="row g-2">
                      {students.map((student, idx) => (
                        <div key={idx} className="col-12">
                          <div
                            className="d-flex align-items-center p-3 rounded"
                            style={{
                              backgroundColor: "#f8fafc",
                              border: "1px solid #e2e8f0",
                              borderRadius: "8px",
                            }}
                          >
                            <div
                              className="d-flex align-items-center justify-content-center me-3 text-white fw-semibold"
                              style={{
                                width: "36px",
                                height: "36px",
                                backgroundColor: "#3b82f6",
                                borderRadius: "8px",
                                fontSize: "14px",
                              }}
                            >
                              {student.firstName?.[0]}
                              {student.lastName?.[0]}
                            </div>
                            <div className="flex-grow-1">
                              <div
                                className="fw-medium text-dark"
                                style={{ fontSize: "14px" }}
                              >
                                {student.firstName} {student.lastName}
                              </div>
                              <small className="text-muted">
                                {student.email}
                              </small>
                            </div>
                            <button
                              className="btn btn-outline-danger btn-sm ms-2"
                              onClick={() => deleteStudent(student.studentId)}
                              style={{
                                borderRadius: "6px",
                                padding: "4px 8px",
                              }}
                            >
                              <FaTrash size={12} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {products.length > 0 && (
            <div className="col-lg-6">
              <div
                className="card border-0"
                style={{
                  backgroundColor: "white",
                  borderRadius: "12px",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                }}
              >
                <div className="card-body p-0">
                  <div className="p-4 border-bottom">
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="d-flex align-items-center">
                        <FaBoxOpen className="text-primary me-2" size={18} />
                        <h6 className="mb-0 fw-semibold">Products & Owners</h6>
                      </div>
                      <span
                        className="badge bg-primary px-2 py-1"
                        style={{ borderRadius: "6px" }}
                      >
                        {products.length}
                      </span>
                    </div>
                  </div>
                  <div
                    className="p-4"
                    style={{ maxHeight: "500px", overflowY: "auto" }}
                  >
                    <div className="row g-3">
                      {products.map((product, idx) => (
                        <div key={idx} className="col-12">
                          <div
                            className="card border-0"
                            style={{
                              backgroundColor: "#f8fafc",
                              border: "1px solid #e2e8f0",
                              borderRadius: "10px",
                            }}
                          >
                            <div className="card-body p-3">
                              <div className="d-flex align-items-start justify-content-between mb-3">
                                <div className="d-flex align-items-center flex-grow-1">
                                  <div
                                    className="d-flex align-items-center justify-content-center me-3"
                                    style={{
                                      width: "40px",
                                      height: "40px",
                                      backgroundColor: "#e2e8f0",
                                      borderRadius: "8px",
                                      fontSize: "16px",
                                    }}
                                  >
                                    {product.imageData ? (
                                      <img
                                        src={`data:${product.imageType};base64,${product.imageData}`}
                                        alt={product.productName}
                                        style={{
                                          width: "40px",
                                          height: "40px",
                                          objectFit: "cover",
                                          borderRadius: "8px",
                                        }}
                                      />
                                    ) : (
                                      <div
                                        className="d-flex align-items-center justify-content-center text-muted"
                                        style={{
                                          width: "40px",
                                          height: "40px",
                                          backgroundColor: "#e2e8f0",
                                          borderRadius: "8px",
                                          fontSize: "10px",
                                          fontWeight: "bold",
                                        }}
                                      >
                                        {getCategoryIcon(
                                          product.productCategory
                                        )}
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex-grow-1">
                                    <h6
                                      className="mb-1 fw-semibold text-dark"
                                      style={{ fontSize: "14px" }}
                                    >
                                      {product.productName}
                                    </h6>
                                    <div className="d-flex align-items-center gap-2 mb-1">
                                      <span
                                        className="badge px-2 py-1 text-white"
                                        style={{
                                          backgroundColor: getConditionColor(
                                            product.condition
                                          ),
                                          fontSize: "11px",
                                          borderRadius: "4px",
                                        }}
                                      >
                                        {product.condition}
                                      </span>
                                      <span
                                        className="text-primary fw-semibold"
                                        style={{ fontSize: "13px" }}
                                      >
                                        {formatPrice(product.price)}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <div className="d-flex align-items-center gap-2">
                                  <span
                                    className={`badge px-2 py-1 ${
                                      product.availabilityStatus
                                        ? "bg-success"
                                        : "bg-secondary"
                                    }`}
                                    style={{
                                      fontSize: "10px",
                                      borderRadius: "4px",
                                    }}
                                  >
                                    {product.availabilityStatus
                                      ? "Available"
                                      : "Sold"}
                                  </span>
                                  <button
                                    className="btn btn-outline-danger btn-sm"
                                    onClick={() =>
                                      deleteProduct(product.productId)
                                    }
                                    style={{
                                      borderRadius: "4px",
                                      padding: "2px 6px",
                                    }}
                                  >
                                    <FaTrash size={10} />
                                  </button>
                                </div>
                              </div>

                              {product.productDescription && (
                                <div className="mb-3">
                                  <p
                                    className="text-muted small mb-0"
                                    style={{
                                      fontSize: "12px",
                                      lineHeight: "1.4",
                                    }}
                                  >
                                    {product.productDescription.length > 80
                                      ? `${product.productDescription.substring(
                                          0,
                                          80
                                        )}...`
                                      : product.productDescription}
                                  </p>
                                </div>
                              )}

                              <div className="border-top pt-3">
                                <div className="d-flex align-items-center">
                                  <div className="d-flex align-items-center">
                                    <FaUser
                                      className="text-muted me-2"
                                      size={12}
                                    />
                                    <small className="text-muted me-2">
                                      Owned by:
                                    </small>
                                  </div>
                                  <div className="d-flex align-items-center">
                                    {product.seller ? (
                                      <>
                                        <div
                                          className="d-flex align-items-center justify-content-center me-2 text-white fw-semibold"
                                          style={{
                                            width: "24px",
                                            height: "24px",
                                            backgroundColor: "#6366f1",
                                            borderRadius: "6px",
                                            fontSize: "10px",
                                          }}
                                        >
                                          {`${
                                            product.seller.firstName?.[0] || ""
                                          }${
                                            product.seller.lastName?.[0] || ""
                                          }`}
                                        </div>
                                        <div>
                                          <span
                                            className="fw-medium text-dark"
                                            style={{ fontSize: "13px" }}
                                          >
                                            {product.seller.firstName}{" "}
                                            {product.seller.lastName}
                                          </span>
                                          <div
                                            style={{ fontSize: "11px" }}
                                            className="text-muted"
                                          >
                                            {product.seller.email}
                                          </div>
                                        </div>
                                      </>
                                    ) : (
                                      <span
                                        className="text-muted"
                                        style={{ fontSize: "12px" }}
                                      >
                                        Owner information not available
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>

                              <div className="mt-2">
                                <small className="text-muted">
                                  Category:{" "}
                                  <span className="text-dark fw-medium">
                                    {product.productCategory}
                                  </span>
                                </small>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {students.length === 0 &&
          products.length === 0 &&
          !loading.students &&
          !loading.products && (
            <div className="text-center py-5">
              <div className="mb-4">
                <div
                  className="d-flex align-items-center justify-content-center mx-auto mb-3"
                  style={{
                    width: "80px",
                    height: "80px",
                    backgroundColor: "#f1f5f9",
                    borderRadius: "16px",
                  }}
                >
                  <FaDatabase className="text-muted" size={32} />
                </div>
                <h5 className="text-dark mb-2">No Data Loaded</h5>
                <p className="text-muted mb-0">
                  Use the refresh buttons above to load students and products
                  data.
                </p>
              </div>
            </div>
          )}
      </div>
    </div>
  );
};

export default AdminDashboard;
