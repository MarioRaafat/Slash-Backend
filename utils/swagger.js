import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import userSchema from "../schema/userSchema.js";
import bodyMeasurementSchema from "../schema/bodyMeasurements.js";
import brandSchema from "../schema/brandSchema.js";
import categorySchema from "../schema/categorySchema.js";
import productSchema from "../schema/productSchema.js";
import orderSchema from "../schema/orderSchema.js";
import reviewSchema from "../schema/reviewSchema.js";
import cartSchema from "../schema/cartSchema.js";
import wishlistSchema from "../schema/wishlistSchema.js";
import cartItemSchema from "../schema/cartItemSchema.js";
import wishlistItemSchema from "../schema/wishlistItemSchema.js";
import orderItemSchema from "../schema/orderItemSchema.js";
import colourSchema from "../schema/colourSchema.js";
import sizeSchema from "../schema/sizeSchema.js";
import productVariantSchema from "../schema/productVariantSchema.js";
import tagSchema from "../schema/tagSchema.js";
import avatarSchema from "../schema/avatarSchema.js";
import messageSchema from "../schema/messageSchema.js";
import chatSchema from "../schema/chatSchema.js";
import shopperSchema from "../schema/shopperSchema.js";
import adminSchema from "../schema/adminSchema.js";
import offerSchema from "../schema/offerSchema.js";
import { responseMessage401Schema, responseMessage403Schema} from "../schema/commonSchema.js";


const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Slash Express API with Swagger",
            version: "1.0.0",
            description: "This is a simple CRUD API application made with Express and documented with Swagger",
        },
        components: {
            schemas: {
                BaseModel: userSchema,
                Admin: adminSchema,
                User: shopperSchema,
                Avatar: avatarSchema,
                Brand: brandSchema,
                BodyMeasurement: bodyMeasurementSchema,
                Product: productSchema,
                ProductVariant: productVariantSchema,
                Category: categorySchema,
                Size: sizeSchema,
                Colour: colourSchema,
                Chat: chatSchema,
                Message: messageSchema,
                Order: orderSchema,
                OrderItem: orderItemSchema,
                Cart: cartSchema,
                CartItem: cartItemSchema,
                Wishlist: wishlistSchema,
                WishlistItem: wishlistItemSchema,
                Review: reviewSchema,
                Tag: tagSchema,
                Offer: offerSchema,
                ResponseMessage401: responseMessage401Schema,
                ResponseMessage403: responseMessage403Schema,
            },
            responses: {
                401: {
                    description: "Unauthorized",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    message: {
                                        type: "string",
                                        example: "Unauthorized",
                                    },
                                },
                            },
                        },
                    },
                },
                403: {
                    description: "Token is not valid / Insufficient permissions",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    message: {
                                        type: "string",
                                        example: "Token is not valid / Insufficient permissions",
                                    },
                                },
                            },
                        },
                    },
                },
                500: {
                    description: "Internal server error",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    message: {
                                        type: "string",
                                        example: "Internal server error",
                                    },
                                },
                            },
                        },
                    },
                },
            },
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: ['./routes/*.js', './schema/*.js'],
};


const specs = swaggerJsdoc(options);
export const swaggerUiSetup = swaggerUi.setup(specs);
export const swaggerUiServe = swaggerUi.serve;