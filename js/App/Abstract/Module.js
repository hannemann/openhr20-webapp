/**
 * @constructor
 */
App.Abstract.Module = function () {};

/**
 * define prototype
 * @type {Lib.Object}
 */
App.Abstract.Module.prototype = new App.Lib.Object();

/**
 * @type {string}
 */
App.Abstract.Module.prototype.namespace = 'App';

/**
 * Initialize module structure
 */
App.Abstract.Module.prototype.init = function () {

    window[this.namespace][this.name].Model = function () {};

    window[this.namespace][this.name].View = function () {};

    window[this.namespace][this.name].ViewModel = function () {};

    window[this.namespace][this.name].Controller = function () {};

    window[this.namespace][this.name].Helper = function () {};

    this.cache = new App.Lib.Cache();

    this.cache.module = this;
};

/**
 * retrieve model
 * @param {String} type
 * @param {Object} cacheKey
 * @return {*}
 */
App.Abstract.Module.prototype.loadModel = function (type, cacheKey) {

    var cache = this.cache.getStore('Model', type),
        path = this.namespace + '.' + this.name + '.Model.' + type,
        constructor,
        data,
        model;

    if ("undefined" !== typeof cache[cacheKey]) {

        return cache[cacheKey];
    }

    constructor = App.Lib.factory.getConstructor(path);

    data = this.getResource(type, this.getResourceInitData(path, cacheKey))
        .setIdUrl(cacheKey)
        .load({
            "async" : false,
            "url" : "byId"
        });

    if (data) {

        model = this.getModel(
            type,
            data.responseJSON[constructor.prototype.resultJSON][0]
        );
    }

    return model;
};

/**
 *
 * @param path
 * @param cacheKey
 * @returns {string}
 */
App.Abstract.Module.prototype.getResourceInitData = function (path, cacheKey) {

    var resourcePath = path + '.Resource',
        resourceConstructor,
        resourceCacheKey,
        resourceId;

    resourceConstructor = App.Lib.factory.getConstructor(resourcePath);
    resourceCacheKey = resourceConstructor.prototype.cacheKey || '';

    resourceId = cacheKey
        .split(this.cache.cacheKeySeparator)
        .slice(0, resourceCacheKey.split(this.cache.cacheKeySeparator).length)
        .join(this.cache.cacheKeySeparator);

    return this.getInitData(resourceId, resourceCacheKey);
};

/**
 * retrieve model
 * @param {String} type
 * @param {Object} [data]
 * @return {*}
 */
App.Abstract.Module.prototype.getModel = function (type, data) {

    return this.getAndInitialize('Model', type, data);
};

/**
 * retrieve viewModel
 * @param {String} type
 * @param {Object} [data]
 * @return {*}
 */
App.Abstract.Module.prototype.getViewModel = function (type, data) {

    return this.getAndInitialize('ViewModel', type, data);
};

/**
 * retrieve controller
 * @param {String} type
 * @param {Object} [data]
 * @return {*}
 */
App.Abstract.Module.prototype.getView = function (type, data) {

    return this.getAndInitialize('View', type, data);
};

/**
 * retrieve controller
 * @param {String} type
 * @param {Object} [data]
 * @return {*}
 */
App.Abstract.Module.prototype.getController = function (type, data) {

    return this.getAndInitialize('Controller', type, data);
};

/**
 * retrieve helper
 * @param {String} [type]
 * @return {*}
 */
App.Abstract.Module.prototype.getHelper = function (type) {

    var cache = this.cache.getStore('Helper'),
        path, instance;

    type = type || 'Default';

    if ("undefined" !== typeof cache[type]) {

        return cache[type];
    }

    path = this.namespace + '.' + this.name + '.Helper.' + type;

    instance = App.Lib.factory.getClass(path);
    instance.module = this;

    return instance;

};

/**
 * retrieve resource model
 * @param {String} type
 * @param {Object} [data]
 * @return {*}
 */
App.Abstract.Module.prototype.getResource = function (type, data) {

    return this.getAndInitialize('Model', type + '.Resource', data);
};

/**
 * retrieve uninitialized instance
 * @param classType
 * @param type
 * @returns {*|_class}
 */
//App.Abstract.Module.prototype.getRaw = function (classType, type) {
//
//    var path = this.namespace + '.' + this.name + '.' + classType + '.' + type,
//        instance = App.Lib.factory.getClass(path);
//    instance.module = this;
//
//    return instance;
//};

/**
 * retrieve initialized instance
 * @param {String} classType
 * @param {String} type
 * @param {Object} [data]
 * @returns {*}
 */
App.Abstract.Module.prototype.getAndInitialize = function (classType, type, data) {

    var instance = this.getClass(classType, type, data);
    instance.module = this;

    if (!instance.initializedData && 'function' === typeof instance.initData) {

        instance.initData(data);
        instance.initializedData = true;
    }

    if (!instance.initialized && 'function' === typeof instance.init) {

        instance.init();
        instance.initialized = true;
    }

    return instance;
};

/**
 * lazy fetching of requested class
 * @param {string} type                     ViewModel, View, Controller
 * @param {string} _class                   classpath
 * @param {(object|string|number)} [data]   data object or identifier
 * @return {*}
 */
App.Abstract.Module.prototype.getClass = function (type, _class, data) {

    var cache = this.cache.getStore(type),
        cacheKey = _class,
        path = this.namespace + '.' + this.name + '.' + type + '.' + _class,
        constructor = App.Lib.factory.getConstructor(path), instance;

    if ("undefined" !== typeof constructor.prototype.cacheKey || (data && data.cacheKey)) {

        cacheKey = constructor.prototype.cacheKey || data.cacheKey;

        if (!(data instanceof Object)) {

            data = this.getInitData(data, cacheKey);
        }

        cache = this.cache.getStore(type, _class);
        cacheKey = this.cache.getCacheKey(data, cacheKey);
    }

    if ("undefined" === typeof cache[cacheKey]) {

        instance = App.Lib.factory.getClass(path);
        cache = this.addToCache(cache, cacheKey, instance, _class);
    }

    return cache[cacheKey];
};

/**
 * store instance in cache
 * @param {object} cache
 * @param {string} key
 * @param {App.Lib.Object} instance
 * @param {string} _class
 * @returns {*}
 */
App.Abstract.Module.prototype.addToCache = function (cache, key, instance, _class) {

    cache[key] = instance;
    cache[key].keyInCache = key;
    cache[key].cache = cache;
    cache[key]._class = _class;

    return cache;
};

/**
 * init data object with properties
 * needed to build the cache key
 * only used if we want to fetch
 * an object from cache that has
 * a cacheKey property.
 * Usually an item of a collection
 *
 * @param {(string|number)}     id
 * @param {string}              cacheKey
 * @returns {object}
 */
App.Abstract.Module.prototype.getInitData = function (id, cacheKey) {

    var data = {},
        keys = cacheKey.split(this.cache.cacheKeySeparator),
        ids = id.split(this.cache.cacheKeySeparator),
        i = 0, l = keys.length;

    if (l != ids.length) {

        throw new Error('ID and cacheKey mismatch');
    }

    for (i;i<l;i++) {

        data[keys[i]] = ids[i];
    }

    return data;
};
