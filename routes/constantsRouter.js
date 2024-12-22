import router from 'express';
import {getColours, getCategories} from "../controllers/constantsController.js";

const constantsRouter = router.Router();


/**
 * @swagger
 * /api/constants/colours:
 *   get:
 *     summary: Get all colours
 *     description: Retrieve all colours from the database
 *     tags:
 *       - Constants
 *     responses:
 *       200:
 *         description: A list of colours
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     format: uuid
 *                     example: 123e4567-e89b-12d3-a456-426614174000
 *                     description: The unique identifier of the colour
 *                   name:
 *                     type: string
 *                     example: Scarlet
 *                   family:
 *                     type: string
 *                     example: Red
 *                   hex:
 *                     type: string
 *       500:
 *         $ref: '#/components/responses/500'
 */
constantsRouter.get('/colours', getColours);

/**
 * @swagger
 * /api/constants/categories:
 *   get:
 *     summary: Get all categories
 *     description: Retrieve all categories from the database
 *     tags:
 *       - Constants
 *     responses:
 *       200:
 *         description: A list of categories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     format: uuid
 *                     example: 123e4567-e89b-12d3-a456-426614174000
 *                     description: The unique identifier of the category
 *                   name:
 *                     type: string
 *                     example: Shirts
 *                   style:
 *                     type: string
 *                     example: round
 *       500:
 *         $ref: '#/components/responses/500'
 */
constantsRouter.get('/categories', getCategories);

export default constantsRouter;