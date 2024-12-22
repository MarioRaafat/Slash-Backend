import router from 'express';
import {
    getChats,
    createChat,
    deleteChat,
    getMessages,
    sendMessage,
} from '../controllers/chatController.js';
import {verifyToken} from '../middlewares/verifyToken.js';
import multer from 'multer';

const chatRouter = router.Router();

/**
 * @swagger
 * /api/chat:
 *   get:
 *     summary: Get all chats of a user
 *     description: Retrieves all chats associated with the authenticated user.
 *     tags:
 *       - Chat
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of chats
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Chat'
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
chatRouter.get('/', verifyToken, getChats);

/**
 * @swagger
 * /api/chat/create:
 *   get:
 *     summary: Create a new chat
 *     description: Creates a new chat for the authenticated user.
 *     tags:
 *       - Chat
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Chat created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Chat'
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
chatRouter.get('/create', verifyToken, createChat);

/**
 * @swagger
 * /api/chat/{chatId}:
 *   delete:
 *     summary: Delete a chat
 *     description: Deletes a chat and its associated messages for the authenticated user.
 *     tags:
 *       - Chat
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: chatId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The Chat ID
 *     responses:
 *       200:
 *         description: Chat deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Chat deleted"
 *       404:
 *         description: Chat not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Chat not found"
 *       500:
 *         $ref: '#/components/responses/500'
 */
chatRouter.delete('/:chatId', verifyToken, deleteChat);

/**
 * @swagger
 * /api/chat/messages:
 *   post:
 *     summary: Get messages from a chat
 *     description: Retrieves messages (both sent and received) of a chat for the authenticated user.
 *     tags:
 *       - Message
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               chatId:
 *                 type: string
 *                 format: uuid
 *                 description: The Chat ID
 *                 example: "123e4567-e89b-12d3-a456-426614174000"
 *     responses:
 *       200:
 *         description: Messages retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userMessages:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Message'
 *                 botMessages:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Message'
 *       404:
 *         description: Chat or messages not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Chat not found"
 *       500:
 *         $ref: '#/components/responses/500'
 */
chatRouter.post('/messages', verifyToken, getMessages);

/**
 * @swagger
 * /api/chat/message:
 *   post:
 *     summary: Send a message in a chat
 *     description: Sends a message in a specific chat and stores the response from an AI server.
 *     tags:
 *       - Message
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *                 description: The message text
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Optional file to send with the message
 *               chatId:
 *                 type: string
 *                 format: uuid
 *                 description: The Chat ID
 *     responses:
 *       200:
 *         description: Message sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   $ref: '#/components/schemas/Message'
 *                 BotMessage:
 *                   $ref: '#/components/schemas/Message'
 *                 products:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *       404:
 *         description: User or chat not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Chat not found"
 *       500:
 *         $ref: '#/components/responses/500'
 */
chatRouter.post('/message', verifyToken, sendMessage);

export default chatRouter;