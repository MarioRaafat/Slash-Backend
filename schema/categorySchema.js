const categorySchema = {
    type: "object",
    required: ["id", "name", "style"],
    properties: {
        id: { type: "string", format: "uuid", example: "123e4567-e89b-12d3-a456-426614174000" },
        name: { type: "string", example: "Category Name" },
        style: { type: "string", example: "Casual" },
    },
};

export default categorySchema;
