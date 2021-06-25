var express = require("express");
var router = express.Router();
const { check } = require("express-validator");
const {
  signout,
  signup,
  signin,
  googleSignin,
} = require("../controllers/auth");
const { isSignedin } = require("../middlewares/auth");

router.post(
  "/signup",
  [
    check("firstname", "name should be at least 3 char").isLength({ min: 3 }),
    check("email", "email is required").isEmail(),
    check("password", "password should be at least 3 char").isLength({
      min: 3,
    }),
  ],
  signup
);

router.post(
  "/signin",
  [
    check("email", "email is required").isEmail(),
    check("password", "password field is required").isLength({ min: 1 }),
  ],
  signin
);

router.post("/auth/google", googleSignin);

router.get("/signout", signout);

router.get("/test", isSignedin, (req, res) => {
  res.send("protected route");
});

module.exports = router;
