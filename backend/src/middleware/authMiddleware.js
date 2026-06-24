import jwt from "jsonwebtoken";
import User from "../models/User.js";

/**
 * Protects routes by verifying the JWT sent in the Authorization header.
 * Expected header format: "Authorization: Bearer <token>"
 *
 * On success, attaches the authenticated user (minus passwordHash) to req.user.
 */
const protect = async (req, res, next) => {
  let token;

  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    try {
      token = authHeader.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await User.findById(decoded.id).select("-passwordHash");

      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Not authorized, user no longer exists",
        });
      }

      req.user = user;
      return next();
    } catch (error) {
      console.error("Auth Middleware Error:", error.message);

      if (error.name === "TokenExpiredError") {
        return res.status(401).json({
          success: false,
          message: "Session expired, please log in again",
        });
      }

      return res.status(401).json({
        success: false,
        message: "Not authorized, invalid token",
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not authorized, no token provided",
    });
  }
};

export { protect };
