import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    parentEmail: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    passwordHash: {
      type: String,
      required: true
    },

    childName: {
      type: String,
      required: true,
      trim: true
    },

    childAgeMonths: {
      type: Number,
      required: true,
      min: 24,
      max: 36
    }
  },
  {
    timestamps: true
  }
);

const User = mongoose.model("User", userSchema);

export default User;
