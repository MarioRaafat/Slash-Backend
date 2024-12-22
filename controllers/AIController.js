import FormData from "form-data";
import prismaClient from "../utils/prismaClient.js";
import {apiClient, ANALYSE_PRODUCT_IMAGE_ROUTE, blobServiceClient, Product_Image_Container_Name, uploadImageToAzure} from "../utils/constants.js";
import {sizeRanges, sizeTags, accessoryCategories} from "../prisma/utils/constants.js";
import {prisma} from "../prisma/seed.js";
import faker from "faker";

const addCategorySize = async (category) => {
    const brands = await prismaClient.brand.findMany();
    const chestRange = sizeRanges[category.name].chest;
    const armLengthRange = sizeRanges[category.name].arm_length;
    const bicepRange = sizeRanges[category.name].bicep;
    const lengthRange = sizeRanges[category.name].length;
    const footLengthRange = sizeRanges[category.name].foot_length;
    const waistRange = sizeRanges[category.name].waist;


    for (const brand of brands) {
        for (let j = 0; j < sizeTags.length; j++) {
            const size = await prisma.size.create({
                data: {
                    brand_id: brand.id,
                    category_id: category.id,
                    size: sizeTags[j],
                    chest: chestRange? faker.datatype.number({
                        min: chestRange[sizeTags[j]][0],
                        max: chestRange[sizeTags[j]][1]
                    }) : null,
                    arm_length: armLengthRange? faker.datatype.number({
                        min: armLengthRange[sizeTags[j]][0],
                        max: armLengthRange[sizeTags[j]][1]
                    }) : null,
                    bicep: bicepRange? faker.datatype.number({
                        min: bicepRange[sizeTags[j]][0],
                        max: bicepRange[sizeTags[j]][1]
                    }) : null,
                    length: lengthRange? faker.datatype.number({
                        min: lengthRange[sizeTags[j]][0],
                        max: lengthRange[sizeTags[j]][1]
                    }) : null,
                    foot_length: footLengthRange? faker.datatype.number({
                        min: footLengthRange[sizeTags[j]][0],
                        max: footLengthRange[sizeTags[j]][1]
                    }) : null,
                    waist: waistRange? faker.datatype.number({
                        min: waistRange[sizeTags[j]][0],
                        max: waistRange[sizeTags[j]][1]
                    }) : null,
                },
            });

            console.log(`Size: ${size.size} added for ${category.name} category in ${brand.name} brand`);
        }
    }
};

const addItems = async (product) => {
    const users = await prismaClient.shopper.findMany();
    const randomUsers_V1 = users.sort(() => 0.5 - Math.random()).slice(0, 1);
    const randomUsers_V2 = users.sort(() => 0.5 - Math.random()).slice(0, 1);
    const randomUsers_V3 = users.sort(() => 0.5 - Math.random()).slice(0, 1);
    const productVariants = await prismaClient.productVariant.findMany({where: {product_id: product.id}});


    for (const user of randomUsers_V1) {
        const randomQuantity = faker.datatype.number({min: 1, max: 3});
        console.log(`User: ${user.id} with quantity: ${randomQuantity}`);
        const cart = await prismaClient.cart.findUnique({where: {user_id: user.id}});
        if (!cart) {
            console.log(`No cart found for user: ${user.id} --> skipping`);
            continue;
        }
        const randomProductVariant = productVariants[Math.floor(Math.random() * productVariants.length)];

        if (!randomProductVariant) {
            console.log(`No product variant found for product: ${product.id} --> skipping`);
            continue;
        }

        await prismaClient.cartItem.create({
            data: {
                cart_id: cart.id,
                product_id: randomProductVariant.id,
                quantity: randomQuantity,
            }
        });

        await prismaClient.cart.update({
            where: {id: cart.id},
            data: {total_cost: parseFloat((cart.total_cost + (product.price * randomQuantity)).toFixed(2))},
        });

        console.log(`Product added to cart for user: ${user.id}`);
    }

    for (const user of randomUsers_V2) {
        const randomProductVariant = productVariants[Math.floor(Math.random() * productVariants.length)];
        const wishlist = await prismaClient.wishlist.findUnique({where: {user_id: user.id}});

        await prismaClient.wishlistItem.create({
            data: {
                wishlist_id: wishlist.id,
                product_id: product.id,
            }
        });
        console.log(`Product added to wishlist for user: ${user.id}`);
    }

    for (const user of randomUsers_V3) {
        const randomProductVariant = productVariants[Math.floor(Math.random() * productVariants.length)];
        let order = await prismaClient.order.findFirst({where: {user_id: user.id}});
        const randomQuantity = faker.datatype.number({min: 1, max: 3});
        const threshold = 0.7;
        const random = Math.random();

        if (!order || random < threshold) {
            order = await prismaClient.order.create({
                data: {
                    user_id: user.id,
                    order_status: "PENDING",
                }
            });
        }

        await prismaClient.order.update({
            where: {id: order.id},
            data: {total_cost: parseFloat((order.total_cost + (product.price * randomQuantity)).toFixed(2))},
        });

        await prismaClient.orderItem.create({
            data: {
                order_id: order.id,
                product_id: randomProductVariant.id,
                quantity: randomQuantity,
            }
        });

        console.log(`Order item added for user: ${user.id}`);

        const randomReview = Math.random();
        if (randomReview > 0.4) {
            await prismaClient.review.create({
                data: {
                    product_id: product.id,
                    user_id: user.id,
                    rating: parseFloat(faker.datatype.number({ min: 3.3, max: 5, precision: 0.2 }).toFixed(1)),
                    valueForMoney_rate: parseFloat(faker.datatype.number({ min: 2.5, max: 5, precision: 0.5 }).toFixed(1)),
                    quality_rate: parseFloat(faker.datatype.number({ min: 2.5, max: 5, precision: 0.5 }).toFixed(1)),
                    shipping_rate: parseFloat(faker.datatype.number({ min: 2.5, max: 5, precision: 0.5 }).toFixed(1)),
                    accuracy_rate: parseFloat(faker.datatype.number({ min: 2.5, max: 5, precision: 0.5 }).toFixed(1)),
                    comment: faker.lorem.sentence(),
                }
            });
            console.log(`Review added for user: ${user.id}`);
        }

        console.log(`Review added for user: ${user.id}`);
    }
};

