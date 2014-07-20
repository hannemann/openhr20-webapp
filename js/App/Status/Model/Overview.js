App.Status.Model.Overview = function () {};

App.Status.Model.Overview.prototype = new App.Abstract.Model();

App.Status.Model.Overview.prototype.getResource = function () {

    return this.module.getResource('Overview');
};

App.Status.Model.Overview.prototype.init = function () {

    var resource = this.getResource();

    this.initData(resource.load({"data":{"page":"status","addr":0},"async":false}).responseJSON);
};

