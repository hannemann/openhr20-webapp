/**
 * Window Module
 * @constructor
 */
Gui.Window = function () {};

/**
 * prototype
 * @type {App.Abstract.Module}
 */
Gui.Window.prototype = new App.Abstract.Module();

/**
 * @type {string}
 */
Gui.Window.prototype.namespace = 'Gui';

/**
 * Modulename
 * @type {string}
 */
Gui.Window.prototype.name = 'Window';

/**
 * add render event
 */
Gui.Window.prototype.init = function () {

    var me = this;

    App.Abstract.Module.prototype.init.call(this);

    $(document).on('window.request', function (e) {

        me.dispatch(e.payload);
    });
};

/**
 * dispatch requested type
 */
Gui.Window.prototype.dispatch = function (payload) {

    var me = this, suffix = payload.type, controller;

    controller = me.getController(payload.type, payload.data);

    if (!(controller.singleton && controller.view.isRendered)) {

        App.core.observe();

        suffix += payload.hashSuffix ? payload.hashSuffix : '';

        App.core.setLocationHash(this.name + '-' + suffix );

        controller.dispatchView();
    }
};

/**
 * register module
 */
App.core.registerModule('Gui.Window', true);