import React from 'react';
import Field from '../Field';
import { FormInput } from 'elemental';

module.exports = Field.create({

	displayName: 'NumberField',

	valueChanged (event) {
		var newValue = event.target.value.replace(/[^-\d\.]/g, '');
		if (newValue === this.props.value) return;
		this.props.onChange({
			path: this.props.path,
			value: newValue
		});
	},

	renderField () {
		return <FormInput name={this.props.path} ref="focusTarget" value={this.props.value} onChange={this.valueChanged} autoComplete="off" />;
	}

});
