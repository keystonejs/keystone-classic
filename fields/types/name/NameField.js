import Field from '../Field';
import React from 'react';
import { FormField, FormInput, FormRow } from 'elemental';

module.exports = Field.create({

	displayName: 'NameField',

	focusTargetRef: 'first',

	valueChanged: function(which, event) {
		this.props.value[which] = event.target.value;
		this.props.onChange({
			path: this.props.path,
			value: this.props.value
		});
	},

	renderValue () {
		return (
			<FormRow>
				<FormField width="one-half">
					<FormInput noedit style={{ width: '100%' }}>{this.props.value.first}</FormInput>
				</FormField>
				<FormField width="one-half">
					<FormInput noedit style={{ width: '100%' }}>{this.props.value.last}</FormInput>
				</FormField>
			</FormRow>
		);
	},

	renderField () {
		return (
			<FormRow>
				<FormField width="one-half">
					<FormInput name={this.props.paths.first} placeholder="First name" ref="first" value={this.props.value.first} onChange={this.valueChanged.bind(this, 'first')} autoComplete="off" />
				</FormField>
				<FormField width="one-half">
					<FormInput name={this.props.paths.last} placeholder="Last name" ref="last" value={this.props.value.last} onChange={this.valueChanged.bind(this, 'last')} autoComplete="off" />
				</FormField>
			</FormRow>
		);
	}

});
