import axios from "axios";

const PRODUCT_API_BASE_URL = "http://localhost:8080/api/product";

// Saving student details to the db: Sign Up page
export const capturedProductDetails = (formData) => {
  return axios.post(PRODUCT_API_BASE_URL + "/create", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// Get all products and display them: Buy page
export const getAllProducts = () => {
  return axios.get(PRODUCT_API_BASE_URL + "/getAllProducts");
};

// Delete product: Admin
export const deleteProduct = (productId) => {
  return axios.delete(`${PRODUCT_API_BASE_URL}/delete/${productId}`);
};

// Get product by ID
export const getProductById = (id) => {
  return axios.get(`${PRODUCT_API_BASE_URL}/read/${id}`);
};

// Get available products by student
export const getAvailableProductsByStudent = (studentId) => {
  return axios.get(`${PRODUCT_API_BASE_URL}/available/${studentId}`);
};

// Update product
export const updateProduct = (productId, updatedProduct) => {
  return axios.put(`${PRODUCT_API_BASE_URL}/update/${productId}`, updatedProduct);
};

export const getSoldProductsByStudent = (studentId) => {
  return axios.get(`${PRODUCT_API_BASE_URL}/sold/${studentId}`);
};