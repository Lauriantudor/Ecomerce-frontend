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
const catrgoryService = {
  getCategories,
};
export default catrgoryService;
