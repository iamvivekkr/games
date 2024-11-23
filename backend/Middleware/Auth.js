const jwt = require("jsonwebtoken");
const User = require("../Model/User");

const Auth = async (req, res, next) => {
  try {
    var token = "";
    token = req.header("Authorization").replace("Bearer ", "");
    if (!token) {
      throw new Error();
    } else {
      if (token != "null" || !token) {
        const decoded = jwt.verify(token, "soyal");
        const user = await User.findOne({
          _id: decoded._id,
          "tokens.token": token,
        });

        if (!user) {
          res.status(401).send({ status: false, msg: "pls login" });
        }

        req.token = token;

        req.user = user;
        next();
      } else {
        res.status(401).send({ status: false, msg: "pls login" });
      }
    }
  } catch (e) {
    console.log(e, "error");
    res.status(401).send({ status: false, msg: "pls loginn" });
  }
};

module.exports = Auth;
