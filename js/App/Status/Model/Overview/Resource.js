App.Status.Model.Overview.Resource = function () {};

App.Status.Model.Overview.Resource.prototype = new App.Api.Resource();

App.Status.Model.Overview.Resource.prototype.cacheKey = null;

App.Status.Model.Overview.Resource.prototype.urls = {
    "load": "Backend"
};

App.Status.Model.Overview.Resource.prototype.getValves = function () {

    return this.load({"data":{"page":"status","addr":0},"async":false})
        .responseJSON
        .valves
};
