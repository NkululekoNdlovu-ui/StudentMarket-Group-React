import axios from "axios";

const PRODUCT_API_BASE_URL = "http://localhost:8080/api/product";

//saving student details to the db: Sign Up page
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

//delete product: Admin
export const deleteProduct = (productId) => {
  return axios.delete(`${PRODUCT_API_BASE_URL}/delete/${productId}`);
};

// Get product by ID
export const getProductById = (id) => {
  return axios.get(`${PRODUCT_API_BASE_URL}/read/${id}`);
};

//making payment
export const payForProduct = (product) => {
  return axios.post(REST_API_BASE_URL + `/checkout` + product);
};
