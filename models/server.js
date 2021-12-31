// Dependences
const express = require('express');
const http = require('http');
const swaggerUI = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const helmet = require('helmet');

// Configurations
const { config } = require('../config');

// Sockets
const socketio = require('socket.io');
const Sockets = require('./sockets');

//Middleware
const corsHandler = require('../utils/middleware/corsHandler');
const notFoundHandler = require('../utils/middleware/notFoundHandler');
const {
  logErrors,
  wrapErrors,
  errorHandler,
} = require('../utils/middleware/errorHandlers');

//Helpers
const helpers = require('../utils/helpers/helpers');

//Servers
const productsApi = require('../routes/products.routes');
const cartsApi = require('../routes/carts.routes');

class Server {
  constructor() {
    this.app = express();
    this.port = config.dbPort;
    // Http Server
    this.server = http.createServer(this.app);
    // Config Socket
    this.io = socketio(this.server, {
      /* Config */
    });
  }
  configSockets() {
    new Sockets(this.io);
  }
  middleware() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(corsHandler());
    this.app.use(helmet());
    this.app.use('/static', express.static('public'));
    //Error middleware
    this.app.use(logErrors);
    this.app.use(wrapErrors);
    this.app.use(errorHandler);
  }
  utilities() {
    this.app.use((req, res, next) => {
      res.locals.vardump = helpers.vardump;
      next();
    });
  }
  configRoutes() {
    productsApi(this.app);
    cartsApi(this.app);
    this.app.use(notFoundHandler);
  }
  configDocumentation() {
    const options = {
      definition: {
        openapi: '3.0.0',
        info: {
          title: 'Coder House Store API Documentation',
          version: '1.0.0',
          description:
            'This is a REST API application made with Express. This API is to apply the knowledge acquired during the Backend course at Coder House.',
        },
        servers: [
          {
            url: `http://localhost:${config.dbPort}/api`,
            description: 'Development server',
          },
          {
            url: `https://coder-house-store.vercel.app/api`,
            description: 'Production server',
          },
        ],
      },
      apis: ['./routes/*.routes.js'],
    };
    const specs = swaggerJsDoc(options);
    this.app.use('/docs', swaggerUI.serve, swaggerUI.setup(specs));
  }
  execute() {
    this.utilities();
    this.configSockets();
    this.configDocumentation();
    this.middleware();
    this.configRoutes();
    this.server.listen(this.port, function () {
      const debug = require('debug')('app:server');
      debug(`Listening http://localhost:${config.dbPort}`);
    });
  }
}

module.exports = Server;
