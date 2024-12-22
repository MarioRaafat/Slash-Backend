const offerSchema = {
    type: "object",
    required: ["id", "product_id", "discount", "list_number", "start_date", "end_date"],
    properties: {
        id: { type: "string", format: "uuid", example: "123e4567-e89b-12d3-a456-426614174000" },
        product_id: { type: "string", format: "uuid", example: "123e4567-e89b-12d3-a456-426614174000" },
        discount: { type: "number", example: 10 },
        prev_discount: { type: "number", example: 5 },
        list_number: { type: "number", example: 1 },
        image: { type: "string", example: "https://example.com/image.jpg" },
        start_date: { type: "string", format: "date-time", example: "2022-01-01T00:00:00.000Z" },
        end_date: { type: "string", format: "date-time", example: "2022-01-01T00:00:00.000Z" },
        product: { type: "object" }
    }
};

export default offerSchema;