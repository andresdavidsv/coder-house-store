const express = require('express');
const ProductsService = require('../services/products');

//controller
const productsController = require('../controllers/productsControllers');

function productsApi(app) {
  const router = express.Router();
  app.use('/products', router);

  const productsService = new ProductsService();

  router.get('/', productsController.productHome);

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

  router.post('/', productsController.productTable);

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