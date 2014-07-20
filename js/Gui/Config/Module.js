/**
 * Settings Module
 * @constructor
 */
Gui.Config = function () {};

/**
 * prototype
 * @type {App.Abstract.Module}
 */
Gui.Config.prototype = new App.Abstract.Module();

/**
 * @type {string}
 */
Gui.Config.prototype.namespace = 'Gui';

/**
 * Modulename
 * @type {string}
 */
Gui.Config.prototype.name = 'Config';

/**
 * headline in menu bar
 * @type {string}
 */
Gui.Config.prototype.headline = 'Configuration';

/**
 * add render event
 */
Gui.Config.prototype.init = function () {

    var me = this;

    App.Abstract.Module.prototype.init.call(this);

    $(document).on('Config.request', function (e) {

        me.dispatch(e.object);
    });
};

/**
 * dispatch requested type
 */
Gui.Config.prototype.dispatch = function () {

    this.store = App.config;
    this.getController('Settings').dispatchView();
};

/**
 * destroy module
 */
Gui.Config.prototype.destruct = function () {

    this.getController('Settings').destructView();
    this.cache.flush();
};

/**
 * register module
 */
App.core.registerModule('Gui.Config', true);