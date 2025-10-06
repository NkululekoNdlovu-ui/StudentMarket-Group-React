import { useState, useEffect } from "react";
import {
  FaUserShield,
  FaSignOutAlt,
  FaPlus,
  FaEdit,
  FaTrash,
  FaChartBar,
  FaUsers,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  getAllAdmins,
  createAdmin,
  updateAdmin,
  deleteAdmin,
} from "../service/SuperAdminService";

const SuperAdminDashboard = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [formData, setFormData] = useState({
    adminId: null,
    username: "",
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const response = await getAllAdmins();
      if (response.data.success) {
        setAdmins(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching admins:", error);
      toast.error("Failed to load administrators");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
    toast.info("Logged out successfully");
  };

  const openCreateModal = () => {
    setModalMode("create");
    setFormData({
      adminId: null,
      username: "",
      email: "",
      password: "",
    });
    setShowModal(true);
  };

  const openEditModal = (admin) => {
    setModalMode("edit");
    setFormData({
      adminId: admin.adminId,
      username: admin.username,
      email: admin.email,
      password: "",
    });
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (modalMode === "create") {
        const response = await createAdmin({
          username: formData.username,
          email: formData.email,
          password: formData.password,
        });

        if (response.data.success) {
          toast.success("Administrator created successfully");
          fetchAdmins();
          setShowModal(false);
        }
      } else {
        const updateData = {
          adminId: formData.adminId,
          username: formData.username,
          email: formData.email,
          password: formData.password || undefined,
        };

        const response = await updateAdmin(updateData);

        if (response.data.success) {
          toast.success("Administrator updated successfully");
          fetchAdmins();
          setShowModal(false);
        }
      }
    } catch (error) {
      console.error("Error saving admin:", error);
      toast.error(
        error.response?.data?.message || "Failed to save administrator"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (adminId) => {
    if (
      !window.confirm("Are you sure you want to delete this administrator?")
    ) {
      return;
    }

    try {
      const response = await deleteAdmin(adminId);

      if (response.data.success) {
        toast.success("Administrator deleted successfully");
        fetchAdmins();
      }
    } catch (error) {
      console.error("Error deleting admin:", error);
      toast.error(
        error.response?.data?.message || "Failed to delete administrator"
      );
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
                  backgroundColor: "#8b5cf6",
                  borderRadius: "8px",
                }}
              >
                <FaUserShield className="text-white" size={20} />
              </div>
              <div>
                <h5 className="mb-0 text-dark fw-semibold">
                  Super Admin Dashboard
                </h5>
                <small className="text-muted">Administrator Management</small>
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
          <div className="col-lg-4 col-md-6">
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
                    style={{ backgroundColor: "#f3e8ff" }}
                  >
                    <FaUsers
                      className="text-primary"
                      size={20}
                      style={{ color: "#8b5cf6" }}
                    />
                  </div>
                  <div className="ms-3">
                    <h6 className="text-muted mb-0 small">
                      Total Administrators
                    </h6>
                    <h4 className="mb-0 fw-bold text-dark">{admins.length}</h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <button
            className="btn btn-primary"
            onClick={openCreateModal}
            style={{ borderRadius: "8px", padding: "12px 24px" }}
          >
            <FaPlus className="me-2" size={14} />
            Add New Administrator
          </button>
        </div>

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
                  <FaUserShield
                    className="me-2"
                    size={18}
                    style={{ color: "#8b5cf6" }}
                  />
                  <h6 className="mb-0 fw-semibold">Administrators</h6>
                </div>
                <span
                  className="badge px-2 py-1"
                  style={{ backgroundColor: "#8b5cf6", borderRadius: "6px" }}
                >
                  {admins.length}
                </span>
              </div>
            </div>

            <div className="p-4">
              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : admins.length === 0 ? (
                <div className="text-center py-5">
                  <FaUserShield className="text-muted mb-3" size={48} />
                  <h5 className="text-dark mb-2">No Administrators Yet</h5>
                  <p className="text-muted">
                    Click "Add New Administrator" to create one.
                  </p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Username</th>
                        <th>Email</th>
                        <th className="text-end">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {admins.map((admin) => (
                        <tr key={admin.adminId}>
                          <td>
                            <div className="d-flex align-items-center">
                              <div
                                className="d-flex align-items-center justify-content-center me-3 text-white fw-semibold"
                                style={{
                                  width: "36px",
                                  height: "36px",
                                  backgroundColor: "#8b5cf6",
                                  borderRadius: "8px",
                                  fontSize: "14px",
                                }}
                              >
                                {admin.username?.[0]?.toUpperCase()}
                              </div>
                              <span className="fw-medium">
                                {admin.username}
                              </span>
                            </div>
                          </td>
                          <td className="text-muted">{admin.email}</td>
                          <td className="text-end">
                            <button
                              className="btn btn-sm btn-outline-primary me-2"
                              onClick={() => openEditModal(admin)}
                              style={{ borderRadius: "6px" }}
                            >
                              <FaEdit size={14} />
                            </button>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleDelete(admin.adminId)}
                              style={{ borderRadius: "6px" }}
                            >
                              <FaTrash size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content" style={{ borderRadius: "12px" }}>
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-semibold">
                  {modalMode === "create"
                    ? "Add New Administrator"
                    : "Edit Administrator"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label htmlFor="username" className="form-label">
                      Username
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                      Email
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">
                      Password{" "}
                      {modalMode === "edit" && "(Leave blank to keep current)"}
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required={modalMode === "create"}
                    />
                  </div>
                </div>
                <div className="modal-footer border-0">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setShowModal(false)}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                        ></span>
                        Saving...
                      </>
                    ) : modalMode === "create" ? (
                      "Create Administrator"
                    ) : (
                      "Update Administrator"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuperAdminDashboard;
