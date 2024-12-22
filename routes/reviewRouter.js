import router from "express";
import {verifyToken} from "../middlewares/verifyToken.js";
import {
    getReviews,
    getProductReviews,
    createReview,
    likeReview,
    uploadReviewImage,
    updateReview,
    deleteReview,
    deleteReviewImage
} from "../controllers/reviewController.js";
import multer from 'multer';

// Set up multer storage for profile images
const storage = multer.memoryStorage(); // Store file in memory for processing
const upload = multer({ storage: storage }).single('image'); // Expect 'image' field in form data

const reviewRouter = router.Router();

/**
 *  @swagger
 *  /api/review/:
 *    get:
 *      summary: Get reviews by the authenticated user
 *      description: Retrieves reviews written by the currently authenticated user. Only accessible to users with the role "USER".
 *      tags:
 *        - Reviews
 *      responses:
 *        200:
 *          description: List of reviews
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  $ref: '#/components/schemas/Review'
 *        401:
 *          $ref: '#/components/responses/401'
 *        403:
 *          description: Insufficient permissions or invalid token
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *                    example: "Insufficient permissions"
 *        500:
 *          $ref: '#/components/responses/500'
 */
reviewRouter.get("/", verifyToken, getReviews);

/**
 *  @swagger
 *  /api/review/{id}:
 *    get:
 *      summary: Get reviews for a product
 *      description: Retrieves reviews associated with a specific product ID. Accessible to all users.
 *      tags:
 *        - Reviews
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          schema:
 *            type: string
 *          description: ID of the product
 *      responses:
 *        200:
 *          description: List of product reviews
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  $ref: '#/components/schemas/Review'
 *        401:
 *          $ref: '#/components/responses/401'
 *        403:
 *          $ref: '#/components/responses/403'
 *        500:
 *          $ref: '#/components/responses/500'
 */
reviewRouter.get("/:id", verifyToken, getProductReviews);

/**
 *  @swagger
 *  /api/review/:
 *    post:
 *      summary: Create a review
 *      description: Allows an authenticated user with the role "USER" to create a review for a product.
 *      tags:
 *        - Reviews
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - productId
 *                - rating
 *                - comment
 *                - valueForMoney_rate
 *                - quality_rate
 *                - shipping_rate
 *                - accuracy_rate
 *              properties:
 *                productId:
 *                  type: string
 *                  format: uuid
 *                  example: "d290f1ee-6c54-4b01-90e6-d701748f0851"
 *                rating:
 *                  type: number
 *                  format: float
 *                  example: 4.5
 *                comment:
 *                  type: string
 *                  example: "Great product, I love it!"
 *                valueForMoney_rate:
 *                  type: number
 *                  format: float
 *                  example: 4.5
 *                quality_rate:
 *                  type: number
 *                  format: float
 *                  example: 4.5
 *                shipping_rate:
 *                  type: number
 *                  format: float
 *                  example: 4.5
 *                accuracy_rate:
 *                  type: number
 *                  format: float
 *                  example: 4.5
 *                image:
 *                  type: string
 *                  format: uri
 *                  example: "https://example.com/image.jpg"
 *      responses:
 *        201:
 *          description: Review created successfully
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Review'
 *        400:
 *          description: Missing required fields
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *                    example: "Missing required fields"
 *        401:
 *          $ref: '#/components/responses/401'
 *        403:
 *          description: Insufficient permissions or invalid token
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *                    example: "Insufficient permissions"
 *        500:
 *          $ref: '#/components/responses/500'
 */
reviewRouter.post("/", verifyToken, createReview);

/**
 * @swagger
 * /api/review/like:
 *   post:
 *     summary: Like or unlike a review
 *     description: Toggles the like status of a review for the authenticated user.
 *     tags:
 *       - Reviews
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reviewId:
 *                 type: string
 *                 format: uuid
 *                 example: "d290f1ee-6c54-4b01-90e6-d701748f0851"
 *     responses:
 *       200:
 *         description: Review liked or unliked successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Review liked"
 *       401:
 *         $ref: '#/components/responses/401'
 *       403:
 *         description: Insufficient permissions.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Insufficient permissions"
 *       404:
 *         description: Review not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Review not found"
 *       500:
 *         $ref: '#/components/responses/500'
 */
