import express from "express";
import { registerHandler, loginHandler, verifyEmailHandler, refreshHandler, logoutHandler ,forgetPasswordHandler} from "../controllers/auth/auth.controller.js";
const router = express.Router();

router.post("/register", registerHandler);
router.post("/login", loginHandler);
router.post("/verify-email", verifyEmailHandler);
router.post("/refresh", refreshHandler);
router.post("/logout", logoutHandler);
router.post("/forget-password", forgetPasswordHandler);

export default router;
