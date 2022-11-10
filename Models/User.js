const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    firstName: {
      type: String,
      reuqired: true,
      max: 10,
    },
    lastName: {
      type: String,
      required: true,
      max: 10,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      max: 16,
      unique: true,
    },
    // imageUrl: {
    //   type: String,
    //   required: true,
    // },
    contactNumber: {
      type: String,
      unique: true,
      required: true,
      max: 11,
    },
    isOwner:{
      type:Boolean,
      default: false,
    },
    orders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
  },
  { timestamps: true }
);
module.exports = mongoose.model("User", UserSchema);
