import router from 'express';
import {
    getAdmins,
    getProductsWaitingList,
    changeRole,
    uploadOffer,
    deleteOffer,
    blockUser,
    unblockUser,
    createAdmin,
    updateAdmin,
    deleteAdmin,
    approveProduct,
    rejectProduct,
    uploadOfferImage,
    deleteOfferImage,
    getReviews,
} from '../controllers/adminController.js';
import {verifyToken} from '../middlewares/verifyToken.js';
import multer from 'multer';

// Set up multer storage for profile images
const storage = multer.memoryStorage(); // Store file in memory for processing
const upload = multer({ storage: storage }).single('image'); // Expect 'image' field in form data

const adminRouter = router.Router();

/**
 * @swagger
 * /api/admin:
 *   get:
 *     summary: Retrieve all admins
 *     description: Allows a SuperAdmin to retrieve a list of all admins.
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved the list of admins.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   user_id:
 *                     type: string
 *                   username:
 *                     type: string
 *                   role:
 *                     type: string
 *       401:
 *         $ref: '#/components/responses/401'
 *       403:
 *         $ref: '#/components/responses/403'
 *       500:
 *         $ref: '#/components/responses/500'
 */
adminRouter.get('/', verifyToken, getAdmins);

/**
 * @swagger
 * /api/admin/reviews/{id}:
 *   get:
 *     summary: Retrieve reviews for a user
 *     description: Allows admins with appropriate roles to view the reviews for a specific user.
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *           example: "66b20963-b429-4319-838d-130db3d1266f"
 *         description: The ID of the user to retrieve reviews for.
 *     responses:
 *       200:
 *         description: Successfully retrieved the list of reviews for the user.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 reviews:
 *                   $ref: '#/components/schemas/Review'
 *       401:
 *         $ref: '#/components/responses/401'
 *       403:
 *         $ref: '#/components/responses/403'
 *       500:
 *         $ref: '#/components/responses/500'
 */
adminRouter.get('/reviews/:id', verifyToken, getReviews);

/**
 * @swagger
 * /api/admin/waiting-products:
 *   get:
 *     summary: Retrieve products waiting for approval
 *     description: Allows admins with appropriate roles to view the list of products pending approval.
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved the list of pending products.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 products:
 *                   $ref: '#/components/schemas/Product'
 *       401:
 *         $ref: '#/components/responses/401'
 *       403:
 *         $ref: '#/components/responses/403'
 *       500:
 *         $ref: '#/components/responses/500'
 */
adminRouter.get('/waiting-products', verifyToken, getProductsWaitingList);

/**
 * @swagger
 * /api/admin/approve-product/{id}:
 *   get:
 *     summary: Approve a product
 *     description: Allows admins with appropriate roles to approve products.
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *           example: "66b20963-b429-4319-838d-130db3d1266f"
 *         description: The ID of the product to approve.
 *     responses:
 *       200:
 *         description: Product approved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Product approved successfully."
 *       400:
 *         description: Product not blocked.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Product not blocked."
 *       401:
 *         $ref: '#/components/responses/401'
 *       403:
 *         $ref: '#/components/responses/403'
 *       500:
 *         $ref: '#/components/responses/500'
 */
adminRouter.get('/approve-product/:id', verifyToken, approveProduct);

/**
 * @swagger
 * /api/admin/reject-product:
 *   post:
 *     summary: Reject a product
 *     description: Allows admins with appropriate roles to reject a product that hasn't been approved.
 *     tags:
 *       - Admin
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
 *                 example: "66b20963-b429-4319-838d-130db3d1266f"
 *     responses:
 *       200:
 *         description: Product rejected successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Product rejected successfully."
 *       400:
 *         description: Product already approved.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Product already approved."
 *       401:
 *         $ref: '#/components/responses/401'
 *       403:
 *         $ref: '#/components/responses/403'
 *       404:
 *         description: Product not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Product not found."
 *       500:
 *         $ref: '#/components/responses/500'
 */
adminRouter.post('/reject-product', verifyToken, rejectProduct);

