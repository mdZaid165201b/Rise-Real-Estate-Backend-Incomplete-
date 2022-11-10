const express = require("express");
const bodyparser = require("body-parser");
const { urlencoded } = require("body-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const port = process.env.port || 8000;
const app = express();
dotenv.config();

const authRoutes = require('./Routes/auth');
const productRoutes = require("./Routes/product");
const userRoutes = require("./Routes/user");

app.use(bodyparser.urlencoded({ extended: true }));
console.log(process.env.MONGO_URL);
app.use(bodyparser.json());

app.use('/api/auth',authRoutes);
app.use('/api/product',productRoutes);
app.use('/api/user',userRoutes);


mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Database connected...");
    app.listen(port, () => {
      console.log("server listening on port no: ", port);
    });
  })
  .catch((err) => {
    console.log(err);
  });
