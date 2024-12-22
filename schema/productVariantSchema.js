const productVariantSchema = {
    type: "object",
    required: ["id", "product_id", "size_id", "quantity"],
    properties: {
        id: { type: "string", format: "uuid", example: "123e4567-e89b-12d3-a456-426614174000" },
        product_id: { type: "string", format: "uuid", example: "123e4567-e89b-12d3-a456-426614174000" },
        size_id: { type: "string", format: "uuid", example: "123e4567-e89b-12d3-a456-426614174000" },
        quantity: { type: "integer", example: 100 },
    },
};

export default productVariantSchema;
