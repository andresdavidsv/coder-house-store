const fs = require('fs');
const path = require('path');

class ProductsService {
  constructor(fileName) {
    this.fileName = fileName || 'products.json';
    this.route = path.join(__dirname, `../files/${this.fileName}`);
  }
  async getProducts() {
    try {
      let products = await fs.promises.readFile(
        `${this.route}`,
        'utf-8'
      );
      products = JSON.parse(products);
      return products
        ? { status: 'success', products, message: 'Products Listed' }
        : { status: 'error', products: null, message: 'Products not Found' };
    } catch (error) {
      return { status: 'error', message: 'Products not Found' };
    }
  }
  async getProductId({ productId }) {
    try {
      let products = await fs.promises.readFile(`${this.route}`, 'utf-8');
      products = JSON.parse(products);
      let product = products.find((product) => product.id == productId);
      if (typeof product === 'undefined') {
        throw new Error();
      }
      return { status: 'success', product, message: 'Product Found' };
    } catch (err) {
      return { status: 'error', message: 'Product not Found' };
    }
  }
  async createProduct(productObj) {
    try {
      if (
        !productObj ||
        !productObj.name ||
        !productObj.description ||
        !productObj.code ||
        !productObj.stock ||
        !productObj.price ||
        !productObj.thumbnail
      ) {
        throw new Error();
      }
      delete productObj.id;
      delete productObj.time_stamp;
      let products = await fs.promises.readFile(`${this.route}`, 'utf-8');
      products ? (products = JSON.parse(products)) : (products = []);
      let lastItem = products[products.length - 1];
      let product = {
        ...productObj,
        id: lastItem ? lastItem.id + 1 : 1,
        time_stamp: new Date().toLocaleString('en-US'),
      };
      products.push(product);
      await fs.promises.writeFile(
        `${this.route}`,
        JSON.stringify(products, null, 2)
      );
      return { status: 'success', product, message: 'Product Saved' };
    } catch (err) {
      return { status: 'error', message: 'Product not Saved' };
    }
  }
  async updateProduct(productId, productObj) {
    try {
      if (!productObj) {
        throw new Error();
      }
      delete productObj.id;
      delete productObj.time_stamp;
      let products = await fs.promises.readFile(`${this.route}`, 'utf-8');
      products = JSON.parse(products);
      let product = products.find((product) => product.id == productId);
      if (typeof product === 'undefined') {
        throw new Error();
      }
      products.map((p) => {
        if (p.id == productId) {
          p.name = productObj.name ? productObj.name : p.name;
          p.description = productObj.description
            ? productObj.description
            : p.description;
          p.code = productObj.code ? productObj.code : p.code;
          p.stock = productObj.stock ? productObj.stock : p.stock;
          p.price = productObj.price ? productObj.price : p.price;
          p.thumbnail = productObj.thumbnail
            ? productObj.thumbnail
            : p.thumbnail;
        }
        return p;
      });
      await fs.promises.writeFile(
        `${this.route}`,
        JSON.stringify(products, null, 2)
      );
      return { status: 'success', products, message: 'Product Updated' };
    } catch (err) {
      return { status: 'error', message: 'Product not Updated' };
    }
  }

  async deleteProductId({ productId }) {
    try {
      let products = await fs.promises.readFile(`${this.route}`, 'utf-8');
      products = JSON.parse(products);
      let product = products.find((product) => product.id == productId);
      if (typeof product === 'undefined') {
        throw new Error();
      }
      const index = products.indexOf(product);
      products.splice(index, 1);
      await fs.promises.writeFile(
        `${this.route}`,
        JSON.stringify(products, null, 2)
      );
      return {
        status: 'success',
        message: `Product ${product.name} was deleted successfully`,
      };
    } catch (err) {
      return { status: 'error', message: 'Product not Found' };
    }
  }
}

module.exports = ProductsService;
