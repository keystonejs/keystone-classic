var assign = require('object-assign');
var listToArray = require('list-to-array');
var utils = require('keystone-utils');

function trim(i) { return i.trim(); }
function truthy(i) { return i; }

function getNameFilter(field, searchString) {
	var searchWords = searchString.split(' ').map(trim).filter(truthy).map(utils.escapeRegExp);
	var nameSearchRegExp = new RegExp(searchWords.join('|'), 'i');
	var first = {};
	first[field.paths.first] = nameSearchRegExp;
	var last = {};
	last[field.paths.last] = nameSearchRegExp;
	return {
		$or: [first, last]
	};
}

function getStringFilter(path, searchRegExp) {
	var filter = {};
	filter[path] = searchRegExp;
	return filter;
}

function addSearchToQuery (searchString, query) {
	searchString = String(searchString || '').trim();
	query = query || {};
	if (!searchString) return query;

	var searchFields = listToArray(this.get('searchFields'));
	var searchRegExp = new RegExp(utils.escapeRegExp(searchString), 'i');

	var searchFilters = searchFields.map(function (path) {
		if (path === '__name__') {
			path = this.mappings.name;
		}
		var field = this.fields[path];
		if (field && field.type === 'name') {
			return getNameFilter(field, searchString);
		} else {
			return getStringFilter(path, searchRegExp);
		}
	}, this);

	if (this.autokey) {
		var autokeyFilter = {};
		autokeyFilter[this.autokey.path] = searchRegExp;
		searchFilters.push(autokeyFilter);
	}

	if (utils.isValidObjectId(searchString)) {
		var idFilter = {};
		idFilter._id = searchString;
		searchFilters.push(idFilter);
	}

	if (searchFilters.length > 1) {
		query.$or = searchFilters;
	} else if (searchFilters.length) {
		assign(query, searchFilters[0]);
	}

	console.log('SEARCH QUERY:', query);

	return query;
}

module.exports = addSearchToQuery;
