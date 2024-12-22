import prisma from "../utils/prismaClient.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {compare} from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

const createToken = async (email, id, role) => {
    return jwt.sign({email, id, role}, process.env.JWT_KEY, {
        expiresIn: "30d",
    });
};

export const login = async (req, res) => {

    const { email, password } = req.body;
    if (!email ||!password) {
        return res.status(400).json({message: "Missing required fields"});
    }
    try {
        const existUser = await prisma.user.findUnique({where: {email}});
        if (!existUser) {
            return res.status(404).json({message: "User not found"});
        }

        const isValidPassword = await compare(password, existUser.password);
        if (!isValidPassword){
            return res.status(401).json({message: "Wrong password"});
        }

        const blocked = await prisma.blackList.findUnique({where: {user_id: existUser.id}});
        if (blocked) {
            return res.status(401).json({message: "User is blocked"});
        };

        let user = null;
        if (existUser.role === 'USER') {
            user = await prisma.shopper.findUnique({where: {user_id: existUser.id}});
            if (!user) {
                return res.status(404).json({message: "Shopper not found"});
            }
        } else if (existUser.role === 'BRAND') {
            user = await prisma.brand.findUnique({where: {user_id: existUser.id}});
            if (!user) {
                return res.status(404).json({message: "Brand not found"});
            }
        } else if (existUser.role === 'ADMIN') {
            user = await prisma.admin.findUnique({where: {user_id: existUser.id}});
            if (!user) {
                return res.status(404).json({message: "Admin not found"});
            }
        } else {
            return res.status(404).json({message: "Something went wrong"});
        }

        const token = await createToken(email, user.id, existUser.role);
        res.cookie("jwt", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
        });

        user = {...user, email: existUser.email};

        return res.status(200).json({
            user: user,
            token: token,
            role: existUser.role
        });
    } catch(error) {
        console.log(error);
        return res.status(500).json({message: "Internal server error"});
    }
};

export const shopperSignup = async (req, res) => {
    const { email, firstName, lastName, username, password, phone, city, gender, age } = req.body;
    if (!email || !username || !password || !phone || !city || !firstName || !lastName || !gender || !age) {
        return res.status(400).json({message: "Missing required fields"});
    }

    try {
        // check unique values
        const existedEmailUser = await prisma.user.findUnique({where: {email}});
        if (existedEmailUser) {
            return res.status(409).json({message: "Email already exists"});
        }

        const existedUsernameUser = await prisma.shopper.findUnique({where: {username}});
        if (existedUsernameUser) {
            return res.status(409).json({message: "Username already exists"});
        }

        const existedPhoneUser = await prisma.shopper.findUnique({where: {phone}});
        if (existedPhoneUser) {
            return res.status(409).json({message: "Phone number already exists"});
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        let user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                role: "USER",
            }
        });

        const preferences = {
            brands: [],
            occasions: [],
            budgetRange: {
                max: 9999999,
                min: 0
            },
            colorPreferences: {
                avoidColors: [],
                primaryColors: []
            },
            stylePreferences: [],
            climatePreferences: [],
            patternPreferences: [],
            materialPreferences: {
                avoidMaterials: [],
                preferredMaterials: []
            },
            productStylePreferences: []
        };
        const newUser = await prisma.shopper.create({
            data: {
                username, phone, city, firstName, lastName, gender, age, preferences, user_id: user.id
            }});
        const newWishlist = await prisma.wishlist.create({data: {user_id: newUser.id}});
        const newCart = await prisma.cart.create({data: {user_id: newUser.id}});

        const token = await createToken(email, newUser.id, user.role);
        res.cookie("jwt", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
        });

        user = {...newUser, email: email};


        res.status(201).json({
            user: newUser,
            token: token,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Internal server error"});
    }
};

