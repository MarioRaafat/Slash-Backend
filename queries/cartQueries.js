export const GET_CART_WITH_ITEMS_AND_PEODUCTVARIANT = `
  SELECT c.*, ci.*, p.*
  FROM "Cart" AS c
  LEFT JOIN "CartItem" AS ci ON ci.cart_id = c.id
  LEFT JOIN "ProductVariant" AS p ON ci.product_id = p.id
  WHERE c.user_id = cast('user_id' as uuid);
`;

export const GET_CART_WITH_ITEMS = `
  SELECT c.*, ci.*
  FROM "Cart" AS c
  LEFT JOIN "CartItem" AS ci ON ci.cart_id = c.id
  WHERE c.user_id = cast('user_id' as uuid);
`;

export const GET_PRODUCT_VARIANT_WITH_PRODUCT = `
  SELECT pv.*, p.*
  FROM "ProductVariant" AS pv
  JOIN "Product" AS p ON pv.product_id = p.id
  WHERE pv.id = cast('productVaruant_id' as uuid)
  LIMIT 1;
`;

export const CREATE_CART_ITEM = `
  INSERT INTO "CartItem" (id, product_id, cart_id, quantity)
  VALUES (cast('id' as uuid), cast('product_id' as uuid), cast('cart_id' as uuid), <quantity>);
`;

export const UPDATE_CART_TOTAL_COST = `
  UPDATE "Cart"
  SET total_cost = total_cost + <value>
  WHERE user_id = cast('user_id' as uuid)
  RETURNING *;
`;

export const GET_CART_ITEM_WITH_PRODUCT = `
SELECT ci.*, p.*
  FROM "CartItem" AS ci
  JOIN "ProductVariant" AS p ON ci.product_id = p.id
  WHERE ci.id = cast('cartItem_id' as uuid)
  LIMIT 1;
`;

export const UPDATE_CART_ITEM_QUANTITY = `
  UPDATE "CartItem"
  SET quantity = <quantity>
  WHERE id = cast('cartItem_id' as uuid);
`;

export const DELETE_CART_ITEM = `
  DELETE FROM "CartItem"
  WHERE id = cast('cartItem_id' as uuid);
`
