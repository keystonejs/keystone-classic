import Field from '../Field';
import React from 'react';
import { FormRow, FormField, FormInput } from 'elemental';

module.exports = Field.create({

	displayName: 'GeopointField',

	focusTargetRef: 'lat',

	valueChanged (which, event) {
		this.props.value[which] = event.target.value;
		this.props.onChange({
			path: this.props.path,
			value: this.props.value
		});
	},

	renderValue () {
		if (this.props.value[1] && this.props.value[0]) {
			return <FormInput noedit>{this.props.value[1]}, {this.props.value[0]}</FormInput>;//eslint-disable-line comma-spacing
		}
		return <FormInput noedit>(not set)</FormInput>;
	},

	renderField () {
		return (
			<FormRow>
				<FormField width="one-half">
					<FormInput name={this.props.path + '[1]'} placeholder="Latitude" ref="lat" value={this.props.value[1]} onChange={this.valueChanged.bind(this, 1)} autoComplete="off" />
				</FormField>
				<FormField width="one-half">
					<FormInput name={this.props.path + '[0]'} placeholder="Longitude" ref="lng" value={this.props.value[0]} onChange={this.valueChanged.bind(this, 0)} autoComplete="off" />
				</FormField>
			</FormRow>
		);
	}

});
