const assert = require('assert');
const proxyquire = require('proxyquire');

const { MongoLibMock, getAllStub } = require('../utils/mocks/mongoLib');

const { productsMock } = require('../utils/mocks/products.js');

describe('services - products', function () {
  const ProductsServices = proxyquire('../services/products', {
    '../lib/mongo': MongoLibMock,
  });

  const productsService = new ProductsServices();

  describe('when getProducts method is called', async function () {
    it('should call the getall MongoLib method', async function () {
      await productsService.getProducts({});
      assert.strictEqual(getAllStub.called, true);
    });

    it('should return an array of products', async function () {
      const result = await productsService.getProducts({});
      const expected = productsMock;
      assert.deepEqual(result, expected);
    });
  });
});
