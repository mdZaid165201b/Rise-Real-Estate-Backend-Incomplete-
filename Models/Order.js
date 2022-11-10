const mongoose = require("mongoose");
const { Schema } = mongoose;

const OrderSchema = new Schema({
  isFulFilled: {
    type: Boolean,
    default: false,
  },
  orderProducts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
});
