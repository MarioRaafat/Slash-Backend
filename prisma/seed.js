import { PrismaClient } from "@prisma/client";
import { BrandsSeed } from "./seed/brandSeed.js";
import { UsersSeed } from "./seed/userSeed.js";
import { ProductSeed } from "./seed/productSeed.js";
import { ColourTagSeed } from "./seed/colour-tagSeed.js";
import { RandomTags } from "./seed/addRandomTags.js";
import { ItemsSeed } from "./seed/itemsSeed.js";

export const prisma = new PrismaClient();


const seedData = async () => {
    try {
        // await BrandsSeed();
        // await ColourTagSeed();
        // await UsersSeed();
        // //await ProductSeed();
        // //await RandomTags();
        // await ItemsSeed();
    } catch (error) {
        console.error(error);
    }
}

// Run the seeder
seedData()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
