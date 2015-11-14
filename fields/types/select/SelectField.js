import Field from '../Field';
import React from 'react';
import Select from 'react-select';
import { FormInput } from 'elemental';

/**
 * TODO:
 * - Custom path support
 */

module.exports = Field.create({

	displayName: 'SelectField',

	valueChanged (newValue) {
		// TODO: This should be natively handled by the Select component
		if (this.props.numeric && 'string' === typeof newValue) {
			newValue = newValue ? Number(newValue) : undefined;
		}
		this.props.onChange({
			path: this.props.path,
			value: newValue
		});
	},

	renderValue () {
		var selected = this.props.ops.find(option => option.value === this.props.value);
		return <FormInput noedit>{selected ? selected.label : null}</FormInput>;
	},

	renderField () {
		// TODO: This should be natively handled by the Select component
		var ops = (this.props.numeric) ? this.props.ops.map(function(i) { return { label: i.label, value: String(i.value) }; }) : this.props.ops;
		var value = ('number' === typeof this.props.value) ? String(this.props.value) : this.props.value;
		return <Select simpleValue name={this.props.path} value={value} options={ops} onChange={this.valueChanged} />;
	}

});
