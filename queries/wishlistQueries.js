export const GET_USER_WISHLIST_WITH_PRODUCTS = `
    SELECT p.* FROM "Wishlist" w
    JOIN "WishlistItem" wi ON w.id = wi.wishlist_id
    JOIN "Product" p ON wi.product_id = p.id
    WHERE w.user_id = CAST($1 as UUID);
`;

export const ADD_PRODUCT_TO_WISHLIST = `
    INSERT INTO "WishlistItem" (product_id, wishlist_id)
    VALUES (CAST($1 as UUID), (SELECT id FROM "Wishlist" WHERE user_id = CAST($2 as UUID)));
`;

export const REMOVE_PRODUCT_FROM_WISHLIST = `
    DELETE FROM "WishlistItem"
    WHERE product_id = CAST($1 as UUID) AND wishlist_id = (SELECT id FROM "Wishlist" WHERE user_id = CAST($2 as UUID));
`;

export const CLEAR_WISHLIST = `
    DELETE FROM "WishlistItem"
    WHERE wishlist_id = (SELECT id FROM "Wishlist" WHERE user_id = CAST($1 as UUID));
`;