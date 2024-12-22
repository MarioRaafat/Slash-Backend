export const GET_CHAT_OF_USER = `
SELECT * FROM "Chat" WHERE user_id = cast('user_id' as uuid);  
`;

export const GET_CHAT_WITH_ID = `
  SELECT * FROM "Chat" WHERE id = cast('chat_id' as uuid);
  `;

export const CREATE_CHAT = `
  INSERT INTO "Chat" (id, user_id, recipient_id, message, created_at)
  VALUES (cast('chat_id' as uuid), cast('user_id' as uuid), cast('recipient_id' as uuid), '$message', NOW())
  RETURNING *;
`;

export const DELETE_MESSAGES = `
  DELETE FROM "Message" WHERE chat_id = cast('chat_id' as uuid);
  `;

export const DELETE_CHAT = `
  DELETE FROM "Chat" WHERE id = cast('chat_id' as uuid) AND user_id = cast('user_id' as uuid);
  `;

  export const GET_MESSAGES_BY_CHAT_AND_SENDER = `
  SELECT *
  FROM "Message"
  WHERE chat_id = cast('chat_id' as uuid)
    AND sender_id = cast('sender_id' as uuid)
    AND receiver_id IS NULL
  ORDER BY created_at DESC;
`;

export const GET_MESSAGES_BY_CHAT_AND_RECIEVER = `
  SELECT *
  FROM "Message"
  WHERE chat_id = cast('chat_id' as uuid)
    AND receiver_id = cast('receiver_id' as uuid)
    AND sender_id IS NULL
  ORDER BY created_at DESC;
`;

export const GET_PRODUCT_MESSAGES_BY_MESSAGE_ID = `
  SELECT *
  FROM "ProductMessage"
  WHERE message_id = cast('message_id' as uuid);
`;

export const CREATE_MESSAGE_SENDED = `
  INSERT INTO "Message" (id, text, chat_id, sender_id, file)
  VALUES (cast('message_id' as uuid), 'text_content', cast('chat_id' as uuid), cast('sender_id' as uuid), 'file_content');
`;

export const CREATE_MESSAGE_RECIEVED = `
  INSERT INTO "Message" (id, text, chat_id, receiver_id, file)
  VALUES (cast('message_id' as uuid), 'text_content', cast('chat_id' as uuid), cast('receiver_id' as uuid), 'file_content');
  RETURNING *
`;

export const CREATE_PRODUCT_MESSAGE = `
  INSERT INTO "productMessage" (id, product_id, message_id, image)
  VALUES (cast('id' AS uuid), cast('id' AS uuid), cast('id' AS uuid), 'image_link')
  RETURNING *;
`;
