const shopperSchema = {
    type: "object",
    required: ["id", "username", "user_id", "phone", "age", "gender", "city", "firstName", "lastName"],
    properties: {
        id: { type: "string", format: "uuid", example: "123e4567-e89b-12d3-a456-426614174000" },
        user_id: { type: "string", format: "uuid", example: "123e4567-e9ab-12d3-a456-426614174000" },
        firstName: { type: "string", example: "7amada" },
        lastName: { type: "string", example: "7alabo2a" },
        username: { type: "string", example: "john_doe" },
        gender: { type: "string", example: "male" },
        age: { type: "number", example: 20 },
        phone: { type: "string", example: "+1234567890" },
        image: { type: "string", example: "http://example.com/image.jpg" },
        city: { type: "string", example: "New York" },
        preferences: { type: "object", example: { preference1: "value1", preference2: "value2" } },
    },
};

export default shopperSchema;
