import API from "./api";

const baseURL = "/orders/";
const createOrder = async (addressId) => {
  const response = await API.post(baseURL, {
    addressId: Number(addressId),
  });
  return response.data;
};
const getUserOrder = async () => {
  const response = await API.get(`${baseURL}my-orders`);
  return response.data;
};
const cancelOrder = async (orderId) => {
  const response = await API.patch(`${baseURL}${orderId}/cancel`);
  return response.data;
};

const getAllOrders = async () => {
  const response = await API.get(`${baseURL}admin/all`);
  return response.data;
};
const changeStatus = async (orderId, status) => {
  const response = await API.put(`${baseURL}admin/${orderId}/status`, {
    status,
  });
};
const orderService = {
  createOrder,
  getUserOrder,
  cancelOrder,
  getAllOrders,
  changeStatus,
};

export default orderService;
