const express = require('express');
const CartsService = require('../services/carts');
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
 *    Cart:
 *      type: object
 *      properties:
 *        id:
 *          type: integer
 *          description: The cart ID,
 *        products:
 *          type: array
 *          items:
 *            type: object
 *            $ref: '#/components/schemas/Product'
 *        time_stamp:
 *          type: string
 *          format: date
 *          description: The Date of cart creation
 *      example:
 *        id: 0
 *        products: [{}]
 *        time_stamp: "12/6/2021, 7:33:04 PM"
 */

function cartsApi(app) {
  const router = express.Router();
  app.use('/api/carts', router);
  const cartsService = new CartsService();
  const productsService = new ProductsService();

  /**
   * @swagger
   * /carts/{cartId}/products:
   *  get:
   *    summary : Retrieve all products in a cart
   *    tags: [Carts]
   *    parameters:
   *       - in: path
   *         name: cartId
   *         required: true
   *         description: Numeric ID of the carte to retrieve.
   *         schema:
   *           type: integer
   *    responses:
   *      200:
   *        description : The Cart description by id
   *        content:
   *          aplication/json:
   *            schema:
   *              $ref: '#/components/schemas/Cart'
   *      403:
   *        description : The Cart not Found
   */
  router.get('/:cartId/products', async function (req, res, next) {
    const { cartId } = req.params;
    try {
      const cart = await cartsService.getCartId({ cartId });
      res.status(200).json({
        data: cart,
        message: 'cart retrieved',
      });
    } catch (err) {
      next(err);
    }
  });

  /**
   * @swagger
   * /carts/{cartId}/products:
   *  post:
   *    summary : Add a new product at the cart
   *    tags: [Carts]
   *    requestBody:
   *         required: true
   *         content:
   *            application/json:
   *              schema:
   *                id: integer
   *    responses:
   *      200:
   *        description : The product was successfully added
   *        content:
   *          aplication/json:
   *            schema:
   *              $ref: '#/components/schemas/Cart'
   *      403:
   *        description : The Product not was added
   */

  router.post('/:cartId/products', async function (req, res, next) {
    const { cartId } = req.params;
    const { body: productId } = req;
    let product;
    try {
      product = await productsService.getProductId(productId);
    } catch (err) {
      next(err);
    }
    console.log(product._id.delete())
    // try {
    //   const cart = await cartsService.createProductAtCart(cartId, product);
    //   res.status(200).json({
    //     data: cart,
    //     message: 'cart updated',
    //   });
    // } catch (err) {
    //   next(err);
    // }
  });
  /**
   * @swagger
   * /carts:
   *  post:
   *    summary : Create a new cart
   *    tags: [Carts]
   *    responses:
   *      200:
   *        description : The cart was successfully created
   *        content:
   *          aplication/json:
   *            schema:
   *              type: integer
   *            properties:
   *              id:
   *                 type: integer
   *              description: The product ID,
   *      403:
   *        description : The Cart not was created
   */

  router.post('/', async function (req, res) {
    const data = await cartsService.createCart();
    res.status(data.status === 'error' ? 403 : 200).json({
      data: data.cart,
      message: data.message,
    });
  });

  /**
   * @swagger
   * /carts/{cartId}:
   *  delete:
   *    summary : Remove the cart by the id
   *    tags: [Carts]
   *    parameters:
   *       - in: path
   *         name: cartId
   *         required: true
   *         description: Numeric ID of the cart to delete.
   *         schema:
   *           type: integer
   *    responses:
   *      200:
   *        description : The cart was successfully removed
   *        content:
   *          aplication/json:
   *            schema:
   *              $ref: '#/components/schemas/Cart'
   *      403:
   *        description : The Cart not was removed
   */
  router.delete('/:cartId', async function (req, res) {
    const { cartId } = req.params;
    const data = await cartsService.deleteCartId({ cartId });
    res.status(data.status === 'error' ? 403 : 200).json({
      message: data.message,
    });
  });

  /**
   * @swagger
   * /carts/{cartId}/products/{productId}:
   *  delete:
   *    summary : Remove product from product and the cart by the id
   *    tags: [Carts]
   *    parameters:
   *       - in: path
   *         name: cartId
   *         required: true
   *         description: Numeric ID of the cart.
   *         schema:
   *           type: integer
   *       - in: path
   *         name: productId
   *         required: true
   *         description: Numeric ID of the product to delete.
   *         schema:
   *           type: integer
   *    responses:
   *      200:
   *        description : The cart was successfully removed
   *        content:
   *          aplication/json:
   *            schema:
   *              $ref: '#/components/schemas/Cart'
   *      403:
   *        description : The Product not was removed
   */
  router.delete(
    '/:cartId/products/:productId',
    scopesValidationHandler({ isAdmin: ADMIN }),
    async function (req, res) {
      const { cartId, productId } = req.params;
      const dataProduct = await productsService.deleteProductId({ productId });
      if (dataProduct.status === 'error') {
        res.status(403).json({
          message: dataProduct.message,
        });
      }
      const data = await cartsService.deleteProductIdAtCartId({
        cartId,
        productId,
      });
      if (data.status === 'error') {
        res.status(403).json({
          message: data.message,
        });
      } else {
        res.status(200).json({
          data: data,
          message: data.message,
        });
      }
    }
  );
}

module.exports = cartsApi;
