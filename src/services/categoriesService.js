import API from "./api";

const baseURL = "/categories/";

const getCategories = async () => {
  try {
    const response = await API.get(baseURL);
    return response.data;
  } catch (error) {
    console.error("Eroare la aducerea categoriilor:", error);
    throw error;
  }
};
const getCategoryById = async (categoryId) => {
  try {
    const response = await API.get(`${baseURL}${categoryId}`);

    return response.data;
  } catch (error) {
    console.error("Eroare la aducerea categoriei:", error);
    throw error;
  }
};
const saveCategory = async (name) => {
  try {
    const response = await API.post(`${baseURL}admin`, { name });
    return response.data;
  } catch (error) {
    console.error("Eroare la salvarea categoriei", error);
    throw error;
  }
};
const updateCategory = async (categoryId, cartegoryData) => {
  try {
    const response = await API.put(`${baseURL}admin/${categoryId}`, {
      name: cartegoryData.name,
    });

    return response.data;
  } catch (error) {
    console.error("Eroare la modificare categoriei", error);
    throw error;
  }
};
const deleteCategory = async (categoryId) => {
  const response = await API.delete(`${baseURL}admin/${categoryId}`);
  return response.data;
};
const categoryService = {
  getCategories,
  getCategoryById,
  saveCategory,
  updateCategory,
  deleteCategory,
};
export default categoryService;
