const express = require('express');
const path = require('path');

const { config } = require('./config');

//Servers
const app = express();
const viewsRoute = require('./routes/views');
const productsApi = require('./routes/products');

//Middleware
const corsHandler = require('./utils/middleware/corsHandler');

//Helpers
const helpers = require('./utils/helpers/helpers');

// body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(corsHandler());
app.use('/static', express.static(__dirname + '/public'));

//vardump
app.use((req, res, next) => {
  res.locals.vardump = helpers.vardump;
  next();
});

//Routes
viewsRoute(app);
productsApi(app);

// The template engine to be used is indicated
app.set('view engine', 'pug');

// The directory where the templates will be stored is indicated.
app.set('views', path.join(__dirname, 'views'));


//Service
app.listen(config.dbPort, function () {
  const debug = require('debug')('app:server');
  debug(`Listening http://localhost:${config.dbPort}`);
});