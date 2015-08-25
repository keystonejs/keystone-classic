var queryfilterlib = require('queryfilter');

/**
 * Processes a filter string into a filters object
 *
 * NOTE: This function is deprecated in favor of List.prototype.addFiltersToQuery
 * and will be removed in a later version.
 *
 * @param {String} filters
 */
function processFilters (q) {
	var list = this;
	var filters = {};
	queryfilterlib.QueryFilters.create(q).getFilters().forEach(function(filter){
		filter.path = filter.key; // alias for b/c
		filter.field = list.fields[filter.key];
		filters[filter.path] = filter;
	});
	return filters;
}

module.exports = processFilters;
