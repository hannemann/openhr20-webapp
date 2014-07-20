Gui.Window.View.Valve = function () {};

Gui.Window.View.Valve.prototype = new Gui.Window.View.Abstract();

Gui.Window.View.Valve.prototype.cacheKey = null;

Gui.Window.View.Valve.prototype.hasHeader = true;

/**
 * @type {boolean}
 */
Gui.Window.View.Valve.prototype.isModal = true;

Gui.Window.View.Valve.prototype.render = function () {

    this.node.addClass('collapsed');

    Gui.Window.View.Abstract.prototype.render.call(this);

    this.node.toggleClass('collapsed expand');

    console.log(this);
};
