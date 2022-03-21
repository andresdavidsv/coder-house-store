const DaoFactory = require('../lib');
const some = DaoFactory.getDao();

class ApiKeysService {
  constructor() {
    this.collection = 'api-keys';
    this.persistenceDb = new some();
  }
  async getApiKey({ token }) {
    const [apikey] = await this.persistenceDb.getAll(this.collection, {
      token,
    });
    return apikey;
  }
}

module.exports = ApiKeysService;
