import { generateAccessAndRefreshToken } from "../controllers/user.controllers.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import jwt from "jsonwebtoken";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(400, "Unauthorized request");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodedToken._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      throw new ApiError(401, "Invalid Access Token");
    }

    req.user = user;
    next();
  } catch (error) {
    try {
      const token = req.cookies?.refreshToken || req.body.refreshToken;

      if (!token) {
        throw new ApiError(400, "Unauthorized request");
      }

      const decodedToken = jwt.verify(
        incomingRefreshToken,
        process.env.REFRESH_TOKEN_SECRET
      );

      let user = await User.findById(decodedToken._id);

      if (!user) {
        throw new ApiError(401, "Invalid refresh token");
      }

      req.user = user;

      let { accessToken, refreshToken } = await generateAccessAndRefreshToken(
        user._id
      );

      // this make the cookie only modified by the server
      const option = {
        httpOnly: true,
        secure: true,
      };

      res
        .cookie("accessToken", accessToken, option)
        .cookie("refreshToken", refreshToken, option);

      next();
    } catch (error) {
      throw new ApiError(401, error?.message || "Invalid token");
    }
  }
});