const setProductData = async (productAnalysis) => {
    const {name, price, tags, style, category, colours, material, description} = productAnalysis;
    const tagsId = [];
    let categoryId = null;
    const coloursId = [];
    const coloursPercentages = []

    for (const tagName of tags) {
        const tag = await prismaClient.tag.upsert({
            where: {name: tagName},
            update: {},
            create: {name: tagName},
        });
        tagsId.push(tag.id);
        console.log(`Tag: ${tag.name}`);
    }

    const existingCategory = await prismaClient.category.findFirst({
        where: { name: category, style: style },
    });

    let categoryData;
    if (existingCategory) {
        categoryData = existingCategory;
    } else {
        console.log(`Adding new Category to the database`)
        categoryData = await prismaClient.category.create({
            data: { name: category, style: style },
        });

        if (!accessoryCategories.includes(category.name)) {
            await addCategorySize(categoryData);
        }
    }

    categoryId = categoryData.id;
    console.log(`Category: ${categoryData.name} with style: ${categoryData.style}`);

    for (const colour of colours) {
        const name = colour.colourName || colour.name;
        const family = colour.colourFamily || colour.family;
        const hex = colour.colourHex || colour.hex;

        const existingColour = await prismaClient.colour.findUnique({where: {name: name}});
        const existHex = await prismaClient.colour.findUnique({where: {hex: hex}});

        let colourData = existingColour || existHex;
        if (!existingColour && !existHex) {
            console.log(`Adding new Colour to the database`)
            colourData = await prismaClient.colour.create({
                data: { name: name, family: family, hex: hex },
            });
        }

        coloursId.push(colourData.id);
        coloursPercentages.push(colour.percentage);
        console.log(`Colour: ${colourData.name} with family: ${colourData.family} and hex: ${colourData.hex}`);
    }

    const brands = await prismaClient.brand.findMany({where: {rated_status: true}});
    const randomBrandId = brands[Math.floor(Math.random() * brands.length)].id;

    const randomDiscount = Math.floor(Math.random() * 20);
    const randomRating = parseFloat((Math.random() * (5 - 3.4) + 3.4).toFixed(1));
    const randomReturnPeriod = Math.floor(Math.random() * 30);

    const newProduct = await prismaClient.product.create({data: {
            name,
            description,
            price: parseFloat(price),
            description,
            brand_id: randomBrandId,
            category_id: categoryId,
            discount: randomDiscount,
            rating: randomRating,
            material,
            returnPeriod: randomReturnPeriod,
            sold_items: faker.datatype.number({min: 0, max: 100}),
            image: " ",
            approved: true,
            rated_status: true,
        }
    });

    if (!newProduct) {
        throw new Error("Failed to add product to the database");
    }

    console.log(`Product: ${newProduct.name} with price: ${newProduct.price}`);

    await prismaClient.product_Tag.createMany({
        data: tagsId.map(tagId => ({tag_id: tagId, product_id: newProduct.id}))
    });

    console.log(`Products tags added`);

    await prismaClient.product_Colour.createMany({
        data: coloursId.map((colourId, index) => ({colour_id: colourId, product_id: newProduct.id, percentage: parseInt(coloursPercentages[index])}))
    });

    console.log(`Products colours added`);

    const sizes = await prismaClient.size.findMany({where: {category_id: categoryId, brand_id: randomBrandId}});
    const random4Sizes = sizes.sort(() => 0.5 - Math.random()).slice(0, 4);
    if (random4Sizes.length < 1) {
        await prismaClient.product.delete({where: {id: newProduct.id}});
        throw new Error("Failed to find sizes for the product");
    }

    for (const size of random4Sizes) {
        await prismaClient.productVariant.create({
            data: {
                quantity: faker.datatype.number({min: 2, max: 20}),
                product_id: newProduct.id,
                size_id: size.id,
            }
        });
    }
    console.log(`Product variants added`);

    await addItems(newProduct);
    console.log(`Items added`);

    return newProduct;
};

