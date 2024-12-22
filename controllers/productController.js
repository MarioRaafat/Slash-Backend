import { CategoryFamilies } from "@prisma/client";
import prisma from "../utils/prismaClient.js";
import {redisClient} from "../utils/redisClient.js";
import {blobServiceClient, Product_Image_Container_Name} from "../utils/constants.js";

export const getAllProducts = async (req, res) => {
    const userId = req.userId;
    const role = req.role;
    try {
        if (role !== "USER" && role !== "ADMIN") {
            return res.status(403).json({message: "Insufficient permissions"});
        }
        const products = await prisma.product.findMany({where: {approved: true}});

        if (role === "ADMIN") {

            return res.status(200).json({products});
        }


        const user = await prisma.shopper.findUnique({where: {id: userId}});
        if (!user) {
            return res.status(404).json({message: "User not found"});
        }

        const wishlist = await prisma.wishlist.findUnique({ where: {user_id: userId}, include: {items: true} });
        const wishlistItems = wishlist.items
        let wishlistProductsIDs = [];

        if (wishlistItems.length > 0) {
            wishlistProductsIDs = wishlistItems.map((item) => item.product_id);
        }

        for (const product of products) {
            product.isInWishlist = wishlistProductsIDs.includes(product.id);
        }

        res.status(200).json({products});
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getSingleProduct = async (req, res) => {
    const { id } = req.params;
    const userId = req.userId;
    const role = req.role;
    try {
        if (role !== "USER" && role !== "ADMIN") {
            return res.status(403).json({message: "Insufficient permissions"});
        }
        const product = await prisma.product.findUnique({where: {id: id}});
        if (!product) {
            return res.status(404).json({message: "Product not found"});
        }

        if (role === "ADMIN") {
            return res.status(200).json(product);
        }

        const user = await prisma.shopper.findUnique({where: {id: userId}});
        if (!user) {
            return res.status(404).json({message: "User not found"});
        }

        const wishlist = await prisma.wishlist.findUnique({ where: {user_id: userId}, include: {items: true} });

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        const wishlistProductsIDs = wishlist.items.map((item) => item.product_id);

        product.isInWishlist = wishlistProductsIDs.includes(product.id);

        res.status(200).json(product);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// export const createProduct = async (req, res) => {
//     const { name, price, image, brand, material, returnPeriod, discount, style, category } = req.body;
//     const role = req.role;
//     try {
//         if (role !== "ADMIN") {
//             return res.status(403).json({message: "Insufficient permissions"});
//         }
//
//         if (!name || !price || !image || !brand || !material || !returnPeriod || !discount || !style || !category) {
//             return res.status(400).json({message: "Missing required fields"});
//         }
//
//         if (isNaN(price) || isNaN(discount)) {
//             return res.status(400).json({message: "Price and discount must be numbers"});
//         }
//
//         const brand_id = await prisma.brand.findFirst({where: {name: brand,}});
//         const category_id = prisma.category.findFirst({where: {name: category, style: style}})
//         const newProduct = await prisma.product.create({
//             data: {
//                 name,
//                 price,
//                 discount,
//                 material,
//                 image,
//                 returnPeriod,
//                 brand_id,
//                 category_id,
//             },
//         });
//         res.status(201).json(newProduct);
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({ message: "Internal server error" });
//     }
// };

export const updateProduct = async (req, res) => {
    const { id, name, price, image, brand, material, returnPeriod, category, style, discount } = req.body;
    const role = req.role;
    try {
        if (role !== "ADMIN") {
            return res.status(403).json({message: "Insufficient permissions"});
        }

        const brand_id = await prisma.brand.findFirst({where: {name: brand,}});
        const category_id = prisma.category.findFirst({where: {name: category, style: style}});

        if (!brand_id || !category_id) {
            return res.status(404).json({message: "Invalid brand or category"});
        }

        if (!name || !price || !image || !material || !returnPeriod || !discount) {
            return res.status(400).json({message: "Missing required fields"});
        }

        if (isNaN(price) || isNaN(discount)) {
            return res.status(400).json({message: "Price and discount must be numbers"});
        }

        const updatedProduct = await prisma.product.update({
            where: {
                id: parseInt(id),
            },
            data: {
                name,
                price,
                image,
                brand_id,
                material,
                returnPeriod,
                category_id,
                discount,
            },
        });
        res.status(200).json(updatedProduct);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
};


export const deleteProduct = async (req, res) => {
    const { id } = req.body;
    const role = req.role;
    try {
        if (role !== "ADMIN") {
            return res.status(403).json({message: "Insufficient permissions"});
        }

        const product = await prisma.product.findUnique({where: {id: id}});
        if (!product) {
            return res.status(404).json({ message: "Invalid product ID" });
        }

        const imageName = `${product.id}-${product.name}`; // Extract the image name from URL
        const containerClient = blobServiceClient.getContainerClient(Product_Image_Container_Name);

        // Delete the image from Azure Blob Storage
        try {
            const blockBlobClient = containerClient.getBlockBlobClient(imageName);
            await blockBlobClient.delete();
        } catch (error) {
            console.log("Error deleting image from Azure Blob Storage: ", error);
        }

        await prisma.product.delete({where: {id}});
        return res.status(200).json({ message: "Product deleted Successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getFilteredProducts = async (req, res) => {
    const userId = req.userId;
    const role = req.role;
    try {
        if (role !== "USER") {
            return res.status(403).json({ message: "Insufficient permissions" });
        }

        const user = await prisma.shopper.findUnique({where: { id: userId }, include: { bodyMeasurement: true }});
        if (!user) {
            // return res.status(404).json({ message: "User not found" });
        }
        const bodyMeasurement = user.bodyMeasurement;
        const preferences = user.preferences;

        if (!preferences || !bodyMeasurement) {
            // console.log("No preferences or body measurement found");
        }

        let products = await prisma.product.findMany({where: {approved: true}, include: {colours: true, category: true}});
        if (preferences) {
            const avoidColours = preferences.colorPreferences.avoidColors;
            const avoidMaterials = preferences.materialPreferences.avoidMaterials;
            // console.log(`size of avoidColors: ${avoidColours.length} and size of avoidMaterials: ${avoidMaterials.length}`);

            if (avoidMaterials) {
                products = products.filter((product) => {
                    if (avoidMaterials.includes(product.material)) {
                        // console.log(`avoiding material: ${product.material}`);
                        return false;
                    }
                    return true;
                });
            }
            if (avoidColours) {
                products = products.filter((product) => {
                    const productColours = product.colours;
                    for (let i = 0; i < productColours.length; i++) {
                        if (avoidColours.includes(productColours[i].name) || avoidColours.includes(productColours[i].family)) {
                            // console.log(`avoiding colour: ${productColours[i].name} for family: ${productColours[i].family}`);
                            return false;
                        }
                    }
                    return true;
                });
            }
        }

        if (!bodyMeasurement) {
            // console.log("No body measurement found");
            const secondsToExpire = 60 * 60 * 24 * 30; // 30 days
            redisClient.setex(`filteredProducts:${userId}`, secondsToExpire, JSON.stringify(products));
            return res.status(200).json(products);
        } else {
            const filteredProducts = [];
            for (let product of products) {
                const filteredSizes = [];
                const productVariants = await prisma.productVariant.findMany({where: {product_id: product.id}});
                // console.log(`productVariants size: ${productVariants.length}`);
                for (const productVariant of productVariants) {
                    const size = await prisma.size.findFirst({where: {id: productVariant.size_id}});
                    let KneeLength = 0;
                    let bodyLength = 0;
                    if (user.gender === "male") {
                        KneeLength = (bodyMeasurement.height - 79 + 0.14 * user.age) / 1.89; // equation for knee from internet
                        bodyLength = bodyMeasurement.height * (35 - ((bodyMeasurement.height - 150) / (210 - 150)) * 3) / 100.0; // equation for body length from internet
                    } else if (user.gender === "female") {
                        KneeLength = (bodyMeasurement.height - 85.89 + 0.19 * user.age) / 1.73;
                        bodyLength = bodyMeasurement.height * (32 - ((bodyMeasurement.height - 140) / (200 - 140)) * 3) / 100.0;
                    } else {
                        return res.status(400).json({ message: "User gender not found" });
                    }

                    const chestDiff = 3;
                    const waistDiff = 4;
                    const armDiff = 3;
                    const bicepDiff = 2;
                    const lengthDiff = 6;
                    const kneeDiff = 3;
                    const footDiff = 2;

                    if (size) {
                        if (user.gender === 'male') {
                            if (product.category.name === 'Skirts' || product.category.name === 'Dresses') {
                                continue;
                            }
                        }
                        if (size.chest) {
                            if (size.chest > bodyMeasurement.chest + chestDiff || size.chest < bodyMeasurement.chest - chestDiff) {
                                continue;
                            }
                        }
                        if (size.waist) {
                            if (size.waist > bodyMeasurement.waist + waistDiff || size.waist < bodyMeasurement.waist - waistDiff) {
                                continue;
                            }
                        }
                        // if (size.arm_length) {
                        //     if (size.arm_length > bodyMeasurement.armLength + armDiff || size.arm_length < bodyMeasurement.armLength - armDiff) {
                        //         continue;
                        //     }
                        // }
                        // if (size.bicep) {
                        //     if (size.bicep > bodyMeasurement.bicep + bicepDiff || size.bicep < bodyMeasurement.bicep - bicepDiff) {
                        //         continue;
                        //     }
                        // }
                        if (size.length) {
                            const productCategory = product.category.name;
                            if (productCategory === 'Shorts' && (size.length > KneeLength + kneeDiff || size.length < KneeLength - kneeDiff)) {
                                continue;
                            } else if (productCategory === 'Skirts' && (size.length > KneeLength + lengthDiff || size.length < KneeLength - lengthDiff)) {
                                continue;
                            } else if (productCategory in ['Jackets', 'Shirts', 'Sweaters'] && (size.length > bodyLength + lengthDiff + 2 || size.length < bodyLength - 2)) {
                                continue;
                            }
                        }
                        if (size.foot_length) {
                            if (size.foot_length > bodyMeasurement.footLength + footDiff || size.foot_length < bodyMeasurement.footLength - footDiff) {
                                continue;
                            }
                        }
                        filteredSizes.push(size.size);
                    }
                }
                if (filteredSizes.length > 0) {
                    product = { ...product, sizes: filteredSizes };
                    filteredProducts.push({ product });
                } else {
                    // console.log(`No sizes found for product: ${product.name}`);
                }
            }
            const secondsToExpire = 60 * 60 * 24 * 30; // 30 days
            redisClient.setex(`filteredProducts:${userId}`, secondsToExpire, JSON.stringify(filteredProducts));
            res.status(200).json(filteredProducts);
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const calculateProductMatch = async (product, userPreferences) => {
    const coloursIds = product.colours.map((colour) => colour.colour_id);
    const colours = await prisma.colour.findMany({where: {id: {in: coloursIds}}});
    const ProductTags = await prisma.product_Tag.findMany({where: {product_id: product.id}, include: {tag: true}});
    const tags = ProductTags.map((productTag) => productTag.tag.name);
    const brand = await prisma.brand.findFirst({where: {id: product.brand_id}});
    let matchScore = 0;

    if (userPreferences.productStylePreferences.includes(product.category.style)) {
        // console.log(`style match: ${product.category.style}`);
        matchScore += 0.4;
    }

    for (const colour of colours) {
        if (userPreferences.colorPreferences.primaryColors.includes(colour.name)) {
            // console.log(`primary color match: ${colour.name}`);
            matchScore += 0.5;
        }
        const coloursFamily = await prisma.colour.findMany({where: {family: colour.family}});
        for (const familyColour of coloursFamily) {
            if (userPreferences.colorPreferences.primaryColors.includes(familyColour.name)) {
                // console.log(`family color match: ${familyColour.family}`);
                matchScore += 0.3;
            }
        }
    }

    if (userPreferences.materialPreferences.preferredMaterials.includes(product.material)) {
        // console.log(`material match: ${product.material}`);
        matchScore += 0.2;
    }

    userPreferences.patternPreferences.forEach((tag) => {
            if (tags.includes(tag)) {
                // console.log(`pattern match: ${tag}`);
                matchScore += 0.1;
            }
    });

    userPreferences.climatePreferences.forEach((tag) => {
        if (tags.includes(tag)) {
            // console.log(`climate match: ${tag}`);
            matchScore += 0.1;
        }
    });

    userPreferences.occasions.forEach((tag) => {
        if (tags.includes(tag)) {
            // console.log(`occasion match: ${tag}`);
            matchScore += 0.1;
        }
    });

    if (userPreferences.brands.includes(brand.name)) {
        // console.log(`brand match: ${brand.name}`);
        matchScore += 0.2;
    }

    if (product.price >= userPreferences.budgetRange.min && product.price <= userPreferences.budgetRange.max) {
        // console.log(`price match: ${product.price}`);
        matchScore += 0.6;
    }

    return matchScore;
};

export const getRecommendedProducts = async (req, res) => {
    const userId = req.userId;
    const role = req.role;
    try {
        if (role !== "USER") {
            return res.status(403).json({message: "Insufficient permissions"});
        }

        const user = await prisma.shopper.findUnique({where: {id: userId}});
        if (!user) {
            return res.status(404).json({message: "User not found"});
        }

        const wishlist = await prisma.wishlist.findUnique({ where: {user_id: userId}, include: {items: true} });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const preferences = user.preferences;

        if (!preferences) {
            return res.status(404).json({message: "Preferences not found",});
        }

        const products = await prisma.product.findMany({where: {approved: true}, include: {colours: true, category: true}});
        for (const product of products) {
            product.isInWishlist = product in wishlist.items;
        }

        let filteredProducts = [];
        const shuffledProducts = products.sort(() => 0.5 - Math.random());
        let count = 0;
        for (const product of shuffledProducts) {
            if (count >= 20) {
                break;
            }
            const matchScore = await calculateProductMatch(product, preferences);
            if (matchScore > 0.9) {
                filteredProducts.push({ product, matchScore });
                count++;
            }
        }

        if (filteredProducts.length > 0) {
             filteredProducts = filteredProducts
                .sort((a, b) => b.matchScore - a.matchScore)
                .slice(0, 10);

            return res.status(200).json({
                products: filteredProducts,
                message: "Recommended products",
            });
        } else {
            return res.status(200).json({
                products: shuffledProducts.slice(0, 10),
                message: "No recommended products found",
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
};


export const getRandomProductsByCategory = async (req, res) => {
    try {
        const products = await prisma.product.findMany({where: {approved: true}, include: {category: true}});
        const shirts = products.filter((product) => product.category.name === "Shirts");
        const jackets = products.filter((product) => product.category.name === "Jackets");
        const dresses = products.filter((product) => product.category.name === "Dresses");
        const shorts = products.filter((product) => product.category.name === "Shorts");

        const shirtStyles = [];
        const jacketStyles = [];
        const dressStyles = [];
        const shortStyles = [];

        const filteredShirts = shirts.filter((shirt) => {
            if (!shirtStyles.includes(shirt.category.style)) {
                shirtStyles.push(shirt.category.style);
                return true;
            }
            return false;
        });

        const filteredJackets = jackets.filter((jacket) => {
            if (!jacketStyles.includes(jacket.category.style)) {
                jacketStyles.push(jacket.category.style);
                return true;
            }
            return false;
        });

        const filteredDresses = dresses.filter((dress) => {
            if (!dressStyles.includes(dress.category.style)) {
                dressStyles.push(dress.category.style);
                return true;
            }
            return false;
        });

        const filteredShorts = shorts.filter((short) => {
            if (!shortStyles.includes(short.category.style)) {
                shortStyles.push(short.category.style);
                return true;
            }
            return false;
        });

        return res.status(200).json({
            Shirts: filteredShirts,
            Jackets: filteredJackets,
            Dresses: filteredDresses,
            Shorts: filteredShorts,
        });

    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getFilteredProductsByColours = async (req,res) => {
    try {
        const colours = await prisma.colour.findMany();        
        let FilteredProducts=[];
        for (const colour of colours) {
            let products = await prisma.product.findMany({where: {approved: true}, include: {colours:true}});
            products = products.filter((product) => {
                const productColours = product.colours;
                for(let i = 0; i < productColours.length; i++) {
                    if(productColours[i].colour_id === colour.id)
                        return true;
                }
                return false;
            })
            FilteredProducts.push({colour: colour,products: products});
        }

        if(FilteredProducts)
            return res.status(200).json(FilteredProducts);
        else
            return res.status(400).json({message: "There are no Products"});
    } catch (error) {
        return res.status(500).json({message: "Internal server error"});
    }
}


export const getProductsOfPreferredColour = async (req,res) => {
    const id = req.userId;
    const role = req.role;
    try {
        if (role !== "USER") {
            return res.status(403).json({message: "Insufficient permissions"});
        }

        const user = await prisma.shopper.findFirst({where:{id}});
        if(!user)
            return res.status(404).json({message:"User not found"});

        const preferences = user.preferences;
        if(!preferences) {
            return res.status(400).json({message: "User preferences not found"});
        }
        let products = await prisma.product.findMany({where: {approved: true}, include:{colours: true}});

        let preferredColours = [];
        if (preferences.colorPreferences.primaryColors) {
            preferredColours = preferences.colorPreferences.primaryColors;
        }

        let colours = await prisma.colour.findMany();
        colours = colours.filter((colour)=> {
            return preferredColours.includes(colour.name) || preferredColours.includes(colour.family);
        });

        if (colours) {
            products = products.filter((product) => {
                const productColours = product.colours;
                for (const productColour of productColours) {
                    for (const colour of colours) {
                        if (productColour.colour_id === colour.id) {
                            // console.log(`preferred colour: ${colour.name}`);
                            return true;
                        }
                    }
                }
                return false;
            });
        }
        if (products) {
            // console.log(`LENGTH:  ${products.length}`);
            return res.status(200).json({products: products});
        } else {
            return res.status(404).json({message: "No products found"});
        }
    } catch (error) {
        return res.status(500).json({message: "Internal server error"});
    }
}


export const getProductsOfBrand = async (req,res) => {
    const {id} = req.params;
    try {
        const brand = await prisma.brand.findFirst({where: {id: id}});
        if (!brand) {
            return res.status(404).json({message:"Brand not found"});
        }
        const products = await prisma.product.findMany({where: {brand_id:id, approved: true}});

        if (products) {
            return res.status(200).json({products: products});
        } else {
            return res.status(404).json({message: "No products found"});
        }
    } catch(error) {
        return res.status(500).json({message: "Internal server error"});
    }
}

export const getFilteredProductsByPriceRange = async (req,res) => {
    const {min, max} = req.params;
    try {
        const Min = parseFloat(min);
        const Max = parseFloat(max);
        const products = await prisma.product.findMany({
            where: {
                price: {
                    gte: Min,
                    lte: Max
                },
                approved: true
            }
        });

        if (products) {
            return res.status(200).json({products: products});
        } else {
            return res.status(404).json({message: "No products found"});
        }
    }
    catch (error) {
        return res.status(500).json({message: "Internal server error"});
    }
}

export const getProductDetails = async (req, res) => {
    const { id } = req.body;
    const role = req.role;
    const userId = req.userId;
    try {
        const product = await prisma.product.findFirst({
            where: {id},
            include: { brand: true, category: true},
        });
        let followedBrands = [];
        if (role === "USER") {
            const Brands = await prisma.brand_Shopper.findMany({where: {user_id: userId}});
            followedBrands = Brands.map((brand) => brand.brand_id);
        }

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        const productVariants = await prisma.productVariant.findMany({where: {product_id: product.id}});
        const sizes = [];
        const colours = {};
        const variants = [];
        for (const productVariant of productVariants) {
            const size = await prisma.size.findFirst({where: {id: productVariant.size_id}});
            sizes.push(size);
            variants.push({size: size.size, quantity: productVariant.quantity, productVariantId: productVariant.id});
        }
        product.sizes = sizes;
        product.variants = variants;

        const productColours = await prisma.product_Colour.findMany({where: {product_id: product.id}});
        for (const productColour of productColours) {
            const colour = await prisma.colour.findFirst({where: {id: productColour.colour_id}});
            colours[colour.family] = colour.name;
        }
        product.colours = colours;

        const productsDiffColours = await prisma.product.findMany({where: {name: product.name, approved: true, id: {not: product.id}}});
        const diffColours = [];
        for (const productDiffColours of productsDiffColours) {
            const DiffColours = await prisma.product_Colour.findMany({where: {product_id: productDiffColours.id}});
            const productColours = {};
            for (const colour of DiffColours) {
                const colourName = await prisma.colour.findFirst({where: {id: colour.colour_id}});
                productColours[colourName.family] = colourName.name;
            }
            diffColours.push(productColours);
        }
        product.diffColours = diffColours;

        if (role === "USER") {
            const wishlist = await prisma.wishlist.findUnique({ where: {user_id: userId}, include: {items: true} });
            if (!wishlist) {
                return res.status(404).json({message: "Wishlist not found"});
            }

            const wishlistItems = wishlist.items;
            const wishlistProductsIDs = wishlistItems.map((item) => item.product_id);

            product.followedBrand = followedBrands.includes(product.brand_id);
            product.isInWishlist = wishlistProductsIDs.includes(product.id);
        }

        res.status(200).json(product);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getSimilarProducts = async (req,res) => {
    const { id } = req.body;
    const userId = req.userId;
    const role = req.role;
    try {
        const Product = await prisma.product.findFirst({
            where: {id},
            include: {tags:{ include:{tag: true}}, colours: {include:{colour: true}}, category: true},
        });

        if (!Product) {
            return res.status(400).json({ message: "Product not found" });
        }

        const productTags = Product.tags;
        const productColours = Product.colours;
        const productCategory = Product.category;

        const similarProducts = await prisma.product.findMany({
            where: {
                approved: true,
                id: {not: Product.id},
                category: {name: productCategory.name}
            },
            include: {
                tags: { include: {tag: true}},
                colours: {include: {colour: true}}
            }
        });

        let tagNames= [];
        let colourNames= [];
        let colourFamilies= new Set();

        for (const colour of productColours) {
            colourNames.push(colour.colour.name);
            colourFamilies.add(colour.colour.family);
        }

        for (const tag of productTags) {
            tagNames.push(tag.tag.name);
        }

        let filteredSimilarProducts = similarProducts.filter((product)=> {
            let tags = product.tags;
            let colours = product.colours;
            let points=0;

            for (const tag of tags) {
                if ( tagNames.includes(tag.tag.name)) points++;
            }

            for (const colour of colours) {
                if (colourNames.includes(colour.colour.name)) points += 2;
                if (colourFamilies.has(colour.colour.family)) points++;
            }
            product.points = points;

            return points >= 2;
        });

        if (filteredSimilarProducts.length === 0) {
            return res.status(404).json({ message: "No similar products found" });
        }

        filteredSimilarProducts = filteredSimilarProducts
            .sort((a,b) => b.points - a.points)
            .slice(0, 10);

        if (role === "USER") {
            const wishlist = await prisma.wishlist.findUnique({ where: {user_id: userId}, include: {items: true} });
            const wishlistItems = wishlist.items;
            const wishlistProductsIDs = wishlistItems.map((item) => item.product_id);
            for (const product of filteredSimilarProducts) {
                product.isInWishlist = wishlistProductsIDs.includes(product.id);
            }
        }

        return res.status(200).json({products: filteredSimilarProducts});
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getAllCategoryNames = async (req, res) => {
    try {
        const categories = await prisma.category.findMany({distinct:['name']});
        if(categories)
            return res.status(200).json(categories);
        else
            return res.status(404).json({message: "No categories found"});
    } catch (error) {
        return res.status(500).json({message: "Internal server error"});
    }
}

export const getProductsByCategoryName = async (req, res)=>{
    const { categoryName } = req.params;
    try {
        const products = await prisma.product.findMany({where: {approved: true}, include: {category: true}});
        const filteredProducts = products.filter((product) => product.category.name === categoryName);
        if(!filteredProducts)
        {            
            return res.status(404).json({message: "No Products found for this category"});
        } 
        return res.status(200).json(filteredProducts);
    }catch(error){
        return res.status(500).json({message: "Internal server error"});
    }
}


