import express from "express";
import { registerHandler, loginHandler, verifyEmailHandler } from "../controllers/auth/auth.controller.js";
const router = express.Router();

router.post("/register", registerHandler);
router.post("/login", loginHandler);
router.post("/verify-email", verifyEmailHandler);


export default router