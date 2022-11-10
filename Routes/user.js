const express = require("express");
const router = express.Router();
const verify = require("../middleware/verify");
const Product = require("../Models/Product");
const User = require("../Models/User");

// Order Product
// router.post('/order/product/:id', verify, async (req, res, next) => {
//     try {
//         if (!req.user.isOwner) {
//             console.log("if part")
//             const fetchedProduct = await Product.findById(req.params.id);
//             console.log("fetchedProduct =>",fetchedProduct)
//             const user = await User.findById(req.user.id);
//             user.orders.forEach(item => {
//                 if (item.toString() !== req.params.id.toString()) {
//                     user.orders.push(fetchedProduct)
//                     console.log("after pushing")

//                 } else {
//                     res.status(400).json('Product already exist!')
//                 }
//             });
//             await user.save();
//             console.log("after saving",user)

//             console.log(fetchedProduct)
//             console.log(user)
//             res.status(200).json(user);
//         }
//         res.status(400).json('You are not authenticated!')
//     } catch (err) {
//         res.status(500).json(err)
//     }
// });

router.post("/order/product/:id",verify,async (req,res,next)=>{
    try{
        if(!req.user.isOwner){
            console.log("if part");
            const user = await User.findById(req.user._id);
            console.log("fetchedUser =>" ,user)

            
            const fetchedProduct = await Product.findById(req.params.id);
            console.log("user =>",user);
            user.orders.push(fetchedProduct);
            console.log("after pushing part");
            await user.save()
            console.log("after saving part",user.orders);
        }
    }
    catch(err){
        res.status(500).json(err)
    }
})


module.exports = router;