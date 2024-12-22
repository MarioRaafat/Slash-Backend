export const responseMessage401Schema = {
    type: "object",
    description: "Unauthorized",
    properties: {
        message: { type: "string", example: "You are not authenticated" },
    },
};

export const responseMessage403Schema = {
    type: "object",
    description: "Access Denied / Token is not valid",
    properties: {
        message: {example: "Token is not valid" },
    },
};
