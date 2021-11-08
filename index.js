const express = require('express');

const { config } = require('./config');

//Servers
const app = express();

const productsApi = require('./routes/products');

// body parser
app.use(express.json())


//Routes
productsApi(app);

//Service
app.listen(config.dbPort, function () {
  const debug = require('debug')('app:server');
  debug(`Listening http://localhost:${config.dbPort}`);
});