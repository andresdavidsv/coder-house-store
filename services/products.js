const fs = require('fs');

class ProductsService {
  constructor(fileName){
    this.fileName=fileName || 'products.txt';
  }
  async getProducts() {
    try {
      let products = await fs.promises.readFile(`./files/${this.fileName}`, 'utf-8');
      products = JSON.parse(products);
      return products ?
        { status: "success", products } :
        {status:"error",products:null, message:"Products not Found"}
    } catch (error) {
      return {status:"error",message:"Products not Found"}
    }
  };
  async getProductId(){
        try{
          let products = await fs.promises.readFile(`./files/${this.fileName}`, 'utf-8');
          products = JSON.parse(products);
          let index = [];
          products.forEach(p => index.push(p.id));
          let id = index[Math.floor(Math.random() * index.length)];
          let product = products.find(product=>product.id===id);
          return product ?
          { status: "success", product } :
          {status:"error",product:null, message:"Product not Found"}
        }catch(err){
            return {status:"error",message:"Product not Found"}
        }
    }
}

module.exports = ProductsService;