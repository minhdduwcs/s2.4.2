const { MongoClient } = require('mongodb');
const util = require('util');

class DBUtil {
  constructor(connArgs, dbName) {
    this.db = null;
    this.url = this.buildConnectionString(connArgs);
    this.dbName = dbName;
    this.connection = null;
  }

  buildConnectionString(host, port, name, username, password, authSource) {
    if (__isObject(host)) {
      const mongodbConf = host;
      host = mongodbConf.host;
      port = mongodbConf.port;
      name = mongodbConf.name || mongodbConf.db;
      username = mongodbConf.username || mongodbConf.user;
      password = mongodbConf.password;
      authSource = mongodbConf.authSource;
    }

    let mongodbAuth = [];
    if (__isString(username) && username.length > 0) {
      mongodbAuth.push(username);
      if (__isString(password)) {
        mongodbAuth.push(':', password, '@');
      }
    }
    mongodbAuth = mongodbAuth.join('');

    let url = util.format(
      'mongodb://%s%s:%s/%s',
      mongodbAuth,
      host,
      port,
      name
    );

    if (authSource) {
      url = [url, '?authSource=', authSource].join('');
    }

    return url;
  }

  async start() {
    this.connection = await MongoClient.connect(this.url, {
      useNewUrlParser: true,
    });
    this.db = this.connection.db(this.dbName);
  }

  stop() {
    return this.connection.close();
  }

  async cleanup() {
    const collections = await this.db.listCollections().toArray();
    return Promise.all(
      collections
        .map(({ name }) => name)
        .map((collection) => this.db.collection(collection).drop())
    );
  }

  getCollection(collectionName) {
    return this.db.collection(collectionName);
  }

  insertCollections(collectionMappings) {
    return Promise.all(
      Object.entries(collectionMappings).map(
        ([collectionName, collectionData]) =>
          this.db.collection(collectionName).insertMany(collectionData)
      )
    );
  }
}

function __isObject(o) {
  return o && typeof o === 'object' && !Array.isArray(o);
}

function __isString(s) {
  return typeof s === 'string';
}

module.exports = DBUtil;