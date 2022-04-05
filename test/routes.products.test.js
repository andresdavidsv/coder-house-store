const assert = require('assert');
const proxyquire = require('proxyquire');

const {
  productsMock,
  ProductsServiceMock,
} = require('../utils/mocks/products.js');
const testServer = require('../utils/testServer');

describe('routes - products', function () {
  const route = proxyquire('../routes/products.routes.js', {
    '../services/products.js': { ProductService: ProductsServiceMock },
  });
  const request = testServer(route);
  describe('GET / Products', function () {
    it('should respond with status 200', function (done) {
      request.get('/products').expect(200, done);
    });
    it('should respond whit the list of products', function (done) {
      request.get('/products').end((err, res) => {
        assert.deepEqual(res.body, {
          data: productsMock,
        });
        done();
      });
    });
  });
});
