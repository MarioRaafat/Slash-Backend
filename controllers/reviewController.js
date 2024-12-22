import prisma from "../utils/prismaClient.js";
import {blobServiceClient, Review_Image_Container_Name, uploadImageToAzure} from "../utils/constants.js";

export const getReviews = async (req, res) => {
    const userId = req.userId;
    const role = req.role;
    try {
        if (role !== "USER") {
            return res.status(403).json({message: "Insufficient permissions"});
        }

        const reviews = await prisma.review.findMany({where: {user_id: userId}, include: {user: true}});
        for (const review of reviews) {
            const likes = await prisma.review_Shopper.findMany({where: {review_id: review.id}});
            review.likes = likes.length;
        }

        res.status(200).json({reviews});
    } catch (error) {
        res.status(500).json({message: "Internal server error"});
    }
}

// allowed for all users
export const getProductReviews = async (req, res) => {
    const productId = req.params.id;
    const userId = req.userId;
    try {
        const reviews = await prisma.review.findMany({where: {product_id: productId}, include: {user: true}});
        for (const review of reviews) {
            const likes = await prisma.review_Shopper.findMany({where: {review_id: review.id}});
            review.likes = likes.length;
            review.liked = false;

            for (const like of likes) {
                if (like.user_id === userId) {
                    review.liked = true;
                    break;
                }
            }
        }

        res.status(200).json({reviews});
    } catch (error) {
        res.status(500).json({message: "Internal server error"});
    }
}

export const createReview = async (req, res) => {
    const { productId, rating, comment, valueForMoney_rate, quality_rate,
        shipping_rate, accuracy_rate, image } = req.body;
    const userId = req.userId;
    const role = req.role;
    try {
        if (role !== "USER") {
            return res.status(403).json({message: "Insufficient permissions"});
        }

        if (!productId || !rating || !comment || !valueForMoney_rate || !quality_rate || !shipping_rate || !accuracy_rate) {
            return res.status(400).json({message: "Missing required fields"});
        }

        const review = await prisma.review.create({
            data: {
                user_id: userId,
                product_id: productId,
                rating,
                comment,
                valueForMoney_rate,
                quality_rate,
                shipping_rate,
                accuracy_rate,
                image
            }
        });

        res.status(201).json({review});
    } catch (error) {
        res.status(500).json({message: "Internal server error"});
    }

}

export const likeReview = async (req, res) => {
    const userId = req.userId;
    const role = req.role;
    const { reviewId } = req.body;
    try {
        if (role !== "USER") {
            return res.status(403).json({message: "Insufficient permissions"});
        }

        const review = await prisma.review.findUnique({where: {id: reviewId}});
        if (!review) {
            return res.status(404).json({message: "Review not found"});
        }

        const like = await prisma.review_Shopper.findFirst({where: {review_id: reviewId, user_id: userId}});
        if (like) {
            await prisma.review_Shopper.delete({where: {id: like.id}});
            return res.status(200).json({message: "Review unliked"});
        }

        await prisma.review_Shopper.create({data: {review_id: reviewId, user_id: userId}});
        res.status(200).json({message: "Review liked"});
    } catch (error) {
        res.status(500).json({message: "Internal server error"});
    }
};

export const uploadReviewImage = async (req, res) => {
    const userId = req.userId;
    const role = req.role;
    const { reviewId } = req.body;
    const file = req.file;
    try {
        if (role !== "USER") {
            return res.status(403).json({message: "Insufficient permissions"});
        }

        const review = await prisma.review.findUnique({where: {id: reviewId}});
        if (!review) {
            return res.status(404).json({message: "Review not found"});
        }

        if (review.user_id !== userId) {
            return res.status(403).json({message: "Insufficient permissions"});
        }

        const imageName = `${reviewId}-${file.originalname}`;
        const containerClient = blobServiceClient.getContainerClient(Review_Image_Container_Name);
        const imageUrl = await uploadImageToAzure(file.buffer, imageName, containerClient);

        await prisma.review.update({where: {id: reviewId}, data: {image: imageUrl}});

        res.status(200).json({message: "Image uploaded successfully", image: imageUrl});
    } catch (error) {
        res.status(500).json({message: "Internal server error"});
    }
}

export const updateReview = async (req, res) => {
    const { id } = req.params;
    const { rating, comment, valueForMoney_rate, quality_rate,
        shipping_rate, accuracy_rate, image } = req.body;
    const userId = req.userId;
    try {
        const review = await prisma.review.findUnique({where: {id}});
        if (!review) {
            return res.status(404).json({message: "Review not found"});
        }

        if (review.user_id !== userId || req.role !== "USER") {
            return res.status(403).json({message: "Insufficient permissions"});
        }

        const updatedReview = await prisma.review.update({
            where: {id},
            data: {
                rating,
                comment,
                valueForMoney_rate,
                quality_rate,
                shipping_rate,
                accuracy_rate,
                image
            }
        });

        res.status(200).json({
            message: "Review updated successfully",
            review: updatedReview
        });

    } catch (error) {
        res.status(500).json({message: "Internal server error"});
    }
}

export const deleteReview = async (req, res) => {
    const { id } = req.params;
    const userId = req.userId;
    const role = req.role;
    try {
        const review = await prisma.review.findUnique({where: {id}});
        if (!review) {
            return res.status(404).json({message: "Review not found"});
        }

        if (role === "USER" && review.user_id === userId || role === "ADMIN") {
            await prisma.review.delete({where: {id}});
        } else {
            return res.status(403).json({message: "Insufficient permissions"});
        }

        res.status(200).json({message: "Review deleted successfully"});
    } catch (error) {
        res.status(500).json({message: "Internal server error"});
    }
}

export const deleteReviewImage = async (req, res) => {
    const userId = req.userId;
    const role = req.role;
    const { reviewId } = req.body;
    try {
        if (role !== "USER" && role !== "ADMIN") {
            return res.status(403).json({message: "Insufficient permissions"});
        }

        const review = await prisma.review.findUnique({where: {id: reviewId}});
        if (!review) {
            return res.status(404).json({message: "Review not found"});
        }

        if (review.user_id !== userId && role !== "ADMIN") {
            return res.status(403).json({message: "Insufficient permissions"});
        }

        if (!review.image) {
            return res.status(404).json({message: "Image not found"});
        }

        // Delete image from Azure Blob Storage
        // Extract the image name from URL & decode it to get the original name with special characters
        const imageName = decodeURIComponent(review.image.split("/").pop());
        const containerClient = blobServiceClient.getContainerClient(Review_Image_Container_Name);
        const blockBlobClient = containerClient.getBlockBlobClient(imageName);
        await blockBlobClient.delete();

        await prisma.review.update({where: {id: reviewId}, data: {image: null}});
        res.status(200).json({message: "Image deleted successfully"});
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Internal server error"});
    }
}