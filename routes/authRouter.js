import { login, shopperSignup, brandSignup, getUserInfo, changePassword, deleteUser, logout } from '../controllers/authController.js';
import Router from 'express';
import {verifyToken} from "../middlewares/verifyToken.js";

const authRouter = Router();


/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Retrieve user information
 *     description: Fetches the current user's information. Requires a valid token.
 *     tags:
 *       - Auth
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User information retrieved successfully (BRAND or USER or ADMIN)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         $ref: '#/components/responses/401'
 *       403:
 *         $ref: '#/components/responses/403'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User not found"
 *       500:
 *         $ref: '#/components/responses/500'
 */
authRouter.get('/me', verifyToken, getUserInfo);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login to the application
 *     description: Authenticates a user and returns a JWT token in a cookie.
 *     tags:
 *        - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: Login successful (USER or BRAND or ADMIN)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/Brand'
 *                 token:
 *                   type: string
 *                   example: "your_jwt_token_here"
 *                 role:
 *                   type: string
 *                   example: "BRAND"
 *       400:
 *          description: Missing required fields or Invalid role
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *                    example: "Missing required fields"
 *       401:
 *         description: Wrong password or User is blocked
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Wrong password"
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User not found"
 *       500:
 *         $ref: '#/components/responses/500'
 */
authRouter.post('/login', login);

/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new user account and returns the user details along with a JWT token in a cookie.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *          description: Missing required fields
 *          content:
 *            application/json:
 *              schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 token:
 *                   type: string
 *                   example: "your_jwt_token_here"
 *       409:
 *         description: User or Phone number or Username already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Email already exists"
 *       500:
 *         $ref: '#/components/responses/500'
 */
authRouter.post('/signup', shopperSignup);

/**
 * @swagger
 * /api/auth/brand-signup:
 *  post:
 *    summary: Register a new brand
 *    description: Creates a new brand account and returns the brand details along with a JWT token in a cookie.
 *    tags:
 *      - Auth
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Brand'
 *    responses:
 *      201:
 *        description: Brand registered successfully
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                user:
 *                  $ref: '#/components/schemas/Brand'
 *                token:
 *                  type: string
 *                  example: "your_jwt_token_here"
 *      400:
 *        description: Missing required fields
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: "Missing required fields"
 *      409:
 *        description: Email already exists
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: "Email already exists"
 *      500:
 *        $ref: '#/components/responses/500'
 */
authRouter.post('/brand-signup', brandSignup);

/**
 * @swagger
 * /api/auth/change-password:
 *   post:
 *     summary: Change the password of the authenticated user
 *     description: Allows an authenticated user to change their password by providing the old password and a new password.
 *     tags:
 *       - Auth
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               oldPassword:
 *                 type: string
 *                 description: The current password of the user.
 *                 example: "currentPassword123"
 *               newPassword:
 *                 type: string
 *                 description: The new password for the user.
 *                 example: "newPassword456"
 *     responses:
 *       200:
 *         description: Password changed successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Password changed successfully"
 *       400:
 *         description: Missing or invalid request data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Missing required fields"
 *       401:
 *         description: Authentication error or invalid password.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Wrong password"
 *       403:
 *         $ref: '#/components/responses/403'
 *       500:
 *         $ref: '#/components/responses/500'
 */
authRouter.post('/change-password', verifyToken, changePassword);

/**
 * @swagger
 * /api/auth/delete-account:
 *   delete:
 *     summary: Delete the authenticated user's account
 *     description: Deletes the authenticated user's account and all associated data.
 *     tags:
 *       - Auth
 *     responses:
 *       200:
 *         description: Account deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Account deleted successfully"
 *       401:
 *         $ref: '#/components/responses/401'
 *       403:
 *         $ref: '#/components/responses/403'
 *       500:
 *         $ref: '#/components/responses/500'
 */
authRouter.delete('/delete-account', verifyToken, deleteUser);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Log out the authenticated user
 *     description: Logs out the user by clearing their authentication cookie.
 *     tags:
 *       - Auth
 *     responses:
 *       200:
 *         description: Successfully logged out.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Logged out"
 *       500:
 *         $ref: '#/components/responses/500'
 */
authRouter.post('/logout', logout);

export default authRouter;
