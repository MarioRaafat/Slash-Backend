const reviewSchema = {
    type: "object",
    required: ["id", "user_id", "product_id", "rating"],
    properties: {
        id: { type: "string", format: "uuid", example: "123e4567-e89b-12d3-a456-426614174000" },
        user_id: { type: "string", format: "uuid", example: "123e4567-e89b-12d3-a456-426614174000" },
        product_id: { type: "string", format: "uuid", example: "123e4567-e89b-12d3-a456-426614174000" },
        rating: { type: "integer", minimum: 1, maximum: 5, example: 4 },
        valueForMoney_rate: { type: "integer", minimum: 1, maximum: 5, example: 4 },
        quality_rate: { type: "integer", minimum: 1, maximum: 5, example: 4 },
        shipping_rate: { type: "integer", minimum: 1, maximum: 5, example: 4 },
        accuracy_rate: { type: "integer", minimum: 1, maximum: 5, example: 4 },
        comment: { type: "string", example: "Great product!" },
        created_at: { type: "string", format: "date-time", example: "2024-11-02T12:00:00Z" },
        updated_at: { type: "string", format: "date-time", example: "2024-11-02T12:00:00Z" },
    },
};

export default reviewSchema;
