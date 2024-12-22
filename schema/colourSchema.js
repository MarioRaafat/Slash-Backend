const colourSchema = {
    type: "object",
    required: ["id", "name", "hex", "family"],
    properties: {
        id: { type: "string", format: "uuid", example: "123e4567-e89b-12d3-a456-426614174000" },
        name: { type: "string", example: "Red" },
        hex: { type: "string", example: "#FF0000" },
        family: { type: "string", example: "Red" },
    },
};

export default colourSchema;
