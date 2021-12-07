const ProductsService = require('../services/products');

const productsService = new ProductsService();

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
    });
  }
}

module.exports = Sockets;