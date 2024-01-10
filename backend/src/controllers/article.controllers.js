import { Article } from "../models/article.model.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {
  uploadOnCloudinary,
  destroyOnCloudinary,
} from "../utils/Cloudinary.js";

// Create Article
const createArticle = asyncHandler(async (req, res) => {
  const { title, slug, content, status } = req.body;

  if ([title, slug, content].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  const featuredImagePath = req.file?.path;
  const featuredImage = await uploadOnCloudinary(featuredImagePath);

  const article = await Article.create({
    title,
    slug,
    content,
    featuredImage: featuredImage?.url || "",
    status,
    user: req.user._id,
  });

  const createdArticle = await Article.findById(article._id);

  if (!createdArticle) {
    throw new ApiError(500, "Something went wrong while creating an article");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, createdArticle, "Article created successfully"));
});

// Update an Article
const updateArticle = asyncHandler(async (req, res) => {
  const { _id, title, slug, content, status, featuredImage } = req.body;

  if ([_id, title, slug, content].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  let newFeaturedImage;
  if (featuredImage && featuredImage.length > 0) {
    const public_id = featuredImage.split("/").at(-1).split(".")[0];

    const isImageDeleted = await destroyOnCloudinary(public_id);

    if (isImageDeleted.result === "ok") {
      const featuredImagePath = req.file?.path;
      newFeaturedImage = await uploadOnCloudinary(featuredImagePath);
    }
  }

  const article = await Article.findByIdAndUpdate(
    _id,
    {
      $set: {
        title,
        slug,
        content,
        status,
        featuredImage: newFeaturedImage?.url || "",
      },
    },
    { new: true }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, article, "Article updated successfully"));
});

// Delete an Article
const deleteArticle = asyncHandler(async (req, res) => {
  const { _id, featuredImage } = req.body;

  if (_id?.trim() === "") {
    throw new ApiError(400, "ID is required");
  }

  if (featuredImage && featuredImage.length > 0) {
    const public_id = featuredImage.split("/").at(-1).split(".")[0];

    const isImageDeleted = await destroyOnCloudinary(public_id);

    if (isImageDeleted.result !== "ok") {
      throw new ApiError(500, "Deleting image error !!!");
    }
  }

  await Article.findByIdAndDelete(_id);

  return res
    .status(200)
    .json(new ApiResponse(200, "", "Article deleted successfully."));
});

// Get a single article
const getArticle = asyncHandler(async (req, res) => {
  const { _id } = req.params;

  if (_id?.trim() === "") {
    throw new ApiError(400, "ID is required");
  }

  const article = await Article.findById(_id);

  return res
    .status(200)
    .json(new ApiResponse(200, article, "Article fetched successfully"));
});

// get a user Article
const getUserArticles = asyncHandler(async (req, res) => {
  const { _id } = req.user;

  const articles = await Article.find({
    user: _id,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, articles, "Articles fetched successfully"));
});

// get all status active active article
const getArticles = asyncHandler(async (_, res) => {
  const articles = await Article.find({
    status: "active",
  });

  return res
    .status(200)
    .json(
      new ApiResponse(200, articles, "Active article fetched successfully")
    );
});

export {
  createArticle,
  updateArticle,
  deleteArticle,
  getArticle,
  getUserArticles,
  getArticles,
};