/**
 * @swagger
 * /api/admin:
 *   post:
 *     summary: Create a new admin
 *     description: Allows a SuperAdmin to create a new admin with a specific role.
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "admin@example.com"
 *               password:
 *                 type: string
 *                 example: "securePassword123"
 *               adminRole:
 *                 type: string
 *                 enum: [CustomerService, BrandManager, SystemAdmin]
 *                 example: "SystemAdmin"
 *               username:
 *                 type: string
 *                 example: "adminUser"
 *     responses:
 *       201:
 *         description: Admin created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 user_id:
 *                   type: string
 *                 username:
 *                   type: string
 *                 role:
 *                   type: string
 *       400:
 *         description: Invalid input or email already exists.
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "Invalid role"
 *       401:
 *         $ref: '#/components/responses/401'
 *       403:
 *         $ref: '#/components/responses/403'
 *       500:
 *         $ref: '#/components/responses/500'
 */
adminRouter.post('/', verifyToken, createAdmin);

/**
 * @swagger
 * /api/admin/offer:
 *   post:
 *     summary: Upload an offer
 *     description: Allows admins with appropriate roles to create a new offer for a product.
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               discount:
 *                 type: number
 *                 example: 20
 *               listNumber:
 *                 type: integer
 *                 example: 12345
 *               startDate:
 *                 type: string
 *                 format: date
 *                 example: "2022-01-01T00:00:00.000Z"
 *               endDate:
 *                 type: string
 *                 format: date
 *                 example: "2022-01-01T00:00:00.000Z"
 *               productId:
 *                 type: string
 *                 format: uuid
 *                 example: "66b20963-b429-4319-838d-130db3d1266f"
 *     responses:
 *       201:
 *         description: Offer uploaded successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Offer uploaded successfully."
 *                 offer:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                       example: "123e4567-e89b-12d3-a456-426614174000"
 *                     discount:
 *                       type: number
 *                       example: 20
 *                     list_number:
 *                       type: integer
 *                       example: 12345
 *                     start_date:
 *                       type: string
 *                       format: date
 *                       example: "2024-01-01"
 *                     end_date:
 *                       type: string
 *                       format: date
 *                       example: "2024-01-31"
 *       400:
 *         description: Missing fields or product not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "All fields are required."
 *       403:
 *         $ref: '#/components/responses/403'
 *       500:
 *         $ref: '#/components/responses/500'
 */
adminRouter.post('/offer', verifyToken, uploadOffer);

/**
 * @swagger
 * /api/admin/offer/image/{id}:
 *   post:
 *     summary: Upload an image for an offer
 *     description: Allows admins with appropriate roles to upload an image for a specific offer.
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *           example: "66b20963-b429-4319-838d-130db3d1266f"
 *         description: The ID of the offer for which the image is being uploaded.
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
 *                 description: The image file to be uploaded.
 *     responses:
 *       200:
 *         description: Offer image uploaded successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Profile image uploaded successfully"
 *                 imageUrl:
 *                   type: string
 *                   example: "https://storage.blob.core.windows.net/images/offer-image.jpg"
 *       400:
 *         description: Bad request or missing data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No image file provided"
 *       403:
 *         $ref: '#/components/responses/403'
 *       404:
 *         description: Offer not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Offer not found"
 *       500:
 *         $ref: '#/components/responses/500'
 *
 */
adminRouter.post('/offer/image/:id', verifyToken, upload, uploadOfferImage);

/**
 * @swagger
 * /api/admin/block:
 *   post:
 *     summary: Block a user
 *     description: Allows admins with appropriate roles to block a user and provide a reason for blocking.
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               comment:
 *                 type: string
 *                 example: "Violation of terms."
 *               id:
 *                 type: string
 *                 format: uuid
 *                 description: The ID of the user (The base one not the id of Shopper/BRAND).
 *                 example: "66b20963-b429-4319-838d-130db3d1266f"
 *     responses:
 *       200:
 *         description: User blocked successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User blocked successfully."
 *       400:
 *         description: User already blocked or invalid input.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User already blocked."
 *       401:
 *         $ref: '#/components/responses/401'
 *       403:
 *         $ref: '#/components/responses/403'
 *       500:
 *         $ref: '#/components/responses/500'
 */
adminRouter.post('/block', verifyToken, blockUser);

