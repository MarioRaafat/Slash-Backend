const messageSchema = {
    type: "object",
    required: ["chat_id", "id", "created_at"],
    properties: {
        id: { type: "string", format: "uuid", example: "123e4567-e89b-12d3-a456-426614174000" },
        sender_id: { type: "string", format: "uuid", example: "123e4567-e89b-12d3-a456-426614174000" },
        receiver_id: { type: "string", format: "uuid", example: "123e4567-e89b-12d3-a456-426614174000" },
        chat_id: { type: "string", format: "uuid", example: "123e4567-e89b-12d3-a456-426614174000" },
        text: { type: "string", example: "Hello, how are you?" },
        file: { type: "string", example: "https://example.com/file" },
        created_at: { type: "string", format: "date-time", example: "2024-11-26T12:00:00Z" },
    }
};

export default messageSchema;