const MongoLib = require('../lib/mongo');

class CartsService {
  constructor() {
    this.collection = 'carts';
    this.mongoDB = new MongoLib();
  }
  async getCartId({ cartId }) {
    const cart = await this.mongoDB.get(this.collection, cartId);
    return cart || [];
  }
  async createCart() {
    const createCartId = await this.mongoDB.create(this.collection, {
      products: [],
    });
    return createCartId;
  }

  async createProductAtCart(cartId, product) {
    const updateCartId = await this.mongoDB.updateElements(
      this.collection,
      cartId,
      product
    );
    return updateCartId;
  }

  async deleteCartId({ cartId }) {
    const deleteCartId = await this.mongoDB.delete(this.collection, cartId);
    return deleteCartId;
  }
  async deleteProductIdAtCartId(cartId, productId) {
    const deleteElementCartId = await this.mongoDB.deleteElement(
      this.collection,
      cartId,
      productId
    );
    return deleteElementCartId;
  }
}

module.exports = CartsService;
