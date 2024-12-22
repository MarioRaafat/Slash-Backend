const adminSchema = {
    type: "object",
    required: ["id", "username", "permission", "user_id"],
    properties: {
        id: { type: "string", format: "uuid", example: "123e4567-e89b-12d3-a456-426614174000" },
        username: { type: "string", example: "admin" },
        role: { type: "string", example: "SuperAdmin" },
        user_id: { type: "string", format: "uuid", example: "123e4567-e98b-12d3-a456-426614174000" },
    },
};

export default adminSchema;