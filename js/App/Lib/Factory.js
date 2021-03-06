/**
 * Class factory
 * @member {object} classes - cache for classes to be instantiated
 * @constructor
 */
App.Lib.Factory = function () {

    this.classes = {};
};

/**
 *
 * @param {String} path
 * @returns {_class}
 */
App.Lib.Factory.prototype.getClass = function (path) {

    var _class,
        instance;

    if ("undefined" === typeof this.classes[path]) {

        _class = this.getConstructor(path);
    } else {
        _class = this.classes[path];
    }

    instance = new _class();

    return instance;

};

/**
 * retrieve constructor for path
 * @param {string} pathName - Namespace.Module.classType.concreteClass.concreteChildClass...
 * @returns {*}
 */
App.Lib.Factory.prototype.getConstructor = function (pathName) {

    var _class = null,
        parent = window,
        path = pathName.split('.'),
        i = 0,
        l = path.length;

    for (i;i<l;i++) {

        if (! _class && this.classExists(parent, path[i])) {

            _class = parent[path[i]];

        } else if (this.classExists(_class, path[i])) {

            _class = _class[path[i]];

        } else {

            throw new ReferenceError('Class ' + path[i] + ' does not exist in ' + parent + ', Factory');
        }

        parent += '.' + path[i];
    }

    return _class;
};

/**
 * check if class exists in namespace
 * @param {function|object} parent
 * @param {string} className
 * @returns {boolean}
 */
App.Lib.Factory.prototype.classExists = function (parent, className) {

    return "function" === typeof parent[className];
};

App.Lib.factory = new App.Lib.Factory();