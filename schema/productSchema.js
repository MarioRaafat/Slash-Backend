const productSchema = {
    type: "object",
    required: ["id", "brand_id", "name", "price", "material", "category_id", "discount", "image", "returnPeriod"],
    properties: {
        id: { type: "string", format: "uuid", example: "123e4567-e89b-12d3-a456-426614174000" },
        brand_id: { type: "string", format: "uuid", example: "123e4567-e89b-12d3-a456-426614174000" },
        name: { type: "string", example: "Product Name" },
        price: { type: "number", format: "float", example: 29.99 },
        material: { type: "string", example: "Cotton" },
        rating: { type: "number", format: "float", example: 4.5 },
        discount: { type: "number", format: "float", example: 8 },
        returnPeriod: { type: "integer", example: 30 },
        inStock: { type: "boolean", example: true },
        image: { type: "string", example: "http://example.com/product.jpg" },
        category_id: { type: "string", format: "uuid", example: "123e4567-e89b-12d3-a456-426614174000" },
        created_at: { type: "string", format: "date-time", example: "2024-11-02T12:00:00Z" },
    },
};

export default productSchema;
