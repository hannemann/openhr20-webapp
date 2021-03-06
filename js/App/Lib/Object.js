/**
 * @constructor
 * @member {object} data
 */
App.Lib.Object = function () {};

/**
 * initialize store
 * @param {Object} [data]
 * @returns {App.Lib.Object}
 */
App.Lib.Object.prototype.initData = function (data) {

    var i;

    this.length = 0;

    data = data || {};

    this.data = data;

    for (i in this.data) {

        if (this.data.hasOwnProperty(i)) {
            this.length++;
        }
    }

    this.each = function (callback) {

        if ("function" !== typeof callback) return;

        for (i in this.data) {

            if (this.data.hasOwnProperty(i)) {

                callback(i, this.data[i]);
            }
        }
    };

    return this;
};

/**
 * get initialized instance
 * @param [data]
 * @returns {App.Lib.Object}
 */
App.Lib.Object.prototype.getInstance = function (data) {

    var obj = new App.Lib.Object();

    return obj.initData(data);
};

/**
 * retrieve option
 * @param [option] {String}
 * @param [defaultValue] {*}
 * @return {*}
 */
App.Lib.Object.prototype.getData = function (option, defaultValue) {

    if ('undefined' === typeof option) {

        return this.data
    }

    if ('undefined' !== typeof this.data[option]) {

        return this.data[option];

    } else if (defaultValue) {

        return defaultValue;
    }
    return null;
};

/**
 *
 * @param {String} option
 * @param {*} value
 * @return {App.Lib.Object}
 */
App.Lib.Object.prototype.setData = function (option, value) {

    this.data[option] = value;
    this.length++;
    return this;
};

/**
 * determine if object has option in its store
 * @param {string} option
 * @returns {boolean}
 */
App.Lib.Object.prototype.hasData = function (option) {

    return "undefined" !== typeof this.data[option];
};

/**
 * retrieve helper object
 * @returns {App.helper|*}
 */
App.Lib.Object.prototype.helper = function () {

    return App.helper;
};