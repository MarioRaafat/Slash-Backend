import prisma from "../utils/prismaClient.js";


export const getColours = async (req, res) => {
    try {
        const colours = await prisma.colour.findMany();
        res.status(200).json({colours});
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getCategories = async (req, res) => {
    try {
        const categories = await prisma.category.findMany();
        res.status(200).json({categories});
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};