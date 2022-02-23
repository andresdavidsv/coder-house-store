const express = require('express');
const passport = require('passport');

// Services
const CartsService = require('../services/carts');
const ProductsService = require('../services/products');

// Middleware
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
  router.get(
    '/:cartId/products',
    passport.authenticate('jwt', { session: false }),
    scopesValidationHandler(['read:carts']),
    async function (req, res, next) {
      cacheResponse(res, FIVE_MINUTES_IN_SECONDS);
      const { user } = req;
      const { cartId } = req.params;
      try {
        const cart = await cartsService.getCartId({ cartId, user });
        res.status(200).json({
          data: cart,
          message: 'cart retrieved',
        });
      } catch (err) {
        next(err);
      }
    }
  );

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

  router.post(
    '/:cartId/products',
    passport.authenticate('jwt', { session: false }),
    scopesValidationHandler(['create:carts']),
    async function (req, res, next) {
      cacheResponse(res, SIXTY_MINUTES_IN_SECONDS);
      const { cartId } = req.params;
      const { body: productId } = req;
      let product;
      try {
        product = await productsService.getProductId(productId);
      } catch (err) {
        next(err);
      }
      try {
        const cart = await cartsService.createProductAtCart(cartId, product);
        res.status(200).json({
          data: cart,
          message: 'cart updated',
        });
      } catch (err) {
        next(err);
      }
    }
  );
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

  router.post(
    '/',
    passport.authenticate('jwt', { session: false }),
    scopesValidationHandler(['update:carts']),
    async function (req, res, next) {
      try {
        const createdCartId = await cartsService.createCart();
        res.status(201).json({
          data: createdCartId,
          message: 'cart created',
        });
      } catch (err) {
        next(err);
      }
    }
  );

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
  router.delete(
    '/:cartId',
    passport.authenticate('jwt', { session: false }),
    scopesValidationHandler(['delete:carts']),
    async function (req, res, next) {
      const { cartId } = req.params;
      try {
        const deleteCartId = await cartsService.deleteCartId({ cartId });
        res.status(200).json({
          data: deleteCartId,
          message: 'cart deleted',
        });
      } catch (err) {
        next(err);
      }
    }
  );

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
    passport.authenticate('jwt', { session: false }),
    scopesValidationHandler(['delete:carts']),
    async function (req, res, next) {
      const { cartId, productId } = req.params;
      try {
        await productsService.deleteProductId({
          productId,
        });
      } catch (err) {
        next(err);
      }
      try {
        const deleteElementCartId = await cartsService.deleteProductIdAtCartId(
          cartId,
          productId
        );
        res.status(200).json({
          data: deleteElementCartId,
          message: 'Element deleted',
        });
      } catch (err) {
        next(err);
      }
    }
  );
}

module.exports = cartsApi;
