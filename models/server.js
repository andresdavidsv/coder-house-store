// Dependencies
const express = require('express');
const http = require('http');
const favicon = require('serve-favicon');
const path = require('path');
const exphbs = require('express-handlebars');
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
const compression = require('compression');
const log4js = require('log4js');

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
const debug = require('debug')('app:server');

//Servers
const authApi = require('../routes/auth.routes');
const viewsRoute = require('../routes/views.routes');
const productsApi = require('../routes/products.routes');

log4js.configure({
  appenders: {
      miLoggerConsole: {type: "console"},
      miLoggerFileWarning: {type: 'file', filename: 'warn.log'},
      miLoggerFileError: {type: 'file', filename: 'error.log'}
  },
  categories: {
      default: {appenders: ["miLoggerConsole"], level:"trace"},
      info: {appenders: ["miLoggerConsole"], level: "info"},
      warn: {appenders:["miLoggerFileWarning"], level: "warn"},
      error: {appenders: ["miLoggerFileError"], level: "error"}
  }
});

const loggerInfo = log4js.getLogger('info');

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
    this.app.use(sessionHandler);
    this.app.use(compression());
    this.app.use(favicon(path.join(__dirname, '../public', 'favicon.ico')));
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
    this.app.engine(
      '.hbs',
      exphbs.engine({
        defaultLayout: 'layout',
        ayoutsDir: path.join(this.app.get('views'), 'layouts'),
        partialsDir: path.join(this.app.get('views'), 'partials'),
        extname: '.hbs',
      })
    );
    this.app.set('view engine', '.hbs');

    // The directory where the templates will be stored is indicated.
    this.app.set('views', path.join(__dirname, '../views'));
  }
  configRoutes() {
    authApi(this.app);
    viewsRoute(this.app);
    productsApi(this.app);
  }
  execute() {
    if (config.modeCluster && cluster.isMaster) {

      debug(`Master ${process.pid} is running`);
      loggerInfo.info(`Master ${process.pid} is running`);

      for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
      }

      // eslint-disable-next-line no-unused-vars
      cluster.on('exit', (worker, code, signal) => {
        debug(`Worker ${worker.process.pid} died`);
        loggerInfo.info(`Worker ${worker.process.pid} died`);
      });
    } else {
      this.middleware();
      this.utilities();
      this.configSockets();
      this.configRoutes();
      this.configTemplates();
      this.server.listen(this.port, function () {
        debug(`Listening http://localhost:${config.dbPort}`);
        loggerInfo.info(`Listening http://localhost:${config.dbPort}`);
      });
      process.on('exit', (code) => {
        debug(code);
        loggerInfo.info(code);
      });
      debug(`Worker ${process.pid} started`);
      loggerInfo.info(`Worker ${process.pid} started`);
    }
  }
}

module.exports = Server;
