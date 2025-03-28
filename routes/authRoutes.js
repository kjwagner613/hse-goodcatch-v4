const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// Define routes
router.get("/sign-up", authController.renderSignUp);
router.get("/sign-in", authController.renderSignIn);
router.get("/sign-out", authController.signOut);
router.post("/sign-up", authController.handleSignUp);
router.post("/sign-in", authController.handleSignIn);

module.exports = router;