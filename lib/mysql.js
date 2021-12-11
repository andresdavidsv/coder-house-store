// Configurations
const { config } = require('../config');

const optionsMySql = {
  client: 'mysql',
  connection: {
    host: config.dbHost,
    port: 3308,
    user: config.dbUser,
    password: config.dbPassword,
    database: config.dbName,
  },
  pool: { min: 0, max: 10 },
};

const knex = require('knex')(optionsMySql);

class MySqlLib {
  constructor() {
    this.knex = knex;
    this.table = 'products';
  }
  async database() {
    await this.knex.schema.hasTable(this.table).then((res) => {
      if (!res) {
        this.knex.schema
          .createTable(this.table, (table) => {
            table.increments();
            table.string('title').notNullable().defaultTo('Product Title');
            table.string('price').notNullable();
            table.string('thumbnail').notNullable();
            table.timestamp(true, true);
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
    return await this.knex()
      .select()
      .table(this.table)
      .then((res) => {
        return res;
      });
  }
  async get(id) {
    this.database();
    return await this.knex(this.table)
      .where('id', id)
      .then((res) => {
        return res;
      });
  }
  async create(data) {
    this.database();
    return await this.knex(this.table)
      .insert(data)
      .then((res) => {
        return res;
      });
  }
  async update(id,data) {
    this.database();
    return await this.knex(this.table)
      .where('id', id)
      .update(data)
      .then((res) => {
        return res;
      });
  }
  dalete(id) {
    this.database();
    return this.knex(this.table)
      .where('id', id)
      .del()
      .then((res) => {
        return res;
      });
  }
}

module.exports = MySqlLib;
