import prisma from "../utils/prismaClient.js";
import {blobServiceClient, Profile_Picture_Container_Name, uploadImageToAzure} from "../utils/constants.js";
import {GET_ALL_USERS, GET_USER_BY_ID} from "../queries/userQueries.js";
import {GET_PRODUCT_BY_ID_INCLUDING_CATEGORY} from "../queries/productQueries.js";

export const setBodyMeasurements = async (req, res)=> {
    const user_id = req.userId;
    const { waist, height, chest, shoulder_width, weight, shape, foot_length } = req.body;
    const role = req.role;
    try {
        if (role !== "USER") {
            return res.status(403).json({message: "Insufficient permissions"});
        }

        if (!waist || !height || !chest || !shoulder_width || !weight || !shape || !foot_length){
            return res.status(400).json({message: "missing required fields"});
        }

        const userExists=await prisma.shopper.findUnique({ where: { id: user_id }});

        if (userExists) {
            const bodyMeasurementExists = await prisma.bodyMeasurement.findUnique({ where: { user_id }});

            if (bodyMeasurementExists) {
                const updatedBodyMeasurement = await prisma.bodyMeasurement.update({
                    where: { user_id },
                    data: {
                        waist, height, chest, shoulder_width, weight, shape, foot_length
                    }
                });

                return res.status(200).json(updatedBodyMeasurement);
            } else {
                const newBodyMeasurement=await prisma.bodyMeasurement.create({
                    data:{
                        waist, height, chest, shoulder_width, weight, shape, foot_length, user_id
                    }
                });

                return res.status(201).json(newBodyMeasurement);
            }
        } else {
            return res.status(404).json({message: "User not found"});
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({message: "Internal server error"});
    }
};

export const getAllUsers = async (req, res) => {
    const role = req.role;
    const userId = req.userId;
    try {
        if (role !== "ADMIN") {
            return res.status(403).send("Insufficient permissions");
        }

        const admin = await prisma.admin.findUnique({where: {id: userId}});
        if (admin.role !== "SuperAdmin" && admin.role !== "SystemAdmin" && admin.role !== "CustomerService") {
            return res.status(403).send("Insufficient permissions");
        }

        const users = await prisma.shopper.findMany({include: {
                user: true,
                chats: {select: {id: true}},
                orders: {select: {id: true}, where: {order_status: {not: "CANCELLED"}}},
            },

        });

        for (const user of users) {
            user.is_blocked = false;
            const cart = await prisma.cart.findUnique({where: {user_id: user.id}, include: {items: true}});
            const wishlist = await prisma.wishlist.findUnique({where: {user_id: user.id}, include: {items: true}});

            user.TotalOrders = user.orders.length;
            user.TotalChats = user.chats.length;
            user.TotalCartItems = cart ? cart.items.length : 0;
            user.TotalWishlistItems = wishlist ? wishlist.items.length : 0;
            const blocked = await prisma.blackList.findUnique({where: {user_id: user.user_id}});
            if (blocked) {
                user.is_blocked = true;
            }
        }

        return res.status(200).json({users});
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const getOffers = async (req, res) => {
    const role = req.role;
    const userId = req.userId;
    try {
        if (role !== "ADMIN" && role !== "USER") {
            return res.status(403).send("Insufficient permissions");
        }

        const admin = await prisma.admin.findUnique({where: {id: userId}});
        if (admin) {
            if (admin.role !== "SuperAdmin" && admin.role !== "SystemAdmin" && admin.role !== "CustomerService") {
                return res.status(403).send("Insufficient permissions");
            }
        }

        const offers = await prisma.offers.findMany({include: {product: true}});
        return res.status(200).json({offers});
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const followBrand = async (req, res) => {
    const role = req.role;
    const userId = req.userId;
    const { brandId } = req.body;
    try {
        if (role !== "USER") {
            return res.status(403).json({message: "Insufficient permissions"});
        }
        const brand = await prisma.brand.findUnique({where: {id: brandId}});
        if (!brand) {
            return res.status(404).json({message: "Brand not found"});
        }

        const isFollowing = await prisma.brand_Shopper.findFirst({where: {user_id: userId, brand_id: brandId}});
        if (isFollowing) {
            return res.status(400).json({message: "Already following this brand"});
        }

        await prisma.brand_Shopper.create({data: {user_id: userId, brand_id: brandId}});
        return res.status(201).json({message: "Brand followed successfully"});
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const unfollowBrand = async (req, res) => {
    const role = req.role;
    const userId = req.userId;
    const { brandId } = req.body;
    try {
        if (role !== "USER") {
            return res.status(403).json({message: "Insufficient permissions"});
        }
        const isFollowing = await prisma.brand_Shopper.findFirst({where: {user_id: userId, brand_id: brandId}});
        if (!isFollowing) {
            return res.status(400).json({message: "Not following this brand"});
        }

        await prisma.brand_Shopper.delete({where: {brand_id_user_id: {brand_id: brandId, user_id: userId}}});
        return res.status(200).json({message: "Brand unfollowed successfully"});
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const setStylePreference = async (req, res) => {
    const userId = req.userId;
    const { products } = req.body;
    const role = req.role;
    try {
        if (role !== "USER") {
            return res.status(403).json({message: "Insufficient permissions"});
        }

        //const user = await prisma.$queryRawUnsafe(GET_USER_BY_ID, userId);
        const user = await prisma.shopper.findUnique({where: {id: userId}});

        if (!user) {
            return res.status(404).json({message: "User not found"});
        }
        const existingPreferences = user.preferences || {};

        // const preferredProducts = [];
        // for (const productId of products) {
        //     const product = await prisma.$queryRawUnsafe(GET_PRODUCT_BY_ID_INCLUDING_CATEGORY, productId);
        //     if (product) {
        //         preferredProducts.push(product);
        //     } else {
        //         console.error(`Product with id ${productId} not found`);
        //     }
        // }

        const preferredProducts = await prisma.product.findMany({ where: { id: {in: products}}, include: {category: true}});

        const stylesSet = new Set();
        preferredProducts.forEach(product => {
          stylesSet.add(product.category.style);
        });


        const updatedProductStylePreferences = Array.from(
            new Set([
                ...(existingPreferences.productStylePreferences || []),
                ...Array.from(stylesSet),
            ])
        );

        await prisma.shopper.update({ where: { id: userId },
          data: {
            preferences: {
                ...existingPreferences,
                productStylePreferences: updatedProductStylePreferences,
            }
          }
        });

        return res.status(200).json({message: "Style preferences set successfully"});
    } catch (error) {
        console.error(error);
        return res.status(500).json({message: "Internal server error"});
    }
};

export const setColourPreferences = async (req, res) => {
    const userId = req.userId;
    const { colours, avoidedColours } = req.body;
    const role = req.role;
    try {
        if (role !== "USER") {
            return res.status(403).json({message: "Insufficient permissions"});
        }
        const user = await prisma.shopper.findUnique({ where: { id: userId } });
        if (!user) {
            return res.status(404).json({message: "User not found"});
        }
        const existingPreferences = user.preferences || {};

        const updatedColorPreferences = Array.from(
            new Set([
                ...(existingPreferences.colorPreferences? (existingPreferences.colorPreferences.primaryColors || []) : []),
                ...Array.from(colours),
            ])
        );

        const updatedAvoidedColorPreferences = Array.from(
            new Set([
                ...(existingPreferences.colorPreferences? (existingPreferences.colorPreferences.avoidColors || []) : []),
                ...Array.from(avoidedColours),
            ])
        );

        await prisma.shopper.update({ where: { id: userId },
            data: {
                preferences: {
                    ...existingPreferences,
                    colorPreferences: {
                            primaryColors: updatedColorPreferences,
                            avoidColors: updatedAvoidedColorPreferences,
                    },
                }
            }
        });

        return res.status(200).json({message: "Colour preferences set successfully"});
    } catch (error) {
        console.error(error);
        return res.status(500).json({message: "Internal server error"});
    }
};

export const setMaterialPreferences = async (req, res) => {
    const userId = req.userId;
    const { materials, avoidedMaterials } = req.body;
    const role = req.role;
    try {
        if (role !== "USER") {
            return res.status(403).json({message: "Insufficient permissions"});
        }

        const user = await prisma.shopper.findUnique({ where: { id: userId } });
        if (!user) {
            return res.status(404).json({message: "User not found"});
        }
        const existingPreferences = user.preferences || {};

        const updatedMaterialPreferences = Array.from(
            new Set([
                ...(existingPreferences.materialPreferences? (existingPreferences.materialPreferences.preferredMaterials || []) : []),
                ...Array.from(materials),
            ])
        );

        const updatedAvoidedMaterialPreferences = Array.from(
            new Set([
                ...(existingPreferences.materialPreferences? (existingPreferences.materialPreferences.avoidMaterials || []) : []),
                ...Array.from(avoidedMaterials),
            ])
        );

        await prisma.shopper.update({ where: { id: userId },
            data: {
                preferences: {
                    ...existingPreferences,
                    materialPreferences: {
                        preferredMaterials: updatedMaterialPreferences,
                        avoidMaterials: updatedAvoidedMaterialPreferences,
                    },
                }
            }
        });

        return res.status(200).json({message: "Material preferences set successfully"});
    } catch (error) {
        return res.status(500).json({message: "Internal server error"});
    }
};

export const createAvatar = async (req, res) => {
    const userId = req.userId;
    const { topType, accessoriesType, hairColor, facialHairType, clotheType,
        eyeType, eyebrowType, mouthType, skinColor, clotheColor, style, graphicType} = req.body;
    const role = req.role;
    try {
        if (role !== "USER") {
            return res.status(403).json({message: "Insufficient permissions"});
        }

        const user = await prisma.shopper.findUnique({ where: { id: userId } });
        if (!user) {
            return res.status(404).json({message: "User not found"});
        }

        const existingAvatar = await prisma.avatar.findFirst({ where: { user_id: userId } });
        if (existingAvatar) {
            const updatedAvatar = await prisma.avatar.update({
                where: { user_id: userId },
                data: {
                    topType, accessoriesType, hairColor, facialHairType, clotheType,
                    eyeType, eyebrowType, mouthType, skinColor, clotheColor, style, graphicType
                }
            });

            return res.status(200).json(updatedAvatar);
        } else {
            const newAvatar = await prisma.avatar.create({
                data: {
                    topType, accessoriesType, hairColor, facialHairType, clotheType,
                    eyeType, eyebrowType, mouthType, skinColor, clotheColor, style, graphicType, user_id: userId
                }
            });

            return res.status(201).json(newAvatar);
        }
    } catch (error) {
        return res.status(500).json({message: "Internal server error"});
    }
};

export const getAvatar = async (req, res) => {
    const userId = req.userId;
    const role = req.role;
    try {
        if (role !== "USER") {
            return res.status(403).json({message: "Insufficient permissions"});
        }

        const user = await prisma.shopper.findFirst({ where: { id: userId } });
        if (!user) {
            return res.status(404).json({message: "User not found"});
        }

        const existingAvatar = await prisma.avatar.findFirst({ where: { user_id: userId } });
        if (existingAvatar) {
            return res.status(200).json(existingAvatar);
        } else {
            return res.status(404).json({message: "Avatar not found"});
        }
    } catch (error) {
        return res.status(500).json({message: "Internal server error"});
    }
};

export const uploadProfileImage = async (req, res) => {
    const userId = req.userId;
    const imageBuffer = req.file.buffer;
    const role = req.role;
    try {
        if (role !== "USER") {
            return res.status(403).json({message: "Insufficient permissions"});
        }

        if (!imageBuffer) {
            return res.status(400).send("No image file provided");
        }
        const containerClient = blobServiceClient.getContainerClient(Profile_Picture_Container_Name);

        const imageName = `${userId}-${Date.now()}-${req.file.originalname}`;
        const imageUrl = await uploadImageToAzure(imageBuffer, imageName, containerClient);

        await prisma.shopper.update({
            where: { id: userId },
            data: {
                image: imageUrl,
            },
        });

        return res.status(200).json({ message: "Profile image uploaded successfully", imageUrl });
    } catch (error) {
        console.error(error);
        return res.status(500).send("Error uploading image");
    }
};

export const deleteProfileImage = async (req, res) => {
    const userId = req.userId;
    const role = req.role;
    try {
        if (role !== "USER") {
            return res.status(403).json({ message: "Insufficient permissions" });
        }

        const user = await prisma.shopper.findFirst({ where: { id: userId } });
        const containerClient = blobServiceClient.getContainerClient(Profile_Picture_Container_Name);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const imageUrl = user.image;
        // Extract the image name from URL & decode it to get the original name with special characters
        const imageName = decodeURIComponent(imageUrl.split("/").pop());

        // Delete the image from Azure Blob Storage
        const blockBlobClient = containerClient.getBlockBlobClient(imageName);
        await blockBlobClient.delete();

        await prisma.shopper.update({
            where: { id: userId },
            data: {
                image: null,
            },
        });

        return res.status(200).json({ message: "Profile image deleted successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const updateUser = async (req, res) => {
    const userId = req.userId;
    const { email, firstName, lastName, userName, gender, phone, city } = req.body;
    const role = req.role;
    try {
        if (role !== "USER") {
            return res.status(403).send("Insufficient permissions");
        }

        if (!email && !firstName && !lastName && !userName && !gender && !phone && !city) {
            return res.status(400).json({ message: "Please, enter at least one field to update" });
        }

        const user = await prisma.shopper.findUnique({ where: { id: userId } });
        const userObj = await prisma.user.findUnique({where: {id: user.user_id}});

        let newPhone = user.phone;
        let newCity = user.city;
        let newFirstName = user.firstName;
        let newLastName = user.lastName;
        let newGender = user.gender;
        let newUserName = user.username;

        if (phone) {
            const existingPhone = await prisma.shopper.findUnique({where: {phone}});
            if (existingPhone) {
                return res.status(400).json({message: "phone already exists"});
            }
            newPhone = phone;
        }

        if (userName) {
            const ExistedUsername = await prisma.admin.findUnique({where: {username}});
            if (ExistedUsername) {
                return res.status(400).json({ message: "username already exists" });
            }
            newUserName = userName;
        }

        if (email) {
            if (email === userObj.email) {
                return res.status(400).json({ message: "Please, enter different email, error same email" });
            }

            const existingUser = await prisma.user.findUnique({where: {email}});
            if (existingUser) {
                return res.status(400).json({message: "email already exists"});
            }
            await prisma.user.update({where: {id: userObj.id}, data: {email}});
        }

        if (city) newCity = city;
        if (firstName) newFirstName = firstName;
        if (lastName) newLastName = lastName;
        if (gender) newGender = gender;

        const updatedUser = await prisma.shopper.update({
            where: { id: userId },
            data: {
                phone: newPhone,
                city: newCity,
                firstName: newFirstName,
                lastName: newLastName,
                gender: newGender,
                username: newUserName
        }});

        return res.status(201).json({ message: "User updated successfully" , user: updatedUser});
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}