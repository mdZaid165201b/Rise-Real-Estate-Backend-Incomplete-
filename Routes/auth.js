const express = require("express");
const router = express.Router();
const Resturant = require("../Models/Resturant");
const mongoose = require("mongoose");
const cryptoJs = require("crypto-js");
const { AES } = require("crypto-js");
const jwt = require("jsonwebtoken");
const verify = require("../middleware/verify");
const User = require("../Models/User");

//register Resturant
router.post("/resturant/register", async (req, res, next) => {
  try {
    console.log("Post request", req.body);

    const newResturant = new Resturant({
      email: req.body.email,
      password: cryptoJs.AES.encrypt(
        req.body.password,
        process.env.SECRET_KEY
      ).toString(),
      desc: req.body.desc,
      address: req.body.address,
      resturantName: req.body.resturantName,
    });

    const fetchedResturant = await Resturant.findOne({
      $or: [{ email: req.body.email }],
    });
    console.log("Fetched", fetchedResturant);
    if (fetchedResturant) {
      console.log("Resturant Alredady exist!!!");
      res.status(404).json("Resturant Already Exist!!!!");
    } else {
      const resturant = await newResturant.save();
      res.status(200).json(resturant);
    }
  } catch {
    (err) => {
      console.log(err);
      res.status(500).json(err);
    };
  }
});
// login resturant
router.get("/resturant/login", async (req, res, next) => {
  try {
    const fetchedResturant = await Resturant.findOne({ email: req.body.email });
    if (!fetchedResturant) {
      res.status(401).json("Wrong Email!!!");
    } else {
      console.log(fetchedResturant);
      const bytes = cryptoJs.AES.decrypt(
        fetchedResturant.password,
        process.env.SECRET_KEY
      );
      const originalPassword = bytes.toString(cryptoJs.enc.Utf8);
      console.log("Original Password = ", originalPassword);
      if (originalPassword !== req.body.password) {
        res.status(401).json("Wrong Password!!!");
      } else {
        // here data is used for resturant...
        const accessToken = jwt.sign(
          { data: fetchedResturant },
          process.env.SECRET_KEY,
          { expiresIn: "5d" }
        );
        const { password, ...info } = fetchedResturant._doc;
        res.status(200).json({ ...info, accessToken });
      }
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// Update Resturant Details
router.put("/resturant/:id", verify, async (req, res, next) => {
  console.log(req.params.id);
  try {
    console.log(
      req.body.resturantName == undefined ? "empty" : req.body.resturantName
    );
    const fetchedResturants = await Resturant.find({
      resturantName: req.body.resturantName,
    });
    if (fetchedResturants.length == 0) {
      console.log(fetchedResturants);
      const updateObj = {
        resturantName:
          req.body.resturantName == undefined
            ? req.user.resturantName
            : req.body.resturantName,
        desc: req.body.desc == undefined ? req.user.desc : req.body.desc,
        password:
          req.body.password == undefined
            ? req.user.password
            : cryptoJs.AES.encrypt(
                req.body.password,
                process.env.SECRET_KEY
              ).toString(),
        address:
          req.body.address == undefined ? req.user.address : req.body.address,
      };
      const updatedResturant = await Resturant.findByIdAndUpdate(
        req.params.id,
        { $set: updateObj },
        { new: true }
      );
      console.log("UpdatedResturant = >", updatedResturant);
      res.status(200).json(updatedResturant);
    } else {
      res.status(404).json("Resturant Already Exist with this name!!!");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//delete Resturant
router.delete("/resturant/:id", verify, async (req, res, next) => {
  try {
    if (req.user.isOwner) {
      await Resturant.findByIdAndDelete(req.params.id);
      res.status(200).json("Resturant Successfully Deleted!");
    } else {
      res.status(401).json("Your are not authorized!!!");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// register user
router.post("/user/register", async (req, res, next) => {
  try {
    const newUser = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: cryptoJs.AES.encrypt(
        req.body.password,
        process.env.SECRET_KEY
      ).toString(),
      contactNumber: req.body.contactNumber,
    });
    const fetchedUser = await User.findOne({ email: req.body.email });
    if (fetchedUser) {
      res.status(404).json("User Already exist!!!");
    } else {
      const storedUser = await newUser.save();
      res.status(201).json(storedUser);
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// login User
router.get("/user/login", async (req, res, next) => {
  try {
    const fetchedUser = await User.findOne({ email: req.body.email });
    if (!fetchedUser) {
      res.status(401).json("Wrong Email!!!");
    } else {
      console.log(fetchedUser);
      const bytes = cryptoJs.AES.decrypt(
        fetchedUser.password,
        process.env.SECRET_KEY
      );
      const originalPassword = bytes.toString(cryptoJs.enc.Utf8);
      console.log("Original Password = ", originalPassword);
      if (originalPassword !== req.body.password) {
        res.status(401).json("Wrong Password!!!");
      } else {
        const accessToken = jwt.sign(
          { data: fetchedUser },
          process.env.SECRET_KEY,
          { expiresIn: "5d" }
        );
        const { password, ...info } = fetchedUser._doc;
        res.status(200).json({ ...info, accessToken });
      }
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// update user
router.put("/user/:id", verify, async (req, res, next) => {
  try {
    console.log(
      req.body.contactNumber == undefined ? "empty" : req.body.contactNumber
    );
    const fetchedUser = await User.find({
      contactNumber: req.body.contactNumber,
    });
    if (fetchedUser.length == 0) {
      console.log(fetchedUser);
      const updateObj = {
        firstName:
          req.body.firstName == undefined
            ? req.user.firstName
            : req.body.firstName,
        lastName:
          req.body.lastName == undefined
            ? req.user.lastName
            : req.body.lastName,
        password:
          req.body.password == undefined
            ? req.user.password
            : cryptoJs.AES.encrypt(
                req.body.password,
                process.env.SECRET_KEY
              ).toString(),
      };
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        { $set: updateObj },
        { new: true }
      );
      console.log("UpdatedResturant = >", updatedUser);
      res.status(200).json(updatedUser);
    } else {
      res.status(404).json("Resturant Already Exist with this name!!!");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// delete user
router.delete("/user/delete/:id", async (req, res, next) => {
  try {
    const fetchedUser = User.findByIdAndDelete(req.params.id);
    res.status(200).json("User Deleted Successfully!!!");
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
