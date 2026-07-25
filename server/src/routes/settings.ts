import { Router } from "express";
import { authenticate, requireAdmin } from "../middleware/auth.js";
import {
  SettingsError,
  formatAdminSettings,
  formatPublicSettings,
  getSiteSettings,
  updateSiteSettings,
} from "../services/settingsService.js";

const router = Router();

function handleError(
  res: import("express").Response,
  err: unknown,
  fallback: string,
) {
  if (err instanceof SettingsError) {
    res.status(err.status).json({ message: err.message });
    return;
  }
  console.error(fallback, err);
  res.status(500).json({ message: fallback });
}

router.get("/", async (_req, res) => {
  try {
    const settings = await getSiteSettings();
    res.json({ settings: formatPublicSettings(settings) });
  } catch (err) {
    handleError(res, err, "Failed to fetch settings");
  }
});

router.get("/admin", authenticate, requireAdmin, async (_req, res) => {
  try {
    const settings = await getSiteSettings();
    res.json({ settings: formatAdminSettings(settings) });
  } catch (err) {
    handleError(res, err, "Failed to fetch settings");
  }
});

router.patch("/", authenticate, requireAdmin, async (req, res) => {
  try {
    const settings = await updateSiteSettings(req.body);
    res.json({ settings: formatAdminSettings(settings) });
  } catch (err) {
    handleError(res, err, "Failed to update settings");
  }
});

export default router;
