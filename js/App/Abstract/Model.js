/**
 * @class Abstract model
 * @constructor
 */
App.Abstract.Model = function () {};

/**
 * prototype
 * @type {App.Lib.Object}
 */
App.Abstract.Model.prototype = new App.Lib.Object();

/**
 * default identifier field
 * models are stored in cache width value of field identifier
 * in its data
 * e.g. channels objects have unique identifier called number or channel_id
 * override property if 'id' is not appropriate
 * @type {string}
 */
App.Abstract.Model.prototype.cacheKey = undefined;

/**
 * indicates if object cache entry can be invalidated
 * @type {boolean}
 */
App.Abstract.Model.prototype.canInvalidate = undefined;

/**
 * name of property that holds parent object
 * @type {string}
 */
App.Abstract.Model.prototype.mixIntoCollectionItem = undefined;

/**
 * class name
 * @type {string}
 * @private
 */
App.Abstract.Model.prototype._class = undefined;

/**
 * default callback when collection is loaded
 * @param result {JSON}
 */
App.Abstract.Model.prototype.processCollection = function (result) {

    var i = 0,
        l = result[this.resultCollection].length,
        model;

    // set currentResult if we have matches already
    if ("undefined" !== typeof this.preprocessedCollection) {

        this.currentResult = this.preprocessedCollection;
        this.preprocessedCollection = undefined;

    } else {

        this.currentResult = [];
    }

    // add loaded entities to result set
    for (i;i<l;i++) {

        if ("undefined" !== typeof this.mixIntoCollectionItem) {

            result[this.resultCollection][i][this.mixIntoCollectionItem] = this;
        }

        model = this.module.getModel(
            this.collectionItemModel,
            result[this.resultCollection][i]
        );

        if ("undefined" === typeof model.isCached) {
            this.collection.push(model);
            model.isCached = true
        }
        this.currentResult.push(model);
    }

    if ("function" === typeof this.afterCollectionLoaded) {

        this.afterCollectionLoaded();
    }

    this.triggerCollectionLoaded();
};

/**
 * trigger event after collection is loaded
 */
App.Abstract.Model.prototype.triggerCollectionLoaded = function () {

    $.event.trigger({
        "type"          : this.events.collectionloaded,
        "collection"    : this.currentResult,
        "_class"        : this._class,
        "iterate"       : $.proxy(this.resultIterator, this)
    });
};

/**
 * default result iterator
 * @param {function} callback
 */
App.Abstract.Model.prototype.resultIterator = function (callback) {

    var i = 0, l = this.currentResult.length, n = true;

    for (i;i<l;i++) {

        n = callback(this.currentResult[i]);

        if (n === false) {
            break;
        }
    }
};

/**
 * default collection iterator
 * @param {function} callback
 */
App.Abstract.Model.prototype.collectionIterator = function (callback) {

    var i = 0, l = this.collection.length;

    for (i;i<l;i++) {

        callback(this.collection[i]);
    }
};

/**
 * delete model from collection
 * @param model
 */
App.Abstract.Model.prototype.deleteFromCollection = function (model) {

    var i = 0, l = this.collection.length;

    for (i;i<l;i++) {

        if (this.collection[i] === model) {

            this.collection.splice(i, 1);
        }
    }
};

/**
 * flush collection
 */
App.Abstract.Model.prototype.flushCollection = function () {

    this.collection = [];
    this.currentResult = [];
};

/**
 * retrieve collection
 */
App.Abstract.Model.prototype.getCollection = function () {

    return this.collection;
};

/**
 * load single data set identified by cache key
 * create collection model instance if not cached already
 * @param cacheKey
 * @returns {boolean}
 */
App.Abstract.Model.prototype.loadCollectionItem = function (cacheKey) {

    var model = false, data;

    if ("undefined" !== typeof this.collectionItemModel) {

        if (
            "undefined" !== typeof this.cache[this.collectionItemModel]
            && this.cache[this.collectionItemModel][cacheKey]
        ) {

            model = this.cache[this.collectionItemModel][cacheKey];

        } else {

            data = this.module.getResource(this.collectionItemModel, cacheKey)
                .setIdUrl(cacheKey)
                .load({
                    "async" : false,
                    "url" : "byId"
                });

            if (data) {

                model = this.module.getModel(
                    this.collectionItemModel,
                    data.responseJSON[this.resultCollection][0]
                );
            }
        }
    }

    return model;
};