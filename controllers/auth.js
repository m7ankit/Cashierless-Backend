const User = require("../models/user");
const { check, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

exports.signup = (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
    });
  }

  const user = new User(req.body);
  user.save((err, user) => {
    if (err) {
      return res.status(400).json({
        error: "User with this email already exists",
      });
    }
    return res.status(201).json({
      name: user.firstname,
      email: user.email,
      id: user._id,
    });
  });
};

exports.signin = (req, res) => {
  // Validating the request
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(404).json({
      error: errors.array()[0].msg,
    });
  }

  // We need only 2 fields for auth
  const { email, password } = req.body;

  //findOne() will give the first user
  User.findOne({ email }, (err, user) => {
    if (err) {
      return res.status(500).json({
        error: "error",
      });
    }

    if (!user) {
      return res.status(401).json({
        error: "user with given email does not exist.",
      });
    }

    if (!user.authenticate(password)) {
      return res.status(401).json({
        error: "email and password do not match",
      });
    }

    // Token Creation
    const token = jwt.sign({ _id: user._id }, process.env.SECRET);

    //Put token in cookies
    res.cookie("token", token, { expire: new Date() + 9999 });

    //response to user
    const { _id, firstname, email, role } = user;
    return res.json({ token, user: { _id, name: firstname, email, role } });
  });
};

exports.signout = (req, res) => {
  res.clearCookie("token");
  return res.status(200).json({
    message: "You are signed out",
  });
};
