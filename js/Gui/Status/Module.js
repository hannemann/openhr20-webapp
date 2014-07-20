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
 * register module
 */
App.core.registerModule('Gui.Status', true);