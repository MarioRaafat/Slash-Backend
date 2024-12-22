const avatarSchema = {
    type: "object",
    required: ["id", "topType", "accessoriesType", "hairColor", "facialHairType", "clotheType", "eyeType", "eyebrowType", "mouthType", "skinColor", "clotheColor", "style", "graphicType", "user_id", "created_at", "updated_at"],
    properties: {
        id: { type: "string", format: "uuid", example: "123e4567-e89b-12d3-a456-426614174000" },
        topType: { type: "integer", example: 1 },
        accessoriesType: { type: "integer", example: 2 },
        hairColor: { type: "integer", example: 3 },
        facialHairType: { type: "integer", example: 4 },
        facialHairColor: { type: "integer", example: 5 },
        clotheType: { type: "integer", example: 6 },
        eyeType: { type: "integer", example: 7 },
        eyebrowType: { type: "integer", example: 8 },
        mouthType: { type: "integer", example: 9 },
        skinColor: { type: "integer", example: 10 },
        clotheColor: { type: "integer", example: 11 },
        style: { type: "integer", example: 12 },
        graphicType: { type: "integer", example: 13 },
        user_id: { type: "string", format: "uuid", example: "123e4567-e89b-12d3-a456-426614174000" },
        created_at: { type: "string", format: "date-time", example: "2024-11-26T12:00:00Z" },
        updated_at: { type: "string", format: "date-time", example: "2024-11-26T13:00:00Z" },
    },
};

export default avatarSchema;
