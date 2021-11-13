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
      const data = await productsService.getProductId({productId});
      if (data.status === 'error') {
        res.status(403).json({
        message: data.message,
      });
    } else {
      res.status(200).json({
        data: data.product,
        message: data.message,
      });
    }
    }
  );

  router.post(
    '/',
    async function (req, res) {
      const { body: product } = req;
      const data = await productsService.createProduct(product);
      res.status(data.status === 'error' ? 403 : 200).json({
      data: data.product,
      message: data.message,
      });
    }
  );

  router.put(
    '/:productId',
    async function (req, res) {
      const { productId } = req.params;
      const { body: product } = req;
      const data = await productsService.updateProduct(productId, product);
      if (data.status === 'error') {
        res.status(403).json({
        message: data.message,
      });
    } else {
      res.status(200).json({
        data: data.products,
        message: data.message,
      });
    }
    }
  );

  router.delete(
    '/:productId',
    async function (req, res) {
      const { productId } = req.params;
      const data = await productsService.deleteProductId({productId});
      res.status(data.status === 'error' ? 403 : 200).json({
      message: data.message,
      });
    }
  );
}

module.exports = productsApi;