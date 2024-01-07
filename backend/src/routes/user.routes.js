import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import {
  changeCurrentPassword,
  getCurrentUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  updateAccountDetails,
} from "../controllers/user.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Register User route
router.route("/register").post(registerUser);

// Login User route
router.route("/login").post(loginUser);

// logout user
router.route("/logout").post(verifyJWT, logoutUser);

// Refresh token route
router.route("/refresh-token").post(refreshAccessToken);

// Change password route
router.route("/change-password").post(verifyJWT, changeCurrentPassword);

// Get current user route
router.route("/current-user").get(verifyJWT, getCurrentUser);

// Update user details
router.route("/update-account").patch(verifyJWT, updateAccountDetails);

export default router;
