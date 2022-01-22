const express = require('express');

//controller
const viewsController = require('../controllers/viewsControllers');

function viewsRoute(app) {
  const router = express.Router();
  app.use('/', router);

  router.get('/', viewsController.viewHome);

  router.get('/logged', viewsController.viewLogin);

  router.get('/logout', viewsController.viewLogout);

  router.get('/register', viewsController.viewRegister);

  router.get('/failregister', viewsController.viewFailRegister);

  router.get('/login', viewsController.viewLoginUser);

  router.get('/faillogin', viewsController.viewFailLogin);

}

module.exports = viewsRoute;