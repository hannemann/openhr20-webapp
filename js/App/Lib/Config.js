/**
 * read from and write to localStorage
 * @constructor
 */
App.Lib.Config = function () {};

/**
 * read from and write to localStorage
 * @constructor
 */
App.Lib.Config.prototype.init = function () {

	var storage = null;

	try {

		if ('localStorage' in window && window['localStorage'] !== null) {

			storage = localStorage;
		}

	} catch (e) {

		throw 'No localStorage available.';
	}

    /**
     * persist item in storage
     * @param {String} k
     * @param {String} v
     * @return {*}
     */
	this.setItem = function (k, v) {

		storage.setItem(k, v);

        if (this.fields[k]) {

            this.setFieldValue(k, v);
        }

		return this;
	};

    /**
     * retrieve item from storage
     * if not found lookup defaults
     * @param k
     * @return {*}
     */
	this.getItem = function (k) {

		var value = storage.getItem(k), type;

		if (!value && typeof this.defaults[k] !== 'undefined') {

			value = this.defaults[k];
		}

        if (this.fields[k]) {

            type = this.fields[k].dataType || this.fields[k].type;

            if ("number" === type) {

                value = parseFloat(value);
            }

            if ("boolean" === type) {

                value = value === "true";
            }
        }

		return value;
	};

    /**
     * remove item from storage
     * @param k
     * @return {*}
     */
	this.removeItem = function (k) {

		storage.removeItem(k);
		return this;
	};

    /**
     * clear whole storage
     * @return {*}
     */
	this.clear = function () {

		storage.clear();
		return this;
	};

    this.initFieldValues();

    return this;
};

/**
 * add values to fields
 */
App.Lib.Config.prototype.initFieldValues = function () {

    var i, type;

    for (i in this.fields) {

        if (this.fields.hasOwnProperty(i)) {

            type = this.fields[i].type;

            if ('string' === type || 'number' === type) {

                this.fields[i].value = this.getItem(i);
            }

            if ('boolean' === type) {

                this.fields[i].checked = this.getItem(i)
            }

            if ('enum' === type) {

                if ('function' !== typeof this.fields[i].values) {

                    this.fields[i].values[this.getItem(i)].selected = true;
                }
            }
        }
    }
};

/**
 * @param {string} k
 * @param v
 */
App.Lib.Config.prototype.setFieldValue = function (k, v) {

    var type = this.fields[k].type;

    if ('string' === type || 'number' === type) {

        this.fields[k].value = v;
    }

    if ('boolean' === type) {

        this.fields[k].checked = v
    }

    if ('enum' === type) {

        if ('function' !== typeof this.fields[k].values) {

            this.fields[k].values[v].selected = true;
        }
    }
};
/**
 * Default values (as string or number)
 * @type {Object}
 */
App.Lib.Config.prototype.defaults = {
    "theme" : "default",
    "language" : "de_DE",
    "protocol" : "http"
};

App.Lib.Config.prototype.categories = {
    "dev" : {
        "label" : 'Developer Options'
    },
    "server" : {
        "label" : 'Server Settings'
    },
    "gui" : {
        "label" : 'User Interface'
    }
};

/**
 * Default values
 * @type {Object}
 */
App.Lib.Config.prototype.fields = {
    "start"             :   {
        "category" : "gui",
        "info" : "Needs reload of app",
        "type" : "enum",
        "dataType" : "string",
        "label" : "Startpage",
        /**
         * @returns {{}}
         */
        "values" : function () {

            var i, modules = App.core.modules,
                pages = {}, start = App.config.getItem('start');

            for (i in modules) {

                if (
                    modules.hasOwnProperty(i)
                    && "Gui" === modules[i].namespace
                    && "undefined" !== typeof modules[i].startPage
                ) {
                    pages[i] = {
                        "label" : modules[i].headline,
                        "value" : i,
                        "selected" : start === i
                    }

                }
            }

            if ("true" === App.config.getItem('debug')) {

                pages['Gui.Config'] = {
                    "label" : "Configuration",
                    "value" : "Gui.Config",
                    "selected" : start === "Gui.Config"
                };
            }

            return pages;
        }
    },
    "theme"          :   {
        "category" : "gui",
        "type" : "enum",
        "label" : "Theme",
        "info" : "Needs reload of app",
        "dataType" : "string",
        "values" : {
            "default" : {
                "label" : "Default",
                "value" : "default"
            },
            "black" : {
                "label" : "Black",
                "value" : "black"
            }
        }
    },
    "language" : {
        "category" : "gui",
        "type" : "enum",
        "label" : "Language",
        "dataType" : "string",
        "info" : "Needs reload of app",
        "values" : {
            "de_DE" : {
                "label" : "Deutsch (Deutschland)",
                "value" : "de_DE"
            },
            "en_US" : {
                "label" : "English (United States)",
                "value" : "en_US"
            }
        }
    },
    "protocol"          :   {
        "category" : "server",
        "type" : "enum",
        "label" : "Prototcol",
        "dataType" : "string",
        "info" : "Needs reload of app",
        "values" : {
            "http" : {
                "label" : "HTTP",
                "value" : "http"
            },
            "https" : {
                "label" : "HTTPS",
                "value" : "https"
            }
        }
    },
    "host"              :   {
        "category" : "server",
        "type" : "string",
        "label" : "Host",
        "info" : "Needs reload of app"
    },
    "port"              :   {
        "category" : "server",
        "type" : "number",
        "label" : "Port",
        "info" : "Needs reload of app"
    },
    "debug"             :   {
        "category" : "dev",
        "type" : "boolean",
        "label" : "Debugmode"
    }
};

App.config = new App.Lib.Config();

App.config.init();
