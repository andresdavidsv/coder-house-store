const MongoLib = require('../lib/mongo');
const { transporter } = require('../utils/emails/transporter');
const { config } = require('../config');
const debug = require('debug')('app:db');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const client = require('twilio')(accountSid, authToken);

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

  async createProductAtCart(cartId, product, user) {
    const updateCartId = await this.mongoDB.updateElements(
      this.collection,
      cartId,
      product
    );
    try {
      await transporter.sendMail({
        from: '"Coder App 👻" <andres@coder.com>',
        to: `${config.gmailAdmin}`,
        subject: `New Order from ${user.user_name} ${user.email}`,
        text: 'Review Your Products',
        html: `<h1>Hello user</h1>
              <h2>Products List:</h2>
              <span> ${product} </span><br>
      `,
      });
      await client.messages.create({
        body: `Hello, new order was created by ${user.user_name} ${user.email}`,
        from: process.env.WHATSAPP_NUMBER,
        to: process.env.RECEVIED_NUMBER,
      });
      await client.messages.create({
        body: `Hello, new order was created by ${user.user_name} ${user.email}`,
        from: `whatsapp:+14155238886`,
        to: `whatsapp:${process.env.RECEVIED_NUMBER}`,
      });
    } catch (error) {
      debug(error);
    }
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
