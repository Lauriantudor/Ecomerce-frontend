import API from "./api";

const baseURL = "/addresses/";

const getUserAddresses = async () => {
  const response = await API.get(baseURL);
  return response.data;
};
const saveAddress = async (addressData) => {
  const response = await API.post(baseURL, {
    title: addressData.title,
    fullName: addressData.fullname,
    phoneNumber: addressData.phoneNumber,
    city: addressData.city,
    county: addressData.county,
    country: addressData.country,
    streetAddress: addressData.streetAddress,
  });
  return response.data;
};

const updateAddress = async (addressId, addressData) => {
  const response = await API.put(`${baseURL}${addressId}`, {
    title: addressData.title,
    fullName: addressData.fullname,
    phoneNumber: addressData.phoneNumber,
    city: addressData.city,
    county: addressData.county,
    country: addressData.country,
    streetAddress: addressData.streetAddress,
  });
  return response.data;
};

const adminGetAddresses = async (userId) => {
  const response = await API.get(`${baseURL}admin/${userId}`);
  return response.data;
};
const deleteAddress = async (addressId) => {
  const response = await API.delete(`${baseURL}${addressId}`);
  return response.data;
};
const addressService = {
  getUserAddresses,
  saveAddress,
  updateAddress,
  adminGetAddresses,
  deleteAddress,
};

export default addressService;
