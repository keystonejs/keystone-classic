/**
 * Generate page array for pagination
 *
 * @param {Number} the maximum number pages to display in the pagination
 * @param {Object} page options
 */
function getPages (options, maxPages) {
	var surround = Math.floor(maxPages / 2);
	var firstPage = maxPages ? Math.max(1, options.currentPage - surround) : 1;
	var padRight = Math.max(((options.currentPage - surround) - 1) * -1, 0);
	var lastPage = maxPages ? Math.min(options.totalPages, options.currentPage + surround + padRight) : options.totalPages;
	var padLeft = Math.max(((options.currentPage + surround) - lastPage), 0);
	options.pages = [];
	firstPage = Math.max(Math.min(firstPage, firstPage - padLeft), 1);
	for (var i = firstPage; i <= lastPage; i++) {
		options.pages.push(i);
	}
	if (firstPage !== 1) {
		options.pages.shift();
		options.pages.unshift('...');
	}
	if (lastPage !== Number(options.totalPages)) {
		options.pages.pop();
		options.pages.push('...');
	}
}

module.exports = getPages;
