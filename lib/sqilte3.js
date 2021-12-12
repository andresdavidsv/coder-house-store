const path = require('path');
// Configurations
const optionsSqlite3 = {
  client: 'sqlite3',
  connection: {
    filename: path.join(__dirname, '../ecommerce/chatMessage.sqlite'),
  },
};

const knexSqlite = require('knex')(optionsSqlite3);

class Sqlite3Lib {
  constructor() {
    this.knexSqlite = knexSqlite;
    this.table = 'chatsMessages';
  }
  async database() {
    await this.knexSqlite.schema.hasTable(this.table).then((res) => {
      if (!res) {
        this.knexSqlite.schema
          .createTable(this.table, (table) => {
            table.increments();
            table.string('user').notNullable().defaultTo('User Name');
            table.string('messsage').notNullable();
            table.timestamps(true, true);
          })
          .then((res) => {
            return res;
          });
      } else {
        return;
      }
    });
  }
  async getAll() {
    this.database();
    return await this.knexSqlite(this.table)
      .select()
      .then((res) => {
        return res;
      });
  }
  async get(id) {
    this.database();
    return await this.knexSqlite(this.table)
      .where('id', id)
      .then((res) => {
        return res;
      });
  }
  async create(data) {
    this.database();
    return await this.knexSqlite(this.table)
      .insert(data)
      .then((res) => {
        return res;
      });
  }
  async update(id, data) {
    this.database();
    return await this.knexSqlite(this.table)
      .where('id', id)
      .update(data)
      .then((res) => {
        return res;
      });
  }
  dalete(id) {
    this.database();
    return this.knexSqlite(this.table)
      .where('id', id)
      .del()
      .then((res) => {
        return res;
      });
  }
}

module.exports = Sqlite3Lib;
