export const GET_ADMIN = `
    SELECT * FROM "Admin" WHERE id = CAST('id) AS uuid
    LIMIT 1;`;

export const GET_ALL_ADMINS = `
    SELECT * FROM "Admin";
`;

export const GET_USER = `
    SELECT * FROM "User" WHERE id = CAST('id' AS uuid)
    LIMIT 1;`;

export const GET_USER_REVIEWS = `
    SELECT 
        "Review".*, 
        "Product".* 
    FROM 
        "Review"
    JOIN 
        "Product" ON "Review".product_id = "Product".id
    WHERE 
        "Review".user_id = CAST('user_id' AS uuid);
`;

export const GET_REVIEW_SHOPPER_COUNT = `
    SELECT 
        COUNT("id") 
    FROM 
        "Review_Shopper"
    WHERE 
        review_id = CAST('R_id' AS uuid);
`;

export const CREATE_ADMIN = `
    INSERT INTO "Admin" (id, user_id, role, username)
    VALUES (CAST('id' AS uuid), CAST('user_id' AS uuid), $2, $3)
    RETURNING *;
`;

export const GET_UNAPPROVED_PRODUCTS = `
    SELECT 
        p.*, 
        b.*, 
        c.*, 
        t.*, 
        i.*,
		S.size
    FROM "Product" p
    LEFT JOIN "Brand" b ON p."brand_id" = b.id
    LEFT JOIN "Product_Colour" c ON p.id = c."product_id"
    LEFT JOIN "Product_Tag" t ON p.id = t."product_id"
    LEFT JOIN "ProductImage" i ON p.id = i."product_id"
    LEFT JOIN "ProductVariant" pv ON p.id = pv."product_id"
	LEFT JOIN "Size" S ON pv.size_id = s.id
    WHERE p."approved" = false;
`;

export const APPROVE_PRODUCT = `
    UPDATE "Product"
    SET "approved" = true
    WHERE id = CAST('id' AS uuid);
`;

export const  DELETE_PRODUCT = `
    DELETE FROM "Product"
    WHERE id = CAST('id' AS uuid);
`;

export const GET_OFFER = `
      SELECT * FROM "Offers" WHERE id = CAST('id' AS uuid)
`;

export const UPDATE_PRODUCT_DISCOUNT = `
    UPDATE "Product"
    SET discount = <discount>
    WHERE id = CAST('id' AS uuid)
`;

export const CREATE_OFFER = `
     INSERT INTO "Offers" (
  		id,
        discount, 
        prev_discount, 
        list_number, 
        start_date, 
        end_date, 
        product_id
    ) 
    VALUES (
	    CAST('id' AS uuid),
        discount, 
        prev_discount, 
        list_number, 
        CAST('startDate' AS TIMESTAMP), 
        CAST('end_date' AS TIMESTAMP), 
        CAST('productId' AS UUID)
    );
`;

export const DELETE_OFFER = `
    DELETE FROM "Offers"
    WHERE id = CAST('id' AS uuid)
    `;

export const GET_BLOCKED_USER = `
    SELECT * FROM "blackList" WHERE user_id = CAST('id' AS uuid)
`;

export const CREATE_BLACKLIST = `
    INSERT INTO "blackList" (
        id,
        user_id, 
        comment,
        created_at
    ) 
    VALUES (
        CAST('id' AS UUID), 
        CAST('user_id' AS UUID), 
        'comment',
        CAST('Created_at' AS TIMESTAMP)
    );
`;

export const DELETE_BLACKLIST = `
    DELETE FROM "blackList"
    WHERE user_id = CAST('id' AS UUID)
`;

export const GET_ADMIN_WITH_USERNAME = `
    SELECT * FROM "Admin" WHERE username = 'userName'
`;

export const UPDATE_USER_Email = `
    UPDATE "User"
    SET  email = 'newEmail'
    WHERE id = CAST('id' AS uuid)
`;

export const UPDATE_ADMIN_USERNAME = `
    UPDATE "Admin"
    SET  username = 'newUsername'
    WHERE id = CAST('id' AS uuid)
    RETURNING *;
`;

export const UPDATE_ADMIN_ROLE = `
    UPDATE "Admin"
    SET  role = 'newRole'
    WHERE id = CAST('id' AS uuid)
    RETURNING *;
`;

export const UPDATE_OFFER_IMAGE = `
    UPDATE "Offers"
    SET  image = 'newImage'
    WHERE id = CAST('id' AS uuid)
`;

export const DELETE_OFFER_IMAGE = `
    UPDATE "Offers"
    SET  image = NULL
    WHERE id = CAST('id' AS uuid)
    RETURNING *;`;

export const DELETE_ADMIN = `
    DELETE FROM "Admin"
    WHERE id = CAST('id' AS uuid)
`;

export const DELETE_USER = `
    DELETE FROM "User"
    WHERE id = CAST('id' AS uuid)
    RETURNING *;
`;

export const GET_SIMILAR_PRODUCTS = `
    SELECT p.*, 
           t.*, 
           c.*
    FROM "Product" p
    LEFT JOIN "ProductTags" pt ON pt."product_id" = p."id"
    LEFT JOIN "Tag" t ON t."id" = pt."tag_id"
    LEFT JOIN "ProductColours" pc ON pc."product_id" = p."id"
    LEFT JOIN "Colour" c ON c."id" = pc."colour_id"
    WHERE p."approved" = TRUE
      AND p."id" != CAST('Product.id' AS UUID)
      AND p."category_id" = (
          SELECT "id" 
          FROM "Category" 
          WHERE "name" = 'productCategory.name'
      );
`;





