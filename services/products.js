const MongoLib = require('../lib/mongo');

class ProductsService {
  constructor() {
    this.collection = 'products';
    this.mongoDB = new MongoLib();
  }
  async getProducts() {
    const query = '';
    const products = await this.mongoDB.getAll(this.collection, query);
    return products || [];
  }
  async getProductId(productId) {
    const product = await this.mongoDB.get(this.collection, productId);
    return product || {};
  }

  async createProduct(productObj) {
    const createProductId = await this.mongoDB.create(
      this.collection,
      productObj
    );
    const products = await this.getProductId(createProductId);
    return products;
  }

  async updateProduct({ productId, productObj } = {}) {
    const updateProductId = await this.mongoDB.update(
      this.collection,
      productId,
      productObj
    );
    return updateProductId;
  }
}

module.exports = ProductsService;
