import React from 'react';
import { Button } from 'elemental';

// NOTE marginBottom of 1px stops things jumping around
// TODO find out why this is necessary

function CollapsedFieldLabel (props) {
	const { style, ...incidentalProps } = props;
	const __style__ = {
		marginBottom: 1,
		paddingLeft: 0,
		paddingRight: 0,
		...style,
	};

	return (
		<Button type="link" style={__style__} {...incidentalProps} />
	);
};

module.exports = CollapsedFieldLabel;
