const express = require("express");
const router = express.Router();
const {
  adminLogin,
  changeAdminPassword,
} = require("../controllers/AuthController");
const { adminAuth } = require("../middleware/authentication");

router.post("/admin", adminLogin);
router.patch("/admin/password", adminAuth, changeAdminPassword);

module.exports = router;
