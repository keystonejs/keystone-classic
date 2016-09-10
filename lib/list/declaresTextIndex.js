/**
 * Look for a text index defined in the current list schema; returns boolean
 * Note this doesn't check for text indexes that exist in the DB
 */

function declaresTextIndex () {
	var indexes = this.schema.indexes();

	for (var i = 0; i < indexes.length; i++) {
		var fields = indexes[i][0];
		var fieldNames = Object.keys(fields);

		for (var h = 0; h < fieldNames.length; h++) {
			var val = fields[fieldNames[h]];
			if (typeof val === 'string' && val.toLowerCase() === 'text') return true;
		}
	}
	return false;
}

module.exports = declaresTextIndex;
