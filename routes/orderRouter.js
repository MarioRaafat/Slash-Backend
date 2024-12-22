import Router from 'express';
import {verifyToken} from "../middlewares/verifyToken.js";
import{
    getAllOrders,
    getOrderById,
    createOrder,
    addProductToOrder,
    updateOrderStatus
} from "../controllers/orderController.js"


const orderRouter = Router();   


/**
 * @swagger
 * /api/order/:
 *   get:
 *     summary: Get all Orders of a user
 *     description: Retrieves a list of all orders for the specified user.
 *     tags:
 *       - Order
 *     responses:
 *       200:
 *         description: A list of orders
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No orders found"
 *       500:
 *         $ref: '#/components/responses/500'
 */
orderRouter.get("/", verifyToken, getAllOrders);

/**
 * @swagger
 * /api/order/create-order:
 *   post:
 *     summary: create a new order
 *     description: create a new order setting the longitude and latitude for location and user_id.
 *     tags:
 *       - Order
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               longitude:
 *                 type: string
 *                 example: "0"
 *               latitude:
 *                 type: string
 *                 example: "0"
 *     responses:
 *       200:
 *         description: order object
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *       400:
 *         description: missing data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Missing longitude or latitude"
 *       401:
 *         $ref: '#/components/responses/401'
 *       403:
 *         $ref: '#/components/responses/403'
 *       500:
 *         $ref: '#/components/responses/500'
 */
orderRouter.post("/create-order", verifyToken, createOrder);

/**
 * @swagger
 * /api/order/{orderId}:
 *   get:
 *     summary: Get an order given its Id
 *     description: Retrieve an order object.
 *     operationId: getOrderById
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The order ID
 *     tags:
 *       - Order
 *     responses:
 *       200:
 *         description: An order object 
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *       404:
 *         description: the given ID doesn't match any order
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Order not found"
 *       500:
 *         $ref: '#/components/responses/500'
 */
orderRouter.get("/:orderId",getOrderById);

/**
 * @swagger
 * /api/order/add-product-to-order:
 *   post:
 *     summary: add a product to an order
 *     description: loading a product with its quantity on an order.
 *     tags:
 *       - Order
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               orderId:
 *                 type: string
 *                 example: "d74a7ea7-3239-4393-8da5-27d31494db67"
 *               ProductVariantId:
 *                 type: string
 *                 example: "0084ec7f-1afa-4524-936a-c9ab0ba19bb3"
 *               quantity:
 *                 type: int
 *                 example: 3
 *     responses:
 *       200:
 *         description: oredr object
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *       400:
 *         description: missing data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Missing order id, product id, or quantity"
 *       500:
 *         $ref: '#/components/responses/500'
 */
orderRouter.post("/add-product-to-order", addProductToOrder);

/**
 * @swagger
 * /api/order/update-order-status:
 *   post:
 *     summary: update the status of an order
 *     description: loading a product with its quantity on an order.
 *     tags:
 *       - Order
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               orderId:
 *                 type: string
 *                 example: "d74a7ea7-3239-4393-8da5-27d31494db67"
 *               status:
 *                 type: string
 *                 example: "PENDING"
 *     responses:
 *       200:
 *         description: oredr object
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *       400:
 *         description: missing data or invalid status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Missing order id or status"
 *       404:
 *         description: order not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Order not found"
 *       500:
 *         $ref: '#/components/responses/500'
 */
orderRouter.post("/update-order-status", updateOrderStatus);


export default orderRouter;
