App.Status.Model.Valve = function () {};

App.Status.Model.Valve.prototype = new App.Abstract.Model();

App.Status.Model.Valve.prototype.cacheKey = 'name';

/**
 * update
 */
App.Status.Model.Valve.prototype.update = function () {

    var result = this.getResource().update(this),
        request = this.getData('request'),
        i;

    console.log(result);

    if (result.status === 200) {

        for (i in request) {

            if (request.hasOwnProperty(i) && this.hasData(i)) {

                this.setData(i, request[i]);
            }
        }

        $.event.trigger({
            "type" : "valveupdate"
        });

        if (result.responseJSON.refresh) {

            this.poll(result.responseJSON.refresh * 1000);
        }
    }
};

/**
 * poll for updates
 * @returns {App.Status.Model.Valve.Resource}
 */
App.Status.Model.Valve.prototype.poll = function (interval) {

    var me = this, count = 0, maxPoll = 10;

    console.log('start polling');
    this.pollint = setInterval(function () {

        var result = me.getResource().poll(me);

        console.log(result);
        if (result.status === 200 && result.responseJSON.valves && result.responseJSON.valves[me.getData('name')]) {

            console.log('success', result.responseJSON.valves[me.getData('name')]);

            clearInterval(me.pollint);

            me.initData(result.responseJSON.valves[me.getData('name')]);

            $.event.trigger('valveupdate');
        }
        count += 1;
        if (count > maxPoll) {

            console.log('failed');

            clearInterval(me.pollint);
        }
    }, interval);
};

/**
 * retrieve resource
 * @returns {App.Status.Model.Valve.Resource}
 */
App.Status.Model.Valve.prototype.getResource = function () {

    return this.module.getResource('Valve');
};