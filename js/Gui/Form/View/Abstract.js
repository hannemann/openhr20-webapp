/**
 * @class
 * @constructor
 */
Gui.Form.View.Abstract = function () {};

/**
 * @type {App.Abstract.View}
 */
Gui.Form.View.Abstract.prototype = new App.Abstract.View();

/**
 * initialize node and categories
 */
Gui.Form.View.Abstract.prototype.init = function () {

    this.node = $('<form>');

    this.categories = {};
};

/**
 * render dom
 */
Gui.Form.View.Abstract.prototype.render = function () {

    this.prepareFields();

    this.renderCategories();

    if (this.data.hasSubmit) {

        this.addSubmit();
    }

    if (this.data.owner && this.data.reference) {

        this.data.owner[this.data.reference] = this.data.fields;
    }

    this.node.appendTo(this.data.parentView.node);
};

/**
 * render buttons
 */
Gui.Form.View.Abstract.prototype.addSubmit = function () {


};

/**
 * prepare data fields, add to category
 */
Gui.Form.View.Abstract.prototype.prepareFields = function () {

    var i;

    for (i in this.data.fields) {

        if (this.data.fields.hasOwnProperty(i)) {

            this.prepareField(i, this.data.fields[i]);

            if (this.data.fields[i].dom) {

                this.addToCategory(this.data.fields[i].category, this.data.fields[i]);
            }
        }
    }
};

/**
 * get dom according to type of data
 * @param {string} id
 * @param {{}} field
 */
Gui.Form.View.Abstract.prototype.prepareField = function (id, field) {

    if ("boolean" === field.type) {

        this.getBoolean(id, field);
    }

    if ("number" === field.type) {

        this.getNumber(id, field);
    }

    if ("string" === field.type) {

        this.getString(id, field);
    }

    if ("enum" === field.type) {

        this.getEnum(id, field);
    }

    if ("channel" === field.type) {

        this.getChannel(id, field);
    }

    if ("directory" === field.type) {

        this.getDirectory(id, field);
    }
};

/**
 * set type checkbox
 * @param {string} id
 * @param {{}} field
 */
Gui.Form.View.Abstract.prototype.getBoolean = function (id, field) {

    this.decorateField(id, field);

    field.gui.attr('type', 'checkbox').prop('checked', field.checked);

    field.dom.addClass('form-field-boolean').append(field.gui);
};

/**
 * set typ number
 * @param {string} id
 * @param {{}} field
 */
Gui.Form.View.Abstract.prototype.getNumber = function (id, field) {

    this.decorateField(id, field);

    field.gui.attr('type', 'number');

    field.dom.append(field.gui);
};

/**
 * set type text
 * @param {string} id
 * @param {{}} field
 */
Gui.Form.View.Abstract.prototype.getString = function (id, field) {

    this.decorateField(id, field);

    field.gui.attr('type', 'text');

    field.dom.append(field.gui);
};

/**
 * set type text, add value
 * @param {string} id
 * @param {{}} field
 */
Gui.Form.View.Abstract.prototype.getEnum = function (id, field) {

    var selected = field.getValue();

    this.decorateField(id, field);

    field.gui
        .attr('type', 'text')
        .val(selected.label);

    field.dom.append(field.gui);
};

/**
 * set type text
 * @param {string} id
 * @param {{}} field
 */
Gui.Form.View.Abstract.prototype.getChannel = function (id, field) {

    this.decorateField(id, field);

    field.gui.attr('type', 'text');

    field.dom.append(field.gui);
};

/**
 * set type text
 * @param {string} id
 * @param {{}} field
 */
Gui.Form.View.Abstract.prototype.getDirectory = function (id, field) {

    this.decorateField(id, field);

    field.gui.attr('type', 'text');

    field.dom.append(field.gui);
};

/**
 * decorate data with dom according to type
 * @param {string} id
 * @param {{}} field
 * @returns {*}
 */
Gui.Form.View.Abstract.prototype.decorateField = function (id, field) {

    field.gui = $('<input name="' + (field.name ? field.name : id) + '">')
        .attr('readonly', true)
        .val((field.value ? field.value : ''));

    field.dom = $('<label id="' + id + '" class="clearer text">');
    $('<span>').text(App.core.translate(field.label)).appendTo(field.dom);

    if (field.hasOwnProperty('info')) {

        $('<span class="info">').text(App.core.translate(field.info)).appendTo(field.dom);
    }

    field.disabled = false;

    if ("undefined" !== typeof field.depends) {

        if (!this.data.fields[field.depends].getValue()) {

            field.dom.addClass('disabled');
            field.disabled = true;
        }
    }

    return field;
};

/**
 * add field to category
 * @param {string} cat
 * @param {{}} field
 */
Gui.Form.View.Abstract.prototype.addToCategory = function (cat, field) {

    this.getCategory(cat).append(field.dom);
};

/**
 * retriev category by name
 * @param {string} cat
 * @returns {*}
 */
Gui.Form.View.Abstract.prototype.getCategory = function (cat) {

    if ("undefined" === typeof this.categories[cat]) {

        this.categories[cat] = $(
            '<div class="category category-'
            + cat
            + '"><h2>'
            + App.core.translate(this.data.catConfig[cat].label)
            + '</h2></div>'
        );
    }

    return this.categories[cat];
};

/**
 * add categories to node
 */
Gui.Form.View.Abstract.prototype.renderCategories = function () {

    var i;

    for (i in this.categories) {

        if (this.categories.hasOwnProperty(i)) {

            this.categories[i].appendTo(this.node);
        }
    }
};
