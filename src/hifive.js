const init = require('./libs/init');

class hifive {
  init(options) {
    return init(options);
  }
}

module.exports = new hifive;
