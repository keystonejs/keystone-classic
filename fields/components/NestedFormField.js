import React from 'react';
import { FormField, FormLabel } from 'elemental';

const NestedFormField = (props) => {
	const { children, label, ...incidentalProps } = props;
	const labelStyles = {
		color: '#999',
		fontSize: '.9rem',
		paddingLeft: '1em',
	};

	return (
		<FormField {...incidentalProps}>
			<FormLabel style={labelStyles}>{label}</FormLabel>
			{children}
		</FormField>
	);
};

module.exports = NestedFormField;
