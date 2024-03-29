import axios from "axios";

const apiRoute = "/api/v1/users";

const createAccount = async ({ email, password, fullName }) => {
  try {
    const res = await axios.post(`${apiRoute}/register`, {
      email,
      password,
      fullName,
    });

    console.log(res);
    return res.data;
  } catch (error) {
    throw error;
  }
};

const loginUser = async ({ email, password }) => {
  try {
    const res = await axios.post(`${apiRoute}/login`, { email, password });

    return res.data;
  } catch (error) {
    throw error;
  }
};

const getCurrentUser = async () => {
  try {
    const res = await axios.get(`${apiRoute}/current-user`);

    return res.data;
  } catch (error) {
    throw error;
  }
};

const logoutUser = async () => {
  try {
    await axios.post(`${apiRoute}/logout`);
  } catch (error) {
    throw error;
  }
};

const changeCurrentPassword = async ({ oldPassword, newPassword }) => {
  try {
    const res = await axios.post(`${apiRoute}/change-password`, {
      oldPassword,
      newPassword,
    });

    return res.data;
  } catch (error) {
    throw error;
  }
};

const updateAccount = async ({ fullName, email }) => {
  try {
    const res = await axios.patch(`${apiRoute}/update-account`, {
      fullName,
      email,
    });

    return res.data;
  } catch (error) {
    throw error;
  }
};

export {
  createAccount,
  loginUser,
  getCurrentUser,
  logoutUser,
  changeCurrentPassword,
  updateAccount,
};
