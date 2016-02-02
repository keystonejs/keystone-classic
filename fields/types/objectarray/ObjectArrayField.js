import Field from '../Field';
import jsonCycle from 'json-cycle';

module.exports = Field.create({
	displayName: 'ObjectArrayField',
	getInitialState () {
		var subList = jsonCycle.retrocycle(this.props.subList);
		console.log(subList);
		subList.getOptions();

		return {
			values: Object.assign({}, this.props.subList.fields),
			list: subList
		};
	},
	getFieldProps (field) {
		var props = Object.assign({}, field);
		props.value = this.state.values[field.path];
		props.values = this.state.values;
		props.onChange = this.handleChange;
		props.mode = 'edit';
		return props;
	},
	renderField () {
		var headings = 0;

		return this.state.list.uiElements.map((el) => {
			if (el.type === 'heading') {
				headings++;
				el.options.values = this.state.values;
				el.key = 'h-' + headings;
				return React.createElement(FormHeading, el);
			}

			if (el.type === 'field') {
				var field = this.state.list.fields[el.field];
				var props = this.getFieldProps(field);
				if ('function' !== typeof Fields[field.type]) {
					return React.createElement(InvalidFieldType, { type: field.type, path: field.path, key: field.path });
				}
				if (props.dependsOn) {
					props.currentDependencies = {};
					Object.keys(props.dependsOn).forEach(dep => {
						props.currentDependencies[dep] = this.state.values[dep];
					});
				}
				console.log(props);
				props.key = field.path;
				return React.createElement(Fields[field.type], props);
			}
		}, this);
	}
});
