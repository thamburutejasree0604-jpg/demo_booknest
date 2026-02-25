import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
  cover: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  author: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
    default: 0,
  },
  description: {
    type: String,
    required: false,
    trim: true,
  },
  details: {
    type: String,
    required: false,
    trim: true,
  },
  genre: {
    type: Number,
    required: true,
    default: 0,
  },
  slug: {
    type: String,
    lowercase: true,
    trim: true,
    unique: true,
  },
  qty: {
    type: Number,
    require: true,
    default: 0,
    min: [0, "Quantity cannot be less than 0"],
  },
});

export default mongoose.model("books", bookSchema);
