const wishlistItemSchema = {
    type: "object",
    required: ["id", "wishlist_id", "product_id"],
    properties: {
        id: { type: "string", format: "uuid", example: "123e4567-e89b-12d3-a456-426614174000" },
        wishlist_id: { type: "string", format: "uuid", example: "123e4567-e89b-12d3-a456-426614174000" },
        product_id: { type: "string", format: "uuid", example: "123e4567-e89b-12d3-a456-426614174000" },
    },
};

export default wishlistItemSchema;
