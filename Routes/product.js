const express = require("express");
const router = express.Router();
const verify = require("../middleware/verify");
const Product = require("../Models/Product");
const Resturant = require("../Models/Resturant");

// create Product
router.post("/create", verify, async (req, res, next) => {
  try {
    if (req.user.isOwner) {
      console.log("Your are Resturant Admin");

      const fetchedProducts = await Product.find({ title: req.body.title });
      if (fetchedProducts.length == 0) {
        const fetchedResturant = await Resturant.findById(req.user._id).select({
          password: 0,
        });
        const newProduct = new Product({
          title: req.body.title,
          desc: req.body.desc,
          imageUrl: req.body.imageUrl,
          price: req.body.price,
          resturant: fetchedResturant,
        });

        newProduct.resturant = fetchedResturant;
        const createdProduct = await Product.create(newProduct);
        fetchedResturant.products.push(newProduct);
        await fetchedResturant.save();
        console.log(createdProduct);
        res.status(200).json("Procut Created Successfully!");
      } else {
        res.status(404).json("Prodcut Already exist!!!");
      }
    } else {
      console.log("You are not admin!!!");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// update Product
router.put("/update/:id", verify, async (req, res, next) => {
  try {
    if (req.user.isOwner) {
      const fetchedProduct = await Product.findById(req.params.id);
      if (fetchedProduct) {
        console.log("fetchedProduct =>", fetchedProduct);
        const updateObj = {
          title:
            req.body.title == undefined ? fetchedProduct.title : req.body.title,
          desc:
            req.body.title == undefined ? fetchedProduct.desc : req.body.desc,
          isAvailable:
            req.body.isAvailable == undefined
              ? fetchedProduct.isAvailable
              : req.body.isAvailable,
          price:
            req.body.price == undefined ? fetchedProduct.price : req.body.price,
        };
        const updatedProduct = await Product.findByIdAndUpdate(
          req.params.id,
          { $set: updateObj },
          { new: true }
        );
        res.status(200).json(updatedProduct);
      } else {
        res.status(404).json("No Product Found!!!");
      }
    } else {
      res.status(401).json("You are not authorized!!!");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//delete product
router.delete("/delete/:id", verify, async (req, res, next) => {
  try {
    if (req.user.isOwner) {
      await Product.findByIdAndDelete(req.params.id);
      res.status(200).json("Product Deleted Successfully!!!");
    } else {
      res.status(401).json("You are not authorized!!!");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get All Resturant Products
router.get("/get/resturant/:id", async (req, res, next) => {
  try {
    const fetchedResturant = await Resturant.findById(req.params.id).populate(
      "products"
    );
    console.log("All  Products =>", fetchedResturant.products);
    res.status(200).json(fetchedResturant.products);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get All Products
router.get("/all/products",async(req,res,next)=>{
    try{
        const allProducts = await Product.find();
        console.log(allProducts);
        res.status(200).json(allProducts);
    }
    catch(err){
        res.status(500).json(err);
    }
});

// Get Latest Products
router.get("/latest",async (req,res,next)=>{
    try{
        const latestProducts = await Product.find({}, {}, {sort: {'createdAt': -1}}).limit(4);
        console.log(latestProducts);
        res.status(200).json(latestProducts);
    }
    catch(err){
        res.status(500).json(err);
    }
});

module.exports = router;
