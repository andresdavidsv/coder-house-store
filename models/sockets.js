const ProductsService = require('../services/products');
const ChatMessagesService = require('../services/chatMessages');

const productsService = new ProductsService();
const chatMessagesService = new ChatMessagesService();

class Sockets {
  constructor(io) {
    this.io = io;
    this.socketEvents();
  }
  socketEvents() {
    // On Conecction
    this.io.on('connection', async (socket) => {
      //Listen Events from Products
      let productsData = await productsService.getProducts();
      this.io.emit('products-from-server', productsData);
      socket.on('products-to-server', async (data) => {
        const {product} = await productsService.createProduct(data);
        productsData.products.push(product);
        this.io.emit('products-from-server', productsData);
      })
      //Listen Events from Chat
      let chatMessagesData = await chatMessagesService.getChatMessages();
      this.io.emit('msg-from-server', chatMessagesData);
      socket.on('msg-to-server', async (data) => {
        const {chatMessage} = await chatMessagesService.createChatMessages(data);
        chatMessagesData.chatMessages.push(chatMessage);
        this.io.emit('msg-from-server', chatMessagesData);
      })
    });
  }
}

module.exports = Sockets;