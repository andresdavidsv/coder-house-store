const express = require('express');
const http = require('http');
const path = require('path');
const exphbs = require('express-handlebars');

// Configurations
const { config } = require('../config');

// Sockets
const socketio = require('socket.io');
const Sockets = require('./sockets');

//Middleware
const corsHandler = require('../utils/middleware/corsHandler');
const sessionHandler = require('../utils/middleware/sessionHandler');

//Helpers
const helpers = require('../utils/helpers/helpers');

//Servers
const viewsRoute = require('../routes/views.routes');
const productsApi = require('../routes/products.routes');

class Server {
  constructor() {
    this.app = express();
    this.port = config.dbPort;
    // Http Server
    this.server = http.createServer(this.app);
    // Config Socket
    this.io = socketio(this.server, {/* Config */ });
  }
  configSockets() {
    new Sockets(this.io);
  }
  middleware() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(corsHandler());
    this.app.use(sessionHandler);
    this.app.use('/static', express.static('public'));
  }
  utilities() {
    this.app.use((req, res, next) => {
      res.locals.vardump = helpers.vardump;
      next();
    });
  }
  configTemplates() {
    // The template engine to be used is indicated
    this.app.engine('.hbs', exphbs.engine({
      defaultLayout: 'layout',
      ayoutsDir: path.join(this.app.get('views'), 'layouts'),
      partialsDir: path.join(this.app.get('views'), 'partials'),
      extname: '.hbs'
    }));
    this.app.set('view engine', '.hbs');

    // The directory where the templates will be stored is indicated.
    this.app.set('views', path.join(__dirname, '../views'));
  }
  configRoutes() {
    viewsRoute(this.app);
    productsApi(this.app);
  }
  execute() {
    this.middleware();
    this.utilities();
    this.configSockets();
    this.configRoutes();
    this.configTemplates();
    this.server.listen(this.port, function () {
      const debug = require('debug')('app:server');
      debug(`Listening http://localhost:${config.dbPort}`);
    });
  }
}

module.exports = Server;