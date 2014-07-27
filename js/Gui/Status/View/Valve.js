Gui.Status.View.Valve = function () {};

Gui.Status.View.Valve.prototype = new App.Abstract.View();

Gui.Status.View.Valve.prototype.cacheKey = 'name';

Gui.Status.View.Valve.prototype.init = function () {

    this.valve = this.getData('valve');

    this.node = $('<div class="valve attr">');
    this.name = $('<div class="name attr">').appendTo(this.node);
    this.temp = $('<div class="temp attr">').appendTo(this.node);
    this.wanted = $('<div class="wanted attr">').appendTo(this.node);
    this.window = $('<div class="window-status attr">').appendTo(this.node);
    this.mode = $('<div class="mode attr">').appendTo(this.node);
    this.batt = $('<div class="batt attr">').appendTo(this.node);
    this.busy = $('<div class="busy"><img src="' + App.image.getCommandAnimation() + '"></div>')
        .appendTo(this.node).hide();
};

Gui.Status.View.Valve.prototype.render = function () {

    this.addName().addTemp().addWanted().addWindow().addMode().addBattery().addError();

    if (this.valve.getData('busy')) {

        this.isBusy(true);
    }

    App.Abstract.View.prototype.render.call(this);
};

Gui.Status.View.Valve.prototype.update = function () {

    this.name.empty();
    this.temp.empty();
    this.wanted.empty();
    this.window.empty();
    this.mode.empty();
    this.batt.empty().removeClass('ok warning error');


    this.node.find('.error').remove();

    this.addName().addTemp().addWanted().addWindow().addMode().addBattery().addError();

    if (this.valve.getData('busy')) {

        this.isBusy(true);
    } else {

        this.isBusy(false);
    }
};

/**
 * indicate if valve is busy
 * @param {bool} isBusy
 */
Gui.Status.View.Valve.prototype.isBusy = function (isBusy) {

    if (isBusy) {

        this.busy.show();
    } else {

        this.busy.fadeOut();
    }
};

Gui.Status.View.Valve.prototype.addName = function () {

    var u = new Date(this.valve.getData('last_update')*1000);

    this.name.text(this.valve.getData('name'));
    this.name.append($('<div class="update">').text(
        this.helper().getDateTimeString(u)
    ));

    this.name.addClass(this.valve.getData('status').type);

    return this;
};

Gui.Status.View.Valve.prototype.addTemp = function () {

    $('<img>').attr({'src':App.image.getIcon(),"width":48,"height":48}).prependTo(this.temp);

    this.temp.append($('<div class="text">').text(this.valve.getData('real_temp') / 100 + ' °C'));

    return this;
};

Gui.Status.View.Valve.prototype.addWanted = function () {

    var d = this.valve.getData('valve_pos');

    if (d <= 50) {

        d = -(120 - ( 120 * d /50 ));
    } else {

        d = ( 120 * d /50 ) - 120;
    }

    this.wanted.append(
        $('<div class="handle">')
            .append($('<div class="indicator-wrapper">').css({
                '-moz-transform':'rotate('+d+'deg)',
                '-webkit-transform':'rotate('+d+'deg)',
                '-o-transform':'rotate('+d+'deg)',
                '-ms-transform':'rotate('+d+'deg)',
                'transform': 'rotate('+d+'deg)'
            }).append('<div class="indicator">'))
            .append($('<div class="text">').text(this.valve.getData('valve_pos') + '%'))
    ).append($('<div class="temp">').text(this.valve.getData('wanted') / 100 + ' °C'));

    return this;
};

Gui.Status.View.Valve.prototype.addWindow = function () {

    this.window.text(
        App.core.translate('Window is ' + (this.valve.getData('window') == '0' ? 'closed' : 'open'))
    );

    return this;
};

Gui.Status.View.Valve.prototype.addMode = function () {

    this.mode.text(App.core.translate('Mode: ' + this.valve.getData('mode')));

    return this;
};

Gui.Status.View.Valve.prototype.addBattery = function () {

    this.batt.text(App.core.translate('Battery:') + ' ' + this.valve.getData('battery').voltage/1000 + ' V');

    this.batt.addClass(this.valve.getData('battery').status);

    return this;
};

Gui.Status.View.Valve.prototype.addError = function () {

    var errors = this.valve.getData('errors'), text = [], i;

    if (errors.status == 'error') {

        delete errors.status;

        this.error = $('<div class="error attr">').appendTo(this.node);

        for (i in errors) {

            if (errors.hasOwnProperty(i)) {
                text.push(errors[i]);
            }
        }
        this.error.html(text.join($('<br>')));
    }

    return this;
};


