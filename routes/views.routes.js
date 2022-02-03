const express = require('express');
const { config } = require('../config');

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

  router.get('/info', viewsController.viewInfo);

  router.get('/api/randoms', viewsController.viewNumberRandom);

  router.get('/datos', (_request, response) => {
    console.log(`PORT: ${config.dbPort} --> FYH: ${Date.now()}`);

    return response
      .status(200)
      .send(
        `Servidor Express <span style="color: blueviolet;">(Nginx)</span> en ${config.dbPort} - <b>PID ${
          process.pid
        }</b> - ${new Date().toLocaleString()}`
      );
  });
}

module.exports = viewsRoute;