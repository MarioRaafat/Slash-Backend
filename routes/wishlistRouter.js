import Router from 'express';
import {verifyToken} from "../middlewares/verifyToken.js";
import {getWishlist, addToWishlist, clearWishlist, removeFromWishlist} from "../controllers/wishlistController.js";

const wishlistRouter = Router();

/**
 * @swagger
 * /api/wishlist:
 *   get:
 *     summary: Retrieve the user's wishlist
 *     description: Fetch the wishlist for the authenticated user, including details of the products.
 *     tags:
 *       - Wishlist
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Wishlist products retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       401:
 *         $ref: '#/components/responses/401'
 *       403:
 *         $ref: '#/components/responses/403'
 *       404:
 *         description: Wishlist not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Wishlist not found"
 *       500:
 *         $ref: '#/components/responses/500'
 */
wishlistRouter.get('/', verifyToken, getWishlist);

/**
 * @swagger
 * /api/wishlist/add:
 *   post:
 *     summary: Add a product to the user's wishlist
 *     description: Add a product to the wishlist of the authenticated user.
 *     tags:
 *       - Wishlist
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *                 format: uuid
 *                 example: "a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6"
 *     responses:
 *       200:
 *         description: Product added to wishlist successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Product added to wishlist"
 *                 item:
 *                   $ref: '#/components/schemas/WishlistItem'
 *       400:
 *         description: Product already exists in wishlist
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Product already exists in wishlist"
 *       401:
 *         $ref: '#/components/responses/401'
 *       403:
 *         $ref: '#/components/responses/403'
 *       404:
 *         description: Wishlist not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Wishlist not found"
 *       500:
 *         $ref: '#/components/responses/500'
 */
wishlistRouter.post('/add', verifyToken, addToWishlist);

/**
 * @swagger
 * /api/wishlist/remove:
 *   delete:
 *     summary: Remove a product from the user's wishlist
 *     description: Remove a specific product from the authenticated user's wishlist.
 *     tags:
 *       - Wishlist
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *                 format: uuid
 *                 example: "a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6"
 *     responses:
 *       200:
 *         description: Product removed from wishlist successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Product removed from wishlist"
 *       401:
 *         $ref: '#/components/responses/401'
 *       404:
 *         description: Item or Wishlist not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Item not found in wishlist"
 *       500:
 *         $ref: '#/components/responses/500'
 */
wishlistRouter.delete('/remove', verifyToken, removeFromWishlist);

/**
 * @swagger
 * /api/wishlist/clear:
 *   delete:
 *     summary: Clear the user's wishlist
 *     description: Remove all products from the authenticated user's wishlist.
 *     tags:
 *       - Wishlist
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Wishlist cleared successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Wishlist cleared"
 *       401:
 *         $ref: '#/components/responses/401'
 *       403:
 *         $ref: '#/components/responses/403'
 *       404:
 *         description: Wishlist not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Wishlist not found"
 *       500:
 *         $ref: '#/components/responses/500'
 */
wishlistRouter.delete('/clear', verifyToken, clearWishlist);

export default wishlistRouter;