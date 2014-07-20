Gui.Status.Controller.Valve = function () {};

Gui.Status.Controller.Valve.prototype = new App.Abstract.Controller();

Gui.Status.Controller.Valve.prototype.cacheKey = null;

Gui.Status.Controller.Valve.prototype.dispatchView = function () {

    this.view = this.module.getView('Valve', this.data);

    this.view.setParentView(
        this.module.getView('Overview')
    );

    this.addObserver();

    App.Abstract.Controller.prototype.dispatchView.call(this);
};

Gui.Status.Controller.Valve.prototype.addObserver = function () {

    this.view.temp.on('click', $.proxy(this.handleTempClick, this));
};

Gui.Status.Controller.Valve.prototype.handleTempClick = function (e) {

    e.preventDefault();

    App.core.getModule('Gui.Window').dispatch({
        "type":"Valve",
        "data" : this.data
    });
};
