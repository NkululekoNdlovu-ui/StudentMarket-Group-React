import axios from "axios";

const REST_API_BASE_URL = "http://localhost:8181/api/superadmin";

// Get all administrators
export const getAllAdmins = () => {
  const token = localStorage.getItem("token");
  return axios.get(`${REST_API_BASE_URL}/admin/getAll`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Create a new administrator
export const createAdmin = (adminData) => {
  const token = localStorage.getItem("token");
  return axios.post(`${REST_API_BASE_URL}/admin/create`, adminData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Update an existing administrator
export const updateAdmin = (adminData) => {
  const token = localStorage.getItem("token");
  return axios.put(`${REST_API_BASE_URL}/admin/update`, adminData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Delete an administrator
export const deleteAdmin = (adminId) => {
  const token = localStorage.getItem("token");
  return axios.delete(`${REST_API_BASE_URL}/admin/delete/${adminId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Get administrator by ID
export const getAdminById = (adminId) => {
  const token = localStorage.getItem("token");
  return axios.get(`${REST_API_BASE_URL}/admin/read/${adminId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
