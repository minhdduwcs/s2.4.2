class logHelper {
  constructor() {
    this.__L = null;
    this.__T = null;
    this.add = this.add.bind(this);
    this.log = this.log.bind(this);
  }

  add(L, T) {
    this.__L = L;
    this.__T = T;
  }

  log(addObject = {}, message = '', status = 'debug') {
    if (!this.__L || !this.__T) {
      return;
    }

    this.__L.has(status) &&
      this.__L.log(
        status,
        this.__T.add(addObject).toMessage({
          tmpl: message,
        })
      );
  }
}

module.exports = logHelper;
