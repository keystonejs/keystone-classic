var _ = require('lodash');
var moment = require('moment');
var utils = require('keystone-utils');

var debug = require('debug')('keystone:core:list:getSearchFilters');

/**
 * Gets filters for a Mongoose query that will search for the provided string,
 * based on the searchFields List option.
 *
 * Also accepts a filters object from `processFilters()`, any of which may
 * override the search string.
 *
 * NOTE: This function is deprecated in favor of List.prototype.addSearchToQuery
 * and will be removed in a later version.
 *
 * Example:
 *     list.getSearchFilters('jed') // returns { name: /jed/i }
 *
 * @param {String} query
 * @param {Object} additional filters
 */
function getSearchFilters (search, add) {
	var filters = {};
	var list = this;

	search = String(search || '').trim();

	if (search.length) {
		// Use the text index the behaviour is enabled by the list schema
		// Usually, when searchUsesTextIndex is true, list.register() will maintain an index using ensureTextIndex()
		// However, it's possible for searchUsesTextIndex to be true while there is an existing text index on the collection that *isn't* described in the list schema
		// If this occurs, an error will be reported when list.register() is called and the existing index will not be replaced, meaning it will be used here
		if (this.options.searchUsesTextIndex) {
			filters.$text = { $search: search };
		}
		else {
			var searchFilter;
			var searchParts = search.split(' ');
			var searchRx = new RegExp(utils.escapeRegExp(search), 'i');
			var splitSearchRx = new RegExp((searchParts.length > 1) ? _.map(searchParts, utils.escapeRegExp).join('|') : search, 'i');
			var searchFields = this.get('searchFields');
			var searchFilters = [];
			var searchIdField = utils.isValidObjectId(search);

			if (typeof searchFields === 'string') {
				searchFields = searchFields.split(',');
			}

			searchFields.forEach(function (path) {
				path = path.trim();

				if (path === '__name__') {
					path = list.mappings.name;
				}

				var field = list.fields[path];

				if (field && field.type === 'name') {
					var first = {};
					first[field.paths.first] = splitSearchRx;
					var last = {};
					last[field.paths.last] = splitSearchRx;
					searchFilter = {};
					searchFilter.$or = [first, last];
					searchFilters.push(searchFilter);
				} else {
					searchFilter = {};
					searchFilter[path] = searchRx;
					searchFilters.push(searchFilter);
				}
			});

			if (list.autokey) {
				searchFilter = {};
				searchFilter[list.autokey.path] = searchRx;
				searchFilters.push(searchFilter);
			}

			if (searchIdField) {
				searchFilter = {};
				searchFilter._id = search;
				searchFilters.push(searchFilter);
			}

			if (searchFilters.length > 1) {
				filters.$or = searchFilters;
			} else if (searchFilters.length) {
				filters = searchFilters[0];
			}
		}
	}

	if (add) {
		_.forEach(add, function (filter) {
			var cond;
			var path = filter.key;
			var value = filter.value;

			switch (filter.field.type) {
				case 'boolean':
					if (!value || value === 'false') {
						filters[path] = { $ne: true };
					} else {
						filters[path] = true;
					}
					break;

				case 'localfile':
				case 'cloudinaryimage':
				case 'cloudinaryimages':
				case 's3file':
				case 'name':
				case 'password':
					// TODO
					break;

				case 'location':
					_.forEach(['street1', 'suburb', 'state', 'postcode', 'country'], function (pathKey, i) {
						var value = filter.value[i];
						if (value) {
							filters[filter.field.paths[pathKey]] = new RegExp(utils.escapeRegExp(value), 'i');
						}
					});
					break;

				case 'relationship':
					if (value) {
						if (filter.field.many) {
							filters[path] = (filter.inverse) ? { $nin: [value] } : { $in: [value] };
						} else {
							filters[path] = (filter.inverse) ? { $ne: value } : value;
						}
					} else {
						if (filter.field.many) {
							filters[path] = (filter.inverse) ? { $not: { $size: 0 } } : { $size: 0 };
						} else {
							filters[path] = (filter.inverse) ? { $ne: null } : null;
						}
					}
					break;

				case 'select':
					if (filter.value) {
						filters[path] = (filter.inverse) ? { $ne: value } : value;
					} else {
						filters[path] = (filter.inverse) ? { $nin: ['', null] } : { $in: ['', null] };
					}
					break;

				case 'number':
				case 'money':
					if (filter.operator === 'bt') {
						value = [
							utils.number(value[0]),
							utils.number(value[1]),
						];
						if (!isNaN(value[0]) && !isNaN(value[1])) {
							filters[path] = {
								$gte: value[0],
								$lte: value[1],
							};
						}
						else {
							filters[path] = null;
						}
					} else {
						value = utils.number(value);
						if (!isNaN(value)) {
							if (filter.operator === 'gt') {
								filters[path] = { $gt: value };
							}
							else if (filter.operator === 'lt') {
								filters[path] = { $lt: value };
							}
							else {
								filters[path] = value;
							}
						}
						else {
							filters[path] = null;
						}
					}
					break;

				case 'date':
				case 'datetime':
					if (filter.operator === 'bt') {
						value = [
							moment(value[0]),
							moment(value[1]),
						];
						if ((value[0] && value[0].isValid()) && (value[1] && value[0].isValid())) {
							filters[path] = {
								$gte: moment(value[0]).startOf('day').toDate(),
								$lte: moment(value[1]).endOf('day').toDate(),
							};
						}
					} else {
						value = moment(value);
						if (value && value.isValid()) {
							var start = moment(value).startOf('day').toDate();
							var end = moment(value).endOf('day').toDate();
							if (filter.operator === 'gt') {
								filters[path] = { $gt: end };
							} else if (filter.operator === 'lt') {
								filters[path] = { $lt: start };
							} else {
								filters[path] = { $lte: end, $gte: start };
							}
						}
					}
					break;

				case 'text':
				case 'textarea':
				case 'html':
				case 'email':
				case 'url':
				case 'key':
					if (filter.exact) {
						if (value) {
							cond = new RegExp('^' + utils.escapeRegExp(value) + '$', 'i');
							filters[path] = filter.inverse ? { $not: cond } : cond;
						} else {
							if (filter.inverse) {
								filters[path] = { $nin: ['', null] };
							} else {
								filters[path] = { $in: ['', null] };
							}
						}
					} else if (value) {
						cond = new RegExp(utils.escapeRegExp(value), 'i');
						filters[path] = filter.inverse ? { $not: cond } : cond;
					}
					break;

			}
		});
	}

	debug('Applying filters to list \'' + list.key + '\':', filters);
	return filters;
}

module.exports = getSearchFilters;
