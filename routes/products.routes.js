const express = require('express');
const ProductsService = require('../services/products');

// Configurations
const { config } = require('../config');

// Middleware
const scopesValidationHandler = require('../utils/middleware/scopesValidationHandler');
const ADMIN = config.scopeRole;

/**
 * @swagger
 * components:
 *  schemas:
 *    Product:
 *      type: object
 *      required:
 *        - name
 *        - description
 *        - code
 *        - stock
 *        - price
 *        - thumbnail
 *      properties:
 *        id:
 *          type: integer
 *          description: The product ID,
 *        name:
 *          type: string
 *          description: The product name
 *        description:
 *          type: string
 *          description: The product description
 *        code:
 *          type: integer
 *          description: The product code
 *        stock:
 *          type: integer
 *          description: The product stock
 *        price:
 *          type: integer
 *          description: The product price
 *        thumbnail:
 *          type: string
 *          description: The product image
 *        time_stamp:
 *          type: string
 *          format: date
 *          description: The Date of product creation
 *      example:
 *        id: 0
 *        name: Product
 *        description: Its a description of product
 *        code: 0
 *        price: 0
 *        stock: 0
 *        thumbnail: https://example.com/
 *        time_stamp: "12/6/2021, 7:33:04 PM"
 */

function productsApi(app) {
  const router = express.Router();
  app.use('/api/products', router);
  const productsService = new ProductsService();

  /**
   * @swagger
   * /products:
   *  get:
   *    summary : Return the list of all the products
   *    tags: [Products]
   *    responses:
   *      200:
   *        description : The list of all the products
   *        content:
   *          aplication/json:
   *            schema:
   *              type: array,
   *              items:
   *                $ref: '#/components/schemas/Product'
   *      403:
   *        description : The Products not Found
   */

  router.get('/', async function (req, res) {
    let data = await productsService.getProducts();
    if (data.status === 'error') {
      res.status(403).json({
        data: data.products,
        message: data.message,
      });
    } else {
      res.status(200).json({
        data: data.products,
        message: data.message,
      });
    }
  });

  /**
   * @swagger
   * /products/{productId}:
   *  get:
   *    summary : Retrieve a single product
   *    tags: [Products]
   *    parameters:
   *       - in: path
   *         name: productId
   *         required: true
   *         description: Numeric ID of the product to retrieve.
   *         schema:
   *           type: integer
   *    responses:
   *      200:
   *        description : The product description by id
   *        content:
   *          aplication/json:
   *            schema:
   *              $ref: '#/components/schemas/Product'
   *      403:
   *        description : The Product not Found
   */

  router.get('/:productId', async function (req, res) {
    const { productId } = req.params;
    const data = await productsService.getProductId({ productId });
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
  });

  /**
   * @swagger
   * /products:
   *  post:
   *    summary : Create a new product
   *    tags: [Products]
   *    requestBody:
   *         required: true
   *         content:
   *            application/json:
   *              schema:
   *                $ref: '#/components/schemas/Product'
   *    responses:
   *      200:
   *        description : The product was successfully created
   *        content:
   *          aplication/json:
   *            schema:
   *              $ref: '#/components/schemas/Product'
   *      403:
   *        description : The Product not was created
   */

  router.post(
    '/',
    scopesValidationHandler({ isAdmin: ADMIN }),
    async function (req, res) {
      const { body: product } = req;
      const data = await productsService.createProduct(product);
      res.status(data.status === 'error' ? 403 : 200).json({
        data: data.product,
        message: data.message,
      });
    }
  );

  /**
   * @swagger
   * /products/{productId}:
   *  put:
   *    summary : Update the product by the id
   *    tags: [Products]
   *    parameters:
   *       - in: path
   *         name: productId
   *         required: true
   *         description: Numeric ID of the product to update.
   *         schema:
   *           type: integer
   *    requestBody:
   *         required: true
   *         content:
   *           aplication/json:
   *              schema:
   *                $ref: '#/components/schemas/Product'
   *    responses:
   *      200:
   *        description : The product was successfully updated
   *        content:
   *          aplication/json:
   *            schema:
   *              $ref: '#/components/schemas/Product'
   *      403:
   *        description : The Product not was updated
   */

  router.put(
    '/:productId',
    scopesValidationHandler({ isAdmin: ADMIN }),
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

  /**
   * @swagger
   * /products/{productId}:
   *  delete:
   *    summary : Remove the product by the id
   *    tags: [Products]
   *    parameters:
   *       - in: path
   *         name: productId
   *         required: true
   *         description: Numeric ID of the product to update.
   *         schema:
   *           type: integer
   *    responses:
   *      200:
   *        description : The product was successfully removed
   *        content:
   *          aplication/json:
   *            schema:
   *              $ref: '#/components/schemas/Product'
   *      403:
   *        description : The Product not was removed
   */
  router.delete(
    '/:productId',
    scopesValidationHandler({ isAdmin: ADMIN }),
    async function (req, res) {
      const { productId } = req.params;
      const data = await productsService.deleteProductId({ productId });
      res.status(data.status === 'error' ? 403 : 200).json({
        message: data.message,
      });
    }
  );
}

module.exports = productsApi;
