const ProductsService = require('../services/products');

const productsService = new ProductsService();

exports.productHome = async function (req, res) {
  const products = await productsService.getProducts();
  res.render('products', {
    title: 'Products Table',
    products
  })
}
exports.productTable = async function (req, res) {
  const { body: product } = req;
  const data = await productsService.createProduct(product);
  if (data.status === 'error') {
    res.status(403).json({
    data: data.product,
    message: data.message,
    });
  }
  res.redirect('/');
}