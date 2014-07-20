/**
 * @class
 * @constructor
 */
Gui.Viewport.Controller.Default = function () {};

/**
 * @type {App.Abstract.Controller}
 */
Gui.Viewport.Controller.Default.prototype = new App.Abstract.Controller();

/**
 * initialize view
 */
Gui.Viewport.Controller.Default.prototype.init = function () {

    this.view = this.module.getView('Default');
};
