/**
 * Initialises Keystone's internal nav config
 *
 * @param {Object} nav
 * @api private
 */

var _ = require('lodash');
var utils = require('keystone-utils');

module.exports = function initNav (sections) {
	var keystone = this;

	var nav = {
		sections: [],
		by: {
			list: {},
			section: {},
		},
	};

	if (!sections) {
		sections = {};
		nav.flat = true;
		_.forEach(this.lists, function (list) {
			if (list.get('hidden')) return;
			sections[list.path] = [list.path];
		});
	}

	_.forEach(sections, function (spec, key) {
		var lists;
		if (typeof spec === 'string') {
			lists = [spec];
		}
		else if (Array.isArray(spec)) {
			lists = spec;
		}
		else {
			lists = spec.paths;
		}

		var section = {
			lists: lists,
			label: nav.flat ? keystone.list(spec[0]).label : utils.keyToLabel(key),
		};
		if (spec.icon) {
			section.icon = spec.icon;
		}
		section.key = key;
		section.lists = _.map(section.lists, function (i) {
			if (typeof i === 'string') {
				var list = keystone.list(i);
				if (!list) {
					throw new Error('Invalid Keystone Option (nav): list ' + i + ' has not been defined.\n');
				}
				if (list.get('hidden')) {
					throw new Error('Invalid Keystone Option (nav): list ' + i + ' is hidden.\n');
				}
				nav.by.list[list.key] = section;
				return {
					key: list.key,
					label: list.label,
					path: list.path,
				};
			} else if (_.isObject(i)) {
				if (!_.has(i, 'key')) {
					throw new Error('Invalid Keystone Option (nav): object ' + i + ' requires a "key" property.\n');
				}
				i.label = i.label || utils.keyToLabel(key);
				i.path = i.path || utils.keyToPath(key);
				i.external = true;
				nav.by.list[i.key] = section;
				return i;
			}
			throw new Error('Invalid Keystone Option (nav): ' + i + ' is in an unrecognized format.\n');
		});
		if (section.lists.length) {
			nav.sections.push(section);
			nav.by.section[section.key] = section;
		}
	});

	return nav;
};
