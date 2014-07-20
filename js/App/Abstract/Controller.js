/**
 * @constructor
 */
App.Abstract.Controller = function () {
};

/**
 * define prototype
 * @type {Lib.Object}
 */
App.Abstract.Controller.prototype = new App.Lib.Object();

/**
 * animationEnd event names
 * @type {string[]}
 */
App.Abstract.Controller.prototype.animationEndEvents =
    "webkitAnimationEnd MSAnimationEnd oanimationend animationend";

/**
 * render view
 */
App.Abstract.Controller.prototype.dispatchView = function () {

    this.view.render();
};

/**
 * destruct view
 */
App.Abstract.Controller.prototype.destructView = function () {

    if ("function" === typeof this.removeObserver) {
        this.removeObserver();
    }

    this.view.destruct();
};