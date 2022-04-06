const assert = require('assert');
const proxyquire = require('proxyquire');

const {
  productsMock,
  ProductsServiceMock,
} = require('../utils/mocks/products.js');
const testServer = require('../utils/testServer');

describe('routes - products', function () {
  const route = proxyquire('../routes/products.routes.js', {
    '../services/products': ProductsServiceMock,
  });

  const request = testServer(route);
  describe('GET /products', function () {
    // it('should respond with status 200', function (done) {
    //   request.get('/products').expect(200);
    //   done();
    // });

    // it('should respond with the list of products', function (done) {
    //   request.get('/products').end((err, res) => {
    //     assert.deepEqual(res.body, {
    //       data: productsMock,
    //       message: 'products listed',
    //     });
    //   });
    //   done();
    // });
  });
});
