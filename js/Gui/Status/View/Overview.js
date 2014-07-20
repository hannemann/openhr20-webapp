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

    var valves = this.getData('valves'), i;

    for (i in valves) {

        if (valves.hasOwnProperty(i)) {

            this.module.getController('Valve', valves[i]).dispatchView();
        }
    }
};
