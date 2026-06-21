import API from "./api";

const baseURL = "/products/";

const getAllProducts = async () => {
  try {
    const response = await API.get(baseURL);
    return response.data;
  } catch (error) {
    console.error("Eroare la aducerea produselor:", error);
    throw error;
  }
};

const getProductById = async (id) => {
  try {
    const response = await API.get(`${baseURL}${id}`);
    return response.data; // <-- CRUCIAL: returnăm direct datele curate trimise de Express
  } catch (error) {
    console.error(`Eroare la aducerea produsului cu id-ul ${id}:`, error);
    throw error;
  }
};

const productService = {
  getAllProducts,
  getProductById,
};

export default productService;
