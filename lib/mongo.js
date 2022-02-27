const { MongoClient, ObjectId } = require('mongodb');
const { config } = require('../config');

const USER = encodeURIComponent(config.dbUserMongo);
const PASSWORD = encodeURIComponent(config.dbPasswordMongo);
const DB_NAME = config.dbNameMongo;

const MONGO_URI = `mongodb+srv://${USER}:${PASSWORD}@${config.dbHostMongo}/${DB_NAME}?retryWrites=true&w=majority`;

class MongoLib {
  constructor() {
    this.client = new MongoClient(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    this.dbName = DB_NAME;
  }

  connect() {
    if (!MongoLib.connection) {
      MongoLib.connection = new Promise((resolve, reject) => {
        this.client.connect((err) => {
          if (err) {
            reject(err);
          }

          const debug = require('debug')('app:db');
          debug('Connected succesfully to mongo');
          resolve(this.client.db(this.dbName));
        });
      });
    }

    return MongoLib.connection;
  }

  getAll(collection, query) {
    return this.connect().then((db) => {
      return db.collection(collection).find(query).toArray();
    });
  }

  get(collection, id) {
    return this.connect().then((db) => {
      return db.collection(collection).findOne({ _id: ObjectId(id) });
    });
  }

  create(collection, data) {
    return this.connect()
      .then((db) => {
        return db.collection(collection).insertOne(data);
      })
      .then((result) => result.insertedId);
  }

  update(collection, id, data) {
    return this.connect()
      .then((db) => {
        return db
          .collection(collection)
          .updateOne({ _id: ObjectId(id) }, { $set: data }, { upsert: true });
      })
      .then((result) => result.upsertedId || id);
  }

  delete(collection, id) {
    return this.connect()
      .then((db) => {
        return db.collection(collection).deleteOne({ _id: ObjectId(id) });
      })
      .then(() => id);
  }
  updateElements(collection, id, data) {
    return this.connect()
      .then((db) => {
        return db.collection(collection).updateOne(
          { _id: ObjectId(id) },
          {
            $push: {
              products: {
                $each: [data],
                $position: -1,
              },
            },
          }
        );
      })
      .then((result) => result.upsertedId || id);
  }
  deleteElement(collection, id, productId) {
    return this.connect()
      .then((db) => {
        return db.collection(collection).updateOne(
          { _id: ObjectId(id) },
          {
            $pull: {
              products: { _id: ObjectId(productId) },
            },
          }
        );
      })
      .then((result) => result.upsertedId || id);
  }
}

module.exports = MongoLib;
