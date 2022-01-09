const faker = require('faker');
const ProductsService = require('../services/products');

const productsService = new ProductsService();

exports.productHome = async function (req, res) {
  const products = await productsService.getProducts();
  res.render('products', {
    title: 'Products Table',
    products,
  });
};
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
};

exports.productsRandom = async function (req, res) {
  let id = 0;
  const products = [];
  for (let index = 0; index < 5; index++) {
    products.push({
      id: ++id,
      title: faker.commerce.productName(),
      price: faker.commerce.price(),
      thumbnail: faker.image.image(),
    });
  }
  res.render('products-test', {
    title: 'Products Random',
    products,
    message: 'Products generated random',
  });
};
