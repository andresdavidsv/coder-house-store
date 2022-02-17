const MongoLib = require('../lib/mongo');

class ProductsService {
  constructor() {
    this.collection = 'products';
    this.mongoDB = new MongoLib();
  }
  async getProducts() {
    const query = ""
    const products = await this.mongoDB.getAll(this.collection, query);
    return products || [];
  }
  async getProductId({ productId }) {
    const product = await this.mongoDB.get(this.collection, productId);
    return product || {};
  }

  async createProduct(productObj) {
    const { title, price, thumbnail } = productObj;

    const createProductId = await this.mongoDB.create(this.collection, {
      title,
      price,
      thumbnail,
    });
    return createProductId;
  }

  async updateProduct({ productId, productObj } = {}) {
    const updateProductId = await this.mongoDB.update(
      this.collection,
      productId,
      productObj
    );
    return updateProductId;
  }

  async deleteProductId({ productId }) {
    try {
      const product = await this.MySqlLib.delete(productId);
      return {
        status: 'success',
        message: `Product ${product.title} was deleted successfully`,
      };
    } catch (err) {
      return { status: 'error', message: 'Product not Found' };
    }
  }
}

module.exports = ProductsService;