export const brandSignup = async (req, res) => {
    const { email, name, phone, description, facebook, instagram, website, password } = req.body;
    try {
        if (!email || !name || !description || !password) {
            return res.status(400).json({message: "Missing required fields"});
        }
        const existedBrand = await prisma.user.findUnique({where: {email}});
        if (existedBrand) {
            return res.status(409).json({message: "Email already exists"});
        }

        const existedBrandName = await prisma.brand.findUnique({where: {name}});
        if (existedBrandName) {
            return res.status(409).json({message: "Brand name already exists"});
        }

        const existedBrandPhone = await prisma.brand.findUnique({where: {phone}});
        if (existedBrandPhone) {
            return res.status(409).json({message: "Phone number already exists"});
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                role: "BRAND",
            }
        });

        let newBrand = await prisma.brand.create({
            data: {
                name, phone, description, facebook, instagram, website, user_id: user.id
            }
        });

        const token = await createToken(email, newBrand.id, user.role);
        res.cookie("jwt", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
        });

        newBrand = {...newBrand, email: email};

        res.status(201).json({
            user: newBrand,
            token: token,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Internal server error"});
    }
};

// will be used in the beginning to skip the login page
export const getUserInfo = async (req, res) => {
    const id = req.userId;
    const role = req.role;
    try {
        let user = null;
        let email = null;
        if (role === 'USER') {
            user = await prisma.shopper.findUnique({where: {id: id}});
            if (!user) {
                return res.status(404).json({message: "Shopper not found"});
            }
        } else if (role === 'BRAND') {
            user = await prisma.brand.findUnique({where: {id: id}});
            if (!user) {
                return res.status(404).json({message: "Brand not found"});
            }
        } else if (role === 'ADMIN') {
            user = await prisma.admin.findUnique({where: {id: id}});
            if (!user) {
                return res.status(404).json({message: "Admin not found"});
            }
        }

        const userObj = await prisma.user.findUnique({where: {id: user.user_id}});
        user = {...user, email: userObj.email};
        res.status(200).json({
            user: user,
            role: role
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Internal server error"});
    }
};

export const changePassword = async (req, res) => {
    const {oldPassword, newPassword} = req.body;
    const id = req.userId;
    const role = req.role;
    try {
        if (role === 'ADMIN') {
            const admin = await prisma.admin.findUnique({where: {id}});
            if (!admin) {
                return res.status(404).json({message: "Admin not found"});
            }
            if (admin.role === "SuperAdmin") {
                return res.status(403).json({message: "No Karim, Don't touch my Super Admin again"});
            }
        }
        if (!oldPassword || !newPassword) {
            return res.status(400).json({message: "Missing required fields"});
        }

        if (oldPassword === newPassword) {
            return res.status(400).json({message: "New password cannot be the same as the old password"});
        }

        let user;
        if (role === 'ADMIN') {
            user = await prisma.admin.findUnique({where: {id}});
        } else if (role === 'USER') {
            user = await prisma.shopper.findUnique({where: {id}});
        } else if (role === 'BRAND') {
            user = await prisma.brand.findUnique({where: {id}});
        } else {
            return res.status(404).json({message: "Something went wrong"});
        }

        const userObj = await prisma.user.findUnique({where: {id: user.user_id}});

        const isValidPassword = await compare(oldPassword, userObj.password);
        if (!isValidPassword){
            return res.status(401).json({message: "Wrong password"});
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await prisma.user.update({where: {id: userObj.id}, data: {password: hashedPassword}});
        res.status(200).json({message: "Password changed successfully"});
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Internal server error"});
    }
};

export const deleteUser = async (req, res) => {
    const id = req.userId;
    const role = req.role;
    try {
        if (role === 'ADMIN') {
            const admin = await prisma.admin.findUnique({where: {id}});
            if (admin.role === "SuperAdmin") {
                return res.status(404).json({message: "Cannot delete Super Admin"});
            }
        }

        let user;
        if (role === 'ADMIN') {
            user = await prisma.admin.findUnique({where: {id}});
            await prisma.admin.delete({where: {id}});
        } else if (role === 'USER') {
            user = await prisma.shopper.findUnique({where: {id}});
            await prisma.shopper.delete({where: {id}});
        } else if (role === 'BRAND') {
            user = await prisma.brand.findUnique({where: {id}});
            await prisma.brand.delete({where: {id}});
        } else {
            return res.status(404).json({message: "Something went wrong"});
        }

        res.clearCookie("jwt", {
            httpOnly: true,
            secure: true,
            sameSite: 'None'
        });

        await prisma.user.delete({where: {id: user.user_id}});
        res.status(200).json({message: "User deleted successfully"});
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Internal server error"});
    }
}

export const logout = async (req, res) => {
    res.clearCookie("jwt", {
        httpOnly: true,
        secure: true,
        sameSite: 'None'
    });
    res.status(200).json({ message: "Logged out" });
};
