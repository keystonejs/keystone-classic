/**
 * Returns either false if the list has no search fields defined or a structure
 * describing the text index that should exist.
 */
function buildSearchTextIndex () {
	var idxDef = {};

	for (var i = 0; i < this.searchFields.length; i++) {
		var sf = this.searchFields[i];
		if (!sf.path || !sf.field) continue;

		// TODO: Allow fields to define their own `getTextIndex` method, so that
		// each type can define the right options for their schema. This is unlikely
		// to behave as expected for fields that aren't simple strings or names
		// until that has been done. Should error if the field type doesn't support
		// text indexing, as the list has been misconfigured.

		// Does the field have a single path or does it use nested values (like 'name')
		if (sf.field.paths) {
			var nFields = sf.field.paths;
			var nKeys = Object.keys(nFields);
			for (var n = 0; n < nKeys.length; n++) {
				idxDef[nFields[nKeys[n]]] = 'text';
			}
		}
		else if (sf.field.path) {
			idxDef[sf.field.path] = 'text';
		}
	}

	// debug('text index for \'' + this.key + '\':', idxDef);
	return Object.keys(idxDef).length > 0 ? idxDef : false;
}

module.exports = buildSearchTextIndex;
