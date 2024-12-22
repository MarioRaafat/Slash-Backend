import prisma from "../utils/prismaClient.js";
import {blobServiceClient, uploadImageToAzure, Brand_Image_Container_Name, Product_Image_Container_Name} from "../utils/constants.js";


export const getAllBrands = async (req, res) => {
    const role = req.role;
    const userId = req.userId;
    try {
        if (role !== "ADMIN" && role !== "USER") {
            return res.status(403).send("Insufficient permissions");
        }

        let followedBrands = []
        const admin = await prisma.admin.findUnique({where: {id: userId}});
        if (admin) {
            if (admin.role !== "SuperAdmin" && admin.role !== "BrandManager" && admin.role !== "SystemAdmin") {
                return res.status(403).send("Insufficient permissions");
            }
        } else if (role === "USER") {
            const Brands = await prisma.brand_Shopper.findMany({where: {user_id: userId}});
            followedBrands = Brands.map(brand => brand.brand_id);
        }

        const brands = await prisma.brand.findMany({include: {user: true}});

        for (const brand of brands) {
            const products = await prisma.product.findMany({where: {brand_id: brand.id}, include: {wishlistItems: true, productVariants: {include: {orderItems: true}}}});

            brand.followed = followedBrands.includes(brand.id);

            brand.totalProducts = products.length;
            brand.totalWishlist = products.reduce((acc, product) => acc + product.wishlistItems.length, 0);
            brand.totalOrders = products.reduce((acc, product) => acc + product.productVariants.reduce((acc, variant) => acc + variant.orderItems.length, 0), 0);

            brand.is_blocked = false;
            const blocked = await prisma.blackList.findUnique({where: {user_id: brand.user_id}});
            if (blocked) {
                brand.is_blocked = true;
            }
        }

        return res.status(200).json({brands});
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const getBrandById = async (req, res) => {
    const {id} = req.params;
    try {
        const brand = await prisma.brand.findFirst({where: {id}});
        if (!brand) {
             return res.status(404).json({message: "Brand not found"});
        }
        return res.status(200).json({brand: brand});
    } catch (error) {
        return res.status(500).json({message: "Internal server error"});
    }
}

export const getBrandCategories = async (req, res) => {
    const userId = req.userId;
    const role = req.role;
    try {
        if (role === "USER") {
            return res.status(403).json({message: "Insufficient permissions"});
        }
        const brand = await prisma.brand.findUnique({where: {id: userId}});
        if (!brand) {
            return res.status(404).json({message: "Brand not found"});
        }
        const BrandCategories = await prisma.size.findMany({where: {brand_id: userId}, distinct: ["category_id"], include: {category: true}});
        const categories = [];

        for (const BrandCategory of BrandCategories) {
            const category = BrandCategory.category;
            const BrandCategorySizes = await prisma.size.findMany({where: {category_id: category.id, brand_id: userId}});
            const sizes = [];
            for (const size of BrandCategorySizes) {
                sizes.push(size.size);
            }
            category.sizes = sizes;
            categories.push(category);
        }

        return res.status(200).json({category: categories});
    } catch (error) {
        return res.status(500).json({message: "Internal server error"});
    }
};

export const getFollowers = async (req, res) => {
    const userId = req.userId;
    const BrandId = req.params.id;
    const role = req.role;
    try {
        if (role === "USER") {
            return res.status(403).json({message: "Insufficient permissions"});
        }

        const brand = role === "BRAND" ? await prisma.brand.findUnique({where: {id: userId}}) : null;
        if (brand && brand.id !== BrandId) {
            return res.status(403).json({message: "Insufficient permissions"});
        }

        const followers = await prisma.brand_Shopper.findMany({where: {brand_id: userId}, select: {user: true}});
        return res.status(200).json(followers);
    } catch (error) {
        return res.status(500).json({message: "Internal server error"});
    }
};

export const getBrandProducts = async (req, res) => {
    const userId = req.userId;
    const role = req.role;
    try {
        if (role === "USER") {
            return res.status(403).json({message: "Insufficient permissions"});
        }

        const brand = await prisma.brand.findUnique({where: {id: userId}});
        if (!brand) {
            return res.status(404).json({message: "Brand not found"});
        }

        const products = await prisma.product.findMany({where: {brand_id: userId}});
        return res.status(200).json(products);
    } catch (error) {
        return res.status(500).json({message: "Internal server error"});
    }
};

export const postCategorySizes = async (req, res) => {
    const userId = req.userId;
    const role = req.role;
    const {category_id, sizeTag, waist, length, chest, arm_length, foot_length, bicep} = req.body;
    try {
        if (role !== "BRAND") {
            return res.status(403).json({message: "Insufficient permissions"});
        }

        const brand = await prisma.brand.findUnique({where: {id: userId}});
        if (!brand) {
            return res.status(404).json({message: "Brand not found"});
        }

        const category = await prisma.category.findUnique({where: {id: category_id}});
        if (!category) {
            return res.status(404).json({message: "Category not found"});
        }

        const existedSize = await prisma.size.findFirst({where: {category_id, brand_id: userId, size: sizeTag}});
        if (existedSize) {
            return res.status(400).json({message: "Size already exists"});
        }

        if (category.name === "Shirts" || category.name === "Sweaters" || category.name === "Hoodies") {
            if (!chest || !arm_length || !bicep || !length) {
                return res.status(400).json({message: "Missing required fields"});
            }
        } else if (category.name === "Pants" || category.name === "Shorts" || category.name === "Skirts") {
            if (!waist || !length) {
                return res.status(400).json({message: "Missing required fields"});
            }
        } else if (category.name === "Shoes") {
            if (!foot_length) {
                return res.status(400).json({message: "Missing required fields"});
            }
        } else if (category.name === "Jackets") {
            if (!chest || !arm_length || !length) {
                return res.status(400).json({message: "Missing required fields"});
            }
        } else if (category.name === "Dresses") {
            return res.status(400).json({message: "Missing required fields"});
        } else if (category.name === "Accessories" || category.name === "Hat" || category.name === "Bag") {
            return res.status(400).json({message: "No need to add sizes for this category"});
        } else {
            return res.status(400).json({message: "Invalid category"});
        }

        const size = await prisma.size.create({data: {
            category_id,
            brand_id: userId,
            size: sizeTag,
            waist, length,
            chest,
            arm_length,
            foot_length,
            bicep,
        }});

        return res.status(201).json(size);
    } catch (error) {
        return res.status(500).json({message: "Internal server error"});
    }
};

export const postProduct = async (req, res) => {
    const userId = req.userId;
    const role = req.role;
    const {name, description, price, category_id, sizes, colours, tags, discount, material} = req.body;
    try {
        if (role !== "BRAND") {
            return res.status(403).json({message: "Insufficient permissions"});
        }

        const brand = await prisma.brand.findUnique({where: {id: userId}});
        if (!brand) {
            return res.status(404).json({message: "Brand not found"});
        }

        if (!name || !description || !price || !category_id || !sizes.length || !colours.length || !material || !tags.length) {
            return res.status(400).json({message: "Missing required fields in the request body"});
        }

        if (tags.length < 7) {
            return res.status(400).json({message: "Please add at least 7 tags"});

        }
        const category = await prisma.category.findUnique({where: {id: category_id}});
        if (!category) {
            return res.status(404).json({message: "Category not found"});

        }

        const product = await prisma.product.create({data: {
                name, description, price, category_id, brand_id: userId, material, discount, approved: false
            }});

        for (const colour of colours) {
            const existedColour = await prisma.colour.findFirst({where: {name: colour.name}});
            if (!existedColour) {
                return res.status(404).json({message: "Colour not found"});
            }
            await prisma.product_Colour.create({data: {product_id: product.id, colour_id: existedColour.id, percentage: colour.percentage}});
        }

        for (const size of sizes) {
            if (!size.size || !size.quantity) {
                return res.status(400).json({message: "Missing required fields in the size object"});
            }
            const Size = await prisma.size.findFirst({where: {category_id: category_id, size: size.size, brand_id: userId}});
            await prisma.productVariant.create({data: {product_id: product.id, size_id: Size.id, quantity: size.quantity}});
        }

        for (const tag of tags) {
            let Tag;
            Tag = await prisma.tag.findFirst({where: {name: tag}});
            if (!Tag) {
                Tag = await prisma.tag.create({data: {name: tag}});
            }
            await prisma.product_Tag.create({data: {product_id: product.id, tag_id: Tag.id}});
        }

        return res.status(201).json({message: "Product added successfully", product});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "Internal server error"});
    }
};

