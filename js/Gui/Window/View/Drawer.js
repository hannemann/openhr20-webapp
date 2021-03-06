/**
 * @class
 * @constructor
 */
Gui.Window.View.Drawer = function () {};

/**
 * @type {Gui.Window.Controller.Abstract}
 */
Gui.Window.View.Drawer.prototype = new Gui.Window.View.Abstract();

/**
 * is modal within viewport
 * @type {boolean}
 */
Gui.Window.View.Drawer.prototype.isModalViewport = true;

/**
 * is transparent modal
 * @type {boolean}
 */
Gui.Window.View.Drawer.prototype.isModalTransparent = true;

/**
 * @type {boolean}
 */
Gui.Window.View.Drawer.prototype.hasHeader = true;

/**
 * draw
 */
Gui.Window.View.Drawer.prototype.render = function () {

    this.header.text('Menu');

    this.buttons = [];

    this.addClasses().addButtons().addInfo();

    Gui.Window.View.Abstract.prototype.render.call(this);
};

/**
 * add needed classes
 * @returns {Gui.Window.View.Drawer}
 */
Gui.Window.View.Drawer.prototype.addClasses = function () {

    this.node.addClass('window-drawer clearer');

    return this;
};

/**
 * add Buttons
 * @returns {Gui.Window.View.Drawer}
 */
Gui.Window.View.Drawer.prototype.addButtons = function () {

    this.getButtons().each($.proxy(function (module, options) {

        this.buttons.push(
            $('<div class="navi-button">')
                .attr('data-module', module)
                .text(App.core.translate(options.headline))
                .addClass(options.current ? 'current' : '')
                .appendTo(this.body)
        );

    }, this));

    return this;
};

/**
 * add info to drawer
 */
Gui.Window.View.Drawer.prototype.addInfo = function () {

    var info = App.core.getModule('App.Info').getModel('Info'),
        channel, onAir = $('<div class="onAir clearer">');

    this.info = $('<div class="info"><div class="header">Info</div></div>');

    if (info.hasData('channel')) {

        channel = App.core.getModule('App.Epg').loadModel('Channels.Channel', info.getData('channel'));

        if (channel.hasData('image')) {

            $('<img>').attr('src', channel.getData('image')).appendTo(onAir);

        } else {

            $('<div>').text(channel.getData('name') + ' - ').appendTo(onAir)
        }

        $('<span>').text(info.getData('title')).appendTo(onAir);

    } else if (info.hasData('video')) {

        $('<div>').text(info.getData('video')).appendTo(onAir)
    }

    onAir.appendTo(this.info);

    $('<div class="info-item">').text(info.getData('diskusage').description_localized).appendTo(this.info);

    this.info.appendTo(this.body);
};
