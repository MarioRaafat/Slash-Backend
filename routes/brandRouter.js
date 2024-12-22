import {
    getAllBrands,
    getBrandById,
    getBrandCategories,
    getFollowers,
    getBrandProducts,
    postCategorySizes,
    uploadBrandImage,
    uploadProductImage,
    postProduct,
    updateBrand,
    updateCategorySize,
    deleteBrandImage,
    deleteProductImage,
    deleteProduct,
    deleteProductVariant,
    deleteCategorySize
} from '../controllers/brandController.js';
import Router from 'express';
import {verifyToken} from "../middlewares/verifyToken.js";
import multer from 'multer';

// Set up multer storage for profile images
const storage = multer.memoryStorage(); // Store file in memory for processing
const upload = multer({ storage: storage }).single('image'); // Expect 'image' field in form data

const brandRouter = Router();

/**
 *  @swagger
 *  /api/brand/:
 *    get:
 *      summary: Get all brands
 *      description: Retrieves a list of all brands.
 *      operationId: getAllBrands
 *      tags:
 *         - Brand
 *      responses:
 *        200:
 *          description: A list of brands
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  $ref: '#/components/schemas/Brand'
 *        401:
 *          $ref: '#/components/responses/401'
 *        403:
 *          $ref: '#/components/responses/403'
 *        500:
 *          $ref: '#/components/responses/500'
 */
brandRouter.get("/", verifyToken, getAllBrands);

/**
 *  @swagger
 *  /api/brand/followers/{id}:
 *    get:
 *      summary: Get followers of a brand
 *      description: search for a certain brand using its id
 *      operationId: getBrandById
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          schema:
 *            type: string
 *            format: uuid
 *          description: The Brand ID
 *      tags:
 *        - Brand
 *      responses:
 *        200:
 *          description: Show followers of a brand
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/User'
 *        401:
 *          $ref: '#/components/responses/401'
 *        403:
 *          $ref: '#/components/responses/403'
 *        500:
 *          $ref: '#/components/responses/500'
 */
brandRouter.get("/followers/:id", verifyToken, getFollowers);

/**
 *  @swagger
 *  /api/brand/get-single-brand/{id}:
 *    get:
 *      summary: Get single brand 
 *      description: search for a certain brand using its id
 *      operationId: getBrandById
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          schema:
 *            type: string
 *            format: uuid
 *          description: The Brand ID
 *      tags:
 *        - Brand
 *      responses:
 *        200:
 *          description: Brand object
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Brand'
 *        404:
 *          description: There's no brand matches this id
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *                    example: "Brand not found"
 *        500:
 *          $ref: '#/components/responses/500'
 */
brandRouter.get("/get-single-brand/:id", getBrandById);

/**
 * @swagger
 *  /api/brand/categories:
 *    get:
 *      summary: Get Categories of a brand
 *      description: Get all categories of a brand
 *      tags:
 *        - Brand
 *      responses:
 *        200:
 *          description: Categories of a brand
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Category'
 *        401:
 *          $ref: '#/components/responses/401'
 *        403:
 *          $ref: '#/components/responses/403'
 *        404:
 *          description: Brand not found
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *                    example: "Brand not found"
 *        500:
 *          $ref: '#/components/responses/500'
 */
brandRouter.get("/categories", verifyToken, getBrandCategories);

/**
 * @swagger
 * /api/brand/products:
 *   get:
 *     summary: Get all products of a brand
 *     description: Retrieve a list of all products associated with a brand.
 *     tags:
 *       - Brand
 *     responses:
 *       200:
 *         description: List of products
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       401:
 *         $ref: '#/components/responses/401'
 *       403:
 *         $ref: '#/components/responses/403'
 *       404:
 *         description: Brand not found
 *         content:
 *           application/json:
 *             example:
 *               message: "Brand not found"
 *       500:
 *         $ref: '#/components/responses/500'
 */
brandRouter.get("/products", verifyToken, getBrandProducts);

/**
 * @swagger
 * /api/brand/category:
 *   post:
 *     summary: Add category sizes
 *     description: Allows a brand to add sizes for a specific category.
 *     tags:
 *       - Brand
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               category_id:
 *                 type: string
 *                 format: uuid
 *                 example: "66b20963-b429-4319-838d-130db3d1266f"
 *               sizeTag:
 *                 type: string
 *                 example: "M"
 *               waist:
 *                 type: number
 *                 nullable: true
 *                 example: 32
 *               length:
 *                 type: number
 *                 nullable: true
 *                 example: 40
 *               chest:
 *                 type: number
 *                 nullable: true
 *                 example: 38
 *               arm_length:
 *                 type: number
 *                 nullable: true
 *                 example: 25
 *               foot_length:
 *                 type: number
 *                 nullable: true
 *                 example: 10
 *               bicep:
 *                 type: number
 *                 nullable: true
 *                 example: 14
 *     responses:
 *       201:
 *         description: Size added successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 size:
 *                   $ref: '#/components/schemas/Size'
 *       400:
 *         description: Missing required fields or invalid category.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Missing required fields."
 *       401:
 *         $ref: '#/components/responses/401'
 *       403:
 *         $ref: '#/components/responses/403'
 *       404:
 *         description: Brand or category not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Brand not found."
 *       500:
 *         $ref: '#/components/responses/500'
 */
