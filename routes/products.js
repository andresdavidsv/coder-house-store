const express = require('express');
const ProductsService = require('../services/products');

function productsApi(app) {
  const router = express.Router();
  app.use('/api/v1/products', router);

  const productsService = new ProductsService();

  router.get('/', async function (req, res) {

    let data = await productsService.getProducts();
    console.log(data);
    // if (data.status === 'error') {
    //   res.status(403).json({
    //     message: data.message,
    //   });
    // } else {
    //   res.status(200).json({
    //     data: data.products,
    //     message: 'products listed',
    //   });
    // }

  });

  router.get(
    '/productRandom',
    async function (req, res) {

      const data = await productsService.getUserId(1);

        res.status(200).json({
          data,
          message: 'product retrieved',
        });
    }
  );
}

module.exports = productsApi;