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
 * indicate if refresh is currently possible
 * @type {boolean}
 */
Gui.Status.prototype.canRefresh = true;

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

    var me = this;

    this.refreshInterval = setInterval(function () {

        me.refresh();
    }, 60000);

    $(document).on('valveupdate', $.proxy(this.refresh, this));

    this.store = App.config;
    this.getController('Overview').dispatchView();
};

/**
 * destroy module
 */
Gui.Status.prototype.destruct = function () {

    clearInterval(this.refreshInterval);
    this.getController('Overview').destructView();
    this.cache.flush();
    return this;
};

/**
 * destroy module
 */
Gui.Status.prototype.refresh = function () {

    var me = this;

    if (!this.canRefresh) {

        return;
    }

    setTimeout(function () {
        var status = App.core.getModule('App.Status');
        status.cache.flush();
        status.getModel('Overview').init();
        me.destruct().dispatch();
    }, 150);
};

/**
 * lock refresh
 */
Gui.Status.prototype.lockRefresh = function () {

    this.canRefresh = false;
};

/**
 * unlock refresh
 */
Gui.Status.prototype.unlockRefresh = function () {

    this.canRefresh = true;
};

/**
 * register module
 */
App.core.registerModule('Gui.Status', true);