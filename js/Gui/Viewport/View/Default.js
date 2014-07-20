/**
 * @class
 * @constructor
 */
Gui.Viewport.View.Default = function () {};

/**
 * @type {App.Abstract.View}
 */
Gui.Viewport.View.Default.prototype = new App.Abstract.View();

/**
 * init nodes
 */
Gui.Viewport.View.Default.prototype.init = function () {

    this.node = $('<div id="viewport">');

    $('body').addClass(App.config.getItem('theme'));
};

/**
 * render
 */
Gui.Viewport.View.Default.prototype.render = function () {

    this.node.appendTo('body');
};