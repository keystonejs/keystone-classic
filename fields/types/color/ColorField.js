import Field from '../Field';
import React from 'react';
import { FormIconField, FormInput } from 'elemental';

module.exports = Field.create({
	
	displayName: 'ColorField',
	
	valueChanged (event) {
		var newValue = event.target.value;
		if (/^([0-9A-F]{3}){1,2}$/.test(newValue)) {
			newValue = '#' + newValue;
		}
		if (newValue === this.props.value) return;
		this.props.onChange({
			path: this.props.path,
			value: newValue
		});
	},
	
	renderField () {
		return (
			<div className="field-type-color__wrapper">
				<FormInput ref="field" onChange={this.valueChanged} name={this.props.path} value={this.props.value} autoComplete="off" />
				<div className="field-type-color__preview" style={{ background: this.props.value }} />
			</div>
		);
	}
	
});
