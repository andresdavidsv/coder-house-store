const session = require('express-session');
const connectMongo = require('connect-mongo');
const { config } = require('../../config');

const USER = encodeURIComponent(config.dbUserMongo);
const PASSWORD = encodeURIComponent(config.dbPasswordMongo);
const DB_NAME = config.dbNameMongo;
const DB_HOST = config.dbHostMongo;

const sessionHandler = session({
  store: connectMongo.create({
    mongoUrl: `mongodb+srv://${USER}:${PASSWORD}@${DB_HOST}/${DB_NAME}?retryWrites=true&w=majority`,
  }),
  secret: config.sessionKey,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 10 * 60 * 1000,
  },
});

module.exports = sessionHandler;
