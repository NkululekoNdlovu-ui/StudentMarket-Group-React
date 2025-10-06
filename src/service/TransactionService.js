import axios from "axios";

const REST_API_BASE_URL = "http://localhost:8080/api";

//create a transaction record for a product sold: Transaction page
export const createTransaction = (productId, buyerId) => {
  return axios.post(REST_API_BASE_URL + "/transaction/create", null, {
    params: { productId, buyerId },
  });
};
