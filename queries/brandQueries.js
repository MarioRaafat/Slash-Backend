export const GET_ALL_BRANDS = `
  SELECT *
  FROM "Brand";
`;

export const GET_BRANDS_WITH_USERS = `
  SELECT b.*, u.*
  FROM "Brand" AS b
  JOIN "User" AS u ON b.user_id = u.id;
`;

export const GET_BRAND_BY_ID = `
  SELECT *
  FROM "Brand"
  WHERE id = cast('brand_id' as uuid)
  LIMIT 1;
`;

export const GET_DISTINCT_SIZES_WITH_CATEGORIES = `
  SELECT DISTINCT ON (s.category_id) s.*, c.*
  FROM "Size" AS s
  JOIN "Category" AS c ON s.category_id = c.id
  WHERE s.brand_id = cast('brand_id' as uuid);
`;

export const GET_SIZES_BY_CATEGORY_AND_BRAND = `
  SELECT *
  FROM "Size"
  WHERE category_id = cast('category_id' as uuid) AND brand_id = cast('brand_id' as uuid);
`;

export const GET_USERS_BY_BRAND_ID = `
  SELECT u.*
  FROM "Brand_Shopper" AS bs
  JOIN "User" AS u ON bs.user_id = u.id
  WHERE bs.brand_id = cast('brand_id' as uuid);
`;

export const GET_CATEGORY_BY_ID = `
  SELECT *
  FROM "Category"
  WHERE id = cast('category_id' as uuid);
`;

export const GET_SIZE_BY_CATEGORY_BRAND_AND_TAG = `
  SELECT *
  FROM "Size"
  WHERE category_id = cast('category_id' as uuid) AND brand_id = cast('brand_id' as uuid) AND size = 'size_tag'
  LIMIT 1;
`;

export const CREATE_SIZE = `
  INSERT INTO "Size" (
	id,
    category_id,
    brand_id,
    size,
    waist,
    length,
    chest,
    arm_length,
    foot_length,
    bicep) 
  VALUES (cast('size_id' as uuid)), cast('size_id' as uuid), cast('size_id' as uuid), 'size_tag', <waist>, <length>, <chest>, <arm_length>, <foot_length>, <bicep>); 
`;

export const CREATE_PRODUCT_COLOUR = `
  INSERT INTO "Product_Colour" (
	id,
    product_id,
    colour_id,
    percentage
  ) 
  VALUES (cast('id' as uuid), cast('product_id' as uuid), cast('colour_id' as uuid), <percentage>);
`;

export const CREATE_PRODUCT_VARIANT = `
INSERT INTO "ProductVariant" (
 	id,
    product_id,
    size_id,
    quantity
  ) 
  VALUES (cast('id' as uuid), cast('product_id' as uuid), cast('size_id' as uuid), <quantity>);
`;

export const CREATE_TAG = `
  INSERT INTO "Tag" (id, name)
  VALUES (cast('id' as uuid), 'name');
`;

export const CREATE_PRODUCT_TAG = `
  INSERT INTO "Product_Tag" (id, product_id, tag_id)
  VALUES (cast('id' as uuid), cast('product_id' as uuid), cast('tag_id' as uuid));
`;

export const UPDATE_BRAND_LOGO = `
UPDATE "Brand"
  SET logo = 'logo_link'
  WHERE id = cast('id' as uuid);
`;

export const UPDATE_PRODUCT_IMAGE = `
UPDATE "Product"
  SET image = 'image_link'
  WHERE id = cast('id' as uuid);
`;

export const UPDATE_USER_EMAIL = `
  UPDATE "User"
  SET email = 'email'
  WHERE id = cast('id' as uuid);
`;

export const UPDATE_BRAND_DETAILS = `
  UPDATE "Brand"
  SET name = 'name',
      description = 'description',
      phone = 'phone_number',
      website = 'website',
      facebook = 'facebook_link',
      instagram = 'instagram_link'
  WHERE id = cast('id' as uuid);
`;

export const UPDATE_SIZE_DETAILS = `
  UPDATE "Size"
  SET size = 'size_tag',
      waist = $2,
      length = $3,
      bicep = $4,
      foot_length = $5,
      chest = $6,
      arm_length = $7
  WHERE id = cast('id' as uuid);
`;

export const DELETE_PRODUCT = `
  DELETE FROM "Product"
  WHERE id = cast('id' as uuid);
`;

export const DELETE_PRODUCT_VARIANR = `
  DELETE FROM "ProductVariant"
  WHERE id = cast('id' as uuid);
`;

export const DELETE_SIZE = `
  DELETE FROM "Size"
  WHERE id = cast('id' as uuid);
`;