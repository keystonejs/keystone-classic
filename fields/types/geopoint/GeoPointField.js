import Field from '../Field';
import React from 'react';
import { FormRow, FormField, FormInput } from 'elemental';

module.exports = Field.create({

	displayName: 'GeopointField',
	statics: {
		type: 'Geopoint',
	},

	focusTargetRef: 'lat',

	handleLat (event) {
		const { value = [], path, onChange } = this.props;
		const newVal = event.target.value;
		onChange({
			path,
			value: [value[0], newVal],
		});
	},

	handleLong (event) {
		const { value = [], path, onChange } = this.props;
		const newVal = event.target.value;
		onChange({
			path,
			value: [newVal, value[1]],
		});
	},

	renderValue () {
		const { value } = this.props;
		if (value && value[1] && value[0]) {
			return <FormInput noedit>{value[1]}, {value[0]}</FormInput>; // eslint-disable-line comma-spacing
		}
		return <FormInput noedit>(not set)</FormInput>;
	},

	renderField () {
		const { value = [], path } = this.props;
		return (
			<FormRow>
				<FormField width="one-half">
					<FormInput name={path + '[1]'} placeholder="Latitude" ref="lat" value={value[1]} onChange={this.handleLat} autoComplete="off" />
				</FormField>
				<FormField width="one-half">
					<FormInput name={path + '[0]'} placeholder="Longitude" ref="lng" value={value[0]} onChange={this.handleLong} autoComplete="off" />
				</FormField>
			</FormRow>
		);
	},

});
