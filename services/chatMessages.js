const Sqlite3Lib = require('../lib/sqilte3');

class ChatMessagesService {
  constructor() {
    this.Sqlite3Lib = new Sqlite3Lib();
  }
  async getChatMessages() {
    try {
      let chatMessages = await this.Sqlite3Lib.getAll();
      return { status: 'success', chatMessages }

    } catch (error) {
      return { status: 'error', message: 'Chat Messages not Found' };
    }
  }
  async createChatMessages(chatMessagesObj) {
    try {
      if (
        !chatMessagesObj ||
        !chatMessagesObj.user ||
        !chatMessagesObj.messsage
      ) {
        throw new Error();
      }
      const chatMessageId = await this.Sqlite3Lib.create(chatMessagesObj);
      let chatMessage = await this.Sqlite3Lib.get(chatMessageId[0]);
      chatMessage = JSON.parse(JSON.stringify(chatMessage));
      return {
        status: 'success',
        chatMessage: chatMessage[0],
        message: 'Chat Message Saved',
      };
    } catch (err) {
      return { status: 'error', message: 'Chat Message not Saved' };
    }
  }
}

module.exports = ChatMessagesService;
