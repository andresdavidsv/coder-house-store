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
  async createCart({ cart }) {
    const createCartId = await this.mongoDB.create(this.collection, cart);
    return createCartId;
  }

  async createProductAtCart(cartId, product) {
    const updateCartId = await this.mongoDB.create(
      this.collection,
      cartId,
      product
    );
    return updateCartId;
    try {
      let carts = await fs.promises.readFile(`${this.route}`, 'utf-8');
      carts = JSON.parse(carts);
      let cart = carts.find((cart) => cart.id == cartId);
      if (typeof cart === 'undefined' || !productObj) {
        throw new Error();
      }
      cart.products.push(productObj);
      await fs.promises.writeFile(
        `${this.route}`,
        JSON.stringify(carts, null, 2)
      );
      return {
        status: 'success',
        cart,
        message: 'Product was successfully added',
      };
    } catch (err) {
      return { status: 'error', message: 'Product not added' };
    }
  }

  async deleteCartId({ cartId }) {
    try {
      let carts = await fs.promises.readFile(`${this.route}`, 'utf-8');
      carts = JSON.parse(carts);
      let cart = carts.find((cart) => cart.id == cartId);
      if (typeof cart === 'undefined') {
        throw new Error();
      }
      const index = carts.indexOf(cart);
      carts.splice(index, 1);
      await fs.promises.writeFile(
        `${this.route}`,
        JSON.stringify(carts, null, 2)
      );
      return {
        status: 'success',
        message: `Cart N# ${cart.id} was deleted successfully`,
      };
    } catch (err) {
      return { status: 'error', message: 'Cart not Found' };
    }
  }
  async deleteProductIdAtCartId({ cartId, productId }) {
    try {
      let carts = await fs.promises.readFile(`${this.route}`, 'utf-8');
      carts = JSON.parse(carts);
      let cart = carts.find((cart) => cart.id == cartId);
      if (typeof cart === 'undefined' || !productId) {
        throw new Error();
      }
      const { products } = cart;
      const product = products.find((product) => product.id == productId);
      if (typeof product === 'undefined') {
        throw new Error();
      }
      const index = products.indexOf(product);
      products.splice(index, 1);
      await fs.promises.writeFile(
        `${this.route}`,
        JSON.stringify(carts, null, 2)
      );
      return {
        status: 'success',
        message: `Product N# ${product.id} was deleted successfully`,
      };
    } catch (err) {
      return { status: 'error', message: 'Product not Found' };
    }
  }
}

module.exports = CartsService;
