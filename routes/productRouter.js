import {
    getAllProducts,
    getSingleProduct,
   // createProduct,
    updateProduct,
    deleteProduct,
    getFilteredProducts,
    getRecommendedProducts,
    getRandomProductsByCategory,
    getFilteredProductsByColours,
    getProductsOfBrand,
    getFilteredProductsByPriceRange, 
    getProductsOfPreferredColour,
    getProductDetails,
    getSimilarProducts,
    getAllCategoryNames,
    getProductsByCategoryName
} from '../controllers/productController.js';
import Router from 'express';
import {verifyToken} from "../middlewares/verifyToken.js";

const productRouter = Router();

/**
 * @swagger
 * /api/product/:
 *   get:
 *     summary: Get all products
 *     description: Retrieves a list of all products.
 *     tags:
 *        - Products
 *     responses:
 *       200:
 *         description: A list of products
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
 *       500:
 *         $ref: '#/components/responses/500'
 */
productRouter.get('/', verifyToken, getAllProducts);

/**
 * @swagger
 * /api/product/filter-products:
 *   get:
 *     summary: Get filtered products
 *     description: Retrieves a list of filtered products based on the user's preferences and body measurements.
 *     tags:
 *       - Products
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of filtered products with available sizes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                   example: "T-shirt round"
 *                 price:
 *                   type: number
 *                   example: 290.99
 *                 image:
 *                   type: string
 *                   example: "https://example.com/product-image.jpg"
 *                 brand:
 *                   type: string
 *                   example: "7amada"
 *                 material:
 *                   type: string
 *                   example: "cotton"
 *                 returnPeriod:
 *                   type: number
 *                   example: 30
 *                 discount:
 *                   type: number
 *                   example: 10
 *                 sizes:
 *                   type: array
 *                   items:
 *                     type: string
 *                     example: "S"
 *       400:
 *         description: User gender not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User gender not found"
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
productRouter.get('/filter-products', verifyToken, getFilteredProducts);

/**
 * @swagger
 * /api/product/recommended-products:
 *   get:
 *     summary: Get recommended products
 *     description: Retrieves a list of recommended products for the authenticated user based on their preferences.
 *     tags:
 *       - Products
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of recommended products
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               description: Product details
 *               properties:
 *                 products:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: "T-shirt round"
 *                     price:
 *                       type: number
 *                       example: 290.99
 *                     image:
 *                       type: string
 *                       example: "https://example.com/product-image.jpg"
 *                     brand:
 *                       type: string
 *                       example: "7amada"
 *                     material:
 *                       type: string
 *                       example: "cotton"
 *                     returnPeriod:
 *                       type: number
 *                       example: 30
 *                     discount:
 *                       type: number
 *                       example: 10
 *                     matchScore:
 *                       type: number
 *                       description: Score indicating how well the product matches the user's preferences
 *                 message:
 *                   type: string
 *                   example: "Recommended products"
 *       401:
 *         $ref: '#/components/responses/401'
 *       403:
 *         $ref: '#/components/responses/403'
 *       404:
 *         description: User or Preferences not found
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
productRouter.get('/recommended-products', verifyToken, getRecommendedProducts);

/**
 * @swagger
 * /api/product/random-products:
 *   get:
 *     summary: Get random products by category
 *     description: Retrieves a list of random products by category, ensuring no duplicate styles within each category.
 *     tags:
 *       - Products
 *     responses:
 *       200:
 *         description: A list of random products by category
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 Shirts:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       name:
 *                         type: string
 *                         example: "Casual Shirt"
 *                       category:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                             example: "Shirts"
 *                           style:
 *                             type: string
 *                             example: "Casual"
 *                 Jackets:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 2
 *                       name:
 *                         type: string
 *                         example: "Leather Jacket"
 *                       category:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                             example: "Jackets"
 *                           style:
 *                             type: string
 *                             example: "Biker"
 *                 Dresses:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 3
 *                       name:
 *                         type: string
 *                         example: "Summer Dress"
 *                       category:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                             example: "Dresses"
 *                           style:
 *                             type: string
 *                             example: "Floral"
 *                 Shorts:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 4
 *                       name:
 *                         type: string
 *                         example: "Denim Shorts"
 *                       category:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                             example: "Shorts"
 *                           style:
 *                             type: string
 *                             example: "Casual"
 *       401:
 *         $ref: '#/components/responses/401'
 *       403:
 *         $ref: '#/components/responses/403'
 *       500:
 *         $ref: '#/components/responses/500'
 */
