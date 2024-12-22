import prisma from "../utils/prismaClient.js";
import {SEND_MESSAGE_ROUTE, apiClient} from "../utils/constants.js";


export const getChats = async (req, res) => {
    const userId = req.userId;
    const role = req.role;
    try {
        if (role !== "USER") {
            return res.status(403).json({message: "Insufficient permissions"});
        }

        const chats = await prisma.chat.findMany({where: {user_id: userId}});

        return res.status(200).json({chats});
    } catch (error) {
        res.status(500).json({message: "Internal server error"});
    }
};

export const createChat = async (req, res) => {
    const userId = req.userId;
    const role = req.role;
    try {
        if (role !== "USER") {
            return res.status(403).json({message: "Insufficient permissions"});
        }

        const chat = await prisma.chat.create({data: {user_id: userId}});

        return res.status(200).json({chat});
    } catch (error) {
        res.status(500).json({message: "Internal server error"});
    }
};

export const deleteChat = async (req, res) => {
    const {chatId} = req.params;
    const userId = req.userId;
    const role = req.role;
    try {
        if (role !== "USER" && role !== "ADMIN") {
            return res.status(403).json({message: "Insufficient permissions"});
        }

        const chat = await prisma.chat.findUnique({where: {id: chatId}});
        if (!chat) {
            return res.status(404).json({message: "Chat not found"});
        }

        let user;
        if (role === "ADMIN") {
            const admin = await prisma.admin.findUnique({where: {id: userId}});
            if (admin.role !== "SuperAdmin" && admin.role !== "CustomerService" && admin.role !== "SystemAdmin") {
                return res.status(403).json({message: "Insufficient permissions"});
            }
            user = await prisma.shopper.findUnique({where: {id: chat.user_id}});
        } else {
            user = await prisma.shopper.findUnique({where: {id: userId}});
            if (chat.user_id !== user.id) {
                return res.status(403).json({message: "Insufficient permissions"});
            }
        }

        await prisma.message.deleteMany({where: {chat_id: chat.id}});
        await prisma.chat.delete({where: {id: chat.id, user_id: user.id}});

        return res.status(200).json({message: "Chat deleted successfully"});
    } catch (error) {
        res.status(500).json({message: "Internal server error"});
    }
};

export const getMessages = async (req, res) => {
    const {chatId} = req.body;
    let userId = req.userId;
    const role = req.role;
    try {
        if (role !== "USER" && role !== "ADMIN") {
            return res.status(403).json({message: "Insufficient permissions"});
        }

        const chat = await prisma.chat.findUnique({where: {id: chatId}});
        if (!chat) {
            return res.status(404).json({message: "Chat not found"});
        }

        if (role === "ADMIN") {
            const admin = await prisma.admin.findUnique({where: {id: userId}});
            if (admin.role !== "SuperAdmin" && admin.role !== "CustomerService" && admin.role !== "SystemAdmin") {
                return res.status(403).json({message: "Insufficient permissions"});
            }
            userId = chat.user_id;
        }

        const userMessages = await prisma.message.findMany({
            where: {AND: [{chat_id: chat.id}, {sender_id: userId}, {receiver_id: null}]},
            orderBy: {created_at: 'desc'}
        });

        const botMessages = await prisma.message.findMany({
            where: {chat_id: chat.id, receiver_id: userId, sender_id: null},
            orderBy: {created_at: 'desc'}
        });

        if (!userMessages || !botMessages) {
            return res.status(404).json({message: "Messages not found"});
        }

        for (const botMessage of botMessages) {
            botMessage.products = await prisma.productMessage.findMany({where: {message_id: botMessage.id}});
        }

        return res.status(200).json({userMessages, botMessages});
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Internal server error"});
    }
};

export const sendMessage = async (req, res) => {
    const {file, text, chatId} = req.body;
    const userId = req.userId;
    const role = req.role;
    try {
        if (role !== "USER") {
            return res.status(403).json({message: "Insufficient permissions"});
        }

        let user = await prisma.shopper.findUnique({where: {id: userId}});
        const chat = await prisma.chat.findUnique({where: {id: chatId}});
        if (!chat) {
            return res.status(404).json({message: "Chat not found"});
        }

        const message = await prisma.message.create({
            data: {
                text: text, chat_id: chat.id, sender_id: user.id,
                file: file ? file : null
            },
        });

        const response = await apiClient.post(SEND_MESSAGE_ROUTE, {message: text, user_id: chat.id});

        if (response.status !== 200) {
            return res.status(500).json({message: "Error sending message to AI server"});
        }

        const BotMessage = await prisma.message.create({
            data: {
                text: response.data.response, chat_id: chat.id, receiver_id: user.id
            },
        });

        if (response.data.intent === "product_search") {
            const productIds = response.data.recommended_products_Ids;
            const products = await prisma.product.findMany({where: {id: {in: productIds}}});
            const recommendedProducts = [];
            for (const productId of productIds) {
                const productMessage = await prisma.productMessage.create({
                    data: {
                        product_id: productId,
                        message_id: BotMessage.id,
                        image: products.find(product => product.id === productId).image
                    }
                });
                recommendedProducts.push(productMessage);
            }

            return res.status(200).json({message, BotMessage, products: recommendedProducts});
        }

        return res.status(200).json({message, BotMessage});
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Internal server error"});
    }
};