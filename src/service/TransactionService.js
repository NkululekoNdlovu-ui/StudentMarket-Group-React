import axios from "axios";
import { getValidToken } from "../utils/authUtils";

const REST_API_BASE_URL = "http://localhost:8181/api";

//create a transaction record for a product sold: Transaction page
export const createTransaction = (productId, buyerId) => {
  const token = getValidToken();
  console.log("TransactionService createTransaction - Token:", token ? `${token.substring(0, 20)}...` : "No token found");
  console.log("TransactionService createTransaction - Params:", { productId, buyerId });
  
  if (!token) {
    throw new Error("No valid authentication token found");
  }
  
  return axios.post(REST_API_BASE_URL + "/transaction/create", null, {
    params: { productId, buyerId },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
