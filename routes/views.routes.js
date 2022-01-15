const express = require('express');

//controller
const viewsController = require('../controllers/viewsControllers');

function viewsRoute(app) {
  const router = express.Router();
  app.use('/', router);

  router.get('/', viewsController.viewHome);

  router.get('/login', viewsController.viewLogin);

  router.get('/logout', viewsController.viewLogout);

}

module.exports = viewsRoute;