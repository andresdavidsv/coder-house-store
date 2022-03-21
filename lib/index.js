const Memorialib = require('./daos/Memoria.js');
const MySqlDLib = require('./mysql');
const SQLite3Lib = require('./sqilte3');
const MongoLib = require('./mongo');

class DaoFactory {
  constructor() {
    this.opcion = 0;
  }
  getDao(opcion) {
    switch (opcion) {
      case 1:
        return Memorialib;
      case 2:
        return MySqlDLib;
      case 3:
        return SQLite3Lib;
      case 4:
        return MongoLib;
      default:
        throw new Error('DAO no encontrado');
    }
  }
}

module.exports = new DaoFactory();
