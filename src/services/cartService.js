import API from "./api";

const baseURL = "/cart/";

const getCart = async () => {
  const response = await API.get(baseURL);
  console.log(response);
  return response.data;
};

const addToCart = async (productId, quantity = 1) => {
  const response = await API.post(baseURL, { productId, quantity });
  return response.data;
};

const updateQuantity = async (cartItemId, quantity) => {
  const response = await API.put(`${baseURL}item/${cartItemId}`, { quantity });
  console.log("Serviciu de update la cantitate dupa backendd");
  return response.data;
};

const removeItem = async (cartItemId) => {
  const response = await API.delete(`${baseURL}item/${cartItemId}`);
  return response.data;
};
const cartService = {
  getCart,
  addToCart,
  updateQuantity,
  removeItem,
};
export default cartService;
