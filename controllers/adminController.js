import prisma from "../utils/prismaClient.js";
import bcrypt from "bcrypt";
import {
    uploadImageToAzure,
    blobServiceClient,
    Offer_Image_Container_Name,
} from "../utils/constants.js";

export const getAdmins = async (req, res) => {
    const role = req.role;
    const userId = req.userId;
    try {
        if (role !== "ADMIN") {
            return res.status(403).send("Insufficient permissions");
        }
        const admin = await prisma.admin.findUnique({where: {id: userId}});
        if (admin.role !== "SuperAdmin") {
            return res.status(403).send("Insufficient permissions");
        }
        const admins = await prisma.admin.findMany({});
        for (const admin of admins) {
            const user = await prisma.user.findUnique({where: {id: admin.user_id}});
            admin.email = user.email;
        }

        return res.status(200).json({admins});
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const getReviews = async (req, res) => {
    const role = req.role;
    const userId = req.userId;
    const {id} = req.params;
    try {
        if (role !== "ADMIN") {
            return res.status(403).send("Insufficient permissions");
        }

        const admin = await prisma.admin.findUnique({where: {id: userId}});
        if (admin.role !== "SuperAdmin" && admin.role !== "CustomerService" && admin.role !== "SystemAdmin") {
            return res.status(403).send("Insufficient permissions");
        }

        const reviews = await prisma.review.findMany({
            include: {
                product: true,
            },
            where: {user_id: id},
        });

        for (const review of reviews) {
            const likes = await prisma.review_Shopper.aggregate({
                _count: {
                    id: true,
                },
                where: {
                    review_id: review.id,
                },
            });
            review.likes = likes._count.id;
        }


        return res.status(200).json({reviews});
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const createAdmin = async (req, res) => {
    const role = req.role;
    const userId = req.userId;
    const { email, password, adminRole, username } = req.body;
    try {
        if (role !== "ADMIN") {
            return res.status(403).send("Insufficient permissions");
        }

        const admin = await prisma.admin.findUnique({where: {id: userId}});
        if (admin.role !== "SuperAdmin") {
            return res.status(403).send("Insufficient permissions");
        }

        const adminExists = await prisma.user.findUnique({where: {email}});
        if (adminExists) {
            return res.status(400).json({ message: "email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const userObj = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                role: "ADMIN",
            },
        });

        if (adminRole !== "CustomerService" && adminRole !== "BrandManager" && adminRole !== "SystemAdmin") {
            return res.status(400).json({ message: "Invalid role" });
        }

        const newAdmin = await prisma.admin.create({
            data: {
                user_id: userObj.id,
                role: adminRole,
                username,
            },
        });

        return res.status(201).json(newAdmin);
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const getProductsWaitingList = async (req, res) => {
    const role = req.role;
    const userId = req.userId;
    try {
        if (role !== "ADMIN") {
            return res.status(403).send("Insufficient permissions");
        }

        const admin = await prisma.admin.findUnique({where: {id: userId}});
        if (admin.role !== "SuperAdmin" && admin.role !== "BrandManager" && admin.role !== "SystemAdmin") {
            return res.status(403).send("Insufficient permissions");
        }

        const products = await prisma.product.findMany({
            where: {approved: false},
            include: {
                brand: true,
                colours: true,
                category: true,
                tags: true,
                images: true,
                productVariants: {select: {size: {select: {size: true}}}},
            }
        });

        return res.status(200).json({products});
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const approveProduct = async (req, res) => {
    const role = req.role;
    const userId = req.userId;
    const { id } = req.params;
    try {
        if (role !== "ADMIN") {
            return res.status(403).send("Insufficient permissions");
        }

        const admin = await prisma.admin.findUnique({where: {id: userId}});
        if (admin.role !== "SuperAdmin" && admin.role !== "BrandManager" && admin.role !== "SystemAdmin") {
            return res.status(403).send("Insufficient permissions");
        }

        const product = await prisma.product.findUnique({where: {id}});
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        await prisma.product.update({
            where: {id},
            data: {
                approved: true,
            },
        });

        return res.status(200).json({ message: "Product approved successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const rejectProduct = async (req, res) => {
    const role = req.role;
    const userId = req.userId;
    const { id } = req.body;
    try {
        console.log(id);
        if (role !== "ADMIN") {
            return res.status(403).send("Insufficient permissions");
        }

        const admin = await prisma.admin.findUnique({where: {id: userId}});
        if (admin.role !== "SuperAdmin" && admin.role !== "BrandManager" && admin.role !== "SystemAdmin") {
            return res.status(403).send("Insufficient permissions");
        }

        const product = await prisma.product.findUnique({where: {id}});
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        if (product.approved) {
            return res.status(400).json({ message: "Product already approved" });
        }

        await prisma.product.delete({where: {id}});

        return res.status(200).json({ message: "Product rejected successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const uploadOffer = async (req, res) => {
    const role = req.role;
    const userId = req.userId;
    const { discount, listNumber, startDate, endDate, productId } = req.body;
    try {
        if (role !== "ADMIN") {
            return res.status(403).send("Insufficient permissions");
        }

        const admin = await prisma.admin.findUnique({where: {id: userId}});
        if (admin.role !== "SuperAdmin" && admin.role !== "SystemAdmin"&& admin.role !== "CustomerService") {
            return res.status(403).send("Insufficient permissions");
        }

        if (!discount || !listNumber || !endDate || !productId) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const product = await prisma.product.findUnique({where: {id: productId}});
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        const existedOffer = await prisma.offers.findFirst({where: {product_id: productId}});
        if (existedOffer) {
            return res.status(400).json({ message: "The product already has an offer" });
        }

        await prisma.product.update({
            where: {id: productId},
            data: {
                discount,
            },
        });

        const offer = await prisma.offers.create({
            data: {
                discount,
                prev_discount: product.discount,
                list_number: listNumber,
                start_date: startDate? startDate: new Date(),
                end_date: endDate,
                product_id: productId,
            },
        });

        return res.status(201).json({ message: "Offer uploaded successfully", offer });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const deleteOffer = async (req, res) => {
    const role = req.role;
    const userId = req.userId;
    const { id } = req.params;
    try {
        if (role !== "ADMIN") {
            return res.status(403).send("Insufficient permissions");
        }

        const admin = await prisma.admin.findUnique({where: {id: userId}});
        if (admin.role !== "SuperAdmin" && admin.role !== "SystemAdmin" && admin.role !== "CustomerService") {
            return res.status(403).send("Insufficient permissions");
        }

        const offer = await prisma.offers.findUnique({where: {id}});
        if (!offer) {
            return res.status(404).json({ message: "Offer not found" });
        }

        const product = await prisma.product.update({
            where: {id: offer.product_id},
            data: {
                discount: offer.prev_discount,
            },
        });

        if (offer.image) {
            const containerClient = blobServiceClient.getContainerClient(Offer_Image_Container_Name);
            const imageUrl = offer.image;
            // Extract the image name from URL & decode it to get the original name with special characters
            const imageName = decodeURIComponent(imageUrl.split("/").pop());

            // Delete the image from Azure Blob Storage
            const blockBlobClient = containerClient.getBlockBlobClient(imageName);
            await blockBlobClient.delete();
        }

        await prisma.offers.delete({where: {id}});

        return res.status(200).json({ message: "Offer deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const blockUser = async (req, res) => {
    const role = req.role;
    const userId = req.userId;
    const { comment, id } = req.body;
    try {
        if (role !== "ADMIN") {
            return res.status(403).send("Insufficient permissions");
        }

        const admin = await prisma.admin.findUnique({where: {id: userId}});
        const user = await prisma.user.findUnique({where: {id}});
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (admin.role !== "SuperAdmin" && admin.role !== "SystemAdmin") {
            if ((user.role === "USER" && admin.role !== "CustomerService") || (admin.role !== "BrandManager" && user.role === "BRAND")) {
                return res.status(403).send("Insufficient permissions");
            }
        }

        if (user.role === "ADMIN" && admin.role !== "SuperAdmin") {
            return res.status(400).json({ message: "You can't block an admin" });
        }

        if (admin.user_id === id) {
            return res.status(400).json({ message: "You can't block yourself" });
        }

        const blocked = await prisma.blackList.findUnique({where: {user_id: id}});
        if (blocked) {
            return res.status(400).json({ message: "User already blocked" });
        }

        await prisma.blackList.create({
            data: {
                user_id: id,
                comment,
            },
        });

        return res.status(200).json({ message: "User blocked successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const unblockUser = async (req, res) => {
    const role = req.role;
    const userId = req.userId;
    const { id } = req.params;
    try {
        if (role !== "ADMIN") {
            return res.status(403).send("Insufficient permissions");
        }

        const admin = await prisma.admin.findUnique({where: {id: userId}});
        const user = await prisma.user.findUnique({where: {id}});

        if (admin.role !== "SuperAdmin" && admin.role !== "SystemAdmin") {
            if ((user.role === "USER" && admin.role !== "CustomerService") || (admin.role !== "BrandManager" && user.role === "BRAND")) {
                return res.status(403).send("Insufficient permissions");
            }
        }

        const blocked = await prisma.blackList.findUnique({where: {user_id: id}});
        if (!blocked) {
            return res.status(400).json({ message: "User not blocked" });
        }

        await prisma.blackList.delete({where: {user_id: id}});

        return res.status(200).json({ message: "User unblocked successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const updateAdmin = async (req, res) => {
    const role = req.role;
    const userId = req.userId;
    const { email, username } = req.body;
    try {
        if (role !== "ADMIN") {
            return res.status(403).send("Insufficient permissions");
        }

        const admin = await prisma.admin.findUnique({where: {id: userId}});
        const userObj = await prisma.user.findUnique({where: {id: admin.user_id}});

        if (admin.role === "SuperAdmin") {
            return res.status(400).json({ message: "Don't touch my Super Admin again" });
        }

        if (!email && !username) {
            return res.status(400).json({ message: "Please, enter at least one field to update" });
        }

        let newEmail = userObj.email;
        let newUsername = admin.username;

        if (username) {
            const ExistedUsername = await prisma.admin.findUnique({where: {username}});
            if (ExistedUsername) {
                return res.status(400).json({ message: "username already exists" });
            }
            newUsername = username;
        }

        if (email) {
            const ExistedEmail = await prisma.user.findUnique({where: {email}});
            if (ExistedEmail) {
                return res.status(400).json({ message: "email already exists" });
            }
            newEmail = email;
        }

        await prisma.user.update({
            where: {id: userObj.id},
            data: {
                email: newEmail,
            },
        })

        const updatedAdmin = await prisma.admin.update({
            where: {id: userId},
            data: {
                username: newUsername,
            },
        });

        return res.status(201).json({ message: "Admin updated successfully", admin: updatedAdmin });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const changeRole = async (req, res) => {
    const role = req.role;
    const userId = req.userId;
    const { adminRole, adminId } = req.body;
    try {
        if (role !== "ADMIN") {
            return res.status(403).send("Insufficient permissions");
        }

        const admin = await prisma.admin.findUnique({where: {id: userId}});
        if (admin.role !== "SuperAdmin") {
            return res.status(403).send("Insufficient permissions");
        }

        if (adminRole !== "CustomerService" && adminRole !== "BrandManager" && adminRole !== "SystemAdmin") {
            return res.status(400).json({ message: "Invalid role" });
        }

        const adminExists = await prisma.admin.findUnique({where: {id: adminId}});
        if (!adminExists) {
            return res.status(400).json({ message: "Admin not found" });
        }

        if (adminExists.role === adminRole) {
            return res.status(400).json({ message: "Admin already has this role" });
        }

        const updatedAdmin = await prisma.admin.update({
            where: {id: adminId},
            data: {
                role: adminRole,
            },
        });

        return res.status(201).json({admin: updatedAdmin});
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const uploadOfferImage = async (req, res) => {
    const userId = req.userId;
    const image = req.file;
    const role = req.role;
    const { id } = req.params;
    try {
        if (role !== "ADMIN") {
            return res.status(403).json({message: "Insufficient permissions"});
        }

        const admin = await prisma.admin.findUnique({where: {id: userId}});
        if (admin.role !== "SuperAdmin" && admin.role !== "SystemAdmin" && admin.role !== "CustomerService") {
            return res.status(403).json({message: "Insufficient permissions"});
        }

        if (!image) {
            return res.status(400).send("No image file provided");
        }

        const offer = await prisma.offers.findUnique({where: {id}});
        if (!offer) {
            return res.status(404).json({ message: "Offer not found" });
        } else if (offer.image) {
            return res.status(400).json({ message: "Image already exists" });
        }

        const containerClient = blobServiceClient.getContainerClient(Offer_Image_Container_Name);

        const imageName = `${id}-${Date.now()}-${req.file.originalname}`;
        const imageUrl = await uploadImageToAzure(image.buffer, imageName, containerClient);

        await prisma.offers.update({
            where: { id: id },
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

export const deleteOfferImage = async (req, res) => {
    const userId = req.userId;
    const role = req.role;
    const { id } = req.params;
    try {
        if (role !== "ADMIN") {
            return res.status(403).json({ message: "Insufficient permissions" });
        }

        const admin = await prisma.admin.findUnique({where: {id: userId}});
        if (admin.role !== "SuperAdmin" && admin.role !== "SystemAdmin" && admin.role !== "CustomerService") {
            return res.status(403).json({ message: "Insufficient permissions" });
        }

        const offer = await prisma.offers.findUnique({where: {id}});
        if (!offer) {
            return res.status(404).json({ message: "Offer not found" });
        } else if (!offer.image) {
            return res.status(400).json({ message: "No image found" });
        }

        try {
            const containerClient = blobServiceClient.getContainerClient(Offer_Image_Container_Name);
            const imageUrl = offer.image;
            // Extract the image name from URL & decode it to get the original name with special characters
            const imageName = decodeURIComponent(imageUrl.split("/").pop());

            // Delete the image from Azure Blob Storage
            const blockBlobClient = containerClient.getBlockBlobClient(imageName);
            await blockBlobClient.delete();
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Error deleting image" });
        }

        await prisma.offers.update({
            where: { id },
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

export const deleteAdmin = async (req, res) => {
    const role = req.role;
    const userId = req.userId;
    const { id } = req.params;
    try {
        if (role !== "ADMIN") {
            return res.status(403).send("Insufficient permissions");
        }

        const admin = await prisma.admin.findUnique({where: {id: userId}});
        if (admin.role !== "SuperAdmin") {
            return res.status(403).send("Insufficient permissions");
        } else if (admin.id === id) {
            return res.status(400).json({ message: "You can't delete yourself" });
        }

        const deletedAdmin = await prisma.admin.delete({where: {id}});
        const userObj = await prisma.user.delete({where: {id: deletedAdmin.user_id}});

        return res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};
