import Field from '../Field';
import React from 'react';
import { FormInput } from 'elemental';

module.exports = Field.create({

	displayName: 'MoneyField',

	valueChanged (event) {
		var newValue = event.target.value.replace(/[^\d\s\,\.\$€£¥]/g, '');
		if (newValue === this.props.value) return;
		this.props.onChange({
			path: this.props.path,
			value: newValue,
		});
	},

	renderField () {
		return <FormInput name={this.props.path} ref="focusTarget" value={this.props.value} onChange={this.valueChanged} autoComplete="off" />;
	},

});
