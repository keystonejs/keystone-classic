var _ = require('lodash');

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
		initialFields: _.map(this.initialFields, 'path'),
		key: this.key,
		label: this.label,
		nameField: this.nameField ? this.nameField.getOptions() : null,
		nameFieldIsFormHeader: this.nameFieldIsFormHeader,
		nameIsInitial: this.nameIsInitial,
		nameIsVirtual: this.nameIsVirtual,
		namePath: this.namePath,
		nocreate: this.options.nocreate,
		nodelete: this.options.nodelete,
		noedit: this.options.noedit,
		path: this.path,
		perPage: this.options.perPage,
		plural: this.plural,
		searchFields: this.options.searchFields,
		singular: this.singular,
		sortable: this.options.sortable,
		sortContext: this.options.sortContext,
		track: this.options.track,
		tracking: this.tracking,
		relationships: this.relationships,
		uiElements: [],
	};
	_.forEach(this.uiElements, function (el) {
		switch (el.type) {
			// TODO: handle indentation
			case 'field':
				// add the field options by path
				ops.fields[el.field.path] = el.field.getOptions();
				// don't output hidden fields
				if (el.field.hidden) {
					return;
				}
				// add the field to the elements array
				ops.uiElements.push({
					type: 'field',
					field: el.field.path,
				});
				break;
			case 'heading':
				ops.uiElements.push({
					type: 'heading',
					content: el.heading,
					options: el.options,
				});
				break;
		}
	});
	return ops;
}

module.exports = getOptions;
