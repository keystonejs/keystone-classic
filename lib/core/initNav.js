/**
 * Initialises Keystone's internal nav config
 *
 * @param {Object} nav
 * @api private
 */

var _ = require('underscore'),
	utils = require('keystone-utils');

function initNav(sections) {
	
	var keystone = this;
	
	var nav = {
		sections: [],
		by: {
			list: {},
			section: {}
		}
	};
	
	if (!sections) {
		sections = {};
		nav.flat = true;
		_.each(this.lists, function(list) {
			if (list.get('hidden')) return;
			sections[list.path] = [list.path];
		});
	}
	
	_.each(sections, function(section, key) {
		if ('string' === typeof section) {
			section = [section];
		}
		section = {
			lists: section,
			label: nav.flat ? keystone.list(section[0]).label : utils.keyToLabel(key)
		};
		section.key = key;
		section.lists = _.map(section.lists, function(i) {
			var msg, list = keystone.list(i);
			if (!list) {
				msg = 'Invalid Keystone Option (nav): list ' + i + ' has not been defined.\n';
				throw new Error(msg);
			}
			if (list.get('hidden')) {
				msg = 'Invalid Keystone Option (nav): list ' + i + ' is hidden.\n';
				throw new Error(msg);
			}
			nav.by.list[list.key] = section;
			return list;
		});
		if (section.lists.length) {
			nav.sections.push(section);
			nav.by.section[section.key] = section;
		}
	});
	
	return nav;
}

module.exports = initNav;
