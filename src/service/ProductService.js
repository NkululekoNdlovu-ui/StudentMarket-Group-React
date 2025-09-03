import axios from "axios";


const REST_API_BASE_URL = 'http://localhost:8080/api/product';

export const capturedProductDetails = (formData) => {
  return axios.post(REST_API_BASE_URL + "/create", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
};


//get all products and display them : Buy page
export const getAllProducts = () => {
  return axios.get(REST_API_BASE_URL + '/getAllProducts');
}

export const deleteProduct = (productId) => {
  return axios.delete(`${REST_API_BASE_URL}/delete/${productId}`);
};