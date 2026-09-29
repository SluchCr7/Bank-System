const jwt = require("jsonwebtoken");
const User = require("../models/User");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");

const verifyJWT = asyncHandler(async (req, res, next) => {
  const token =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    throw new ApiError(401, "Unauthorized: Access token missing");
  }

  try {
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const userId = decodedToken?._id || decodedToken?.id;

    if (!userId) {
      throw new ApiError(401, "Invalid access token payload");
    }

    const user = await User.findById(userId).select("-password -refreshToken");

    if (!user) {
      throw new ApiError(401, "Invalid access token: User not found");
    }

    req.user = user;
    req.user.id = user._id.toString();
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw new ApiError(401, "Access token expired");
    }
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(401, error?.message || "Invalid access token");
  }
});

const optionalAuth = asyncHandler(async (req, res, next) => {
  const token =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    req.user = null;
    return next();
  }

  try {
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const userId = decodedToken?._id || decodedToken?.id;
    if (userId) {
      const user = await User.findById(userId).select("-password -refreshToken");
      req.user = user || null;
      if (req.user) {
        req.user.id = user._id.toString();
      }
    } else {
      req.user = null;
    }
  } catch (error) {
    req.user = null;
  }
  next();
});

const adminOnly = asyncHandler(async (req, res, next) => {
  if (!req.user || !req.user.isAdmin) {
    throw new ApiError(403, "غير مصرح لك: هذا القسم والإجراءات مخصصة للمسؤولين فقط (Admin Access Required)");
  }
  next();
});

module.exports = {
  verifyJWT,
  optionalAuth,
  adminOnly,
};