reviewRouter.post("/like", verifyToken, likeReview);

/**
 * @swagger
 * /api/review/upload-image:
 *   post:
 *     summary: Upload an image to a review
 *     description: Allows the authenticated user to upload an image to a specific review.
 *     tags:
 *       - Reviews
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               reviewId:
 *                 type: string
 *                 format: uuid
 *                 example: "d290f1ee-6c54-4b01-90e6-d701748f0851"
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: The image file to upload.
 *     responses:
 *       200:
 *         description: Image uploaded successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Image uploaded successfully"
 *                 image:
 *                   type: string
 *                   format: uri
 *                   example: "https://example.blob.core.windows.net/review-images/review123-image.png"
 *       401:
 *         $ref: '#/components/responses/401'
 *       403:
 *         description: Insufficient permissions.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Insufficient permissions"
 *       404:
 *         description: Review not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Review not found"
 *       500:
 *         $ref: '#/components/responses/500'
 */
reviewRouter.post("/upload-image", verifyToken, upload, uploadReviewImage);

/**
 *  @swagger
 *  /api/review/{id}:
 *    put:
 *      summary: Update a review
 *      description: Allows an authenticated user to update a review they have created.
 *      tags:
 *        - Reviews
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          schema:
 *            type: string
 *          description: ID of the review to update
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *           schema:
 *              type: object
 *              required:
 *                - rating
 *                - comment
 *                - valueForMoney_rate
 *                - quality_rate
 *                - shipping_rate
 *                - accuracy_rate
 *              properties:
 *                rating:
 *                  type: number
 *                  format: float
 *                  example: 4.5
 *                comment:
 *                  type: string
 *                  example: "Great product, I love it!"
 *                valueForMoney_rate:
 *                  type: number
 *                  format: float
 *                  example: 4.5
 *                quality_rate:
 *                  type: number
 *                  format: float
 *                  example: 4.5
 *                shipping_rate:
 *                  type: number
 *                  format: float
 *                  example: 4.5
 *                accuracy_rate:
 *                  type: number
 *                  format: float
 *                  example: 4.5
 *                image:
 *                  type: string
 *                  format: uri
 *                  example: "https://example.com/image.jpg"
 *      responses:
 *        200:
 *          description: Review updated successfully
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *                    example: "Review updated successfully"
 *                  review:
 *                    $ref: '#/components/schemas/Review'
 *        401:
 *          $ref: '#/components/responses/401'
 *        403:
 *          description: Insufficient permissions or invalid token
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *                    example: "Insufficient permissions"
 *        404:
 *          description: Review not found
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *                    example: "Review not found"
 *        500:
 *          $ref: '#/components/responses/500'
 */
reviewRouter.put("/:id", verifyToken, updateReview);

/**
 * @swagger
 * /api/review/image:
 *   delete:
 *     summary: Delete an image from a review
 *     description: Allows the authenticated user to delete an image from a specific review.
 *     tags:
 *       - Reviews
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reviewId:
 *                 type: string
 *                 format: uuid
 *                 example: "d290f1ee-6c54-4b01-90e6-d701748f0851"
 *     responses:
 *       200:
 *         description: Image deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Image deleted successfully"
 *       401:
 *         $ref: '#/components/responses/401'
 *       403:
 *         description: Insufficient permissions.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Insufficient permissions"
 *       404:
 *         description: Review not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Review not found"
 *       500:
 *         $ref: '#/components/responses/500'
 */
reviewRouter.delete("/image", verifyToken, deleteReviewImage);

/**
 *  @swagger
 *  /api/review/{id}:
 *    delete:
 *      summary: Delete a review
 *      description: Allows an authenticated user to delete their review or an admin to delete any review.
 *      tags:
 *        - Reviews
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          schema:
 *            type: string
 *          description: ID of the review to delete
 *      responses:
 *        200:
 *          description: Review deleted successfully
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *                    example: "Review deleted successfully"
 *        401:
 *          $ref: '#/components/responses/401'
 *        403:
 *          description: Insufficient permissions or invalid token
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *                    example: "Insufficient permissions"
 *        404:
 *          description: Review not found
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *                    example: "Review not found"
 *        500:
 *          $ref: '#/components/responses/500'
 */
reviewRouter.delete("/:id", verifyToken, deleteReview);

export default reviewRouter;