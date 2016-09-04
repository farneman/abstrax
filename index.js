var Request = function (config) {
    this._config = config;
};

Request.of = function (config) {
    return new Request(config);
};

Request.prototype.empty = function () {
    return this._config;
};

Request.prototype.concat = function (additionalConfig) {
    return Request.of(_.assign({}, this.empty(), additionalConfig));
};

Request.prototype.for = function (urlParams) {
    var appliedUrl = applyParamsToTemplate(this.empty().url, urlParams);

    return this.concat({url: appliedUrl});
};

Request.prototype.with = function (payload) {
    return this.concat({data: payload});
};

Request.prototype.fulfill = function () {
    if (typeof this.empty().url === 'function') {
        throw 'Must supply url keys before calling fulfill';
    }

    return $.ajax(this.empty());
};

var templateUrl = function (url) {
    var templateDelimiter = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/;

    if (templateDelimiter.test(url)) {
        return _.template(url);
    } else {
        return url;
    }
};

var applyParamsToTemplate = function (template, params) {
    if (typeof template !== 'function') {
        return template;
    }

    return template(params);
}

var abstrax = function (config) {

    var defaultConfig = {
        method: 'GET',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8'
    };

    var defaultRequest = Request.of(defaultConfig).concat(config.defaults);

    var prepareRequestToReceiveUrl = function (requests, requestKey) {
        var request = Request.of(config.requests[requestKey]);

        if (!request.empty().url) {
            return requests;
        }

        var templatedRequest = request.concat({ url: templateUrl(request.empty().url) });
        var preparedRequest = defaultRequest.concat(templatedRequest.empty());

        requests[requestKey] = preparedRequest;

        return requests;
    };

    return Object.keys(config.requests)
        .reduce(prepareRequestToReceiveUrl, {});
};
