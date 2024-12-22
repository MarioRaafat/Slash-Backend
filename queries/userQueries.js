import prisma from "../utils/prismaClient.js";

export const GET_ALL_USERS = `
    SELECT * FROM "User" ;`;

export const GET_ALL_SHOPPERS = `
    SELECT * FROM "Shopper" s JOIN "User" u ON s.user_id = u.id;
`;

export const GET_ALL_BRANDS = `
    SELECT * FROM "Brand" s JOIN "User" u ON s.user_id = u.id;
`;

export const GET_ALL_ADMINS = `
    SELECT * FROM "Admin" s JOIN "User" u ON s.user_id = u.id;
`;

export const GET_USER_BY_ID = `
    SELECT
      s.id,
      s."firstName",
      s."lastName",
      s.username,
      s.age,
      s.gender,
      s.phone,
      s.image,
      s.city,
      s.preferences,
      s.user_id,
      u.email,
      u.role,
      u.created_at,
      u.updated_at
    FROM
      "Shopper" s
    JOIN
      "User" u
    ON
      s.user_id = u.id
    WHERE
      s.id = CAST($1 AS UUID)
`;


export const GET_USER_BY_EMAIL = `
  SELECT * FROM "User" WHERE email = 'value_of_email' LIMIT 1;
`;

export const GET_BRAND_BY_USER_ID = `
  SELECT * FROM "Brand" WHERE user_id = cast('$id' as uuid) LIMIT 1;
`;

export const GET_SHOPPER_BY_USER_ID = `
  SELECT * FROM "Shopper" WHERE user_id = cast('$id' as uuid) LIMIT 1;
`;

export const GET_SHOPPER_BY_ID = `
  SELECT * FROM "Shopper" WHERE id = cast('$id' as uuid) LIMIT 1;
`;

export const CREATE_USER = `
  INSERT INTO "User" (email, password, role)
  VALUES (cast('$id' as uuid), '$email', '$hashedPassword', 'USER', cast('hh:mm:ss.ms' as time));
`;

export const GET_SHOPPER_BY_USERNAME = `
  SELECT * FROM "Shopper" WHERE username = '$username' LIMIT 1;
`;

export const GET_SHOPPER_BY_PHONE = `
  SELECT * FROM "Shopper" WHERE phone = '$Phon' LIMIT 1;
`;

export const CREATE_SHOPPER = `
  INSERT INTO "Shopper" (id, username, phone, city, "firstName", "lastName", gender, age, user_id)
  VALUES (cast('$Shopper_id' as uuid), '$userName', '$phone', '$city', '$firstName', '$lastName', '$gender', age, cast('$user_id' as uuid));
`;

export const CREATE_WISHLIST = `
  INSERT INTO "Wishlist" (id, Shopper_id, updated_at)
  VALUES (cast('$id' as uuid), cast('$Shopper_id' as uuid), cast('$updated_at' as timestamp));
`;

export const CREATE_CART = `
  INSERT INTO "Cart" (id, Shopper_id, updated_at)
  VALUES (cast('$id' as uuid), cast('$shopper_id' as uuid), cast('$updated_at' as timestamp));
`;

export const CREATE_BRAND = `
  INSERT INTO "Brand" (id, name, phone, description, facebook, instagram, website, user_id)
  VALUES (cast('$brand_id' as uuid), '$name', '$phone', '$description', '$facebook', '$instagram', '$website', cast('$user_is' as uuid));
`;

export const GET_BODY_MEASUREMENT = `
  SELECT * FROM "BodyMeasurement" WHERE user_id = cast('$id' as uuid) LIMIT 1;
`;

export const UPDATE_BODY_MEASUREMENT = `
  UPDATE "BodyMeasurement"
  SET
    waist = $1,
    height = $2,
    chest = $3,
    shoulder_width = $4,
    weight = $5,
    shape = '$6',
    foot_length = $7
  WHERE user_id = cast('Shopper_id' as uuid);
`;

export const CREATE_BODY_MEASUREMENT = `
  INSERT INTO "BodyMeasurement" (id, waist, height, chest, shoulder_width, weight, shape, foot_length, user_id)
  VALUES (cast('id' as uuid), <waist>, <height>, <chest>, <shoulder_width>, <weight>, 'shape', <foot_length>, cast('shopper_id' as uuid));
`;

export const GET_ALL_SHOPPER_AND_USER = `
  SELECT * FROM "Shopper"
  JOIN "User" ON "Shopper".user_id = "User".id;
`;

export const UPDATE_SHOPPER_PREFERENCES = `
  UPDATE "Shopper"
  SET preferences = jsonb_set(preferences, '{productStylePreferences}', $1::jsonb, true)
  WHERE id = cast('id' as uuid);
`;

export const GET_AVATAR_BY_USERID = `
  SELECT * FROM "Avatar" 
  WHERE user_id = cast('$id' as uuid) LIMIT 1;
`;

export const UPDATE_AVATAR = `
  UPDATE "Avatar"
  SET
    "topType" = $1,
    "accessoriesType" = $2,
    "hairColor" = $3,
    "facialHairType" = $4,
    "clotheType" = $5,
    "eyeType" = $6,
    "eyebrowType" = $7,
    "mouthType" = $8,
    "skinColor" = $9,
    "clotheColor" = $10,
    style = $11,
    "graphicType" = $12
  WHERE user_id = $13;
`;

export const CREATE_AVATAR = `
  INSERT INTO "Avatar" (
    id, "topType", "accessoriesType", "hairColor", "facialHairType", "clotheType", 
    "eyeType", "eyebrowType", "mouthType", "skinColor", "clotheColor", 
    "style", "graphicType", "user_id"
  )
  VALUES (
    cast('id' as uuid), 
    '$1', '$2', '$3', '$4', '$5', 
    '$6', '$7', '$8', '$9', '$10', 
    '$11', '$12',
    cast('user_id' as uuid), 
  );
`;

export const UPDATE_SHOPPER_IMAGE = `
  UPDATE "Shopper"
  SET image = 'image_link'
  WHERE id = cast('id' as uuid);
`;







