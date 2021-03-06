App.Api.Resource = function () {

    /**
     * @type {Object}
     */
    this.responseCache = {};

    /**
     * @type {Boolean}
     */
    this.cacheResponse = false;

    /**
     * @type {Boolean}
     */
    this.refreshCache = false;
};

App.Api.Resource.prototype = new App.Lib.Object();

/**
 * @type {String}
 */
App.Api.Resource.prototype.host = App.config.getItem('host');

/**
 * @type {int}
 */
App.Api.Resource.prototype.port = App.config.getItem('port');

/**
 * @type {String}
 */
App.Api.Resource.prototype.protocol = App.config.getItem('protocol');

/**
 * @type {string}
 */
App.Api.Resource.prototype.getBaseUrl = function () {

    var url = this.protocol + '://' + this.host;

    if (80 !== parseInt(this.port) && 443 !== parseInt(this.port)) {

        url += ':' + this.port;
    }
    return  url + '/';
};

/**
 * fetch data from VDR
 * @param options {object}
 */
App.Api.Resource.prototype.load = function (options) {

    var url = "undefined" !== typeof options.url && "undefined" !== typeof this.urls[options.url] ?
        this.urls[options.url] : this.urls.load, request = {},

        method = options.method || 'GET',

        callback = options.callback || undefined,

        async = options.async !== false;

    if (!this.noThrobber) {
        App.core.getModule('Gui.Menubar').getController('Default').showThrobber();
    }

    if ("function" !== typeof callback) {

        callback = this.onSuccess;
    }

    if (!this.refreshCache && this.cacheResponse && "undefined" !== typeof this.responseCache[url]) {

        callback(this.responseCache[url]);
        this.onComplete();

    } else {

        this.refreshCache = false;

        request.url = this.getBaseUrl() + url;
        request.method = method;

        if (options.data) {
            request.data = options.data;
        }

        if (!async) {

            return this.fetchSync(request, callback);
        }

        if (App.config.getItem('useSlowServerStrategy')) {

            request.async = false;
        }

        this.fetchAsync(request, callback);
    }
};

/**
 * fetch data asynchronous, fire callback on success
 * @param {{}} request
 * @param {Function} callback
 */
App.Api.Resource.prototype.fetchAsync = function (request, callback) {

    var me = this;

    $.ajax(
        request
    )
        .done(function (result) {

            me.responseCache[request.url] = result;
            callback(result);

        }).fail(function () {

            me.onError.apply(me, arguments)

        }).always(function () {

            me.onComplete.apply(me, arguments)
        });
};

/**
 * fetch data synchronous, return data and fire callback if requested
 * @returns {{}|boolean}
 */
App.Api.Resource.prototype.fetchSync = function (request, callback) {

    var data;

    request.async = false;

    data = $.ajax(request);

    this.onComplete(data);

    if (data.readyState === 4 && data.status === 200) {

        this.responseCache[request.url] = data;
        "function" === typeof callback && callback(data);

        return data;

    } else {

        this.onError(data);

        return false;
    }
};

/**
 * abstract request success handler
 */
App.Api.Resource.prototype.onSuccess = function () {};

/**
 * abstract request error handler
 */
App.Api.Resource.prototype.onError = function (e) {

    App.helper.log(e);

    if (0 === e.readyState && 0 === e.status) {

        $.event.trigger({
            "type": "window.request",
            "payload": {
                "type": "Alert",
                "data": {
                    "message": "Error loading resource",
                    "info": "Please make sure that your device is connected to the Network and that host and port settings are set properly"
                }
            }
        });
    }

    if (4 === e.readyState && ( 502 === e.status || 403 === e.status )) {

        $.event.trigger({
            "type": "window.request",
            "payload": {
                "type": "Alert",
                "data": {
                    "message": e.statusText
                }
            }
        });
    }
};

/**
 * method to be called any time an request is complete
 */
App.Api.Resource.prototype.onComplete = function () {

    if (!this.noThrobber) {

        App.core.getModule('Gui.Menubar').getController('Default').hideThrobber();
    }
};
