/* TODO */

import React from 'react';
import Field from '../Field';
import Domify from 'react-domify';

import { FormField } from 'elemental';

module.exports = Field.create({
	displayName: 'ListField',
	statics: {
		type: 'List',
	},
	propTypes: {
		label: React.PropTypes.string,
		onChange: React.PropTypes.func.isRequired,
		path: React.PropTypes.string.isRequired,
		value: React.PropTypes.bool,
	},
	renderUI () {
		const { value, label } = this.props;
		return (
			<FormField label={label}>
				<Domify value={value} />
				{this.renderNote()}
			</FormField>
		);
	},
});
