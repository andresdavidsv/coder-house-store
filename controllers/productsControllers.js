const ProductsService = require('../services/products');

const productsService = new ProductsService();

exports.productHome = async function (req, res) {
  const products = await productsService.getProducts();
  res.render('products', {
    title: 'Products Table',
    products
  })
}