export const uploadBrandImage = async (req, res) => {
    const userId = req.userId;
    const role = req.role;
    const file = req.file;
    try {
        if (role !== "BRAND") {
            return res.status(403).json({message: "Insufficient permissions"});
        }

        const brand = await prisma.brand.findUnique({where: {id: userId}});
        if (!brand) {
            return res.status(404).json({message: "Brand not found"});
        }

        if (!file) {
            return res.status(400).json({message: "No file uploaded"});
        }

        const containerClient = blobServiceClient.getContainerClient(Brand_Image_Container_Name);
        const imageName = `${userId}-${file.originalname}`;
        const imageURL = await uploadImageToAzure(file.buffer, imageName, containerClient);

        const updatedBrand = await prisma.brand.update({where: {id: userId}, data: {logo: imageURL}});

        return res.status(201).json({message: "Image uploaded successfully", image: imageURL});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "Internal server error"});
    }
};

export const uploadProductImage = async (req, res) => {
    const userId = req.userId;
    const role = req.role;
    const file = req.file;
    const productId = req.params.id;
    try {
        if (role !== "BRAND") {
            return res.status(403).json({message: "Insufficient permissions"});
        }

        const brand = await prisma.brand.findUnique({where: {id: userId}});
        if (!brand) {
            return res.status(404).json({message: "Brand not found"});
        }

        const product = await prisma.product.findUnique({where: {id: productId}});
        if (!product) {
            return res.status(404).json({message: "Product not found"});
        }

        if (product.brand_id !== userId) {
            return res.status(403).json({message: "Insufficient permissions"});
        }

        if (!file) {
            return res.status(400).json({message: "No file uploaded"});
        }

        const containerClient = blobServiceClient.getContainerClient(Product_Image_Container_Name);
        const imageExtension = file.originalname.split(".").pop();
        const imageName = `${productId}-${product.name}.${imageExtension}`;
        const imageURL = await uploadImageToAzure(file.buffer, imageName, containerClient);

        await prisma.product.update({where: {id: productId}, data: {image: imageURL}});

        return res.status(201).json({message: "Image uploaded successfully", image: imageURL});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "Internal server error"});
    }
};

