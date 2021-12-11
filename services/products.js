const MySqlLib = require('../lib/mysql');

class ProductsService {
  constructor(fileName) {
    this.fileName = fileName || 'products.txt';
    this.MySqlLib = new MySqlLib();
  }
  async getProducts() {
    try {
      let products = await this.MySqlLib.getAll();
      return { status: 'success', products };
    } catch (error) {
      return { status: 'error', message: 'Products not Found' };
    }
  }
  async getProductId({ productId }) {
    try {
      let product = await this.MySqlLib.get(productId);
      product = JSON.parse(JSON.stringify(product));
      return { status: 'success', product, message: 'Product Found' };
    } catch (err) {
      return { status: 'error', message: 'Product not Found' };
    }
  }
  async createProduct(productObj) {
    try {
      const productId = await this.MySqlLib.create(productObj);
      let product = await this.MySqlLib.get(productId[0]);
      product = JSON.parse(JSON.stringify(product));
      return {
        status: 'success',
        product: product[0],
        message: 'Product Saved',
      };
    } catch (err) {
      return { status: 'error', message: 'Product not Saved' };
    }
  }
  async updateProduct(productId, productObj) {
    try {
      const products = await this.MySqlLib.update(productId, productObj);
      return { status: 'success', products, message: 'Product Updated' };
    } catch (err) {
      return { status: 'error', message: 'Product not Updated' };
    }
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
