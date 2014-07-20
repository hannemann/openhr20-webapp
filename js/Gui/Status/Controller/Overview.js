Gui.Status.Controller.Overview = function () {};

Gui.Status.Controller.Overview.prototype = new App.Abstract.Controller();

Gui.Status.Controller.Overview.prototype.dispatchView = function () {

    this.data = App.core.getModule('App.Status').getModel('Overview').getData();

    this.view = this.module.getView('Overview', this.data);

    this.view.setParentView(
        App.core.getModule('Gui.Viewport').getView('Default')
    );

    App.Abstract.Controller.prototype.dispatchView.call(this);
};