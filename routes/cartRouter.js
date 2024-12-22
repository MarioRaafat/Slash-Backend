import {
    addProductToCart,
    updateProductInCart,
    removeProductFromCart,
    getCart,
    clearCart,
    checkoutCart,
    checkoutCartItem,
} from '../controllers/cartController.js'
import Router from 'express';
import {verifyToken} from "../middlewares/verifyToken.js";

const cartRouter = Router();

/**
 * @swagger
 * /api/cart:
 *   get:
 *     summary: get the cart of user including the cart items
 *     description: get the cart of user including the cart items.
 *     tags:
 *       - Cart
 *     responses:
 *       200:
 *         description: A cart object including cart items
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Cart'
 *       500:
 *         $ref: '#/components/responses/500'
 */
cartRouter.get('/', verifyToken, getCart);

/**
 * @swagger
 * /api/cart/checkout:
 *   get:
 *     summary: Checkout the cart
 *     description: Creates an order for all items in the authenticated user's cart, resets the cart, and updates the total cost to 0.
 *     tags:
 *       - Cart
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Cart checked out successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 order:
 *                   type: object
 *                   description: Details of the created order
 *                   $ref: '#/components/schemas/Order'
 *       403:
 *         $ref: '#/components/responses/403'
 *       404:
 *         description: Cart not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Cart not found"
 *       500:
 *         $ref: '#/components/responses/500'
 */
cartRouter.get('/checkout', verifyToken, checkoutCart);

/**
 * @swagger
 * /api/cart/checkout-item:
 *   post:
 *     summary: Checkout a specific cart item
 *     description: Creates an order for a specific item in the cart, removes it from the cart, and updates the total cost.
 *     tags:
 *       - Cart
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cartItemId:
 *                 type: string
 *                 format: uuid
 *                 description: The ID of the cart item to be checked out
 *                 example: "123e4567-e89b-12d3-a456-426614174000"
 *     responses:
 *       201:
 *         description: Cart item checked out successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 order:
 *                   type: object
 *                   description: Details of the created order
 *                   $ref: '#/components/schemas/Order'
 *       401:
 *         $ref: '#/components/responses/401'
 *       403:
 *         $ref: '#/components/responses/403'
 *       404:
 *         description: Cart item not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Cart item not found"
 *       500:
 *         $ref: '#/components/responses/500'
 */
cartRouter.post('/checkout-item', verifyToken, checkoutCartItem);

/**
 * @swagger
 * /api/cart/add:
 *   post:
 *     summary: add a product to the cart
 *     description: add the selected product to the cart.
 *     tags:
 *       - Cart
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *                 example: "66b20963-b429-4319-838d-130db3d1266f"
 *               quantity:
 *                 type: int
 *                 example: 3
 *     responses:
 *       201:
 *         description: the product is added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Cart'
 *       404:
 *         description: Product variant not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Product variant not found"
 *       500:
 *         $ref: '#/components/responses/500'
 */
cartRouter.post('/add', verifyToken, addProductToCart);

/**
 * @swagger
 * /api/cart/update:
 *   put:
 *     summary: update a product in the cart
 *     description: update the selected product in the cart.
 *     tags:
 *       - Cart
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cartItemId:
 *                 type: string
 *                 example: "66b20963-b429-4319-838d-130db3d1266f"
 *               quantity:
 *                 type: int
 *                 example: 3
 *     responses:
 *       201:
 *         description: the product is updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 cartItem:
 *                   $ref: '#/components/schemas/CartItem'
 *                 message:
 *                   type: string
 *                   example: "the product is updated successfully"
 *       404:
 *         description: Product variant not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Product variant not found"
 *       500:
 *         $ref: '#/components/responses/500'
 */
cartRouter.put('/update', verifyToken, updateProductInCart);

/**
 * @swagger
 * /api/cart/remove/{cartItemId}:
 *   delete:
 *     summary: remove a product from the cart
 *     description: delete the selected product from the cart.
 *     parameters:
 *       - in: path
 *         name: cartItem id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The cartItem ID
 *     tags:
 *       - Cart
 *     responses:
 *       204:
 *         description: the product is removed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "the product is removed successfully"
 *       404:
 *         description: Cart item not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Cart item not found"
 *       500:
 *         $ref: '#/components/responses/500'
 */
cartRouter.delete('/remove/:cartItemId', verifyToken, removeProductFromCart);

/**
 * @swagger
 * /api/cart/clear:
 *   delete:
 *     summary: Clear the cart
 *     description: Removes all items from the authenticated user's cart and resets the total cost to 0.
 *     tags:
 *       - Cart
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204:
 *         description: Cart cleared successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Cart cleared successfully"
 *       403:
 *         $ref: '#/components/responses/403'
 *       404:
 *         description: Cart not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Cart not found"
 *       500:
 *         $ref: '#/components/responses/500'
 */
cartRouter.delete('/clear', verifyToken, clearCart);

export default cartRouter;