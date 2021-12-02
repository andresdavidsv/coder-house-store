const fs = require('fs');

class ChatMessagesService {
  constructor(fileName){
    this.fileName=fileName || 'chatmessagesService.txt';
  }
  async getChatMessages() {
    try {
      let chatMessages = await fs.promises.readFile(`./files/${this.fileName}`, 'utf-8');
      chatMessages = JSON.parse(chatMessages);
      return chatMessages ?
        { status: "success", chatMessages } :
        {status:"error",chatMessages:null, message:"Chat Messages not Found"}
    } catch (error) {
      return {status:"error",message:"Chat Messages not Found"}
    }
  };
  async createChatMessages(chatMessagesObj) {
    try {
      if (!chatMessagesObj || !chatMessagesObj.user || !chatMessagesObj.messsage || !chatMessagesObj.timestamp) {
        throw new Error;
      }
      let chatMessages = await fs.promises.readFile(`./files/${this.fileName}`, 'utf-8');
      chatMessages ? chatMessages = JSON.parse(chatMessages) : chatMessages = [];
      let lastItem = chatMessages[chatMessages.length - 1];
      let chatMessage = {
        ...chatMessagesObj,
        id: lastItem ? lastItem.id + 1 : 1,
      }
      chatMessages.push(chatMessage);
      await fs.promises.writeFile(`./files/${this.fileName}`,JSON.stringify(chatMessages,null,2));
      return { status: "success", chatMessage, message:"Chat Message Saved"}
    }catch(err){
        return {status:"error",message:"Chat Message not Saved"}
    }
  }
}

module.exports = ChatMessagesService;