export const updateBrand = async (req, res) => {
    const userId = req.userId;
    const role = req.role;
    const {name, description, email, phone, website, facebook, instagram} = req.body;
    try {
        if (role !== "BRAND") {
            return res.status(403).json({message: "Insufficient permissions"});
        }

        if (!name && !description && !email && !phone && !website && !facebook && !instagram) {
            return res.status(400).json({message: "Please, enter at least one field to update"});
        }

        const brand = await prisma.brand.findUnique({where: {id: userId}});
        const userObj = await prisma.user.findUnique({where: {id: brand.user_id}});

        let newName = brand.name;
        let newDescription = brand.description;
        let newPhone = brand.phone;
        let newWebsite = brand.website;
        let newFacebook = brand.facebook;
        let newInstagram = brand.instagram;

        if (name) {
            const existedBrand = await prisma.brand.findFirst({where: {name}});
            if (existedBrand) {
                return res.status(400).json({message: "Brand name already exists"});
            }
            newName = name;
        }

        if (phone) {
            const existedBrand = await prisma.brand.findFirst({where: {phone}});
            if (existedBrand) {
                return res.status(400).json({message: "Phone number already exists"});
            }
            newPhone = phone;
        }

        if (email) {
            const existedUser = await prisma.user.findFirst({where: {email}});
            if (existedUser) {
                return res.status(400).json({message: "Email already exists"});
            }
            await prisma.user.update({where: {id: userObj.id}, data: {email}});
        }

        if (website) newWebsite = website;
        if (facebook) newFacebook = facebook;
        if (instagram) newInstagram = instagram;
        if (description) newDescription = description;

        const updatedBrand = await prisma.brand.update({where: {id: userId}, data: {
            name: newName,
            description: newDescription,
            phone: newPhone,
            website: newWebsite,
            facebook: newFacebook,
            instagram: newInstagram
        }});

        return res.status(200).json({message: "Brand updated successfully", brand: updatedBrand});

    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "Internal server error"});
    }
};

