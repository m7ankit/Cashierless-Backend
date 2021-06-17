var express = require("express");
var router = express.Router();
const {
  isSignedin,
  isAuthenticated,
  isCustomer,
  isGuard,
  isManager,
} = require("../middlewares/auth");
const { updateStock } = require("../middlewares/product");
const { getUserById, pushOrderInPurchaseList } = require("../middlewares/user");
const {
  createOrder,
  getAllOrders,
  getOrderStatus,
  updateStatus,
  getOrderDetails,
} = require("../controllers/order");
const { getOrderById } = require("../middlewares/order");

router.param("userId", getUserById);
router.param("orderId", getOrderById);

// Get all orders
router.get(
  "/order/all/:userId",
  isSignedin,
  isAuthenticated,
  isManager,
  getAllOrders
);

// Get all status in enums
router.get(
  "/order/status/:userId",
  isSignedin,
  isAuthenticated,
  isManager,
  getOrderStatus
);

// Get order details
router.get("/order/:orderId", getOrderDetails);

// Admin can change status of orders
router.put("/order/status", isSignedin, isAuthenticated, updateStatus);

//create a new order createOrder
router.post(
  "/order/create/:userId",
  isSignedin,
  isAuthenticated,
  isCustomer,
  pushOrderInPurchaseList,
  createOrder
);

module.exports = router;
