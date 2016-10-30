// @flow

import jQuery from 'jquery';

import template from './micro_template';

const applyParamsToTemplate = (urlTemplate, params) => {
  if (typeof urlTemplate !== 'function') {
    return urlTemplate;
  }

  return urlTemplate(params);
};

const templateUrl = (url) => {
  const templateDelimiter = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/;

  if (!templateDelimiter.test(url)) {
    return url;
  }

  return template(url);
};

const immutableAssign = (...args) => Object.assign({}, ...args);

const createRequester = (addFor, requestObject) => {
  const requester = function (payload) {
    const requestWithPayload = immutableAssign(requestObject, {data: payload});

    if (typeof requestWithPayload.url === 'function') {
      throw new Error('Must supply url keys before calling fulfill');
    }

    return jQuery.ajax(requestWithPayload);
  };

  if (addFor) {
    requester.for = (urlParams) => {
      const appliedUrl = applyParamsToTemplate(requestObject.url, urlParams);
      const requested = immutableAssign(requestObject, {url: appliedUrl});

      return createRequester(false, requested);
    };
  }

  return requester;
};

const configureRequestCreator = function (defaultRequest, requestList) {
  return (requests, requestKey) => {
    const request = requestList[requestKey];

    if (!request.url) {
      return requests;
    }

    const templatedRequest = immutableAssign(request, {url: templateUrl(request.url)});
    const preparedRequest = immutableAssign(defaultRequest, templatedRequest);

    requests[requestKey] = createRequester(true, preparedRequest);

    return requests;
  };
};

export default function abstrax(config: Object) {
  const defaultConfig = {
    method: 'GET',
    dataType: 'json',
    contentType: 'application/json; charset=utf-8'
  };

  const defaultRequest = immutableAssign(defaultConfig, config.defaults);
  const requestCreator = configureRequestCreator(defaultRequest, config.requests);

  return Object.keys(config.requests)
        .reduce(requestCreator, {});
}
