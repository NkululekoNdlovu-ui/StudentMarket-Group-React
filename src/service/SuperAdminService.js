import axios from "axios";

const REST_API_BASE_URL = "http://localhost:8080/api/superadmin";

// Get all administrators
export const getAllAdmins = () => {
  return axios.get(`${REST_API_BASE_URL}/admin/getAll`);
};

// Create a new administrator
export const createAdmin = (adminData) => {
  return axios.post(`${REST_API_BASE_URL}/admin/create`, adminData);
};

// Update an existing administrator
export const updateAdmin = (adminData) => {
  return axios.put(`${REST_API_BASE_URL}/admin/update`, adminData);
};

// Delete an administrator
export const deleteAdmin = (adminId) => {
  return axios.delete(`${REST_API_BASE_URL}/admin/delete/${adminId}`);
};

// Get administrator by ID
export const getAdminById = (adminId) => {
  return axios.get(`${REST_API_BASE_URL}/admin/read/${adminId}`);
};
