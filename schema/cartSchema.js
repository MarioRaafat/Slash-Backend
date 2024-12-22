const cartSchema = {
    type: "object",
    required: ["id", "user_id", "price"],
    properties: {
        id: { type: "string", format: "uuid", example: "123e4567-e89b-12d3-a456-426614174000" },
        user_id: { type: "string", format: "uuid", example: "123e4567-e89b-12d3-a456-426614174000" },
        total_cost: { type: "number", format: "float", example: 199.99 },
        created_at: { type: "string", format: "date-time", example: "2024-11-02T12:00:00Z" },
        updated_at: { type: "string", format: "date-time", example: "2024-11-02T12:00:00Z" },
    },
};

export default cartSchema;
