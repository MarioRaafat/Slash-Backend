export const GET_ALL_USER_ORDERS_WITH_ITEMS = `
    SELECT * FROM "Order" o
    JOIN "OrderItem" oi ON o.id = oi.order_id
    WHERE o.user_id = CAST($1 as UUID);
`;

export const GET_ORDER_BY_ID_WITH_ITEMS =  `
        SELECT * FROM "Order" o
        JOIN "OrderItem" oi ON o.id = oi.order_id
        WHERE o.id = CAST($1 as UUID);
    `;

export const GET_ORDER_BY_ID = `
  SELECT * FROM "Order"
  WHERE id = CAST($1 as UUID);
`;

export const CREATE_ORDER = `
  INSERT INTO "Order" (order_status, longitude, latitude, user_id)
  VALUES ('PENDING', $1, $2, CAST($3 as UUID))
`;

export const ADD_PRODUCT_TO_ORDER = `
  INSERT INTO "OrderItem" (order_id, product_id, quantity)
  VALUES (CAST($1 as UUID), CAST($2 as UUID), $3)
`;

export const UPDATE_ORDER_TOTAL_COST = `
  UPDATE "Order"
  SET total_cost = total_cost + $1
  WHERE id = CAST($2 as UUID)
`;

export const UPDATE_ORDER_STATUS = `
  UPDATE "Order"
  SET order_status = $1
  WHERE id = CAST($2 as UUID)
`;

export const FIND_PRODUCT_VARIANT_BY_ID_WITH_PRODUCT = `
  SELECT * FROM "ProductVariant" pv
  JOIN "Product" p ON pv.product_id = p.id
  WHERE pv.id = CAST($1 as UUID);
`;