productRouter.get('/random-products', verifyToken, getRandomProductsByCategory);


/**
 *  @swagger
 *  /api/product/colour-filtered-products:
 *    get:
 *      summary: Get filtered products by colours
 *      description: Retrieves products filtered based on colour name and family.
 *      operationId: getFilteredProductsByColours
 *      tags:
 *        - Products
 *      responses:
 *        200:
 *          description: List of filtered products
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Product'
 *        404:
 *          description: No products found
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *                    example: "There are no Products"
 *        500:
 *          $ref: '#/components/responses/500'
 */
productRouter.get('/colour-Filtered-Products', getFilteredProductsByColours);

/**
 *  @swagger
 *  /api/product/products-filtered-by-preferredColour/{id}:
 *    get:
 *      summary: Get products based on colour preference of a user
 *      description: Retrieves products filtered based on colour preference of a specific user.
 *      tags:
 *        - Products
 *      responses:
 *        200:
 *          description: List of filtered products
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Product'
 *        400:
 *          description: No user found with this id or No colour preferences are found for this user
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *                    example: "User preferences not found"
 *        404:
 *          description: No products found
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *                    example: "There are no Products"
 *        500:
 *          $ref: '#/components/responses/500'
 */
productRouter.get('/products-filtered-by-preferredColour', getProductsOfPreferredColour);

/**
 *  @swagger
 *  /api/product/get-similar-products/{id}:
 *    get:
 *      summary: Get products similar to a given product
 *      description: Retrieves products filtered based on similarity to a certain product.
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          schema:
 *            type: string
 *            format: uuid
 *          description: The Product ID
 *      tags:
 *        - Products
 *      responses:
 *        200:
 *          description: List of filtered products
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Product'
 *        400:
 *          description: There's no product with this id
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *                    example: "Product not found"
 *        404:
 *          description: No products found similar to the given product
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *                    example: "No similar products found"
 *        500:
 *          $ref: '#/components/responses/500'
 */
productRouter.get('/get-similar-products/:id', verifyToken, getSimilarProducts);

/**
 *  @swagger
 *  /api/product/get-products-of-brand/{id}:
 *    get:
 *      summary: Get all products of a specific brand
 *      description: Retrieves products filtered based on Brand id.
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          schema:
 *            type: string
 *            format: uuid
 *          description: The brand ID
 *      tags:
 *        - Products
 *      responses:
 *        200:
 *          description: List of filtered products
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Product'
 *        404:
 *          description: No products found or No Brand with this id
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *                    example: "No products found"
 *        500:
 *          $ref: '#/components/responses/500'
 */
productRouter.get('/get-products-of-brand/:id', getProductsOfBrand);

/**
 *  @swagger
 *  /api/product/get-products-limitedPrice/{min}/{max}:
 *    get:
 *      summary: Get filtered products by price range
 *      description: Retrieves products filtered based their price in range (min, max).
 *      parameters:
 *        - in: path
 *          name: min
 *          required: true
 *          schema:
 *            type: number
 *          description: Minimum Price
 *        - in: path
 *          name: max
 *          required: true
 *          schema:
 *            type: number
 *          description: Maximum Price
 *      tags:
 *        - Products
 *      responses:
 *        200:
 *          description: List of filtered products
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Product'
 *        404:
 *          description: No products found
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *                    example: "No products found"
 *        500:
 *         $ref: '#/components/responses/500'
 */
productRouter.get('/get-products-limitedPrice/:min/:max', getFilteredProductsByPriceRange);

/**
 * @swagger
 * /api/product/category-names:
 *   get:
 *     summary: Get all the category names
 *     description: Retrieves a list of categories that distinct in name.
 *     tags:
 *       - Products
 *     responses:
 *       200:
 *         description: A list  of categories
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       404:
 *         description: No categories found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No categories found"
 *       500:
 *         $ref: '#/components/responses/500'
 */
productRouter.get('/category-names', getAllCategoryNames);

/**
 * @swagger
 * /api/product/get-products-of-category/{categoryName}:
 *   get:
 *     summary: Get all products that belongs to a certain category
 *     description: Retrieves a list of products that belongs to a certain category.
 *     tags:
 *       - Products
 *     parameters:
 *       - in: path
 *         name: categoryName
 *         required: true
 *         schema:
 *           type: string
 *         description: The Category name
 *     responses:
 *       200:
 *         description: A list of prducts
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: No Products found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No Products found for this category"
 *       500:
 *         $ref: '#/components/responses/500'
 */
