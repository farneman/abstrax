// @flow

export default class Request {
  _config: Object;

  constructor(config: Object) {
    this._config = config;
  }

  empty() {
    return this._config;
  }

  concat(additionalConfig: Object) {
    return new Request(Object.assign({}, this.empty(), additionalConfig));
  }
}
