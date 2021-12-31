const MongoLib = require('../lib/mongo');

class ProductsService {
  constructor() {
    this.collection = 'products';
    this.mongoDB = new MongoLib();
  }
  async getProducts({ name }) {
    const query = name && { name: { $in: name } };
    const products = await this.mongoDB.getAll(this.collection, query);
    return products || [];
  }
  async getProductId({ productId }) {
    const product = await this.mongoDB.get(this.collection, productId);
    return product || {};
  }
  async createProduct({ product }) {
    const createProductId = await this.mongoDB.create(this.collection, product);
    return createProductId;
  }
  async updateProduct({ productId, product } = {}) {
    const updateProductId = await this.mongoDB.update(this.collection, productId, product);
    return updateProductId;
  }

  async deleteProductId({ productId }) {
    const deleteProductId = await this.mongoDB.delete(this.collection, productId);
    return deleteProductId;
  }
}

module.exports = ProductsService;
