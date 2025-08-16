const express = require("express");
const router = express.Router();


const payphiController = require("../controllers/payphiController");

// ✅ Use the function properly
router.post("/create-order", payphiController.createPayPhiOrder);
router.post("/callback", payphiController.paymentCallback);

module.exports = router;
