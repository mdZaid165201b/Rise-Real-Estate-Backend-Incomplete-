const jwt = require("jsonwebtoken");

verify = (req, res, next) => {
  const authHeader = req.headers.token;
  const token = authHeader.split(" ")[1];
  if (authHeader) {
    jwt.verify(token, process.env.SECRET_KEY, (err, result) => {
      if (err) {
        console.log("verify error part = ",err)
        res.status(403).json("Invalid token!!!");
      }
      console.log("result =>",result);
      req.user = result.data;
      next();
    });
  } else {
    res.status(401).json("You are not authorized!!!");
  }
};
module.exports = verify;
