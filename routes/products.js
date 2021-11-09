const express = require('express');
const ProductsService = require('../services/products');

function productsApi(app) {
  const router = express.Router();
  app.use('/api/v1', router);

  const productsService = new ProductsService();

  router.get('/products', async function (req, res) {

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
    '/productRandom',
    async function (req, res) {

      const data = await productsService.getProductId();
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
}

module.exports = productsApi;