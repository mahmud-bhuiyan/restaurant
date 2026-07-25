import { Router } from "express";
import { authenticate, requireAdmin } from "../middleware/auth.js";
import {
  OrderError,
  createOrder,
  formatOrder,
  getAllOrders,
  getCustomerName,
  getOrderById,
  getOrdersForUser,
  updateOrderStatus,
} from "../services/orderService.js";
import { OrderStatus } from "../types/order.js";

const router = Router();

function handleOrderError(
  res: import("express").Response,
  err: unknown,
  fallback: string,
) {
  if (err instanceof OrderError) {
    res.status(err.status).json({ message: err.message });
    return;
  }
  console.error(fallback, err);
  res.status(500).json({ message: fallback });
}

router.post("/", authenticate, async (req, res) => {
  try {
    const order = await createOrder(req.user!.id, req.body);
    res.status(201).json({ order: formatOrder(order) });
  } catch (err) {
    handleOrderError(res, err, "Failed to create order");
  }
});

router.get("/mine", authenticate, async (req, res) => {
  try {
    const orders = await getOrdersForUser(req.user!.id);
    res.json({ orders: orders.map((o) => formatOrder(o)) });
  } catch (err) {
    handleOrderError(res, err, "Failed to fetch orders");
  }
});

router.get("/", authenticate, requireAdmin, async (req, res) => {
  try {
    const status = req.query.status as OrderStatus | undefined;
    if (status && !Object.values(OrderStatus).includes(status)) {
      res.status(400).json({ message: "Invalid status filter" });
      return;
    }

    const orders = await getAllOrders(status);
    const formatted = await Promise.all(
      orders.map(async (order) => {
        const customerName = await getCustomerName(order.userId.toString());
        return formatOrder(order, customerName);
      }),
    );

    res.json({ orders: formatted });
  } catch (err) {
    handleOrderError(res, err, "Failed to fetch orders");
  }
});

router.get("/:id", authenticate, async (req, res) => {
  try {
    const order = await getOrderById(req.params.id);

    if (order.userId.toString() !== req.user!.id && req.user!.role !== "ADMIN") {
      res.status(403).json({ message: "Access denied" });
      return;
    }

    const customerName =
      req.user!.role === "ADMIN"
        ? await getCustomerName(order.userId.toString())
        : undefined;

    res.json({ order: formatOrder(order, customerName) });
  } catch (err) {
    handleOrderError(res, err, "Failed to fetch order");
  }
});

router.patch("/:id/status", authenticate, requireAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await updateOrderStatus(req.params.id, status);
    const customerName = await getCustomerName(order.userId.toString());
    res.json({ order: formatOrder(order, customerName) });
  } catch (err) {
    handleOrderError(res, err, "Failed to update order status");
  }
});

export default router;
