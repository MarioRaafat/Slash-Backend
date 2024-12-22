import Router from 'express';
import {verifyToken} from "../middlewares/verifyToken.js";
import {
    getAllUsers,
    setBodyMeasurements,
    setStylePreference,
    setColourPreferences,
    setMaterialPreferences,
    createAvatar,
    getAvatar,
    uploadProfileImage,
    deleteProfileImage,
    updateUser,
    getOffers,
    followBrand,
    unfollowBrand,
} from "../controllers/userController.js";
import multer from 'multer';

// Set up multer storage for profile images
const storage = multer.memoryStorage(); // Store file in memory for processing
const upload = multer({ storage: storage }).single('image'); // Expect 'image' field in form data

const userRouter = Router();

/**
 * @swagger
 * /api/user:
 *   get:
 *     summary: Get all users
 *     description: Retrieve a list of all users.
 *     tags:
 *       - User
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       500:
 *         $ref: '#/components/responses/500'
 */
userRouter.get('/', verifyToken, getAllUsers);

/**
 * @swagger
 * /api/user/offers:
 *   get:
 *     summary: Get offers
 *     description: Allows admins with appropriate roles to view the list of offers.
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved the list of offers.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 products:
 *                   $ref: '#/components/schemas/Offer'
 *       401:
 *         $ref: '#/components/responses/401'
 *       403:
 *         $ref: '#/components/responses/403'
 *       500:
 *         $ref: '#/components/responses/500'
 */
userRouter.get('/offers', verifyToken, getOffers);

/**
 *  @swagger
 *  /api/user/get-avatar:
 *   get:
 *     summary: Retrieve the avatar for a user
 *     description: Get the avatar associated with a specific user by their ID.
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Avatar retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Avatar'
 *       401:
 *         $ref: '#/components/responses/401'
 *       403:
 *         $ref: '#/components/responses/403'
 *       404:
 *         description: Avatar or User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Avatar/User not found"
 *       500:
 *         $ref: '#/components/responses/500'
 */
userRouter.get('/get-avatar', verifyToken, getAvatar);

/**
 * @swagger
 * /api/user/avatar:
 *   post:
 *     summary: Create or update the avatar for a user
 *     description: Add or update an avatar associated with a specific user.
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - topType
 *               - accessoriesType
 *               - hairColor
 *               - facialHairType
 *               - clotheType
 *               - eyeType
 *               - eyebrowType
 *               - mouthType
 *               - skinColor
 *               - clotheColor
 *               - style
 *               - graphicType
 *             properties:
 *               topType:
 *                 type: number
 *                 example: "2"
 *               accessoriesType:
 *                 type: number
 *                 example: "2"
 *               hairColor:
 *                 type: number
 *                 example: "2"
 *               facialHairType:
 *                 type: number
 *                 example: "2"
 *               clotheType:
 *                 type: number
 *                 example: "2"
 *               eyeType:
 *                 type: number
 *                 example: "2"
 *               eyebrowType:
 *                 type: number
 *                 example: "2"
 *               mouthType:
 *                 type: number
 *                 example: "2"
 *               skinColor:
 *                 type: number
 *                 example: "2"
 *               clotheColor:
 *                 type: number
 *                 example: "2"
 *               style:
 *                 type: number
 *                 example: "2"
 *               graphicType:
 *                 type: number
 *                 example: "2"
 *     responses:
 *       200:
 *         description: Avatar updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Avatar'
 *       201:
 *         description: Avatar created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Avatar'
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
userRouter.post('/avatar',verifyToken, createAvatar);

/**
 * @swagger
 * /api/user/follow-brand:
 *   post:
 *     summary: Follow a brand
 *     description: Follow a brand by its ID.
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               brandId:
 *                 type: string
 *                 format: uuid
 *                 example: "123e4567-e89b-12d3-a456-426614174000"
 *     responses:
 *       200:
 *         description: Followed brand successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Brand followed successfully"
 *       401:
 *         $ref: '#/components/responses/401'
 *       403:
 *         $ref: '#/components/responses/403'
 *       500:
 *         $ref: '#/components/responses/500'
 */
userRouter.post('/follow-brand', verifyToken, followBrand);

/**
 * @swagger
 * /api/user/unfollow-brand:
 *   post:
 *     summary: Unfollow a brand
 *     description: Unfollow a brand by its ID.
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               brandId:
 *                 type: string
 *                 format: uuid
 *                 example: "123e4567-e89b-12d3-a456-426614174000"
 *     responses:
 *       200:
 *         description: Unfollowed brand successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Brand unfollowed successfully"
 *       401:
 *         $ref: '#/components/responses/401'
 *       403:
 *         $ref: '#/components/responses/403'
 *       500:
 *         $ref: '#/components/responses/500'
 */
userRouter.post('/unfollow-brand', verifyToken, unfollowBrand);

