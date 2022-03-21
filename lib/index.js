const Memorialib = require('./daos/Memoria.js');
const MySqlDLib = require('./mysql');
const SQLite3Lib = require('./sqilte3');
const MongoLib = require('./mongo');
const FileSytemLib = require('./fileSytem');

class DaoFactory {
  constructor() {
    this.opcion = 0;
  }
  getDao(opcion) {
    switch (opcion) {
      case 1:
        return Memorialib;
      case 2:
        return FileSytemLib;
      case 3:
        return MySqlDLib;
      case 4:
        return SQLite3Lib;
      case 5:
        return MongoLib;
      default:
        return MongoLib;
    }
  }
}

module.exports = new DaoFactory();
