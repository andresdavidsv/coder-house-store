const fs = require('fs');
const path = require('path');

class CartsService {
  constructor(fileName) {
    this.fileName = fileName || 'carts.json';
    this.route = path.join(__dirname, `../files/${this.fileName}`);
  }
  async getCartId({ cartId }) {
    try {
      let carts = await fs.promises.readFile(`${this.route}`, 'utf-8');
      carts = JSON.parse(carts);
      let cart = carts.find((cart) => cart.id == cartId);
      if (typeof cart === 'undefined') {
        throw new Error();
      }
      return { status: 'success', cart, message: 'Cart Found' };
    } catch (err) {
      return { status: 'error', message: 'Cart not Found' };
    }
  }
  async createCart() {
    try {
      let carts = await fs.promises.readFile(`${this.route}`, 'utf-8');
      carts ? (carts = JSON.parse(carts)) : (carts = []);
      let lastItem = carts[carts.length - 1];
      let cart = {
        id: lastItem ? lastItem.id + 1 : 1,
        products: [],
        time_stamp: new Date().toLocaleString('en-US'),
      };
      carts.push(cart);
      await fs.promises.writeFile(
        `${this.route}`,
        JSON.stringify(carts, null, 2)
      );
      return { status: 'success', cart, message: 'Cart Created' };
    } catch (err) {
      return { status: 'error', message: 'Cart not Created' };
    }
  }

  async createProductAtCart(cartId, productObj) {
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
      return { status: 'success', cart, message: 'Product was successfully added' };
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
