/**
 * Specified select and populate options for a query based the provided columns.
 *
 * @param {Query} query
 * @param {Array} columns
 */
function selectColumns (q, cols) {
	var list = this;
	var allColumns = cols;
	cols.forEach(function(col){
		var virtual = list.model.schema.virtuals[col.path];
		if(virtual && virtual.depends) {
			// TODO: Check if the column was already added
			allColumns = allColumns.concat(list.expandColumns(virtual.depends));
		}
	});

	// Populate relationship columns
	var select = [];
	var populate = {};
	var path;
	allColumns.forEach(function(col) {
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
};

module.exports = selectColumns;
