Gui.Status.Controller.Overview = function () {};

Gui.Status.Controller.Overview.prototype = new App.Abstract.Controller();

Gui.Status.Controller.Overview.prototype.dispatchView = function () {

    this.view = this.module.getView(
        'Overview',
        App.core.getModule('App.Status').getModel('Overview').getValves()
    );

    this.view.setParentView(
        App.core.getModule('Gui.Viewport').getView('Default')
    );

    App.Abstract.Controller.prototype.dispatchView.call(this);
};