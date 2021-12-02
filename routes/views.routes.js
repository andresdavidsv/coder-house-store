const express = require('express');

//controller
const viewsController = require('../controllers/viewsControllers');

function viewsRoute(app) {
  const router = express.Router();
  app.use('/', router);

  router.get('/', viewsController.viewHome);

}

module.exports = viewsRoute;