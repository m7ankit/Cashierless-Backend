const express = require("express");
const router = express.Router();
const { makePayment } = require("../controllers/stripe");

router.post("/stripepayment", makePayment);

module.exports = router;