brandRouter.post("/category", verifyToken, postCategorySizes);

/**
 * @swagger
 * /api/brand/upload-image:
 *   post:
 *     summary: Upload brand image
 *     description: Allows a brand to upload an image for their profile.
 *     tags:
 *       - Brand
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
 *       201:
 *         description: Image uploaded successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Image uploaded successfully."
 *                 image:
 *                   type: string
 *                   example: "https://example.com/images/brand123.png"
 *       400:
 *         description: No file uploaded.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No file uploaded."
 *       401:
 *         $ref: '#/components/responses/401'
 *       403:
 *         $ref: '#/components/responses/403'
 *       404:
 *         description: Brand not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Brand not found."
 *       500:
 *         $ref: '#/components/responses/500'
 */
brandRouter.post("/upload-image", verifyToken, upload, uploadBrandImage);

/**
 * @swagger
 * /api/brand/product/upload-image/{id}:
 *   post:
 *     summary: Upload product image
 *     description: Upload an image for a specific product.
 *     tags:
 *       - Brand
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the product to upload an image for
 *         schema:
 *           type: string
 *           format: uuid
 *           example: "66b20963-b429-4319-838d-130db3d1266f"
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
 *     responses:
 *       201:
 *         description: Image uploaded successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "Image uploaded successfully"
 *               image: "https://image.url/product-image.png"
 *       400:
 *         description: No file uploaded
 *         content:
 *           application/json:
 *             example:
 *               message: "No file uploaded"
 *       401:
 *         $ref: '#/components/responses/401'
 *       403:
 *         $ref: '#/components/responses/403'
 *       404:
 *         description: Brand or product not found
 *         content:
 *           application/json:
 *             example:
 *               message: "Product not found"
 *       500:
 *         $ref: '#/components/responses/500'
 */
brandRouter.post("/product/upload-image/:id", verifyToken, upload, uploadProductImage);

/**
 * @swagger
 * /api/brand/product:
 *   post:
 *     summary: Add product
 *     description: Allows a brand to add a new product.
 *     tags:
 *       - Brand
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "T-shirt"
 *               description:
 *                 type: string
 *                 example: "A comfortable cotton T-shirt."
 *               price:
 *                 type: number
 *                 example: 19.99
 *               category_id:
 *                 type: string
 *                 format: uuid
 *                 example: "66b20963-b429-4319-838d-130db3d1266f"
 *               sizes:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     size:
 *                       type: string
 *                       example: "M"
 *                     quantity:
 *                       type: number
 *                       example: 50
 *               colours:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: "Scarlet"
 *                     percentage:
 *                       type: number
 *                       example: 80
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                   example: "hooded"
 *               discount:
 *                 type: number
 *                 example: 10
 *               material:
 *                 type: string
 *                 example: "Cotton"
 *     responses:
 *       201:
 *         description: Product added successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Product added successfully."
 *       400:
 *         description: Missing required fields.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Missing required fields."
 *                 product:
 *                   $ref: '#/components/schemas/Product'
 *       401:
 *         $ref: '#/components/responses/401'
 *       403:
 *         $ref: '#/components/responses/403'
 *       404:
 *         description: Brand or category not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Brand not found."
 *       500:
 *         $ref: '#/components/responses/500'
 */
brandRouter.post("/product", verifyToken, postProduct);

/**
 * @swagger
 * /api/brand:
 *   put:
 *     summary: Update brand information
 *     description: Allows a brand to update its profile information.
 *     tags:
 *       - Brand
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Brand Name"
 *               description:
 *                 type: string
 *                 example: "Brand Description"
 *               email:
 *                 type: string
 *                 example: "brand@example.com"
 *               phone:
 *                 type: string
 *                 example: "+123456789"
 *               website:
 *                 type: string
 *                 example: "https://brandwebsite.com"
 *               facebook:
 *                 type: string
 *                 example: "https://facebook.com/brand"
 *               instagram:
 *                 type: string
 *                 example: "https://instagram.com/brand"
 *     responses:
 *       200:
 *         description: Brand updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Brand updated successfully."
 *       400:
 *         description: Missing required fields / phone or email or name already exists.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Please, enter at least one field to update"
 *       401:
 *         $ref: '#/components/responses/401'
 *       403:
 *         $ref: '#/components/responses/403'
 *       404:
 *         description: Brand not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Brand not found."
 *       500:
 *         $ref: '#/components/responses/500'
 */