export const analyseProductImage = async (req, res) => {
    const image = req.file;
    const password = req.params.password;
    try {
        if (password !== "M@ri0") {
            return res.status(401).json({ message: "Don't touch it, It's an art" });
        }

        if (!image) {
            return res.status(400).json({ message: "Missing image file" });
        }

        const imageExtension = image.originalname.split(".").pop();

        const containerClient = blobServiceClient.getContainerClient(Product_Image_Container_Name);
        const formData = new FormData();
        formData.append("file", image.buffer, image.originalname);

        let AI_response = null;
        let productAnalysis = null;
        try {
            AI_response = await apiClient.post(
                ANALYSE_PRODUCT_IMAGE_ROUTE,
                formData,
                {
                    headers: formData.getHeaders(), // Set appropriate headers for FormData
                }
            );

            productAnalysis = AI_response.data;
        } catch (error) {
            console.error(error.response?.data || error.message);
            return res.status(500).json({ message: "Error analysing image" });
        }

        const { name, price, tags, style, category, colours, material, description } = productAnalysis;
        if (!name || !price || !tags || !style || !category || !colours || !material || !description) {
            return res.status(400).json({ message: "Invalid AI response" });
        }

        console.log("Product Analysis Insertion... ");

        const product = await setProductData(productAnalysis);
        const imageUrl = await uploadImageToAzure(image.buffer, `${product.id}-${product.name}.${imageExtension}`, containerClient);

        await prismaClient.product.update({
            where: {id: product.id},
            data: {image: imageUrl},
        });

        await prismaClient.productImage.create({
            data: {
                product_id: product.id,
                image: imageUrl,
            }
        });

        return res.status(200).json({
            AI_Response: productAnalysis,
            product_id: product.id,
            image: imageUrl,
        });
    } catch (error) {
        console.error(error.response?.data || error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};


export const getStatistics = async (req, res) => {
    try {
        const totalProducts = await prismaClient.product.count();
        const totalApprovedProducts = await prismaClient.product.count({where: {approved: true}});
        const totalUnapprovedProducts = await prismaClient.product.count({where: {approved: false}});
        const totalUsers = await prismaClient.shopper.count();
        const BlockedUsers = await prismaClient.blackList.findMany({include: {user: true}, where: {user: {role: "USER"}}});
        const totalBlockedUsers = BlockedUsers.length;
        const totalBrands = await prismaClient.brand.count();
        const BlockedBrands = await prismaClient.blackList.findMany({include: {user: true}, where: {user: {role: "BRAND"}}});
        const totalBlockedBrands = BlockedBrands.length;
        const totalAdmins = await prismaClient.admin.count();
        const totalOrders = await prismaClient.order.count();
        const totalReviews = await prismaClient.review.count();
        const totalCategories = await prismaClient.category.count();
        const totalTags = await prismaClient.tag.count();
        const totalColours = await prismaClient.colour.count();
        const totalSizes = await prismaClient.size.count();
        const totalProductVariants = await prismaClient.productVariant.count();
        const totalCartItems = await prismaClient.cartItem.count();
        const totalWishlistItems = await prismaClient.wishlistItem.count();
        const totalOrderItems = await prismaClient.orderItem.count();
        const totalOrdersCost = await prismaClient.order.aggregate({
            _sum: {
                total_cost: true,
            }
        });
        const totalCompletedOrdersCost = await prismaClient.order.aggregate({
            _sum: {
                total_cost: true,
            },
            where: {
                order_status: "COMPLETED",
            }
        });
        const totalPendingOrdersCost = await prismaClient.order.aggregate({
            _sum: {
                total_cost: true,
            },
            where: {
                order_status: "PENDING",
            }
        });
        const totalCartsCost = await prismaClient.cart.aggregate({
            _sum: {
                total_cost: true,
            }
        });

        return res.status(200).json({
            totalProducts,
            totalApprovedProducts,
            totalUnapprovedProducts,
            totalUsers,
            totalBlockedUsers,
            totalBrands,
            totalBlockedBrands,
            totalAdmins,
            totalOrders,
            totalReviews,
            totalCategories,
            totalTags,
            totalColours,
            totalSizes,
            totalProductVariants,
            totalCartItems,
            totalWishlistItems,
            totalOrderItems,
            totalOrdersCost: totalOrdersCost._sum.total_cost || 0,
            totalCompletedOrdersCost: totalCompletedOrdersCost._sum.total_cost || 0,
            totalPendingOrdersCost: totalPendingOrdersCost._sum.total_cost || 0,
            totalCartsCost: totalCartsCost._sum.total_cost || 0,
        });
    } catch (error) {
        console.error(error.response?.data || error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};