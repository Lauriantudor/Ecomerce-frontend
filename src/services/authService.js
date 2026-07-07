import API from "./api";

const baseURL = "/users";
const register = async (username, email, password) => {
  try {
    const register = await API.post(`${baseURL}/sign-up`, {
      username,
      email,
      password,
    });
    return register;
  } catch (error) {
    throw error;
  }
};

const login = async (email, password) => {
  try {
    const login = await API.post(`${baseURL}/login`, {
      email,
      password,
    });

    return login;
  } catch (error) {
    throw error;
  }
};

const refresh = async () => {
  try {
    const refresh = await API.post(`${baseURL}/refresh`);
    console.log("Refrshhhh", refresh.data);
    return refresh.data;
  } catch (error) {
    throw error;
  }
};
const logout = async () => {
  try {
    const logout = await API.post(`${baseURL}/logout`);
    return logout.data;
  } catch (error) {
    throw error;
  }
};
const authService = {
  register,
  login,
  refresh,
  logout,
};
export default authService;
