/**
 * Accounts for the presence choice when filtering
 *
 * @param {String} presence  		The current presence choice
 * @param {Object} currentPathQuery The current request query
 */
function addPresenceToQuery (presence, currentPathQuery) {
	var newQuery;
	// Adds $elemMatch if the presence choice is 'all'
	// ('all' is the default)
	if (presence === 'some') {
		newQuery = {
			$elemMatch: currentPathQuery,
		};
	// Adds $not if the presence is 'none'
	} else if (presence === 'none') {
		newQuery = {
			$not: currentPathQuery,
		};
	}
	// Return the newQuery if the presence changed something
	// otherwise return the original query
	return newQuery || currentPathQuery;
}

module.exports = addPresenceToQuery;
