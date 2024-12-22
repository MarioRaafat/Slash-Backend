const orderSchema = {
    type: "object",
    required: ["id", "user_id", "payment_status"],
    properties: {
        id: { type: "string", format: "uuid", example: "123e4567-e89b-12d3-a456-426614174000" },
        user_id: { type: "string", format: "uuid", example: "123e4567-e89b-12d3-a456-426614174000" },
        order_status: { type: "string", example: "PENDING" },
        longitude: { type: "string", example: "-74.006" },
        latitude: { type: "string", example: "40.7128" },
        total_cost: { type: "number", example: 200.00 },
        created_at: { type: "string", format: "date-time", example: "2024-11-02T12:00:00Z" },
        purchased_at: { type: "string", format: "date-time", nullable: true, example: "2024-11-02T12:00:00Z" },
    },
};

export default orderSchema;
