/**
 * @class
 * @constructor
 */
App.Status.Model.Overview = function () {};

/**
 * @type {App.Abstract.Model}
 */
App.Status.Model.Overview.prototype = new App.Abstract.Model();

/**
 * initialize
 */
App.Status.Model.Overview.prototype.init = function () {

    this.initValves(
        this.module.getResource('Overview').getValves()
    );
};

/**
 * init collection
 */
App.Status.Model.Overview.prototype.initValves = function (valves) {

    var i;

    this.valves = new App.Lib.Object();
    this.valves.initData();

    for (i in valves) {

        if (valves.hasOwnProperty(i)) {

            this.valves.setData(i, this.module.getModel('Valve', valves[i]));
        }
    }
};

/**
 * retrieve specific valve
 * @param {string} name
 * @returns {App.Status.Model.Valve}
 */
App.Status.Model.Overview.prototype.getValve = function (name) {

    return this.valves.getData(name);
};

/**
 * retrieve valves collection
 * @returns {App.Lib.Object|*}
 */
App.Status.Model.Overview.prototype.getValves = function () {

    return this.valves.getData();
};

