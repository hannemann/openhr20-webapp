/**
 * EPG Module
 * @constructor
 */
App.Status = function () {};

/**
 * prototype
 * @type {App.Abstract.Module}
 */
App.Status.prototype = new App.Abstract.Module();

/**
 * Modulename
 * @type {string}
 */
App.Status.prototype.name = 'Status';

/**
 * register module
 */
App.core.registerModule('App.Status', true);

