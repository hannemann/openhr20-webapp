App.Status.Model.Valve.Resource = function () {};

App.Status.Model.Valve.Resource.prototype = new App.Api.Resource();

App.Status.Model.Valve.Resource.prototype.cacheKey = null;

App.Status.Model.Valve.Resource.prototype.urls = {
    "load": "Backend/"
};

App.Status.Model.Valve.Resource.prototype.update = function (valve) {

    return this.load({
        "method":"POST",
        "async":false,
        "data":{
            "page":"status",
            "type":"addr",
            "addr":valve.getData('id'),
            "w_temp":valve.getData('request').wanted / 100
        }
    });
};

App.Status.Model.Valve.Resource.prototype.poll = function (valve, callback) {

    return this.load({
        "method":"POST",
//        "async":false,
        "data":{
            "page":"status",
            "type":"addr",
            "addr":valve.getData('id')
        },
        "callback":callback
    });
};