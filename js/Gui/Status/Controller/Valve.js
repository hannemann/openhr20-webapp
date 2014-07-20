Gui.Status.Controller.Valve = function () {};

Gui.Status.Controller.Valve.prototype = new App.Abstract.Controller();

Gui.Status.Controller.Valve.prototype.cacheKey = null;

Gui.Status.Controller.Valve.prototype.dispatchView = function () {

    this.view = this.module.getView('Valve', this.data);

    this.view.setParentView(
        this.module.getView('Overview')
    );

    App.Abstract.Controller.prototype.dispatchView.call(this);
};