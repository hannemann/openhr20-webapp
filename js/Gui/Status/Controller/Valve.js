/**
 * @class
 * @constructor
 */
Gui.Status.Controller.Valve = function () {};

/**
 * @type {App.Abstract.Controller}
 */
Gui.Status.Controller.Valve.prototype = new App.Abstract.Controller();

/**
 * @type {null}
 */
Gui.Status.Controller.Valve.prototype.cacheKey = 'name';

/**
 * dispatch view
 */
Gui.Status.Controller.Valve.prototype.dispatchView = function () {

    this.view = this.module.getView('Valve', this.data);

    this.view.setParentView(
        this.module.getView('Overview')
    );

    this.addObserver();

    App.Abstract.Controller.prototype.dispatchView.call(this);
};

/**
 * add event listeners
 */
Gui.Status.Controller.Valve.prototype.addObserver = function () {

    this.view.temp.on('click', $.proxy(this.handleTempClick, this));

    $(document).on('valveupdate-' + this.getData('valve').getData('id'), $.proxy(this.handleUpdate, this));
};

/**
 * handle click on temperature icon
 * @param {jQuery.Event} e
 */
Gui.Status.Controller.Valve.prototype.handleTempClick = function (e) {

    e.preventDefault();

    App.core.getModule('Gui.Window').dispatch({
        "type":"Valve",
        "data" : this.data
    });
};

/**
 * handle click on temperature icon
 */
Gui.Status.Controller.Valve.prototype.handleUpdate = function () {

    this.view.update()
};
