var debug = require('debug')('keystone:core:list:ensureTextIndex');

// A basic string hashing function
function hashString (string) {
	var char;
	var hash = 0;
	if (string.length === 0) return hash;
	for (var i = 0; i < string.length; i++) {
		char = string.charCodeAt(i);
		hash = ((hash << 5) - hash) + char;
		hash = hash & hash; // Convert to 32bit integer
	}
	return hash;
}

/**
 * Does what it can to ensure the collection has an appropriate text index.
 *
 * Works around unreliable behaviour with the Mongo drivers ensureIndex()
 * Specifically, when the following are true..
 *   - Relying on collection.ensureIndexes() to create text indexes
 *   - A text index already exists on the collection
 *   - The existing index has a different definition but the same name
 * The index is not created/updated and no error is returned, either by the
 * ensureIndexes() call or the connection error listener.
 * Or at least that's what was happening for me (mongoose v3.8.40, mongodb v1.4.38)..
 */
function ensureTextIndex (callback) {
	var list = this;
	var collection = list.model.collection;

	var textIndex = list.buildSearchTextIndex();
	var fieldsHash = Math.abs(hashString(Object.keys(textIndex).sort().join(';')));
	var indexNamePrefix = 'keystone_searchFields_textIndex_';
	var newIndexName = indexNamePrefix + fieldsHash;

	// We use this later to create a new index if needed
	var createNewIndex = function () {
		collection.createIndex(textIndex, { name: newIndexName }, function (result) {
			debug('collection.createIndex() result for \'' + list.key + '\:', result);
			return callback();
		});
	};

	collection.getIndexes(function (err, indexes) {
		if (err) {
			if (err.code === 26) {
				// if the database doesn't exist, we'll get error code 26 "no database" here
				// that's fine, we just default the indexes object so the new text index
				// gets created when the database is connected.
				indexes = {};
			} else {
				// otherwise, we've had an unexpected error, so we throw it
				throw err;
			}
		}
		var indexNames = Object.keys(indexes);

		// Search though the
		for (var i = 0; i < indexNames.length; i++) {
			var existingIndexName = indexNames[i];
			var isText = false;

			// Check we're dealing with a text index
			for (var h = 0; h < indexes[existingIndexName].length; h++) {
				var column = indexes[existingIndexName][h];
				if (column[1] === 'text') isText = isText || true;
			}

			// Skip non-text indexes
			if (!isText) continue;

			// Already exists with correct def
			if (existingIndexName === newIndexName) {
				debug('Existing text index \'' + existingIndexName + '\' already matches the searchFields for \'' + list.key + '\'');
				return;
			}

			// Exists but hash (def) doesn't match
			// Check for 'searchFields_text_index' for backwards compatibility
			if (existingIndexName.slice(0, indexNamePrefix.length) === indexNamePrefix || existingIndexName === 'searchFields_text_index') {
				debug('Existing text index \'' + existingIndexName + '\' doesn\'t match the searchFields for \'' + list.key + '\' and will be recreated as \'' + newIndexName + '\'');

				collection.dropIndex(existingIndexName, function (result) {
					debug('collection.dropIndex() result for \'' + list.key + '\:', result);
					createNewIndex();
				});
				return;
			}

			// It's a text index but not one of ours; nothing we can do
			console.error(''
				+ 'list.ensureTextIndex() failed to update the existing text index \'' + existingIndexName + '\' for the \'' + list.key + '\' list.\n'
				+ 'The existing index wasn\'t automatically created by ensureTextIndex() so will not be replaced.\n'
				+ 'This may lead to unexpected behaviour when performing text searches on the this list.'
			);
			return;
		}

		// No text indexes found at all; create ours now
		debug('No existing text index found in \'' + list.key + '\'; Creating ours now');
		createNewIndex();
	});
}

module.exports = ensureTextIndex;
