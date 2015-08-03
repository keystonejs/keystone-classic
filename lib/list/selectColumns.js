/**
 * Specified select and populate options for a query based the provided columns.
 *
 * @param {Query} query
 * @param {Array} columns
 */
function selectColumns (q, cols) {
	// Populate relationship columns
	var select = [];
	var populate = {};
	var path;
	cols.forEach(function(col) {
		select.push(col.path);
		if (col.populate) {
			if (!populate[col.populate.path]) {
				populate[col.populate.path] = [];
			}
			populate[col.populate.path].push(col.populate.subpath);
		}
	});
	q.select(select.join(' '));
	for (path in populate) {
		if (populate.hasOwnProperty(path)) {
			q.populate(path, populate[path].join(' '));
		}
	}
}

module.exports = selectColumns;
