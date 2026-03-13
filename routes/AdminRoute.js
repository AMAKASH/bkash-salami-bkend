const express = require("express");
const router = express.Router();
const { createAdmin } = require("../controllers/AdminController");
const { adminAuth } = require("../middleware/authentication");

router.post("/", adminAuth, createAdmin);

module.exports = router;