export const updateCategorySize = async (req, res) => {
    const userId = req.userId;
    const role = req.role;
    const {sizeId, sizeTag, waist, length, chest, arm_length, foot_length, bicep} = req.body;
    try {
        if (role !== "BRAND") {
            return res.status(403).json({message: "Insufficient permissions"});
        }

        const brand = await prisma.brand.findUnique({where: {id: userId}});
        if (!brand) {
            return res.status(404).json({message: "Brand not found"});
        }

        const size = await prisma.size.findUnique({where: {id: sizeId}});
        if (!size) {
            return res.status(404).json({message: "Size not found"});
        }

        const category = await prisma.category.findUnique({where: {id: size.category_id}});

        if (size.brand_id !== userId) {
            return res.status(403).json({message: "Insufficient permissions"});
        }

        if (sizeTag) {
            const existedSize = await prisma.size.findFirst({where: {category_id: size.category_id, brand_id: userId, size: sizeTag}});
            if (existedSize) {
                return res.status(400).json({message: "Size already exists"});
            }
        }

        if (category.name === "Shirts" || category.name === "Sweaters" || category.name === "Hoodies") {
            if (!chest || !arm_length || !bicep || !length) {
                return res.status(400).json({message: "Missing required fields"});
            }
        } else if (category.name === "Pants" || category.name === "Shorts" || category.name === "Skirts") {
            if (!waist || !length) {
                return res.status(400).json({message: "Missing required fields"});
            }
        } else if (category.name === "Shoes") {
            if (!foot_length) {
                return res.status(400).json({message: "Missing required fields"});
            }
        } else if (category.name === "Jackets") {
            if (!chest || !arm_length || !length) {
                return res.status(400).json({message: "Missing required fields"});
            }
        } else if (category.name === "Dresses") {
            return res.status(400).json({message: "Missing required fields"});
        } else if (category.name === "Accessories" || category.name === "Hat" || category.name === "Bag") {
            return res.status(400).json({message: "No need to add sizes for this category"});
        } else {
            return res.status(400).json({message: "Invalid category"});
        }

        await prisma.size.update({where: {id: sizeId}, data: {
            size: sizeTag, waist, length, bicep, foot_length, chest, arm_length
        }});

        return res.status(200).json({message: "Size updated successfully"});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "Internal server error"});
    }
};

export const deleteBrandImage = async (req, res) => {
    const userId = req.userId;
    const role = req.role;
    try {
        if (role !== "BRAND") {
            return res.status(403).json({message: "Insufficient permissions"});
        }

        const brand = await prisma.brand.findUnique({where: {id: userId}});
        if (!brand) {
            return res.status(404).json({message: "Brand not found"});
        }

        const containerClient = blobServiceClient.getContainerClient(Brand_Image_Container_Name);
        const imageName = decodeURIComponent(brand.logo.split("/").pop());
        const blobClient = containerClient.getBlobClient(imageName);
        await blobClient.delete();

        await prisma.brand.update({where: {id: userId}, data: {logo: null}});
        return res.status(200).json({message: "Image deleted successfully"});
    } catch (error) {
        return res.status(500).json({message: "Internal server error"});
    }
};

