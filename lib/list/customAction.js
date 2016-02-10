var _ = require('underscore');
var utils = require('keystone-utils');

function customAction (name, options, action) {
	name = String(name);

	if (_.isUndefined(action)) {
		action = options;
		options = {};
	}

	if (!_.isFunction(action)) {
		throw new Error('List.customAction: Must provide a callback function to custom actions.');
	}

	var customAction = _.defaults(options, {
		slug: utils.slug(name, '-'),
		mobileText: name,
		title: name,
		type: 'hollow-primary',
		dependsOn: undefined,
		save: _.defaults(options.defaults || {}, {
			pre: false,
			post: false,
		}),
	});

	if (_.findWhere(this._customActions, { slug: customAction.slug })) {
		throw new Error('List.customAction: A custom action with the slug ' + customAction.slug + ' already exists on list ' + this.name);
	}

	customAction.action = action;
	customAction.name = name;

	this._customActions.push(customAction);

	return this;
}

module.exports = customAction;
