import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const SALT_ROUNDS = 12;

/**
 * Signs a JWT for a given user id.
 */
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

/**
 * @route   POST /api/auth/signup
 * @desc    Register a new parent account
 * @access  Public
 */
const signup = async (req, res) => {
  try {
    const { parentEmail, password, childName, childAgeMonths } = req.body;

    if (!parentEmail || !password || !childName || !childAgeMonths) {
      return res.status(400).json({
        success: false,
        message:
          "parentEmail, password, childName, and childAgeMonths are all required.",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long.",
      });
    }

    const normalizedEmail = parentEmail.toLowerCase().trim();

    const existingUser = await User.findOne({ parentEmail: normalizedEmail });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists.",
      });
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    const user = await User.create({
      parentEmail: normalizedEmail,
      passwordHash,
      childName,
      childAgeMonths,
    });

    const token = generateToken(user._id);

    return res.status(201).json({
      success: true,
      message: "Account created successfully.",
      data: {
        token,
        user: {
          id: user._id,
          parentEmail: user.parentEmail,
          childName: user.childName,
          childAgeMonths: user.childAgeMonths,
        },
      },
    });
  } catch (error) {
    console.error("Signup Error:", error.message);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Something went wrong while creating the account.",
    });
  }
};

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate a parent and issue a JWT
 * @access  Public
 */
const login = async (req, res) => {
  try {
    const { parentEmail, password } = req.body;

    if (!parentEmail || !password) {
      return res.status(400).json({
        success: false,
        message: "parentEmail and password are required.",
      });
    }

    const normalizedEmail = parentEmail.toLowerCase().trim();

    // Explicitly select passwordHash since schema doesn't exclude it by default,
    // but being explicit keeps intent clear at the query site.
    const user = await User.findOne({ parentEmail: normalizedEmail });

    if (!user) {
      // Generic message avoids leaking which accounts exist
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const token = generateToken(user._id);

    return res.status(200).json({
      success: true,
      message: "Logged in successfully.",
      data: {
        token,
        user: {
          id: user._id,
          parentEmail: user.parentEmail,
          childName: user.childName,
          childAgeMonths: user.childAgeMonths,
        },
      },
    });
  } catch (error) {
    console.error("Login Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while logging in.",
    });
  }
};

/**
 * @route   GET /api/auth/profile
 * @desc    Return the currently authenticated user's profile
 * @access  Private (requires protect middleware)
 */
const getProfile = async (req, res) => {
  try {
    // req.user is populated by the protect middleware and already
    // excludes passwordHash via .select("-passwordHash")
    return res.status(200).json({
      success: true,
      data: {
        user: req.user,
      },
    });
  } catch (error) {
    console.error("Get Profile Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching the profile.",
    });
  }
};

/**
 * @route   PATCH /api/auth/profile
 * @desc    Update limited, non-sensitive profile fields (childName, childAgeMonths)
 * @access  Private (requires protect middleware)
 */
const updateProfile = async (req, res) => {
  try {
    const { childName, childAgeMonths } = req.body;

    const updates = {};

    if (childName !== undefined) updates.childName = childName;
    if (childAgeMonths !== undefined) updates.childAgeMonths = childAgeMonths;

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid fields provided to update.",
      });
    }

    const updatedUser = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    }).select("-passwordHash");

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      data: {
        user: updatedUser,
      },
    });
  } catch (error) {
    console.error("Update Profile Error:", error.message);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Something went wrong while updating the profile.",
    });
  }
};

export { signup, login, getProfile, updateProfile };
