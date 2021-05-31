var express = require("express");
var router = express.Router();
const { createCategory, getAllCategories, getCategory, updateCategory, deleteCategory } = require("../controllers/category");
const { getCategoryById } = require("../middlewares/category");
const { getUserById } = require("../middlewares/user");
const { isSignedin, isAuthenticated, isCustomer, isGuard, isManager } = require("../middlewares/auth");

router.param("userId", getUserById);
router.param("categoryId", getCategoryById);

router.post("/category/create/:userId", isSignedin, isAuthenticated, isManager, createCategory);
router.get("/category/all", isSignedin, getAllCategories);
router.get("/category/:categoryId", isSignedin, getCategory);
router.put("/category/:categoryId/:userId", isSignedin, isAuthenticated, isManager, updateCategory);
router.delete("/category/:categoryId/:userId", isSignedin, isAuthenticated, isManager, deleteCategory);



module.exports = router;