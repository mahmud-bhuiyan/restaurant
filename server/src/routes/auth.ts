import { Router } from "express";
import { authenticate } from "../middleware/auth.js";
import {
  AuthError,
  loginUser,
  registerUser,
  updateUserProfile,
} from "../services/authService.js";
import { COOKIE_NAME, cookieOptions, signToken } from "../utils/jwt.js";
import { sendAuthResponse } from "../utils/userFormatter.js";

const router = Router();

function handleAuthError(
  res: import("express").Response,
  err: unknown,
  fallback: string,
) {
  if (err instanceof AuthError) {
    res.status(err.status).json({ message: err.message });
    return;
  }
  console.error(fallback, err);
  res.status(500).json({ message: fallback });
}

function setAuthCookie(
  res: import("express").Response,
  token: string,
) {
  res.cookie(COOKIE_NAME, token, cookieOptions());
}

router.post("/register", async (req, res) => {
  try {
    const user = await registerUser(req.body);
    sendAuthResponse(res, user, (token) => setAuthCookie(res, token), signToken, 201);
  } catch (err) {
    handleAuthError(res, err, "Registration failed");
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await loginUser(email, password);
    sendAuthResponse(res, user, (token) => setAuthCookie(res, token), signToken);
  } catch (err) {
    handleAuthError(res, err, "Login failed");
  }
});

router.post("/logout", (_req, res) => {
  res.clearCookie(COOKIE_NAME, cookieOptions(true));
  res.json({ message: "Logged out" });
});

router.get("/me", authenticate, (req, res) => {
  res.json({ user: req.user });
});

router.patch("/profile", authenticate, async (req, res) => {
  try {
    const user = await updateUserProfile(req.user!.id, req.body);
    res.json({ user });
  } catch (err) {
    handleAuthError(res, err, "Profile update failed");
  }
});

export default router;
