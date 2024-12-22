const bodyMeasurementSchema = {
    type: "object",
    required: ["id", "user_id", "waist", "height", "weight", "shape", "shoulder_width", "chest"],
    properties: {
        id: { type: "string", format: "uuid", example: "123e4567-e89b-12d3-a456-426614174000" },
        waist: { type: "integer", example: 32 },
        height: { type: "integer", example: 175 },
        weight: { type: "integer", example: 70 },
        chest: { type: "integer", example: 90 },
        shoulder_width: { type: "integer", example: 45 },
        shape: { type: "string", example: "RECTANGLE" },
        foot_length: { type: "integer", example: 27 },
        user_id: { type: "string", format: "uuid", example: "123e4567-e89b-12d3-a456-426614174000" },
    },
};

export default bodyMeasurementSchema;
