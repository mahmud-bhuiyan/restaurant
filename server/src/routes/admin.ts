import { Router } from "express";
import { authenticate, requireAdmin } from "../middleware/auth.js";
import { getDashboardStats } from "../services/dashboardService.js";

const router = Router();

router.get("/stats", authenticate, requireAdmin, async (_req, res) => {
  try {
    const stats = await getDashboardStats();
    res.json({ stats });
  } catch (err) {
    console.error("Dashboard stats error:", err);
    res.status(500).json({ message: "Failed to fetch dashboard stats" });
  }
});

export default router;
