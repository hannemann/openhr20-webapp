/**
 * @class
 * @constructor
 */
Gui.Window.View.Abstract = function () {};

/**
 * @type {App.Lib.Cache.store.View}
 */
Gui.Window.View.Abstract.prototype = new App.Abstract.View();

Gui.Window.View.Abstract.prototype.getNode = function () {

    return $('<div class="window">');
};

/**
 * initialize essentials
 */
Gui.Window.View.Abstract.prototype.init = function () {

    this.node = this.getNode();

    if (this.hasCloseButton && !this.closeButton) {
        this.addCloseButton();
    }

    this.body = $('<div class="window-body">').appendTo(this.node);

    if (this.hasHeader) {
        this.header = $('<div class="window-header clearer">').appendTo(this.body);
        this.node.addClass('has-header');
    }

};

/**
 * render essentials
 */
Gui.Window.View.Abstract.prototype.render = function () {

    if (this.isModal) {

        this.addModalOverlay(this.parentView);
    }

    if (this.isModalViewport) {

        this.addModalOverlay(App.core.getModule('Gui.Viewport').getView('Default'));
    }

    if (!this.isModalTransparent) {

        $('body').addClass('show-modal');
    }

    App.Abstract.View.prototype.render.call(this);
};

/**
 * add modal overlay, set as parentView
 * @param parentView
 */
Gui.Window.View.Abstract.prototype.addModalOverlay = function (parentView) {

    /**
     * @type {App.Abstract.view|object}
     * @property {jQuery.fn.init} node
     */
    parentView = parentView || $('body');

    this.modalOverlay = $('<div class="modal-overlay dark">').appendTo(parentView.node);

    if (this.isModalTransparent) {
        this.modalOverlay.toggleClass('dark transparent');
    }

    this.parentView = {
        "node" : this.modalOverlay
    };
};

/**
 * add a button to close the window if configured
 */
Gui.Window.View.Abstract.prototype.addCloseButton = function () {

    this.closeButton = $('<div class="window-close">').html('&#10006;')
        .appendTo(this.node);
};

/**
 * retrieve tool button
 * @param options
 * @returns {*|jQuery|HTMLElement}
 */
Gui.Window.View.Abstract.prototype.getToolButton = function (options) {

    var dom, me=this;

    dom = $('<li>');
    if (typeof options.image != 'undefined') {

        dom.append('<img src="'+options.image.src+'">');

    } else if (typeof options.dom != 'undefined') {

        if (typeof options.dom == 'function') {

            dom.append(options.dom.apply(me));

        } else {

            dom.append(options.dom);

        }
    }

    dom.on('click', function () {

        if (typeof options.url != 'undefined') {

            if (options.target == 'new') {

                window.open(options.url);

            } else {

                location.href = options.url;
            }

        } else if (typeof options.callback == 'function') {

            options.callback.apply(me);
        }
    });

    return dom;
};

/**
 * remove window
 */
Gui.Window.View.Abstract.prototype.destruct = function () {

    var me=this;

    $.event.trigger({
        "type" : "destruct.window-" + this.keyInCache
    });

    if (this.hasHeader) {
        this.header.empty();
    }
    if (this.hasOwnProperty('body')) {
        this.body.empty();
    }
    this.remove();

    if (this.isModal || this.isModalViewport) {

        if (!this.isModalTransparent) {

            this.modalOverlay.on('webkitAnimationEnd MSAnimationEnd oanimationend animationend', function (e) {

                if (e.target === me.modalOverlay.get(0)) {

                    me.modalOverlay.remove();
                    $('body').removeClass('hide-modal');
                }
            });

            $('body').toggleClass('hide-modal show-modal');

        } else {

            this.modalOverlay.remove();
        }
    }
};