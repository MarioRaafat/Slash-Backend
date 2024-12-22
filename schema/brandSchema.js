const brandSchema = {
    type: "object",
    required: ["id", "name", "description", "user_id", "phone"],
    properties: {
        id: { type: "string", format: "uuid", example: "123e4567-e89b-12d3-a456-426614174000" },
        name: { type: "string", example: "BrandName" },
        description: { type: "string", example: "This is a sample brand description." },
        user_id: { type: "string", format: "uuid", example: "123e4567-e9ab-12d3-a456-426614174000" },
        phone: { type: "string", example: "+1234567890" },
        logo: { type: "string", example: "https://example.com/logo.jpg" },
        website: { type: "string", example: "https://example.com" },
        facebook: { type: "string", example: "https://facebook.com/brand" },
        instagram: { type: "string", example: "https://instagram.com/brand" },
    },
};

export default brandSchema;
