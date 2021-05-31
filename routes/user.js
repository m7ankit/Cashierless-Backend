var express = require("express");
var router = express.Router();
const { check, validationResult } = require("express-validator");
const { getUser, updateUser, userOrderList } = require("../controllers/user");
const { getUserById } = require("../middlewares/user")
const { isSignedin, isAuthenticated, isCustomer, isGuard, isManager } = require("../middlewares/auth")

router.param("userId", getUserById);

router.get("/user/:userId", isSignedin, isAuthenticated, getUser);
router.put("/user/:userId", isSignedin, isAuthenticated, updateUser);
router.get("/order/user/:userId", isSignedin, isAuthenticated, userOrderList);



module.exports = router;