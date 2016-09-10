/**
 * Creates a new field at the specified path, with the provided options.
 * If no options are provides, returns the field at the specified path.
 */
function field (path, options) {
	var Field = this.keystone.Field;
	if (arguments.length === 1) {
		return this.fields[path];
	}
	if (typeof options === 'function') {
		options = { type: options };
	}
	if (this.get('noedit')) {
		options.noedit = true;
	}
	if (!options.note && this.get('notes')) {
		options.note = this.get('notes')[path];
	}
	if (typeof options.type !== 'function') {
		throw new Error('Fields must be specified with a type function');
	}
	if (!(options.type.prototype instanceof Field)) {
		// Convert native field types to their default Keystone counterpart
		if (options.type === String) {
			options.type = Field.Types.Text;
		} else if (options.type === Number) {
			options.type = Field.Types.Number;
		} else if (options.type === Boolean) {
			options.type = Field.Types.Boolean;
		} else if (options.type === Date) {
			options.type = Field.Types.Datetime;
		} else {
			throw new Error('Unrecognised field constructor: ' + options.type);
		}
	}

	// Note the presence of this field type for client-side script optimisation
	this.fieldTypes[options.type.name] = options.type.properName;

	// Wysiwyg HTML fields are handled as a special case so we can include TinyMCE as required
	if (options.type.name === 'html' && options.wysiwyg) {
		this.fieldTypes.wysiwyg = true;
	}

	var field = new options.type(this, path, options);
	this.fields[path] = field;
	this.fieldsArray.push(field);
	if (field.type === 'relationship') {
		this.relationshipFields.push(field);
	}
	return field;
}

module.exports = field;
