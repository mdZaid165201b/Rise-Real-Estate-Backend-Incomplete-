const mongoose = require("mongoose");
const { Schema } = mongoose;

const ResturantSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      unique: true,
    },
    resturantName: {
      type: String,
      required: true,
      unique: true,
    },

    desc: {
      type: String,
      max: 50,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    isOwner: {
      type: Boolean,
      default: true,
    },
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Resturant", ResturantSchema);
