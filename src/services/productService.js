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
    return response.data;
  } catch (error) {
    console.error(`Eroare la aducerea produsului cu id-ul ${id}:`, error);
    throw error;
  }
};

const saveProduct = async (formData) => {
  try {
    const response = await API.post(`${baseURL}admin`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Eroare la salvare produsului:", error);
    throw error;
  }
};

const updateProduct = async (productId, formData) => {
  try {
    const response = await API.put(`${baseURL}admin/${productId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Eroare la salvare produsului:", error);
    throw error;
  }
};
const addStock = async (productId, quantity) => {
  try {
    const response = await API.patch(`${baseURL}admin/addstock/${productId}`, {
      quantity: quantity,
    });

    return response.data;
  } catch (error) {
    console.error("Eroare la adaugare de stock", error);
    throw error;
  }
};
const deleteProduct = async (productId) => {
  try {
    const response = await API.delete(`${baseURL}admin/${productId}`);
    return response.data;
  } catch (error) {
    console.error(`Eroare la stergerea produsului cu ID ${productId}`, error);
    throw error;
  }
};
const productService = {
  getAllProducts,
  getProductById,
  saveProduct,
  updateProduct,
  addStock,
  deleteProduct,
};

export default productService;
