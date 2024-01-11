import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  createArticle,
  deleteArticle,
  getArticle,
  getArticles,
  getUserArticles,
  updateArticle,
} from "../controllers/article.controllers.js";

const router = Router();

// Create an Article and get articles
router
  .route("/")
  .post(verifyJWT, upload.single("featuredImage"), createArticle)
  .get(verifyJWT, getUserArticles);

// update an Article
router
  .route("/update")
  .patch(verifyJWT, upload.single("featuredImage"), updateArticle);

// Delete an article
router.route("/delete").patch(verifyJWT, deleteArticle);

// Get a single article
router.route("/:_id").get(verifyJWT, getArticle);

// Get Status active article
router.route("/active").get(verifyJWT, getArticles);

export default router;