/**
 * @swagger
 * /api/admin/unblock/{id}:
 *   post:
 *     summary: Unblock a user
 *     description: Allows admins with appropriate roles to unblock a user.
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *           example: "66b20963-b429-4319-838d-130db3d1266f"
 *         description: The ID of the user to unblock.
 *     responses:
 *       200:
 *         description: User unblocked successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User unblocked successfully."
 *       400:
 *         description: User not blocked.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User not blocked."
 *       401:
 *         $ref: '#/components/responses/401'
 *       403:
 *         $ref: '#/components/responses/403'
 *       500:
 *         $ref: '#/components/responses/500'
 */
adminRouter.post('/unblock/:id', verifyToken, unblockUser);

/**
 * @swagger
 * /api/admin:
 *   put:
 *     summary: Update admin information
 *     description: Allows an admin to update their own information.
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "newemail@example.com"
 *               username:
 *                 type: string
 *                 example: "newUsername"
 *     responses:
 *       201:
 *         description: Admin updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 user_id:
 *                   type: string
 *                 username:
 *                   type: string
 *                 role:
 *                   type: string
 *       400:
 *         description: Email already exists or invalid data provided.
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "email already exists"
 *       401:
 *         $ref: '#/components/responses/401'
 *       403:
 *         $ref: '#/components/responses/403'
 *       500:
 *         $ref: '#/components/responses/500'
 */
adminRouter.put('/', verifyToken, updateAdmin);


/**
 * @swagger
 * /api/admin/change-role:
 *   put:
 *     summary: Change admin role
 *     description: Allows superAdmins to change the role of an admin.
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               adminRole:
 *                 type: string
 *                 example: "CustomerService"
 *               adminId:
 *                 type: string
 *                 format: uuid
 *                 example: "66b20963-b429-4319-838d-130db3d1266f"
 *     responses:
 *       201:
 *         description: Admin role updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 admin:
 *                   $ref: '#/components/schemas/Admin'
 *       400:
 *         description: Invalid role / admin not found / admin already has the role.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid role"
 *       401:
 *         $ref: '#/components/responses/401'
 *       403:
 *         $ref: '#/components/responses/403'
 *       500:
 *         $ref: '#/components/responses/500'
 */
adminRouter.put('/change-role', verifyToken, changeRole);

/**
 * @swagger
 * /api/admin/{id}:
 *   delete:
 *     summary: Delete an admin
 *     description: Allows a SuperAdmin to delete an admin by their ID.
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the admin to delete.
 *     responses:
 *       200:
 *         description: Admin deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User deleted successfully"
 *       401:
 *         $ref: '#/components/responses/401'
 *       403:
 *         $ref: '#/components/responses/403'
 *       500:
 *         $ref: '#/components/responses/500'
 */
adminRouter.delete('/:id', verifyToken, deleteAdmin);

/**
 * @swagger
 * /api/admin/offer/{id}:
 *   delete:
 *     summary: Delete an offer
 *     description: Allows admins with appropriate roles to delete an existing offer and revert the product's discount.
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *           example: "66b20963-b429-4319-838d-130db3d1266f"
 *         description: The ID of the offer to delete.
 *     responses:
 *       200:
 *         description: Offer deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Offer deleted successfully."
 *       401:
 *         $ref: '#/components/responses/401'
 *       403:
 *         $ref: '#/components/responses/403'
 *       404:
 *         description: Offer not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Offer not found."
 *       500:
 *         $ref: '#/components/responses/500'
 */
adminRouter.delete('/offer/:id', verifyToken, deleteOffer);

/**
 * @swagger
 * /api/admin/offer/image/{id}:
 *   delete:
 *     summary: Delete an image for an offer
 *     description: Allows admins with appropriate roles to delete an image associated with a specific offer.
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *           example: "66b20963-b429-4319-838d-130db3d1266f"
 *         description: The ID of the offer for which the image is being deleted.
 *     responses:
 *       200:
 *         description: Offer image deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Profile image deleted successfully"
 *       400:
 *         description: Bad request or missing data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No image found"
 *       403:
 *         $ref: '#/components/responses/403'
 *       404:
 *         description: Offer not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Offer not found"
 *       500:
 *         $ref: '#/components/responses/500'
 */
adminRouter.delete('/offer/image/:id', verifyToken, deleteOfferImage);


export default adminRouter;