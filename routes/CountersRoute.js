const express = require("express");
const router = express.Router();
const {
  getDashboardInfo,
  appendInfo,
  appendVisitCount,
} = require("../controllers/CountersController");
const { auth, adminAuth } = require("../middleware/authentication");

// Public routes
router.get("/dashboard", adminAuth, getDashboardInfo);
router.post("/visit", appendVisitCount);
router.post("/info",  appendInfo);

module.exports = router;
