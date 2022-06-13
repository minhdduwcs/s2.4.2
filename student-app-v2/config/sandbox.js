'use strict';

const path = require('path');

const errorCodes = require('./error-codes');

const config = {
  application: {
    errorCodes,
  },
  plugins: {
    appRestfront:{
      contextPath: '/api',
      mappingStore: {
        intro: path.join(__dirname, '../lib/mappings/restfront'),
      },
    },
    appDatastore: {
      mappingStore: {
        'student-datastore': path.join(__dirname, '../lib/mappings/datastore'),
      },
    },
    appWebweaver: {
      cors: {
        enabled: true,
        mode: 'simple',
      },
    },
    appWebserver: {
      host: '0.0.0.0',
      port: 7979,
      verbose: true,
    },
  },
  bridges: {
    mongoose: {
      appDatastore:{
        manipulator: {
          connection_options: {
            host: process.env['appDatastore_mongoose_manipulator_host'] || '0.0.0.0',
            port: process.env['appDatastore_mongoose_manipulator_port'] || '27017',
            name: process.env['appDatastore_mongoose_manipulator_db'] || 'student-db'
          },
        },
      },
    },
  },
};

module.exports = config;
