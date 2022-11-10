const mongoose = require("mongoose");
const { Schema } = mongoose;

const ProductSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      max: 15,
    },
    desc: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    price: {
      type: String,
      required: true,
    },
    resturant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resturant'
  }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);
