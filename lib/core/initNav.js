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
			var msg;
			if ( _.isString(i)){
				var list = keystone.list(i);
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
			}else if ( _.isObject(i)){
				if(!_.has(i, 'key')){
					msg = 'Invalid Keystone Option (nav): object ' + i + ' requires a "key" property.\n';
					throw new Error(msg);
				}
				i.label = i.label || utils.keyToLabel(key);
				i.path = i.path || utils.keyToPath(key);
				i.external = true;
				nav.by.list[i.key] = section;
				return i;
			}
			
			msg = 'Invalid Keystone Option (nav): ' + i + ' is in an unrecognized format.\n';
			throw new Error(msg);
		});
		if (section.lists.length) {
			nav.sections.push(section);
			nav.by.section[section.key] = section;
		}
	});
	
	return nav;
}

module.exports = initNav;
