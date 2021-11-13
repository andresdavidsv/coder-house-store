const express = require('express');

const { config } = require('./config');

//Servers
const app = express();

const productsApi = require('./routes/products');

//Middleware
const corsHandler = require('./utils/middleware/corsHandler');

// body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(corsHandler());
app.use('/static', express.static(__dirname + '/public'));

//Routes
productsApi(app);

//Service
app.listen(config.dbPort, function () {
  const debug = require('debug')('app:server');
  debug(`Listening http://localhost:${config.dbPort}`);
});