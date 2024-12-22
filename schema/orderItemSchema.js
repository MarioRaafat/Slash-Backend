const orderItemSchema = {
    type: "object",
    required: ["id", "order_id", "product_id"],
    properties: {
        id: { type: "string", format: "uuid", example: "123e4567-e89b-12d3-a456-426614174000" },
        order_id: { type: "string", format: "uuid", example: "123e4567-e89b-12d3-a456-426614174000" },
        product_id: { type: "string", format: "uuid", example: "123e4567-e89b-12d3-a456-426614174000" },
        quantity: { type: "integer", example: 2 },
    },
};

export default orderItemSchema;
