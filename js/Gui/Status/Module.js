/**
 * Settings Module
 * @constructor
 */
Gui.Status = function () {};

/**
 * prototype
 * @type {App.Abstract.Module}
 */
Gui.Status.prototype = new App.Abstract.Module();

/**
 * @type {string}
 */
Gui.Status.prototype.namespace = 'Gui';

/**
 * Modulename
 * @type {string}
 */
Gui.Status.prototype.name = 'Status';

/**
 * headline in menu bar
 * @type {string}
 */
Gui.Status.prototype.headline = 'Status';

/**
 * show up in drawer
 * @type {string}
 */
Gui.Status.prototype.inDrawer = true;

/**
 * start page capable
 * @type {string}
 */
Gui.Status.prototype.startPage = true;

/**
 * context menu definition
 * @type {{}}
 */
Gui.Status.prototype.contextMenu = {

    "Refresh" : {
        "labels" : {
            "on" : App.core.translate("Refresh")
        },
        "state" : "on",
        "scope" : 'Gui.Status',
        "fn" : function () {

            this.refresh();
        }
    }
};

/**
 * dispatch requested type
 */
Gui.Status.prototype.dispatch = function () {

    this.store = App.config;
    this.getController('Overview').dispatchView();
};

/**
 * destroy module
 */
Gui.Status.prototype.destruct = function () {

    this.getController('Overview').destructView();
    this.cache.flush();
};

/**
 * destroy module
 */
Gui.Status.prototype.refresh = function () {

    var me = this;
    setTimeout(function () {
        me.getController('Overview').destructView();
        me.cache.flush();
        me.dispatch();
    }, 150);
};

/**
 * register module
 */
App.core.registerModule('Gui.Status', true);