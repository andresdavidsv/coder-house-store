const MongoLib = require('../lib/mongo');

class ApiKeysService {
  constructor() {
    this.collection = 'api-keys';
    this.mongoDb = new MongoLib();
  }
  async getApiKey({ token }) {
    const [apikey] = await this.mongoDb.getAll(this.collection, { token });
    return apikey;
  }
}

module.exports = ApiKeysService;
