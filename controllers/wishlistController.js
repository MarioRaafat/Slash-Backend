import prisma from "../utils/prismaClient.js";

export const getWishlist = async (req, res) => {
    const userId = req.userId;
    const role = req.role;
    try {
        if (role !== "USER") {
            return res.status(403).json({message: "Insufficient permissions"});
        }

        const wishlist = await prisma.wishlist.findUnique({where: {user_id: userId}, include: {items: true}});
        if (!wishlist) {
            return res.status(404).json({message: "Wishlist not found"});
        }

        const wishlistItems = wishlist.items;
        const products = [];

        for (const item of wishlistItems) {
            const product = await prisma.product.findUnique({where: {id: item.product_id}});
            products.push(product);
        }

        res.status(200).json({products});
    } catch (error) {
        res.status(500).json({message: "Internal Server Error"});
    }
};

export const addToWishlist = async (req, res) => {
    const userId = req.userId;
    const role = req.role;
    const {productId} = req.body;
    try {
        if (role !== "USER") {
            return res.status(403).json({message: "Insufficient permissions"});
        }

        const wishlist = await prisma.wishlist.findUnique({where: {user_id: userId}});
        if (!wishlist) {
            return res.status(404).json({message: "Wishlist not found"});
        }

        const itemExists = await prisma.wishlistItem.findFirst({where: {product_id: productId, wishlist_id: wishlist.id}});
        if (itemExists) {
            return res.status(400).json({message: "Product already exists in wishlist"});
        }

        const item = await prisma.wishlistItem.create({
            data: {
                product_id: productId,
                wishlist_id: wishlist.id,
            }
        });

        res.status(200).json({
            message: "Product added to wishlist",
            item: item,
        });
    } catch (error) {
        res.status(500).json({message: "Internal Server Error"});
    }
};

export const removeFromWishlist = async (req, res) => {
    const userId = req.userId;
    const {productId} = req.body;
    const role = req.role;
    try {
        if (role !== "USER") {
            return res.status(403).json({message: "Insufficient permissions"});
        }

        const wishlist = await prisma.wishlist.findUnique({where: {user_id: userId}});
        if (!wishlist) {
            return res.status(404).json({message: "Wishlist not found"});
        }

        const item = await prisma.wishlistItem.findFirst({
            where: {
                product_id: productId,
                wishlist_id: wishlist.id,
            }
        });

        if (!item) {
            return res.status(404).json({message: "Item not found in wishlist"});
        }

        await prisma.wishlistItem.delete({where: {id: item.id}});
        res.status(200).json({message: "Product removed from wishlist"});
    } catch (error) {
        res.status(500).json({message: "Internal Server Error"});
    }
};

export const clearWishlist = async (req, res) => {
    const userId = req.userId;
    const role = req.role;
    try {
        if (role !== "USER") {
            return res.status(403).json({message: "Insufficient permissions"});
        }

        const wishlist = await prisma.wishlist.findUnique({where: {user_id: userId}});
        if (!wishlist) {
            return res.status(404).json({message: "Wishlist not found"});
        }

        await prisma.wishlistItem.deleteMany({where: {wishlist_id: wishlist.id}});
        res.status(200).json({message: "Wishlist cleared"});
    } catch (error) {
        res.status(500).json({message: "Internal Server Error"});
    }
};