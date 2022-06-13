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
            // host: '172.17.0.2',
            // port: '27017',
            // name: 'student-v2',
            host: process.env['appDatastore_mongoose_manipulator_host'] || 
            '172.17.0.2',
            port: process.env['appDatastore_mongoose_manipulator_port'] || 
            '27017',
            name: process.env['appDatastore_mongoose_manipulator_db'] ||
            'student-v2'
            // 'student-test'
          },
        },
      },
    },
  },
};

module.exports = config;