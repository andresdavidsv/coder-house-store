const express = require('express');
const passport = require('passport');
const ProductsService = require('../services/products');

const {
  productIdSchema,
  createProductSchema,
  updateProductSchema,
} = require('../utils/schemas/products');

// Middleware
const validationHandler = require('../utils/middleware/validationHandlers');
const scopesValidationHandler = require('../utils/middleware/scopesValidationHandler');

const cacheResponse = require('../utils/cacheResponse');
const {
  FIVE_MINUTES_IN_SECONDS,
  SIXTY_MINUTES_IN_SECONDS,
} = require('../utils/time');

//JWT strategy
require('../utils/auth/strategies/jwt');

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
 *        _id: 0
 *        name: Product
 *        description: Its a description of product
 *        code: 0
 *        price: 0
 *        stock: 0
 *        thumbnail: https://example.com/
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
   *              type: array
   *              items:
   *                $ref: '#/components/schemas/Product'
   *      403:
   *        description : The Products not Found
   */

  router.get(
    '/',
    passport.authenticate('jwt', { session: false }),
    scopesValidationHandler(['read:products']),
    async function (req, res, next) {
      cacheResponse(res, FIVE_MINUTES_IN_SECONDS);
      const { name } = req.query;
      try {
        const products = await productsService.getProducts({ name });

        res.status(200).json({
          data: products,
          message: 'products listed',
        });
      } catch (err) {
        next(err);
      }
    }
  );

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

  router.get(
    '/:productId',
    passport.authenticate('jwt', { session: false }),
    scopesValidationHandler(['read:products']),
    validationHandler({ productId: productIdSchema }, 'params'),
    async function (req, res, next) {
      cacheResponse(res, SIXTY_MINUTES_IN_SECONDS);
      const { productId } = req.params;
      try {
        const product = await productsService.getProductId({ productId });

        res.status(200).json({
          data: product,
          message: 'product retrieved',
        });
      } catch (err) {
        next(err);
      }
    }
  );

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
    passport.authenticate('jwt', { session: false }),
    scopesValidationHandler(['create:products']),
    validationHandler(createProductSchema),
    async function (req, res, next) {
      const { body: product } = req;
      try {
        const createdProductId = await productsService.createProduct({
          product,
        });

        res.status(201).json({
          data: createdProductId,
          message: 'material created',
        });
      } catch (err) {
        next(err);
      }
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
    passport.authenticate('jwt', { session: false }),
    scopesValidationHandler(['update:products']),
    validationHandler({ productId: productIdSchema }, 'params'),
    validationHandler(updateProductSchema),
    async function (req, res, next) {
      const { productId } = req.params;
      const { body: product } = req;

      try {
        const updatedProductId = await productsService.updateProduct({
          productId,
          product,
        });

        res.status(200).json({
          data: updatedProductId,
          message: 'product updated',
        });
      } catch (err) {
        next(err);
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
    passport.authenticate('jwt', { session: false }),
    scopesValidationHandler(['delete:products']),
    validationHandler({ productId: productIdSchema }, 'params'),
    async function (req, res, next) {
      const { productId } = req.params;

      try {
        const deleteProductlId = await productsService.deleteProductId({
          productId,
        });
        res.status(200).json({
          data: deleteProductlId,
          message: 'material deleted',
        });
      } catch (err) {
        next(err);
      }
    }
  );
}

module.exports = productsApi;
