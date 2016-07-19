
/**
 * Returns either false if the list has no search fields defined or a structure 
 * describing the text index that should exist.
 */
function buildSearchTextIndex () {
	var list = this;
	var idxDef = {};
	
	for (var i = 0; i < list.searchFields.length; i ++) {
		var sf = list.searchFields[i];
		if (!sf.path || !sf.field) continue;
		// Also maybe skip the field if it: a) isn't type === 'name' and b) doesn't have typeof _nativeType === 'string'
		
		// Does the field have a single path or does it use nested values (like 'name')
		if (sf.field.paths) {
			var nFields = sf.field.paths;
			var nKeys = Object.keys(nFields);
			for (var n = 0; n < nKeys.length; n ++) {
				idxDef[nFields[nKeys[n]]] = 'text';
			}
		}
		else if (sf.field.path) {
			idxDef[sf.field.path] = 'text';
		}
	}
	
	// debug('text index for \'' + list.key + '\':', idxDef);
	return Object.keys(idxDef).length > 0 ? idxDef : false;
}


module.exports = buildSearchTextIndex;
