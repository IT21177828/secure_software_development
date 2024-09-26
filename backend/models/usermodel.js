import mongoose from "../db/conn.js";

const user = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },

  lastName: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  passwordHash: {
    type: String,
    required: false,
  },

  gender: {
    type: String,
    required: false,
  },

  age: {
    type: Number,
    required: false,
  },

  address: {
    type: String,
    required: false,
  },

  provider: {
    type: String,
    // required: true,
  },

  providerId: {
    type: String,
    // required: true,
    unique: true,
  },
  photo: {
    type: String,
    required: false,
  },
  userRole: {
    type: String,
    required: true,
    default: "client",
    enum: ["client", "admin"],
  },
});
export default user;
