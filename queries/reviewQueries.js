export const GET_REVIEWS_BY_USER_ID = `
  SELECT r.*, u.*
  FROM "Review" AS r
  JOIN "Shopper" AS u ON r.user_id = u.id
  WHERE r.user_id = cast('user_id' as uuid);
`;

export const GET_REVIEW_SHOPPERS_BY_REVIEW_ID = `
  SELECT *
  FROM "Review_Shopper"
  WHERE review_id = cast('review_id' as uuid);
`;

export const GET_REVIEWS_BY_PRODUCT_ID = `
 SELECT r.*, u.*
  FROM "Review" AS r
  JOIN "Shopper" AS u ON r.user_id = u.id
  WHERE r.product_id = cast('product_id' as uuid);
`;

export const  GET_REVIEW_BY_ID = `
  SELECT *
  FROM "Review"
  WHERE id = cast('review_id' as uuid);
  LIMIT 1;
  `;

export const CREATE_REVIEW = `
  INSERT INTO "Review" (id, user_id, product_id, rating, comment, created_at, "valueForMoney_rate", quality_rate, shipping_rate, accuracy_rate, image)
  VALUES (cast('id' as uuid), cast('id' as uuid), cast('id' as uuid), <rating>, 'comment_content', 'created_at_Date', <valueForMoney_rate>, <quality_rate>, <shipping_rate>, <accuracy_rate>, 'image');
`;

export const DELETE_REVIEW_SHOPPER = `
  DELETE FROM "Review_Shopper"
  WHERE id = cast('id' as uuid);
  `;

export const CREATE_REVIEW_SHOPPER = `
  INSERT INTO "Review_Shopper" (id, review_id, user_id)
  VALUES (cast('id' as uuid), cast('review_id' as uuid), cast('shopper_id' as uuid));
`;

export const UPDATE_REVIEW_IMAGE = `
  UPDATE "Review"
  SET image = 'image_link'
  WHERE id = cast('id as uuid');
`;

export const UPDATE_REVIEW = `
  UPDATE "Review"
  SET
    rating = $1,
    comment = 'comment_content',
    "valueForMoney_rate" = <valueForMoney_rate>,
    quality_rate = <quality_rate>,
    shipping_rate = <shipping_rate>,
    accuracy_rate = <accuracy_rate>,
    image = 'image_link'
  WHERE id = cast('id' as uuid);
`;

export const DELETE_REVIEW = `
  DELETE FROM "Review"
  WHERE id = cast('id' as uuid);
`;

export const DELETE_REVIEW_IMAGE = `
  UPDATE "Review"
  SET image = NULL
  WHERE id = cast('id' as uuid);
`;


