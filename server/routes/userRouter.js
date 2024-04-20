import express from "express";
import {
  login,
  logout,
  myProfile,
  register,
} from "../controller/userController.js";
import { isAuthenticated } from "../middlewares/auth.js";

import {
  resetPasswordToken,
  resetPassword
} from "../controller/resetPassword.js"


const router = express.Router();

router.post("/login", login);
router.get("/logout", isAuthenticated, logout);
router.get("/me", isAuthenticated, myProfile);
router.post("/register", register);



router.post("/reset-password-token", resetPasswordToken)
router.post("/reset-password", resetPassword)



export default router;
