// @flow
import jQuery from 'jquery';

const applyParamsToTemplate = (urlTemplate, params) => {
  if (typeof urlTemplate !== 'function') {
    return urlTemplate;
  }

  return urlTemplate(params);
};

class Request {
  constructor(config: Object) {
    this._config = config;
  }

  static of(config) {
    return new Request(config);
  }

  empty() {
    return this._config;
  }

  concat(additionalConfig: Object) {
    return Request.of(Object.assign({}, this.empty(), additionalConfig));
  }

  for(urlParams: Object) {
    var appliedUrl = applyParamsToTemplate(this.empty().url, urlParams);

    return this.concat({url: appliedUrl});
  }

  with(payload: Object) {
    return this.concat({data: payload});
  }

  fulfill() {
    if (typeof this.empty().url === 'function') {
      throw new Error('Must supply url keys before calling fulfill');
    }

    return jQuery.ajax(this.empty());
  }
}

export default Request;
