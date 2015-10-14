/**
 * Checks to see if a field path matches a currently unmapped path, and
 * if so, adds a mapping for it.
 */
function automap (field) {
	if ((field.path in this.mappings) && !this.mappings[field.path]) {
		this.map(field.path, field.path);
	}
	return this;
}

module.exports = automap;
