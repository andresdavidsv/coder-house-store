const express = require('express');
const ProductsService = require('../services/products');

function productsApi(app) {
  const router = express.Router();
  app.use('/api/v1/products', router);

  const productsService = new ProductsService();

  router.get('/', async function (req, res) {

    let data = await productsService.getProducts();
    if (data.status === 'error') {
      res.status(403).json({
        data: data.product,
        message: data.message,
      });
    } else {
      res.status(200).json({
        data: data.products,
        message: 'products listed',
      });
    }

  });

  router.get(
    '/:productId',
    async function (req, res) {
      const { productId } = req.params;
      const data = await productsService.getProductId(productId);
      if (data.status === 'error') {
        res.status(403).json({
        data: data.product,
        message: data.message,
      });
    } else {
      res.status(200).json({
        data: data.product,
        message: 'product listed',
      });
    }
    }
  );

  router.post(
    '/',
    async function (req, res) {
      const { body: product } = req;
    }
  );
}

module.exports = productsApi;