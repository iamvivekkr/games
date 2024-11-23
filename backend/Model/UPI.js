const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the UPI schema
const upiSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User", // Assuming you have a User model
  },
  upiId: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const UPI = mongoose.model("UPI", upiSchema);

module.exports = UPI;
