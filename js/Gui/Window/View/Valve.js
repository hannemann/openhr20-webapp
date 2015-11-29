Gui.Window.View.Valve = function () {};

Gui.Window.View.Valve.prototype = new Gui.Window.View.Abstract();

Gui.Window.View.Valve.prototype.cacheKey = null;

Gui.Window.View.Valve.prototype.hasHeader = true;

Gui.Window.View.Valve.prototype.sliderPos = 0;

/**
 * @type {boolean}
 */
Gui.Window.View.Valve.prototype.isModal = true;

Gui.Window.View.Valve.prototype.render = function () {

    this.valve = this.getData('valve');

    this.addHeader().addButtons().addThermometer().setTemp();

    this.node.addClass('collapsed tool-window window-valve');

    Gui.Window.View.Abstract.prototype.render.call(this);

    this.node.toggleClass('collapsed expand');
};

Gui.Window.View.Valve.prototype.addHeader = function () {

    this.header.append($('<h2 class="name">').text(this.valve.getData('name')));

    return this;
};

Gui.Window.View.Valve.prototype.addThermometer = function () {

    this.thermo = $('<div class="thermometer-wrapper">');

    this.slider = $('<div class="slider">').appendTo(this.thermo);
    this.sliderText = $('<div class="slider-text">').appendTo(this.slider);
    this.activator = $('<div class="activator">').appendTo(this.slider);
    this.thermo.append('<div class="scala">');
    this.thermo.append('<div class="ball">');
    this.tempIndicator = $('<div class="indicator">').appendTo(this.body);
    this.setSliderPos(this.getSliderPos());
    this.thermo.appendTo(this.body);
    return this;
};

/**
 * add buttons
 * @returns {Gui.Window.View.Valve}
 */
Gui.Window.View.Valve.prototype.addButtons = function () {

    var mode = this.valve.getData('mode');

    this.auto = $('<div class="button button-auto">').text(App.core.translate('AUTO'));

    this.manu = $('<div class="button button-manu">').text(App.core.translate('MANU'));

    $('<div class="button-wrapper">').append(this.auto).append(this.manu).appendTo(this.body);

    if ('-' !== mode) {

        this[mode.toLowerCase()].addClass('active');
    }

    this.cancel = $('<div class="button button-cancel">').text(App.core.translate('Cancel')).appendTo(this.node);

    this.ok = $('<div class="button button-confirm">').text('OK').appendTo(this.node);

    return this;
};

Gui.Window.View.Valve.prototype.setTemp = function () {

    var temp = this.valve.getData('wanted');

    temp = temp%100 == 0 ? temp / 100 + '.0' : temp / 100;

    this.tempIndicator.text(temp + ' °C');
    this.sliderText.text(temp + ' °C');
};
Gui.Window.View.Valve.prototype.getSliderPos = function () {

    return Math.ceil(275 - (240 * (this.valve.getData('wanted') / 10 - 100) / 200));
};

/**
 *
 * @param {int} [pos]
 */
Gui.Window.View.Valve.prototype.setSliderPos = function (pos) {

    var temp;

    if (pos) {

        pos -= this.thermo.offset().top;
    } else {

        this.slider.animate({"top":this.sliderPos + 'px'}, 'fast');
        return;
    }

    pos = parseInt(pos, 10);

    if (pos >= 255) {
        pos = 255;
    }
    if (pos <= 15) {
        pos = 15;
    }
    this.slider.css({"top":pos + 'px'});

    temp = (((255 - pos) / 6) * 0.5 + 10) * 100;

    temp = temp%100 == 0 ? temp / 100 + '.0' : temp / 100;

    if ((pos - 15) % 6 == 0) {
        this.sliderText.text(temp + ' °C');
        this.tempIndicator.text(temp + ' °C');
        this.sliderPos = pos;
    }
};
