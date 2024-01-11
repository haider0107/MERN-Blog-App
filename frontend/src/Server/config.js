import axios from "axios";

const apiRoute = "/api/v1/articles";

const createArticle = async ({
  title,
  slug,
  content,
  featuredImage,
  status,
}) => {
  try {
    const res = await axios.post(`${apiRoute}/`, {
      title,
      slug,
      content,
      featuredImage,
      status,
    });

    return res.data;
  } catch (error) {
    console.log("CreateArticle :: error", error);
  }
};

const updatePost = async ({
  _id,
  title,
  slug,
  content,
  status,
  imageURL,
  featuredImage,
}) => {
  try {
    const res = await axios.patch(`${apiRoute}/update`, {
      _id,
      title,
      slug,
      content,
      status,
      imageURL,
      featuredImage,
    });

    return res.data;
  } catch (error) {
    console.log("UpdateArticle :: error", error);
  }
};

const deleteArticle = async ({ _id, featuredImage }) => {
  try {
    const res = await axios.patch(`${apiRoute}/delete`, { _id, featuredImage });

    return res.data;
  } catch (error) {
    console.log("DeleteArticle :: error", error);
  }
};

const getArticle = async ({ _id }) => {
  try {
    const res = await axios.get(`${apiRoute}/${_id}`);

    return res.data;
  } catch (error) {
    console.log("getArticle :: error", error);
  }
};

const getUserArticles = async () => {
  try {
    const res = await axios.get(`${apiRoute}/`);

    return res.data;
  } catch (error) {
    console.log("getUserArticles :: error", error);
  }
};

const getArticles = async () => {
  try {
    const res = await axios.get(`${apiRoute}/active`);

    return res.data;
  } catch (error) {
    console.log("getArticles :: error", error);
  }
};

export {
  createArticle,
  updatePost,
  deleteArticle,
  getArticle,
  getUserArticles,
  getArticles,
};
