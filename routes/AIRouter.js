import router from 'express';
import {
    analyseProductImage,
    getStatistics,
} from '../controllers/AIController.js';

import {verifyToken} from '../middlewares/verifyToken.js';
import multer from 'multer';

// Set up multer storage for profile images
const storage = multer.memoryStorage(); // Store file in memory for processing
const upload = multer({ storage: storage }).single('image'); // Expect 'image' field in form data

const AIRouter = router.Router();

/**
 * @swagger
 * /api/analysis/analyse-product-image/{password}:
 *   post:
 *     summary: Analyse a product image
 *     description: Analyse a product image and return the results of the analysis from the AI server.
 *     tags:
 *       - Analyses
 *     parameters:
 *        - in: path
 *          name: password
 *          required: true
 *          schema:
 *            type: string
 *          description: The password to access the AI server
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: The image file to upload
 *     responses:
 *       200:
 *         description: Product image analysed successfully
 *       500:
 *         $ref: '#/components/responses/500'
 */
AIRouter.post('/analyse-product-image/:password', upload, analyseProductImage);

/**
 * @swagger
 * /api/analysis/statistics:
 *   get:
 *     summary: Get statistics
 *     description: Get statistics.
 *     tags:
 *       - Analyses
 *     responses:
 *       200:
 *         description: Statistics retrieved successfully
 *       500:
 *         $ref: '#/components/responses/500'
 */
AIRouter.get('/statistics', getStatistics);

export default AIRouter;