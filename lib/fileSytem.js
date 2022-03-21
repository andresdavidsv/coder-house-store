const fs = require('fs');

class FileSytemLib {
  constructor(fileName) {
    this.fileName = fileName || 'products.txt';
  }
  async getAll() {
    try {
      let products = await fs.promises.readFile(
        `./files/${this.fileName}`,
        'utf-8'
      );
      products = JSON.parse(products);
      return products
        ? { status: 'success', products }
        : { status: 'error', products: null, message: 'Products not Found' };
    } catch (error) {
      return { status: 'error', message: 'Products not Found' };
    }
  }
  async get({ productId }) {
    try {
      let products = await fs.promises.readFile(
        `./files/${this.fileName}`,
        'utf-8'
      );
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
  async create(Obj) {
    try {
      let products = await fs.promises.readFile(
        `./files/${this.fileName}`,
        'utf-8'
      );
      products ? (products = JSON.parse(products)) : (products = []);
      let lastItem = products[products.length - 1];
      let product = {
        ...Obj,
        id: lastItem ? lastItem.id + 1 : 1,
      };
      products.push(product);
      await fs.promises.writeFile(
        `./files/${this.fileName}`,
        JSON.stringify(products, null, 2)
      );
      return { status: 'success', product, message: 'Product Saved' };
    } catch (err) {
      return { status: 'error', message: 'Product not Saved' };
    }
  }
  async update(productId, productObj) {
    try {
      let products = await fs.promises.readFile(
        `./files/${this.fileName}`,
        'utf-8'
      );
      products = JSON.parse(products);
      let product = products.find((product) => product.id == productId);
      if (typeof product === 'undefined') {
        throw new Error();
      }
      products.map((p) => {
        if (p.id == productId) {
          p.title = productObj.title ? productObj.title : p.title;
          p.price = productObj.price ? productObj.price : p.price;
          p.thumbnail = productObj.thumbnail
            ? productObj.thumbnail
            : p.thumbnail;
        }
        return p;
      });
      await fs.promises.writeFile(
        `./files/${this.fileName}`,
        JSON.stringify(products, null, 2)
      );
      return { status: 'success', products, message: 'Product Updated' };
    } catch (err) {
      return { status: 'error', message: 'Product not Updated' };
    }
  }

  async deleteProductId({ productId }) {
    try {
      let products = await fs.promises.readFile(
        `./files/${this.fileName}`,
        'utf-8'
      );
      products = JSON.parse(products);
      let product = products.find((product) => product.id == productId);
      if (typeof product === 'undefined') {
        throw new Error();
      }
      const index = products.indexOf(product);
      products.splice(index, 1);
      await fs.promises.writeFile(
        `./files/${this.fileName}`,
        JSON.stringify(products, null, 2)
      );
      return {
        status: 'success',
        message: `Product ${product.title} was deleted successfully`,
      };
    } catch (err) {
      return { status: 'error', message: 'Product not Found' };
    }
  }
}

module.exports = FileSytemLib;
