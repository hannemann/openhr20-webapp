/**
 * @namespace
 */
var App = function () {};

/**
 * @namespace
 */
App.Abstract = function () {};

/**
 * @namespace
 */
App.Lib = function () {};

/**
 * @namespace
 */
App.Api = function () {};

/**
 * initialize main class
 * @constructor
 */
App.Core = function () {
	this.current = null;
    this.initWithoutConfig = false;
};

/**
 * Check if necessary App.configuration is set
 * @return {*}
 */
App.Core.prototype.checkConfig = function () {

    return App.config.getItem('host') && App.config.getItem('port');
};

/**
 * modules buffer
 * @type {Object}
 */
App.Core.prototype.modules = {};

/**
 * destroy callbacks in cas of history is used
 * @type {Array}
 */
App.Core.prototype.destroyer = [];

/**
 * observe if location hash changes to observeHash
 * @type {Boolean|String}
 */
App.Core.prototype.observeHash = [];

/**
 * add module instance to buffer
 * @param {string} keys namespace and name of module to be instantiated
 * @param {boolean} init
 */
App.Core.prototype.registerModule = function (keys, init) {

    var namespace = keys.split('.')[0],
        module = keys.split('.')[1];

	this.modules[keys] = new window[namespace][module]();
    if (init) {
        this.initModule(keys);
    }
};

/**
 * determine if module is registered
 * @param module
 * @return {Boolean}
 */
App.Core.prototype.isRegistered = function (module) {
    return typeof this.modules[module] != 'undefined';
};

/**
 * entrypoint of programm
 */
App.Core.prototype.run = function () {
	var start = 'Gui.Config', i,
        startConfig = App.config.getItem('start');

    this.language = App.config.getItem('language');

    if (this.isRegistered(startConfig)) {

        start = startConfig;
    } else {

        App.config.setItem('start', 'Gui.Status');
        this.getModule('Gui.Menubar').getController('Default').initial = true;
        this.initial = true;
    }

    this.pollLocation();

    if (!this.initWithoutConfig) {

        this.initNoConfig();
    }
	if (this.checkConfig()) {

		for (i in this.modules) {

            if (this.modules.hasOwnProperty(i)) {

                this.initModule(i);
                this.initModuleLate(i);
            }
		}

        $(document).one('infoupdate', $.proxy(function () {

            this.dispatch(start);

        }, this));

        $.event.trigger('updateinfo');

	} else {

		this.getConfig();
	}
};

/**
 * retrieve location hash
 * @return {String}
 */
App.Core.prototype.getLocationHash = function () {
    return window.location.hash.replace('#', '');
};

/**
 * set location hash
 * @param hash
 * @return {*}
 */
App.Core.prototype.setLocationHash = function (hash) {

    window.location.hash = '#' + hash;
    return this;
};

/**
 * poll location hash and dispatch changes
 */
App.Core.prototype.pollLocation = function () {
    var start = App.config.getItem('start'), hash;

    setInterval($.proxy(function () {

        hash = this.getLocationHash();

        if ("" === hash) {

            hash = start;
        }

        if (hash !== this.current && this.isRegistered(hash)) {

            this.dispatch(hash);

        } else if (this.observeHash[this.observeHash.length-1] === hash) {

            this.destroy();

        }

    }, this), 100);
};

App.Core.prototype.observe = function (hash) {

    this.observeHash.push(hash || this.getLocationHash() || App.config.getItem('start'));
};

/**
 * add destroyer method
 * @param {string} destroyer
 * @param {function} callback
 */
App.Core.prototype.addDestroyer = function (destroyer, callback) {

    this.destroyer.push(destroyer);
    $(document).one(destroyer, callback);
};

/**
 * call last added destroyer
 */
App.Core.prototype.destroy = function () {

    var destroyer = this.destroyer.pop();
    this.observeHash.pop();

    if ("undefined" !== typeof destroyer) {

        $.event.trigger({
            "type" : destroyer,
            "skipHistoryBack" : true
        });
    }
};

/**
 * call init method of module
 * @param {string} module name of module to be initialized
 */
App.Core.prototype.initModule = function (module) {

    if ("undefined" === typeof this.modules[module].initialized) {

        this.modules[module].init();
        this.modules[module].initialized = true;
    }
};

/**
 * call late init method of module
 * @param {string} module name of module to be initialized
 */
App.Core.prototype.initModuleLate = function (module) {

    if (
        "undefined" === typeof this.modules[module].initializedLate
        && "function" === typeof this.modules[module].initLate
    ) {

        this.modules[module].initLate();
        this.modules[module].initializedLate = true;
    }
};

/**
 * init modules that need to be initialized before config is loaded
 */
App.Core.prototype.initNoConfig = function () {
    var i;

    for (i in this.modules) {

        if (this.modules.hasOwnProperty(i) && typeof this.modules[i].noConfig !== 'undefined') {

            this.initModule(i);
        }
    }

    this.initWithoutConfig = true;
};

/**
 * main dispatcher
 * @param {string} moduleName
 * @param {function} [callback]
 */
App.Core.prototype.dispatch = function (moduleName, callback) {

	if (this.current != moduleName) {

        if (this.current && 'function' === typeof this.modules[this.current].destruct) {

            this.modules[this.current].destruct();
        }

        $.event.trigger({
            "type":"dispatch.before",
            "payload" : this.modules[this.current]
        });

        if (moduleName !== this.getLocationHash()) {

            this.setLocationHash(moduleName);
        }
		this.modules[moduleName].dispatch(callback);
		this.current = moduleName;

        $.event.trigger({
            "type":"dispatch.after",
            "payload" : this.modules[this.current]
        });
	}
};

/**
 * initialize settings module
 */
App.Core.prototype.getConfig = function () {

//	this.modules['Gui.Config'].init();
	this.dispatch('Gui.Config', $.proxy(this.run, this));
};

/**
 * module getter
 * @param module
 * @return {*}
 */
App.Core.prototype.getModule = function (module) {

	if (typeof this.modules[module] != 'undefined') {

		return this.modules[module];
	}

	return false;
};

/**
 * retrieve current dispatched module name
 * @param {boolean} [asModule]
 * @return {string|App.Abstract.Module}
 */
App.Core.prototype.getCurrent = function (asModule) {

    if (asModule) {

        return this.modules[this.current];
    }

    return this.current;
};

/**
 * get localized string if available
 * printf syntax is supported
 */
App.Core.prototype.translate = function () {

    var args = Array.prototype.slice.apply(arguments),
        key = args.shift();

    if (this[this.language] && this[this.language][key]) {

        return sprintf(this[this.language][key], args);
    }

    return key;
};

App.core = new App.Core();

$(document).ready(function () {

	App.core.run();
});
