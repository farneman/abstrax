import template from 'lodash.template';
import Request from './request';

const templateUrl = (url) => {
  const templateDelimiter = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/;

  if (!templateDelimiter.test(url)) {
    return url;
  }

  return template(url);
};

export default function abstrax(config) {
  const defaultConfig = {
    method: 'GET',
    dataType: 'json',
    contentType: 'application/json; charset=utf-8'
  };

  const defaultRequest = Request.of(defaultConfig).concat(config.defaults);

  const prepareRequestToReceiveUrl = (requests, requestKey) => {
    const request = Request.of(config.requests[requestKey]);

    if (!request.empty().url) {
      return requests;
    }

    const templatedRequest = request.concat({ url: templateUrl(request.empty().url) });
    const preparedRequest = defaultRequest.concat(templatedRequest.empty());

    requests[requestKey] = preparedRequest;

    return requests;
  };

  return Object.keys(config.requests)
        .reduce(prepareRequestToReceiveUrl, {});
}