brandRouter.put("/", verifyToken, updateBrand);

/**
 * @swagger
 * /api/brand/size:
 *   put:
 *     summary: Update a category size
 *     description: Updates size details for a specific category.
 *     tags:
 *       - Brand
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               sizeId:
 *                 type: string
 *                 example: "456e1234-f78c-90ab-345d-567890abd12"
 *               sizeTag:
 *                 type: string
 *                 example: "M"
 *               waist:
 *                 type: number
 *                 example: 30
 *               length:
 *                 type: number
 *                 example: 32
 *               chest:
 *                 type: number
 *                 example: 40
 *               arm_length:
 *                 type: number
 *                 example: 24
 *               foot_length:
 *                 type: number
 *                 example: 10
 *               bicep:
 *                 type: number
 *                 example: 15
 *     responses:
 *       200:
 *         description: Size updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Size updated successfully"
 *       401:
 *         $ref: '#/components/responses/401'
 *       403:
 *         $ref: '#/components/responses/403'
 *       404:
 *         description: Size or category not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Size not found"
 *       500:
 *         $ref: '#/components/responses/500'
 */
brandRouter.put("/size", verifyToken, updateCategorySize);

/**
 * @swagger
 * /api/brand/image:
 *   delete:
 *     summary: Delete brand image
 *     description: Allows a brand to delete its profile image.
 *     tags:
 *       - Brand
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
 *                   example: "Image deleted successfully."
 *       401:
 *         $ref: '#/components/responses/401'
 *       403:
 *         $ref: '#/components/responses/403'
 *       404:
 *         description: Brand not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Brand not found."
 *       500:
 *         $ref: '#/components/responses/500'
 */
brandRouter.delete("/image", verifyToken, deleteBrandImage);

/**
 * @swagger
 * /api/brand/product/image/{productId}:
 *   delete:
 *     summary: Delete product image
 *     description: Remove an image associated with a specific product.
 *     tags:
 *       - Brand
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         description: ID of the product to delete the image for
 *         schema:
 *           type: string
 *           format: uuid
 *           example: "66b20963-b429-4319-838d-130db3d1266f"
 *     responses:
 *       200:
 *         description: Image deleted successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "Image deleted successfully"
 *       401:
 *         $ref: '#/components/responses/401'
 *       403:
 *         $ref: '#/components/responses/403'
 *       404:
 *         description: Brand or product not found
 *         content:
 *           application/json:
 *             example:
 *               message: "Product not found"
 *       500:
 *         $ref: '#/components/responses/500'
 */
brandRouter.delete("/product/image", verifyToken, deleteProductImage);

/**
 * @swagger
 * /api/brand/product:
 *   delete:
 *     summary: Delete a product
 *     description: Deletes a product associated with the brand.
 *     tags:
 *       - Brand
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
 *                 example: "123e4567-e89b-12d3-a456-426614174000"
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Product deleted successfully"
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
brandRouter.delete("/product", verifyToken, deleteProduct);

/**
 * @swagger
 * /api/brand/product/variant:
 *   delete:
 *     summary: Delete a product variant
 *     description: Deletes a specific variant of a product.
 *     tags:
 *       - Brand
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               variantId:
 *                 type: string
 *                 example: "987e6543-e21a-34d3-c789-765432101010"
 *     responses:
 *       200:
 *         description: Variant deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Variant deleted successfully"
 *       401:
 *         $ref: '#/components/responses/401'
 *       403:
 *         $ref: '#/components/responses/403'
 *       404:
 *         description: Variant not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Variant not found"
 *       500:
 *         $ref: '#/components/responses/500'
 */
brandRouter.delete("/product/variant", verifyToken, deleteProductVariant);

/**
 * @swagger
 * /api/brand/size:
 *   delete:
 *     summary: Delete a category size
 *     description: Deletes a size associated with a category for the brand.
 *     tags:
 *       - Brand
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               sizeId:
 *                 type: string
 *                 example: "456e1234-f78c-90ab-345d-567890acd12"
 *     responses:
 *       200:
 *         description: Size deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Size deleted successfully"
 *       403:
 *         $ref: '#/components/responses/403'
 *       404:
 *         description: Size not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Size not found"
 *       500:
 *         $ref: '#/components/responses/500'
 */
brandRouter.delete("/size", verifyToken, deleteCategorySize);

export default brandRouter;