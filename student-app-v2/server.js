'use strict';

const devebot = require('devebot').initialize('tasks');

const app = devebot.launchApplication(
  {
    appRootPath: __dirname,
  },
  [
    'app-restfront',
    'app-datastore',
    'app-errorlist',
  ]
);

if (require.main === module) {
  app.server.start();
  const stop = function () {
    app.server.stop().then(function () {
      console.log('The server has been stopped.');
      process.exit(0);
    });
  };
  process.on('SIGINT', stop);
  process.on('SIGQUIT', stop);
  process.on('SIGTERM', stop);
}

module.exports = app;
