const userSchema = {
    type: "object",
    required: ["id", "email", "password", "role"],
    properties: {
        id: { type: "string", format: "uuid", example: "123e4567-e89b-12d3-a456-426614174000" },
        email: { type: "string", example: "7amada@example.com" },
        password: { type: "string", example: "password@123" },
        role: { type: "string", example: "USER" },
        created_at: { type: "string", format: "date-time", example: "2024-11-02T12:00:00Z" },
        updated_at: { type: "string", format: "date-time", example: "2024-11-02T12:00:00Z" },
    },
};

export default userSchema;
