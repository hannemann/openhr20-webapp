/**
 * Menubar Module
 * @constructor
 */
Gui.Viewport = function () {};

/**
 * prototype
 * @type {App.Abstract.Module}
 */
Gui.Viewport.prototype = new App.Abstract.Module();

/**
 * @type {string}
 */
Gui.Viewport.prototype.namespace = 'Gui';

/**
 * Modulename
 * @type {string}
 */
Gui.Viewport.prototype.name = 'Viewport';

/**
 * add render event
 */
Gui.Viewport.prototype.init = function () {

    var me = this;

    App.Abstract.Module.prototype.init.call(this);

    $(document).one('menubar.init', function () {
        me.dispatch();
    });
};

/**
 * dispatch default view
 */
Gui.Viewport.prototype.dispatch = function () {

    this.getController('Default').dispatchView();
};

/**
 * register module
 */
App.core.registerModule('Gui.Viewport', true);