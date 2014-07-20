Gui.Window.Controller.Valve = function () {};

Gui.Window.Controller.Valve.prototype = new Gui.Window.Controller.Abstract();

Gui.Window.Controller.Valve.prototype.cacheKey = null;

Gui.Window.Controller.Valve.prototype.init = function () {

    this.view = this.module.getView('Valve', this.data);

    Gui.Window.Controller.Abstract.prototype.init.call(this);

    this.view.setParentView(
        {"node":$('body')}
    );
};

/**
 * destroy
 */
Gui.Window.Controller.Valve.prototype.destructView = function () {

    var me = this;

    // apply animation
    this.view.node.toggleClass('collapse expand');
    // remove on animation end
    this.view.node.one(this.animationEndEvents, function () {

        Gui.Window.Controller.Abstract.prototype.destructView.call(me);
    });
};
