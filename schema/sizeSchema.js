const sizeSchema = {
    type: "object",
    required: ["id", "product_id"],
    properties: {
        id: { type: "string", format: "uuid", example: "123e4567-e89b-12d3-a456-426614174000" },
        brand_id: { type: "string", format: "uuid", example: "123e4567-e89b-12d3-a456-426614174000" },
        category_id: { type: "string", format: "uuid", example: "123e4567-e89b-12d3-a456-426614174000" },
        sizeTag: { type: "string", example: "M" },
        waist: { type: "integer", example: 32 },
        length: { type: "integer", example: 180 },
        chest: { type: "integer", example: 50 },
        arm_length: { type: "integer", example: 60 },
        bicep: { type: "integer", example: 12 },
        foot_length: { type: "integer", example: 26 },
        product_id: { type: "string", format: "uuid", example: "123e4567-e89b-12d3-a456-426614174000" },
    },
};

export default sizeSchema;
