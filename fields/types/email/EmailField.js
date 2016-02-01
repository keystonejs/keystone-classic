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
	renderValue () {
		return this.props.value ? (
			<FormInput noedit href={'mailto:' + this.props.value}>{this.props.value}</FormInput>
		) : (
			<FormInput noedit>(not set)</FormInput>
		);
	},
});
