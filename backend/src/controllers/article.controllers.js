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

export { createArticle, updateArticle };