productRouter.get('/get-products-of-category/:categoryName', getProductsByCategoryName);

/**
 * @swagger
 * /api/product/{id}:
 *   get:
 *     summary: Get a single product
 *     description: Retrieves a product by its unique ID.
 *     tags:
 *       - Products
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The product ID
 *     responses:
 *       200:
 *         description: Product found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Product not found"
 *       500:
 *         $ref: '#/components/responses/500'
 */
productRouter.get('/:id', verifyToken, getSingleProduct);

/**
 * @swagger
 * /api/product/details:
 *   post:
 *     summary: Get product details
 *     description: Retrieves a product by its unique ID.
 *     tags:
 *       - Products
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 format: uuid
 *                 example: "123e4567-e89b-12d3-a456-426614174000"
 *     responses:
 *       200:
 *         description: Product found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Product not found"
 *       500:
 *         $ref: '#/components/responses/500'
 *
 */
productRouter.post('/details', verifyToken, getProductDetails);

// /**
//  * @swagger
//  * /api/product:
//  *   post:
//  *     summary: Create a new product
//  *     description: Adds a new product to the database.
//  *     tags:
//  *       - Products
//  *     security:
//  *       - bearerAuth: []
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               name:
//  *                 type: string
//  *                 example: "T-shirt"
//  *               price:
//  *                 type: number
//  *                 example: 290.99
//  *               image:
//  *                 type: string
//  *                 example: "https://example.com/product-image.jpg"
//  *               brand:
//  *                 type: string
//  *                 example: "7amada"
//  *               material:
//  *                 type: string
//  *                 example: "cotton"
//  *               returnPeriod:
//  *                 type: string
//  *                 example: "30"
//  *               discount:
//  *                 type: number
//  *                 example: 10
//  *               style:
//  *                 type: string
//  *                 example: "round"
//  *               category:
//  *                 type: string
//  *                 example: "Shirts"
//  *     responses:
//  *       201:
//  *         description: Product created successfully
//  *         content:
//  *           application/json:
//  *             schema:
//  *               $ref: '#/components/schemas/Product'
//  *       401:
//  *         $ref: '#/components/responses/401'
//  *       403:
//  *         $ref: '#/components/responses/403'
//  *       500:
//  *         $ref: '#/components/responses/500'
//  */
// productRouter.post('/', verifyToken, createProduct);

/**
 * @swagger
 * /api/product:
 *   put:
 *     summary: Update a product
 *     description: Updates an existing product in the database.
 *     tags:
 *       - Products
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 format: uuid
 *                 example: "123e4567-e89b-12d3-a456-426614174000"
 *               name:
 *                 type: string
 *                 example: "T-shirt"
 *               price:
 *                 type: number
 *                 example: 350.99
 *               image:
 *                 type: string
 *                 example: "https://example.com/updated-product-image.jpg"
 *               brand:
 *                 type: string
 *                 example: "7amada"
 *               material:
 *                 type: string
 *                 example: "Polyester"
 *               returnPeriod:
 *                 type: string
 *                 example: "45"
 *               discount:
 *                 type: number
 *                 example: 5
 *               style:
 *                 type: string
 *                 example: "cargo"
 *               category:
 *                 type: string
 *                 example: "Pants"
 *     responses:
 *       200:
 *         description: Product updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       401:
 *         $ref: '#/components/responses/401'
 *       403:
 *         $ref: '#/components/responses/403'
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Product not found"
 *       500:
 *         $ref: '#/components/responses/500'
 */
productRouter.put('/', verifyToken, updateProduct);

/**
 * @swagger
 * /api/product:
 *   delete:
 *     summary: Delete a product
 *     description: Removes a product from the database.
 *     tags:
 *        - Products
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 format: uuid
 *                 example: "123e4567-e89b-12d3-a456-426614174000"
 *     responses:
 *       204:
 *         description: Product deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Product deleted successfully"
 *       400:
 *         description: Invalid product ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid product ID"
 *       401:
 *         $ref: '#/components/responses/401'
 *       403:
 *         $ref: '#/components/responses/403'
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Product not found"
 *       500:
 *         $ref: '#/components/responses/500'
 */
productRouter.delete('/', deleteProduct);




export default productRouter;