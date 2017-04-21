import Field from '../Field';
import React from 'react';
import Select from 'react-select';
import { Button, InputGroup } from 'elemental';

module.exports = Field.create({

	displayName: 'MultiSelectField',
	statics: {
		type: 'MultiSelect',
	},

	getInitialState () {
		return {
			value: null,
			createIsOpen: false,
		};
	},

	shouldCollapse () {
		return this.props.collapse && !this.props.value.length;
	},

	valueChanged (value) {
		this.props.onChange({
			path: this.props.path,
			value: value,
		});
	},

	onCreate (item) {
		const values = this.state.value.map((item) => item);
		values.push(item);
		this.valueChanged(values.join(','));

		this.closeCreate();
	},

	renderSelect () {
		var ops = this.props.ops;
		var value = this.props.value;
		return <Select
			simpleValue
			multi={true}
			name={this.getInputName(this.props.path)}
			value={value}
			options={ops}
			onChange={this.valueChanged} />;
	},

	renderValue () {
		return this.renderSelect();
	},

	renderField () {
		return this.renderSelect();
	},

});
