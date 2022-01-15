const ProductsService = require('../services/products');
const ChatMessagesService = require('../services/chatMessages');
const sessionHandler = require('../utils/middleware/sessionHandler');

const productsService = new ProductsService();
const chatMessagesService = new ChatMessagesService();

class Sockets {
  constructor(io) {
    this.io = io;
    this.socketEvents();
  }
  socketEvents() {
    this.io.use(function (socket, next) {
      sessionHandler(socket.request, socket.request.res, next);
    });
    // On Conecction
    this.io.on('connection', async (socket) => {
      //Listen Events from Products
      let productsData = await productsService.getProducts();
      this.io.emit('products-from-server', productsData);
      socket.on('products-to-server', async (data) => {
        const { product } = await productsService.createProduct(data);
        productsData.products.push(product);
        this.io.emit('products-from-server', productsData);
      });
      //Listen Events from Chat
      let chatMessagesData = await chatMessagesService.getChatMessages('');
      this.io.emit('msg-from-server', chatMessagesData);
      socket.on('msg-to-server', async (data) => {
        const messages = await chatMessagesService.createChatMessages(data);
        this.io.emit('msg-from-server', messages);
      });
    });
  }
}

module.exports = Sockets;
