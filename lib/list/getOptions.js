var _ = require('underscore');

/**
 * Gets the options for the List, as used by the React components
 */
function getOptions () {
	var ops = {
		autocreate: this.options.autocreate,
		autokey: this.autokey,
		defaultColumns: this.options.defaultColumns,
		defaultSort: this.options.defaultSort,
		fields: {},
		hidden: this.options.hidden,
		initialFields: _.pluck(this.initialFields, 'path'),
		key: this.key,
		label: this.label,
		nameField: this.nameField ? this.nameField.getOptions() : null,
		nameIsEditable: this.nameIsEditable,
		nameIsInitial: this.nameIsInitial,
		nameIsVirtual: this.nameIsVirtual,
		namePath: this.namePath,
		nocreate: this.options.nocreate,
		nodelete: this.options.nodelete,
		noedit: this.options.noedit,
		path: this.path,
		plural: this.plural,
		searchFields: this.options.searchFields,
		singular: this.singular,
		sortable: this.options.sortable,
		sortContext: this.options.sortContext,
		track: this.options.track,
		tracking: this.tracking,
		uiElements: []
	};
	_.each(this.uiElements, function (el) {
		switch (el.type) {
			// TODO: handle indentation
			case 'field':
				// add the field options by path
				ops.fields[el.field.path] = el.field.getOptions();
				// don't output the name field as a ui element if it's editable as it'll
				// appear as an input in the header
				if (el.field === this.nameField && this.nameIsEditable) {
					return;
				}
				// don't output hidden fields
				if (el.field.hidden && el.field.type !== 'boolean') {
					return;
				}
				// add the field to the elements array
				ops.uiElements.push({
					type: 'field',
					field: el.field.path
				});
			break;
			case 'heading':
				ops.uiElements.push({
					type: 'heading',
					content: el.heading,
					options: el.options
				});
			break;
		}
	}, this);
	return ops;
}

module.exports = getOptions;
