import mongoose from "mongoose";

//Role bassed system is defined
const roles = ["ADMIN", "USER"];

/*
  User Schema defines structure of User collection
*/
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true, // no duplicate emails
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: roles,
      default: "USER", // default role
    },
  },
  { timestamps: true },
);

const User = mongoose.model("User", userSchema);

export default User;
