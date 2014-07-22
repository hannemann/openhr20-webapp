Gui.Status.View.Overview = function () {};

Gui.Status.View.Overview.prototype = new App.Abstract.View();

Gui.Status.View.Overview.prototype.init = function () {

    this.node = $('<div class="overview">');
};

Gui.Status.View.Overview.prototype.render = function () {

    this.addValves();

    App.Abstract.View.prototype.render.call(this);
};

Gui.Status.View.Overview.prototype.addValves = function () {

    var valves = this.getData('valves'), me = this;

    this.each(function (name, valve) {

            me.module.getController('Valve', {
                "name":name,
                "valve":valve
            }).dispatchView();
    });
};
