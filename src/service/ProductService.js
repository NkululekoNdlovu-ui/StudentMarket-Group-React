import axios from "axios";
import { getValidToken } from "../utils/authUtils";

const PRODUCT_API_BASE_URL = "http://localhost:8181/api/product";

//saving student details to the db: Sign Up page
export const capturedProductDetails = (formData) => {
  const token = getValidToken();
  console.log("ProductService capturedProductDetails - Token:", token ? `${token.substring(0, 20)}...` : "No valid token found");
  
  if (!token) {
    throw new Error("No valid authentication token found");
  }
  
  return axios.post(PRODUCT_API_BASE_URL + "/create", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });
};

// Get all products and display them: Buy page
export const getAllProducts = () => {
  const token = getValidToken();
  console.log("ProductService getAllProducts - Token:", token ? `${token.substring(0, 20)}...` : "No valid token found");
  
  return axios.get(PRODUCT_API_BASE_URL + "/getAllProducts", {
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
    },
  });
};

//delete product: Admin
export const deleteProduct = (productId) => {
  const token = getValidToken();
  if (!token) {
    throw new Error("No valid authentication token found");
  }
  return axios.delete(`${PRODUCT_API_BASE_URL}/delete/${productId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Get product by ID
export const getProductById = (id) => {
  const token = getValidToken();
  return axios.get(`${PRODUCT_API_BASE_URL}/read/${id}`, {
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
    },
  });
};

//making payment
export const payForProduct = (product) => {
  const token = getValidToken();
  if (!token) {
    throw new Error("No valid authentication token found");
  }
  
  const productId = product.productId || product.id;
  if (!productId) {
    throw new Error("Product ID is required for checkout");
  }
  
  console.log("ProductService payForProduct - ProductID:", productId, "Token:", token ? `${token.substring(0, 20)}...` : "No token");
  
  return axios.post(`${PRODUCT_API_BASE_URL}/checkout/${productId}`, {}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
