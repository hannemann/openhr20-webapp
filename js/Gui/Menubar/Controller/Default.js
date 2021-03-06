/**
 * @class
 * @constructor
 */
Gui.Menubar.Controller.Default = function () {};

/**
 * @type {App.Lib.Cache.store.Controller}
 */
Gui.Menubar.Controller.Default.prototype = new App.Abstract.Controller();

/**
 * throbber counter
 * @type {number}
 */
Gui.Menubar.Controller.Default.prototype.throbberCalls = 0;

/**
 * defer click on icon
 * @type {boolean}
 */
Gui.Menubar.Controller.Default.prototype.deferIconClick = false;

/**
 * initialize
 */
Gui.Menubar.Controller.Default.prototype.init = function () {

    this.view = this.module.getView('Default');

    $(document).on('dispatch.after', $.proxy(this.view.setTitle, this.view));

    this.view.setParentView({"node":$('body')});

    this.drawerDispatched = false;

    $.event.trigger('menubar.init');
};

/**
 * call render, add observer
 */
Gui.Menubar.Controller.Default.prototype.dispatchView = function () {

    App.Abstract.Controller.prototype.dispatchView.call(this);

    this.addObserver();
};

/**
 * show spinner in upper right corner
 * increase calls
 */
Gui.Menubar.Controller.Default.prototype.showThrobber = function () {

    if (this.throbberCalls === 0) {
        this.view.settingsButton.hide();
        this.view.throbber.show();
    }
    this.throbberCalls++;
};

/**
 * hide spinner in upper right corner
 * decrease calls
 */
Gui.Menubar.Controller.Default.prototype.hideThrobber = function (force) {

    this.throbberCalls--;
    if (this.throbberCalls <= 0 || force) {
        this.view.throbber.hide();
        this.view.settingsButton.show();
        this.throbberCalls = 0;
    }
};

/**
 * add events to elements
 */
Gui.Menubar.Controller.Default.prototype.addObserver = function () {

    $(document).on('drawer.statechanged', $.proxy(this.onDrawerReady, this));

    $(document).on('drawer.animate', $.proxy(this.onDrawerAnimate, this));

    this.view.titleWrapper.on('click', $.proxy(this.onIconClick, this));

    $(document).on('dispatch.after', $.proxy(this.handlePostDispatch, this));

    this.view.settingsButton.on('click', $.proxy(this.requestContextMenu, this));
};

/**
 * actions after new module is dispatched
 */
Gui.Menubar.Controller.Default.prototype.handlePostDispatch = function () {

    this.view.decorateIndicator(this.isStartPage());
};

/**
 * retrieve configuration for contextMenu
 * @returns {object}
 */
Gui.Menubar.Controller.Default.prototype.getContextMenu = function () {

    this.contextMenu = App.core.getCurrent(true).contextMenu;

    if ("undefined" === typeof this.contextMenu) {

        this.contextMenu = {};
    }

    return this.contextMenu
};

/**
 * request context menu
 */
Gui.Menubar.Controller.Default.prototype.requestContextMenu = function (e) {

    e.stopPropagation();

    if (this.drawerDispatched) {

        history.back()

    } else {

        $.event.trigger({
            "type" : "window.request",
            "payload" : {
                "type" : "ContextMenu",
                "data" : this.getContextMenu()
            }
        });
    }
};

/**
 * determine if current dispatched page matches configured start page
 * @returns {boolean}
 */
Gui.Menubar.Controller.Default.prototype.isStartPage = function () {

    return ( App.config.getItem('start') === App.core.getCurrent() ) || "undefined" !== typeof this.initial
};

/**
 * handle drawer animation ready state
 * @param e
 */
Gui.Menubar.Controller.Default.prototype.onDrawerReady = function (e) {

    this.drawerDispatched = !!e.payload;

    this.deferIconClick = false;
};

/**
 * handle drawer starts animation
 */
Gui.Menubar.Controller.Default.prototype.onDrawerAnimate = function () {

    this.deferIconClick = true;
};

/**
 * handle click on icon
 */
Gui.Menubar.Controller.Default.prototype.onIconClick = function (e) {

    e.stopPropagation();

    if (!this.deferIconClick) {

        if ("undefined" !== typeof this.initial) {

            this.initial = undefined;

            location.replace(
                location.href.replace(/#.*$/, '#' + App.config.getItem('start'))
            );

        } else if (this.drawerDispatched) {

            history.back()

        } else {

            if (!this.isStartPage()) {

                history.back();

            } else {

                $.event.trigger({
                    "type": 'window.request',
                    "payload": {
                        "type": "Drawer"
                    }
                });

            }
        }
    }
};