export const deleteProductImage = async (req, res) => {
    const userId = req.userId;
    const role = req.role;
    const {productId} = req.params;
    try {
        if (role !== "BRAND") {
            return res.status(403).json({message: "Insufficient permissions"});
        }

        const brand = await prisma.brand.findUnique({where: {id: userId}});
        if (!brand) {
            return res.status(404).json({message: "Brand not found"});
        }

        const product = await prisma.product.findUnique({where: {id: productId}});
        if (!product) {
            return res.status(404).json({message: "Product not found"});
        }

        const containerClient = blobServiceClient.getContainerClient(Product_Image_Container_Name);
        const imageName = decodeURIComponent(product.image.split("/").pop());
        const blobClient = containerClient.getBlobClient(imageName);
        await blobClient.delete();

        await prisma.product.update({where: {id: productId}, data: {image: null}});
        return res.status(200).json({message: "Image deleted successfully"});
    } catch (error) {
        return res.status(500).json({message: "Internal server error"});
    }
};

export const deleteProduct = async (req, res) => {
    const userId = req.userId;
    const role = req.role;
    const {productId} = req.body;
    try {
        if (role === "USER") {
            return res.status(403).json({message: "Insufficient permissions"});
        }

        const brand = role === "BRAND" ? await prisma.brand.findUnique({where: {id: userId}}) : null;

        const product = await prisma.product.findUnique({where: {id: productId}});
        if (!product) {
            return res.status(404).json({message: "Product not found"});
        }

        if (brand && brand.id !== product.brand_id) {
            return res.status(404).json({message: "Insufficient permissions"});
        }

        await prisma.product.delete({where: {id: productId}});
        return res.status(200).json({message: "Product deleted successfully"});
    } catch (error) {
        return res.status(500).json({message: "Internal server error"});
    }
};

export const deleteProductVariant = async (req, res) => {
    const userId = req.userId;
    const role = req.role;
    const {variantId} = req.body;
    try {
        if (role === "USER") {
            return res.status(403).json({message: "Insufficient permissions"});
        }

        const brand = role === "BRAND" ? await prisma.brand.findUnique({where: {id: userId}}) : null;

        const variant = await prisma.productVariant.findUnique({where: {id: variantId}});
        if (!variant) {
            return res.status(404).json({message: "Variant not found"});
        }

        const product = await prisma.product.findUnique({where: {id: variant.product_id}});
        if (brand && brand.id !== product.brand_id) {
            return res.status(404).json({message: "Insufficient permissions"});
        }

        await prisma.productVariant.delete({where: {id: variantId}});
        return res.status(200).json({message: "Variant deleted successfully"});
    } catch (error) {
        return res.status(500).json({message: "Internal server error"});
    }
}

export const deleteCategorySize = async (req, res) => {
    const userId = req.userId;
    const role = req.role;
    const {sizeId} = req.body;
    try {
        if (role === "USER") {
            return res.status(403).json({message: "Insufficient permissions"});
        }

        const brand = role === "BRAND" ? await prisma.brand.findUnique({where: {id: userId}}) : null;

        const size = await prisma.size.findUnique({where: {id: sizeId}});
        if (!size) {
            return res.status(404).json({message: "Size not found"});
        }

        if (brand && brand.id !== size.brand_id) {
            return res.status(403).json({message: "Insufficient permissions"});
        }

        await prisma.size.delete({where: {id: sizeId}});
        return res.status(200).json({message: "Size deleted successfully"});
    } catch (error) {
        return res.status(500).json({message: "Internal server error"});
    }
};