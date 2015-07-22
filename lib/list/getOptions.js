var _ = require('underscore');

/**
 * Gets the options for the List, as used by the React components
 */
function getOptions() {
	var ops = {
		key: this.key,
		path: this.path,
		label: this.label,
		singular: this.singular,
		plural: this.plural,
		namePath: this.namePath,
		nameField: this.nameField ? this.nameField.getOptions() : null,
		nameIsVirtual: this.nameIsVirtual,
		nameIsEditable: this.nameIsEditable,
		nameIsInitial: this.nameIsInitial,
		noedit: this.options.noedit,
		nocreate: this.options.nocreate,
		nodelete: this.options.nodelete,
		autocreate: this.options.autocreate,
		sortable: this.options.sortable,
		hidden: this.options.hidden,
		searchFields: this.options.searchFields,
		defaultSort: this.options.defaultSort,
		defaultColumns: this.options.defaultColumns,
		track: this.options.track,
		tracking: this.tracking,
		autokey: this.autokey,
		fields: {},
		uiElements: [],
		initialFields: _.pluck(this.initialFields, 'path')
	};
	_.each(this.uiElements, function(el) {
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
				if (el.field.hidden) {
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
