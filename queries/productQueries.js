export const GET_PRODUCT_BY_ID_INCLUDING_CATEGORY = `
    SELECT
        *
    FROM
        "Product" p
    JOIN
        "Category" c
    ON
        p.category_id = c.id
    WHERE
        p.id = CAST($1 AS UUID) AND p.approved = true;
`;

export const GET_SHOPPER_BY_ID = `
  SELECT *
  FROM "Shopper"
  WHERE id = cast('$userId' as uuid)
  LIMIT 1;
`;

export const GET_ALL_PRODUCTS = `
  SELECT *
  FROM "Product"
  WHERE approved=true;
`;

export const GET_WISHLIST_WITH_ITEMS = `
  SELECT w.*, i.*
  FROM "Wishlist" as w
  LEFT JOIN "WishlistItem" as i ON i.wishlist_id = w.id
  WHERE w.user_id = cast('$userId' as uuid)
  LIMIT 1;
`;

export const GET_PRODUCT_BY_ID = `
  SELECT *
  FROM "Product"
  WHERE id = cast('$id' as uuid) AND approved = true
  LIMIT 1;
`;

export const GET_BRAND_BY_NAME = `
  SELECT *
  FROM "Brand"
  WHERE name = '$brandName'
  LIMIT 1;
`;

export const GET_CATEGORY_BY_NAME_AND_STYLE = `
  SELECT *
  FROM "Category"
  WHERE name = '$categoryName' AND style = '$style'
  LIMIT 1;
`;

export const CREATE_PRODUCT = `
  INSERT INTO "Product"
    (id, name, price, discount, material, image, "returnPeriod", brand_id, category_id, approved)
  VALUES
    (cast('$id' as uuid), '$name', <price>, <discount>, '$material', '$image', <returnPeriod>, cast('$brand_id' as uuid), cast('$category_id' as uuid), <intially>false);
`;

export const UPDATE_PRODUCT = `
  UPDATE "Product"
  SET
    name = '$name',
    price = <price>,
    image = '$image',
    brand_id = cast('$brand_id' as uuid),
    material = '$material',
    "returnPeriod" = <returnPeriod>,
    category_id = cast('$category_id' as uuid),
    discount = <discount>
  WHERE id = cast('$id' as uuid) AND approved = true;
`;

export const DELETE_PRODUCT = `
  DELETE FROM "Product"
  WHERE id = cast('$id' as uuid);
`;

export const GET_SHOPPER_WITH_BODY_MEASUREMENTS = `
  SELECT s.*, bm.*
  FROM "Shopper" AS s
  LEFT JOIN "BodyMeasurement" AS bm ON bm.shopper = s.id
  WHERE s.id = cast('shopper_id' as uuid)
  LIMIT 1;
`;

export const GET_ALL_PRODUCTS_WITH_COLOURS_AND_CATEGORY = `
  SELECT p.*, PC.*, c.*, cat.*
  FROM "Product" AS p
  LEFT JOIN "Product_Colour" AS PC ON PC.product_id = p.id
  LEFT JOIN "Colour" AS c ON PC.colour_id = c.id
  LEFT JOIN "Category" AS cat ON cat.id = p.category_id
  WHERE p.approved = true;
`;

export const GET_PRODUCT_VARIANTS_BY_PRODUCT_ID = `
  SELECT pv.*
FROM "ProductVariant" AS pv
JOIN "Product" ON pv."product_id" = "Product"."id"
WHERE pv.product_id = cast('$productId' as uuid) 
AND "Product"."approved" = true;
`;

export const GET_SIZE_BY_ID = `
  SELECT *
  FROM "Size"
  WHERE id = cast('$sizeId' as uuid)
  LIMIT 1;
`;

export const GET_COLOURS_BY_IDS = `
  SELECT *
  FROM "Colour"
  WHERE id IN ($colourIds);
`;

export const GET_PRODUCT_TAGS = `
 SELECT pt.*, t.*
  FROM "Product_Tag" AS pt
  JOIN "Tag" AS t ON pt.tag_id = t.id
  WHERE pt.product_id = cast('$Product_id' as uuid);
`;

export const GET_BRAND_BY_ID = `
  SELECT *
  FROM brand
  WHERE id = cast('$brand_id' as uuid)
  LIMIT 1;
`;

export const GET_COLOURS_BY_FAMILY = `
    SELECT *
  FROM "Colour"
  WHERE family = '$familyName';
`;


export const GET_PRODUCTS_WITH_CATEGORIES = `
SELECT p.*, c.*
  FROM "Product" AS p
  JOIN "Category" AS c ON p.category_id = c.id
  WHERE p.approved = true;
`;

export const GET_ALL_COLOURS = `
SELECT *
FROM "Colour";
`;

export const GET_PRODUCTS_WITH_COLOURS = `
  SELECT p.*, PC.*, c.*
  FROM "Product" AS p
  LEFT JOIN "Product_Colour" AS PC ON PC.product_id = p.id
  LEFT JOIN "Colour" AS c ON PC.colour_id = c.id
  WHERE p.approved = true;
`;

export const GET_ALL_PRODUCTS_BY_BRAND_ID = `
  SELECT *
  FROM "Product"
  WHERE brand_id = cast('$brandId' as uuid)
        AND approved = true;
  `;

  export const GET_PRODUCTS_BY_PRICE_RANGE = `
  SELECT *
  FROM "Product"
    WHERE price >= <lowerLimit> AND price <= <upperLimit>
    AND approved = true;
`;

export const GET_PRODUCT_WITH_BRAND_AND_CATEGORY_withID = `
 SELECT p.*, b.*, cat.*
  FROM "Product" AS p
  LEFT JOIN "Category" AS cat ON cat.id = p.category_id
  LEFT JOIN "Brand" AS b ON b.id = p.brand_id
  WHERE p.id = cast('$productId' as uuid) AND approved = true;
`;

export const GET_PRODUCTVARIANT_WITH_PRODUCT_ID=`
  SELECT *
  FROM "ProductVariant"
  WHERE product_id = cast('$productId' as uuid);
  `;

export const GET_ALL_PRODUCTS_USING_NAME_AND_ID=`
  SELECT *
  FROM "Product"
  WHERE name = '$name' AND id = cast('$productId' as uuid) 
  AND approved = true;
  `;

export const GET_PRODUCT_COLOUR_USING_PRODUCTId=`
  SELECT *
  FROM "Product_Colour"
  WHERE product_id = cast('$productId' as uuid);
`;

export const GET_PRODUCT_WITH_TAGS = `
  SELECT p.*, pt.*, t.*
  FROM "Product" AS p
  LEFT JOIN "Product_Tag" AS pt ON pt.product_id = p.id
  LEFT JOIN "Tag" AS t ON pt.tag_id = t.id
  WHERE p.id = cast('productId' as uuid) AND approved = true
  LIMIT 1;
`;

export const GET_ALL_PRODUCTS_WITH_TAGS = `
  SELECT p.*, pt.*, t.*
  FROM "Product" AS p
  LEFT JOIN "Product_Tag" AS pt ON pt.product_id = p.id
  LEFT JOIN "Tag" AS t ON pt.tag_id = t.id
  WHERE approved = true
  LIMIT 1;
`;

export const GET_DISTINCT_CATEGORY_NAMES = `
  SELECT DISTINCT name
  FROM "Category";
`;





