import Field from '../Field';
import React from 'react';
import { FormInput } from 'elemental';

/*
	TODO:
	- gravatar
	- validate email address
 */

module.exports = Field.create({
	displayName: 'EmailField',
	renderField () {
		return (
			<FormInput
				name={this.props.path}
				ref="focusTarget"
				value={this.props.value}
				onChange={this.valueChanged}
				autoComplete="off"
				type="email"
			/>
		);
	},
	renderValue () {
		return this.props.value ? (
			<FormInput noedit href={'mailto:' + this.props.value}>{this.props.value}</FormInput>
		) : (
			<FormInput noedit>(not set)</FormInput>
		);
	},
});
