import express from "express";
import * as OrderController from "../controllers/OrderController";
import {authenticate, authorize} from "../middlewares/auth";

const router = express.Router();

/**
  * @openapi
  * /api/orders:
  *   post:
  *     summary: Create a new order
  *     tags: [Order]
  *     security:
  *       - bearerAuth: []
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             $ref: '#/components/schemas/OrderRequestBody'
  *     responses:
  *       201:
  *         description: Order created
  *         content:
  *           application/json:
  *             schema:
  *               $ref: '#/components/schemas/Order'
  *       500:
  *         $ref: '#/components/responses/InternalServerError'
  */
router.post("/", authenticate, OrderController.createOrder);

// TODO: filter by order status

/**
  * @openapi
  * /api/orders:
  *   get:
  *     summary: Get all orders
  *     tags: [Order]
  *     responses:
  *       200:
  *         description: List of all orders
  *         content:
  *           application/json:
  *             schema:
  *               type: array
  *               items:
  *                 $ref: '#/components/schemas/Order'
  *       500:
  *         $ref: '#/components/responses/InternalServerError'
  */
router.get("/", authorize('staff'), OrderController.getOrders);

/**
  * @openapi
  * /api/orders/{id}:
  *   get:
  *     summary: Get order by id
  *     tags: [Order]
  *     responses:
  *       200:
  *         description: Single order
  *         content:
  *           application/json:
  *             schema:
  *                 $ref: '#/components/schemas/Order'
  *       404:
  *         $ref: '#/components/responses/NotFoundError'
  *       500:
  *         $ref: '#/components/responses/InternalServerError'
  */
router.get("/:id", authenticate, OrderController.getOrderById);

export default router;