/**
 * @swagger
 * /api/user/body-measurements:
 *   post:
 *     summary: Set body measurements for a user
 *     description: Add body measurement data for a specific user.
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - waist
 *               - length
 *               - weight
 *               - chest
 *               - shape
 *               - foot_length
 *             properties:
 *               waist:
 *                 type: number
 *                 example: 32
 *               height:
 *                 type: number
 *                 example: 170
 *               chest:
 *                 type: number
 *                 example: 90
 *               weight:
 *                 type: number
 *                 example: 70
 *               shoulder_width:
 *                 type: number
 *                 example: 45
 *               shape:
 *                 type: string
 *                 example: "Rectangle"
 *               foot_length:
 *                 type: number
 *                 example: 25.5
 *     responses:
 *       200:
 *         description: Body measurement updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BodyMeasurement'
 *       201:
 *         description: Body measurement created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BodyMeasurement'
 *       400:
 *         description: Missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "missing required fields"
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
userRouter.post('/body-measurements', verifyToken, setBodyMeasurements);

/**
 * @swagger
 * /api/user/style-preferences:
 *   post:
 *     summary: Set style preferences
 *     description: Updates the user's style preferences based on selected products.
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               products:
 *                 type: array
 *                 description: An array of product IDs selected by the user
 *                 items:
 *                   type: integer
 *                 example: [123e4567-e89b-12d3-a456-426614174000, 123e4567-e89b-12d3-a456-426614174000]
 *     responses:
 *       200:
 *         description: Style preferences set successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Style preferences set successfully"
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
userRouter.post('/style-preferences', verifyToken, setStylePreference);

/**
 * @swagger
 * /api/user/colour-preferences:
 *   post:
 *     summary: Set colour preferences
 *     description: Updates the user's colour preferences based on selected colours.
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               colours:
 *                 type: array
 *                 description: An array of colours selected by the user
 *                 items:
 *                   type: string
 *                 example: ["Red", "Blue"]
 *               avoidedColours:
 *                 type: array
 *                 description: An array of colours to avoid selected by the user
 *                 items:
 *                   type: string
 *                   example: ["Green"]
 *     responses:
 *       200:
 *         description: Colour preferences set successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Colour preferences set successfully"
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
userRouter.post('/colour-preferences', verifyToken, setColourPreferences);

/**
 * @swagger
 * /api/user/material-preferences:
 *   post:
 *     summary: Set material preferences
 *     description: Updates the user's material preferences based on selected materials.
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               materials:
 *                 type: array
 *                 description: An array of materials selected by the user
 *                 items:
 *                   type: string
 *                 example: ["cotton", "wool"]
 *               avoidedMaterials:
 *                 type: array
 *                 description: An array of materials to avoid selected by the user
 *                 items:
 *                   type: string
 *                   example: ["leather"]
 *     responses:
 *       200:
 *         description: Material preferences set successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Material preferences set successfully"
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
userRouter.post('/material-preferences', verifyToken, setMaterialPreferences);

/**
 * @swagger
 * /api/user/upload-image:
 *   post:
 *     summary: Upload profile image
 *     description: Uploads a profile image for the authenticated user and updates their profile with the image URL.
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
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
 *         description: Profile image uploaded successfully
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
 *                   format: uri
 *                   example: "https://example.blob.core.windows.net/images/user-id-image.png"
 *       400:
 *         description: No image file provided
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "No image file provided"
 *       500:
 *         description: Error uploading image
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "Error uploading image"
 */
userRouter.post('/upload-image', verifyToken, upload, uploadProfileImage);

/**
 * @swagger
 * /api/user:
 *   put:
 *     summary: Update User information
 *     description: Allows a user to update its profile information.
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: "Mario"
 *               lastName:
 *                 type: string
 *                 example: "Raafat"
 *               email:
 *                 type: string
 *                 example: "mario@example.com"
 *               phone:
 *                 type: string
 *                 example: "+123456789"
 *               userName:
 *                 type: string
 *                 example: "mario_raafat"
 *               gender:
 *                 type: string
 *                 example: "male/female"
 *               city:
 *                 type: string
 *                 example: "Sohag"
 *     responses:
 *       200:
 *         description: User updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User updated successfully."
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Missing required fields / username or email or phone already exists.
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
 *         description: User not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User not found."
 *       500:
 *         $ref: '#/components/responses/500'
 */
userRouter.put('/', verifyToken, updateUser);

/**
 * @swagger
 * /api/user/image:
 *   delete:
 *     summary: Delete profile image
 *     description: Deletes the authenticated user's profile image from Azure Blob Storage and updates the profile to remove the image URL.
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile image deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Profile image deleted successfully"
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
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */
userRouter.delete('/image', verifyToken, deleteProfileImage);

export default userRouter;