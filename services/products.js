const Lib = require('../lib');

class ProductsService {
  constructor() {
    this.collection = 'products';
    this.persistenceDb = new Lib();
  }
  async getProducts() {
    const query = '';
    const products = await this.persistenceDb.getAll(this.collection, query);
    return products || [];
  }
  async getProductId(productId) {
    const product = await this.persistenceDb.get(this.collection, productId);
    return product || {};
  }

  async createProduct(productObj) {
    const createProductId = await this.persistenceDb.create(
      this.collection,
      productObj
    );
    const products = await this.getProductId(createProductId);
    return products;
  }

  async updateProduct({ productId, productObj } = {}) {
    const updateProductId = await this.persistenceDb.update(
      this.collection,
      productId,
      productObj
    );
    return updateProductId;
  }
}

module.exports = ProductsService;
