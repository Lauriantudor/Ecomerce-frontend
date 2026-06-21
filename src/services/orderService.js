import API from "./api";

const baseURL = "/orders";
const createOder = async (addressId) => {
  const response = await API.post(baseURL, {
    addressId: Number(addressId),
  });
  return response.data;
};
const getUserOrder = async () => {
  const response = await API.get(`${baseURL}/my-orders`);
  return response.data;
};
const cancelOrder = async (orderId) => {
  const response = await API.patch(`${baseURL}/${orderId}/cancel`);
  return response.data;
};
const orderService = {
  createOder,
  getUserOrder,
  cancelOrder,
};

export default orderService;
