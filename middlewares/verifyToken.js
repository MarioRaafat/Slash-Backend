import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const verifyToken = (req, res, next) => {
    let token = req.cookies.jwt || req.headers['authorization'];

    if (token && token.startsWith('Bearer ')) {
        token = token.slice(7);
    }

    if(!token) return res.status(401).send("You are not authenticated");
    jwt.verify(token, process.env.JWT_KEY, async (error, payload) => {
        if (error) return res.status(403).send("Token is not valid");
        req.userId = payload.id;
        req.role = payload.role;
        next();
    });
};