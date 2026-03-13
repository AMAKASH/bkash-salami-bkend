const Admin = require("../models/admin.js");
const { StatusCodes } = require("http-status-codes");
const { UnauthenticatedError, CustomAPIError } = require("../errors");

const PROD_MODE = process.env.PROD_MODE === "true";

const adminLogin = async (req, res) => {
  if (!req.body.email || !req.body.password) {
    throw new UnauthenticatedError("Invalid Login Credentials. Try Again");
  }

  const admin = await Admin.findOne({ email: req.body.email, enabled: true });

  if (!admin) {
    throw new UnauthenticatedError("Invalid Login Credentials. Try Again");
  }

  const isPassCorrect = await admin.comparePassword(req.body.password);

  if (!isPassCorrect) {
    throw new UnauthenticatedError("Invalid Login Credentials. Try Again");
  }

  const token = admin.createJWT();

  res.status(StatusCodes.OK).json({ user: { email: admin.email }, token });
};

const changeAdminPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const admin = await Admin.findById(req.admin.userID);
  if (!admin) {
    throw new NotFoundError("Admin not found");
  }
  const isPassCorrect = await admin.comparePassword(oldPassword);
  if (!isPassCorrect) {
    throw new UnauthenticatedError("Invalid Old Password");
  }
  admin.password = newPassword;
  await admin.save();
  return res.json({ user: { email: admin.email }, token: admin.createJWT() });
};

module.exports = {
  adminLogin,
  changeAdminPassword,
};
