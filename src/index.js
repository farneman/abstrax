// @flow

import template from 'lodash.template';
import jQuery from 'jquery';

import Request from './request';

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

const createRequester = (addFor, requestObject) => {
  const requester = function (payload) {
    const requestWithPayload = requestObject.concat({data: payload});

    if (typeof requestWithPayload.empty().url === 'function') {
      throw new Error('Must supply url keys before calling fulfill');
    }

    return jQuery.ajax(requestWithPayload.empty());
  };

  if (addFor) {
    requester.for = (urlParams) => {
      const appliedUrl = applyParamsToTemplate(requestObject.empty().url, urlParams);
      const requested = requestObject.concat({url: appliedUrl});

      return createRequester(false, requested);
    };
  }

  return requester;
};

const configureRequestCreator = function (defaultRequest, requestList) {
  return (requests, requestKey) => {
    const request = new Request(requestList[requestKey]);

    if (!request.empty().url) {
      return requests;
    }

    const templatedRequest = request.concat({ url: templateUrl(request.empty().url) });
    const preparedRequest = defaultRequest.concat(templatedRequest.empty());

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

  const defaultRequest = new Request(defaultConfig).concat(config.defaults);
  const requestCreator = configureRequestCreator(defaultRequest, config.requests);

  return Object.keys(config.requests)
        .reduce(requestCreator, {});
}
