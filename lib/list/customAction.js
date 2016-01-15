var _ = require('underscore'),
    utils = require('keystone-utils');

function customAction (name, options, callback) {
    name = String(name);

    if (_.isUndefined(callback)) {
        callback = options;
        options = {};
    }

    if (!_.isFunction(callback)) {
        throw new Error('List.customAction: Must provide a callback function to custom actions.');
    }

    var customAction = _.defaults(options, {
        slug: utils.slug(name, '-'),
        mobileText: name
    })

    if (_.findWhere(this._customActions, { slug: customAction.slug })) {
        throw new Error('List.customAction: A custom action with the slug '+ customAction.slug + ' already exists on list '+this.name);
    }

    customAction.callback = callback;
    customAction.name = name;

    this._customActions.push(customAction);

	return this;
}

module.exports = customAction;
