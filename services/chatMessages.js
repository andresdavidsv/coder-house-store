const MongoLib = require('../lib/mongo');
const { normalize, schema } = require('normalizr');

const schemaAutor = new schema.Entity('author', {}, { idAttribute: 'email' });

const schemaMessage = new schema.Entity(
  'post',
  { author: schemaAutor },
  { idAttribute: '_id' }
);

const schemaMessages = new schema.Entity(
  'posts',
  { messages: [schemaMessage] },
  { idAttribute: 'id' }
);

class ChatMessagesService {
  constructor() {
    this.collection = 'chatMessages';
    this.mongoDB = new MongoLib();
  }
  async getChatMessages({ name }) {
    const query = name && { name: { $in: name } };
    let chatMessages = await this.mongoDB.getAll(this.collection, query);

    chatMessages = {
      id: 'mensaje',
      messages: chatMessages.map((messages) => ({ ...messages })),
    };

    const normalizedData = normalize(chatMessages, schemaMessages);

    const value = JSON.stringify(chatMessages).length;

    const data = {
      status: 'success',
      normalizedData: normalizedData,
      porcentage: (
        (value / JSON.stringify(normalizedData).length) *
        100
      ).toFixed(2),
    };
    return data || [];
  }

  async getChatMessagesNormal({ name }) {
    const query = name && { name: { $in: name } };
    const chatMessages = await this.mongoDB.getAll(this.collection, query);
    return chatMessages || [];
  }

  async createChatMessages(chatMessage) {
    await this.mongoDB.create(this.collection, chatMessage);
    let messages = await this.getChatMessagesNormal('');
    messages = {
      id: 'message',
      messages: messages.map((messages) => ({ ...messages })),
    };

    const normalizedData = normalize(messages, schemaMessages);

    const value = JSON.stringify(messages).length;

    const data = {
      status: 'success',
      normalizedData: normalizedData,
      porcentage: (
        (value / JSON.stringify(normalizedData).length) *
        100
      ).toFixed(2),
    };
    return data;
  }
}

module.exports = ChatMessagesService;