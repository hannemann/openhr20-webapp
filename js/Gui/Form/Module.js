/**
 * Form Module
 * @constructor
 */
Gui.Form = function () {};

/**
 * prototype
 * @type {App.Abstract.Module}
 */
Gui.Form.prototype = new App.Abstract.Module();

/**
 * @type {string}
 */
Gui.Form.prototype.namespace = 'Gui';

/**
 * Module name
 * @type {string}
 */
Gui.Form.prototype.name = 'Form';

/**
 * add render event
 */
Gui.Form.prototype.init = function () {

    var me = this;

    App.Abstract.Module.prototype.init.call(this);

    $(document).on('form.request', function (e) {

        me.dispatch(e.config);
    });
};

/**
 * dispatch requested type
 */
Gui.Form.prototype.dispatch = function (config) {

    this.getController('Abstract', config).dispatchView();
};

/**
 * register module
 */
App.core.registerModule('Gui.Form', true);