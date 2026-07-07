import API from "./api";

const baseURL = "/contact-message/";

const createMessage = async (fromData) => {
  try {
    const response = await API.post(`${baseURL}create-message`, fromData);
    return response.data;
  } catch (error) {
    console.error("Eroare la salvare mesajului", error);
    throw error;
  }
};
const getAllMessages = async () => {
  try {
    const response = await API.get(`${baseURL}admin/get-messages`);

    return response.data;
  } catch (error) {
    console.error("Eroare la citirea  mesajului", error);
    throw error;
  }
};
const getMessageById = async (messageId) => {
  try {
    const response = await API.get(`${baseURL}admin/get-message/${messageId}`);
    return response.data;
  } catch (error) {
    console.error(`Eroare la citirea mesajului cu id= ${messageId}`, error);
    throw error;
  }
};

const markAsRead = async (messageId) => {
  try {
    const response = await API.patch(
      `${baseURL}admin/mark-as-read/${messageId}`,
    );
    return response.data;
  } catch (error) {
    console.error(
      `Eroare la marcarea ca citit a mesajului cu id= ${messageId}`,
      error,
    );
    throw error;
  }
};
const contactMessageService = {
  createMessage,
  getAllMessages,
  getMessageById,
  markAsRead,
};
export default contactMessageService;
