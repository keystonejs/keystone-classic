var assign = require('object-assign');
var utils = require('keystone-utils');

function trim (i) { return i.trim(); }
function truthy (i) { return i; }

function getNameFilter (field, searchString) {
	var searchWords = searchString.split(' ').map(trim).filter(truthy).map(utils.escapeRegExp);
	var nameSearchRegExp = new RegExp(searchWords.join('|'), 'i');
	var first = {};
	first[field.paths.first] = nameSearchRegExp;
	var last = {};
	last[field.paths.last] = nameSearchRegExp;
	return {
		$or: [first, last],
	};
}

function getStringFilter (path, searchRegExp) {
	var filter = {};
	filter[path] = searchRegExp;
	return filter;
}

function getRelationshipFilter (path, id) {
	var filter = {};
	filter[path] = id;
	return filter;
}

function addSearchToQuery (searchString) {

	searchString = String(searchString || '').trim();
	var query = {};
	if (!searchString) return query;

	var parsed;
	try {
		parsed = JSON.parse(searchString);
	} catch (ex) {
		// we don't care. We'll handle non-objects below
	}

	if (typeof parsed === 'object') {
		var searchFilters = [];
		searchFilters.push(parsed);
	} else {
		var searchRegExp = new RegExp(utils.escapeRegExp(searchString), 'i');
		searchFilters = this.searchFields.map(function (i) {
			if (i.field && i.field.type === 'name') {
				return getNameFilter(i.field, searchString);
			} else if (i.field && i.field.type === 'relationship') {
				if (utils.isValidObjectId(searchString)) {
					return getRelationshipFilter(i.path, searchString);
				}
			} else {
				return getStringFilter(i.path, searchRegExp);
			}
		}, this).filter(function (item) {
			if (item !== undefined) {
				return true;
			} else return false;
		});
	}

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

	return query;
}

module.exports = addSearchToQuery;
