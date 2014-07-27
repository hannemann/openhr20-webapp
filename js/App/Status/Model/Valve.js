App.Status.Model.Valve = function () {};

App.Status.Model.Valve.prototype = new App.Abstract.Model();

App.Status.Model.Valve.prototype.cacheKey = 'name';

/**
 * update
 */
App.Status.Model.Valve.prototype.update = function () {

    var request = this.getData('request'),
        i, me = this;

    App.core.getModule('Gui.Status').lockRefresh();

    this.setData('busy', true);

    $.event.trigger({
        "type" : "valveupdate-" + this.getData('id')
    });

    for (i in request) {

        if (request.hasOwnProperty(i) && me.hasData(i)) {

            me.setData(i, request[i]);
        }
    }

    this.getResource().update(this, function (result) {

        App.helper.log(result);

        $.event.trigger({
            "type" : "valveupdate-" + me.getData('id')
        });

        if (result.refresh) {

            me.poll(result.refresh * 1000);
        } else {

            App.core.getModule('Gui.Status').unlockRefresh();
        }
    });
};

/**
 * poll for updates
 * @returns {App.Status.Model.Valve.Resource}
 */
App.Status.Model.Valve.prototype.poll = function (interval) {

    var me = this, count = 0, maxPoll = 10,
        name = this.getData('name');

    App.helper.log('start polling');
    this.pollint = setInterval(function () {

        me.getResource().poll(me, function (result) {

            App.helper.log(result);
            if (result.valves && result.valves[name]) {

                App.helper.log('success', result.valves[name]);

                clearInterval(me.pollint);

                me.initData(result.valves[name]);

                me.setData('busy', false);

                $.event.trigger('valveupdate-' + me.getData('id'));

                App.core.getModule('Gui.Status').unlockRefresh();
            }
            count += 1;
            if (count > maxPoll) {

                App.helper.log('failed');

                clearInterval(me.pollint);

                App.core.getModule('Gui.Status').unlockRefresh();
            }
        });

    }, interval);
};

/**
 * retrieve resource
 * @returns {App.Status.Model.Valve.Resource}
 */
App.Status.Model.Valve.prototype.getResource = function () {

    return this.module.getResource('Valve');
};