/**
 * @typedef tabConfig
 * @type {object}
 * @property {string|number} id         maybe more strings|numbers are needed according to cacheKey
 * @property {string} cacheKey
 * @property {object|function} scope    content getters run within scope context
 * @property {jQuery} parentView        element to append tabs to
 * @property {tabs} tabs
 */

/**
 * @typedef tabs
 * @type {object}
 * @property {tab}
 */

/**
 * @typedef tab
 * @type {object}
 * @property {string} label
 * @property {function|string} content  content as string or getter
 * @property {boolean} default          is default tab to be shown on invocation
 */

/**
 * Tabs Module
 *
 * Invocation requires object of type tabConfig
 *
 * @constructor
 */
Gui.Tabs = function () {};

/**
 * prototype
 * @type {App.Abstract.Module}
 */
Gui.Tabs.prototype = new App.Abstract.Module();

/**
 * @type {string}
 */
Gui.Tabs.prototype.namespace = 'Gui';

/**
 * Modulename
 * @type {string}
 */
Gui.Tabs.prototype.name = 'Tabs';

/**
 * add render event
 */
Gui.Tabs.prototype.init = function () {

    var me = this;

    App.Abstract.Module.prototype.init.call(this);

    $(document).on('tabs.request', function (e) {

        me.dispatch(e.tabConfig);
    });
};

/**
 * dispatch requested type
 */
Gui.Tabs.prototype.dispatch = function (tabConfig) {

    this.getController('Abstract', tabConfig).dispatchView();
};

/**
 * register module
 */
App.core.registerModule('Gui.Tabs', true);