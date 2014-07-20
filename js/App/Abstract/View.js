/**
 * @class
 * @constructor
 * @var {jQuery} node
 */
App.Abstract.View = function () {};

/**
 * prototype
 * @type {App.Lib.Object}
 */
App.Abstract.View.prototype = new App.Lib.Object();

/**
 * set parent view
 * @param parentView
 * @returns {App.Abstract.View}
 */
App.Abstract.View.prototype.setParentView = function (parentView) {

    this.parentView = parentView;

    return this;
};

/**
 * append node to parentNode
 */
App.Abstract.View.prototype.render = function () {

    this.node.appendTo(this.parentView.node);

    this.isRendered = !this.isRendered;
};

/**
 * remove node
 */
App.Abstract.View.prototype.remove = function () {

    this.node.remove();

    this.isRendered = !this.isRendered;
};

/**
 * default destructor
 */
App.Abstract.View.prototype.destruct = function () {

    this.remove();
};