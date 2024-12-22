import {prisma} from "../seed.js";
import faker from "faker";

const styleTags = [
    // Style and Fit
    "casual", "formal", "sporty", "business", "trendy", "vintage", "classic", "relaxed fit",
    "slim fit", "tailored", "athleisure", "bohemian", "preppy",
];

const occasionTags = [
    // Occasion
    "everyday", "work", "party", "night out", "holiday", "wedding", "date night",
    "summer", "winter", "spring", "fall", "beachwear", "travel", "outdoor", "gym",
]

const featureTags = [
    // Specific Features
    "pockets", "zippers", "buttons", "elastic waist", "drawstring", "cuffed",
    "hooded", "sleeveless", "long sleeve",
    "short sleeve", "high waist", "low rise", "mid rise",
];

const designTags = [
    // Design and Detail
    "graphic print", "plain", "stripes", "polka dot", "floral", "checkered",
    "color block", "patchwork", "distressed", "embellished", "embroidered",
    "animal print", "camouflage", "metallic", "tie-dye",
];


export const RandomTags = async () => {
    try {
        const products = await prisma.product.findMany({});
        for (const product of products) {
            const randomStyleTags = faker.random.arrayElements(styleTags, 2);
            const randomOccasionTags = faker.random.arrayElements(occasionTags, 2);
            const randomFeatureTags = faker.random.arrayElements(featureTags, 1);
            const randomDesignTags = faker.random.arrayElements(designTags, 1);
            const tags = [...randomStyleTags, ...randomOccasionTags, ...randomFeatureTags, ...randomDesignTags];
            const tagIds = [];

            for (const tag of tags) {
                const tagData = await prisma.tag.findFirst({
                    where: {
                        name: tag
                    }
                });
                if (!tagData) {
                    const newTag = await prisma.tag.create({
                        data: {
                            name: tag
                        }
                    });
                    tagIds.push(newTag.id);
                    console.log(`Added new tag ${newTag.id} with name ${newTag.name}`);
                } else {
                    tagIds.push(tagData.id);
                }
            }

            for (const tagId of tagIds) {
                try {
                    await prisma.product_Tag.create({
                        data: {
                            product_id: product.id,
                            tag_id: tagId
                        }
                    });
                    console.log(`Added tag ${tagId} to product ${product.id}`);
                } catch (error) {
                    console.log(`Error adding tag ${tagId} to product ${product.id} ####################`);
                }
            }
        }
    } catch (error) {
        console.error(error);
    }
}