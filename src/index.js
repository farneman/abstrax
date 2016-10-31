// @flow

import jQuery from 'jquery';

import template from './micro_template';

const templateDelimiter = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/;

const immutableAssign = (...args) => Object.assign({}, ...args);

const createRequester = (addFor, request) => {
  const requester = function (payload) {
    const requestWithPayload = immutableAssign(request, {data: payload});

    if (typeof requestWithPayload.url === 'function') {
      throw new Error('Must supply url keys before calling fulfill');
    }

    return jQuery.ajax(requestWithPayload);
  };

  if (addFor) {
    requester.for = (urlParams) => createRequester(false, immutableAssign(request, {
      url: typeof request.url === 'function' ? request.url(urlParams) : request.url
    }));
  }

  return requester;
};

export default function abstrax(config: Object) {
  const defaultConfig = immutableAssign({
    method: 'GET',
    dataType: 'json',
    contentType: 'application/json; charset=utf-8'
  }, config.defaults);

  const requestCreator = (requests, requestKey) => {
    const request = config.requests[requestKey];

    if (!request.url) {
      return requests;
    }

    requests[requestKey] = createRequester(true, immutableAssign(defaultConfig, request, {
      url: templateDelimiter.test(request.url) ? template(request.url) : request.url
    }));

    return requests;
  };

  return Object.keys(config.requests)
    .reduce(requestCreator, {});
}
