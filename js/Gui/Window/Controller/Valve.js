/**
 * @constructor
 * @property {Gui.Window.View.Valve} view
 */
Gui.Window.Controller.Valve = function () {};

Gui.Window.Controller.Valve.prototype = new Gui.Window.Controller.Abstract();

Gui.Window.Controller.Valve.prototype.cacheKey = null;

Gui.Window.Controller.Valve.prototype.init = function () {

    this.view = this.module.getView('Valve', {"valve" : this.getData('valve')});

    Gui.Window.Controller.Abstract.prototype.init.call(this);

    this.view.setParentView(
        {"node":$('body')}
    );

    this.request = {};
};

Gui.Window.Controller.Valve.prototype.dispatchView = function () {

    Gui.Window.Controller.Abstract.prototype.dispatchView.call(this);

    this.addObserver();
};

Gui.Window.Controller.Valve.prototype.addObserver = function () {

    this.view.activator.on('mousedown', $.proxy(this.handleSliderDown, this));

    this.view.activator.on('touchstart', $.proxy(this.handleSliderDown, this));

    this.view.auto.on('click', $.proxy(this.handleAuto, this));

    this.view.manu.on('click', $.proxy(this.handleManu, this));

    $(window).on('mousemove', $.proxy(this.handleSliderMove, this));

    $(window).on('touchmove', $.proxy(this.handleSliderMove, this));

    $(window).on('mouseup', $.proxy(this.handleSliderUp, this));

    $(window).on('touchend', $.proxy(this.handleSliderUp, this));

    this.view.cancel.one('click', function () {
        history.back();
    });

    this.view.ok.one('click', $.proxy(this.sendCommand, this));
};

Gui.Window.Controller.Valve.prototype.handleSliderDown = function (e) {

    e.preventDefault();
    this.sliderMove = true;

    if ('touchstart' === e.type) {

        this.delta = e.originalEvent.changedTouches[0].clientY - this.view.slider.offset().top;
    } else {

        this.delta = e.clientY - this.view.slider.offset().top;
    }

    this.view.tempIndicator.addClass('active');
};

Gui.Window.Controller.Valve.prototype.handleSliderMove = function (e) {

    var clientY;

    if (this.sliderMove) {

        e.preventDefault();
        if ('touchmove' === e.type) {

            clientY = e.originalEvent.changedTouches[0].clientY;
        } else {

            clientY = e.clientY;
        }
        this.view.setSliderPos(clientY - this.delta);
    }
};

Gui.Window.Controller.Valve.prototype.handleSliderUp = function () {

    if (this.sliderMove) {
        this.view.setSliderPos();
    }
    this.sliderMove = false;

    this.view.tempIndicator.removeClass('active');
};

Gui.Window.Controller.Valve.prototype.handleAuto = function () {

    this.request.mode = "AUTO";
    this.view.manu.removeClass('active');
    this.view.auto.addClass('active');
};

Gui.Window.Controller.Valve.prototype.handleManu = function () {

    this.request.mode = "MANU";
    this.view.auto.removeClass('active');
    this.view.manu.addClass('active');
};

Gui.Window.Controller.Valve.prototype.sendCommand = function () {

    var me = this, valve = this.getData('valve');

    this.request.wanted = parseFloat(me.view.sliderText.text()) * 100;

    history.back();

    $(document).one(this.animationEndEvents, function () {

        valve.setData('request', me.request).update();
        me.request = {};
    });
};

/**
 * destroy
 */
Gui.Window.Controller.Valve.prototype.destructView = function () {

    var me = this;

    // apply animation
    this.view.node.toggleClass('collapse expand');
    // remove on animation end
    this.view.node.one(this.animationEndEvents, function () {

        Gui.Window.Controller.Abstract.prototype.destructView.call(me);
    });
};
