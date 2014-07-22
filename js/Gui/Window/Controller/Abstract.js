/**
 * @class
 * @constructor
 */
Gui.Window.Controller.Abstract = function () {};

/**
 * @type {App.Abstract.Controller}
 */
Gui.Window.Controller.Abstract.prototype = new App.Abstract.Controller();

/**
 * init parentView
 */
Gui.Window.Controller.Abstract.prototype.init = function () {

    App.core.addDestroyer(this.eventPrefix + '.hashChanged', $.proxy(this.destructView, this));

    this.view.setParentView({
        "node" :$('body')
    });
};

/**
 * init parentView
 */
Gui.Window.Controller.Abstract.prototype.dispatchView = function () {

    var tabConfig, i;

    if (this.view.getTabConfig) {

        tabConfig = this.view.getTabConfig();

        if (this.data.activeTab) {

            for (i in tabConfig.tabs) {

                if (tabConfig.tabs.hasOwnProperty(i)) {

                    delete tabConfig.tabs[i].default;
                }
            }

            tabConfig.tabs[this.data.activeTab].default = true;
        }

        $.event.trigger({
            "type" : "tabs.request",
            "tabConfig" : tabConfig
        });
    }

    App.Abstract.Controller.prototype.dispatchView.call(this);
};

/**
 * add event handler
 * add destroyer to App.core
 */
Gui.Window.Controller.Abstract.prototype.addObserver = function () {

    if (this.view.closeButton) {

        this.view.closeButton.one('click', function () {

            history.back();
        });
    }
};

/**
 * destroy
 */
Gui.Window.Controller.Abstract.prototype.destructView = function () {

    App.Abstract.Controller.prototype.destructView.call(this);

    if ("undefined" !== typeof this.cacheKey) {
        this.module.cache.flushByClassKey(this);
    }
    $.event.trigger({
        "type" : "destruct.window-" + this.keyInCache
    });

    $(document).off("destruct.window-" + this.keyInCache);
};
