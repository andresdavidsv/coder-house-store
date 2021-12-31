require('dotenv').config();

const config = {
  dev: process.env.NODE_ENV !== 'production',
  dbPort: process.env.PORT || 808,
  cors: process.env.CORS,
  dbUser: process.env.DB_USER,
  dbUserMongo: process.env.DB_USER_MONGO,
  dbPassword: process.env.DB_PASSWORD,
  dbPasswordMongo: process.env.DB_PASSWORD_MONGO,
  dbHost: process.env.DB_HOST,
  dbHostMongo: process.env.DB_HOST_MONGO,
  dbName: process.env.DB_NAME,
  dbNameMongo: process.env.DB_NAME_MONGO,
  defaultAdminPassword: process.env.DEFAULT_ADMIN_PASSWORD,
  defaultUserPassword: process.env.DEFAULT_USER_PASSWORD,
  authJwtSecret: process.env.AUTH_JWT_SECRET,
  publicApiKeyToken: process.env.PUBLIC_API_KEY_TOKEN,
  adminApiKeyToken: process.env.ADMIN_API_KEY_TOKEN,
  scopeRole: process.env.ADMIN,
};

module.exports = { config };