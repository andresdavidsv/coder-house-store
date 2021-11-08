const fs = require('fs');

class ProductsService {
  constructor(fileName){
    this.fileName=fileName || 'products.txt';
  }
  async getProducts() {
    try {
      let products = await fs.promises.readFile(`../files/${this.fileName}`, 'utf-8');
      products = JSON.parse(products);
      return products ?
        { status: "success", products } :
        {status:"error",products:null, message:"Products not Found"}
    } catch (error) {
      return {status:"error",message:"Products not Found"}
    }
  };
}

module.exports = ProductsService;