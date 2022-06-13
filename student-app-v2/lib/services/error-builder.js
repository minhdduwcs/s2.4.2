'use strict';

function Service(params = {}) {
  const { packageName, sandboxConfig, errorManager} = params;

  const errorBuilder = errorManager.register(packageName, {
    errorCodes: sandboxConfig.errorCodes,
  });

  this.newError = function (errorName, { payload, language } = {}) {
    return errorBuilder.newError(errorName, {
      payload,
      language,
    });
  };
}

Service.referenceHash = {
  errorManager: 'app-errorlist/manager',
};

module.exports = Service;