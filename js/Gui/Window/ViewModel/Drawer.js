/**
 * @class
 * @constructor
 */
Gui.Window.ViewModel.Drawer = function () {};

/**
 * @type {App.Abstract.ViewModel}
 */
Gui.Window.ViewModel.Drawer.prototype = new App.Abstract.ViewModel();

/**
 * initialize view
 */
Gui.Window.ViewModel.Drawer.prototype.init = function () {

    this.view = this.data.view;

    this.initViewMethods();
};

/**
 * add view specific methods
 */
Gui.Window.ViewModel.Drawer.prototype.initViewMethods = function () {

    var me = this;

    this.view.getButtons = function () {

        return me.getButtons();
    }
};

/**
 * retrieve collection
 * @returns {App.Lib.Object}
 */
Gui.Window.ViewModel.Drawer.prototype.getButtons = function () {

    var collection = App.Lib.Object.prototype.getInstance(),
        i,
        modules = App.core.modules,
        current = App.core.current,
        module;

    collection.initData();

    for (i in modules) {

        if (current !== i && modules.hasOwnProperty(i) && modules[i].inDrawer && modules[i].headline) {

            module = modules[i].namespace+'.'+modules[i].name;

            collection.setData(module, {
                "headline" : modules[i].headline,
                "current" : current === module
            });
        }
    }

    return collection;
};
