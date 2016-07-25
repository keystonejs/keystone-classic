import React, { PropTypes } from 'react';

const Row = (props) => {
	const { className, gutter, style, ...incidentalProps } = props;
	const __style__ = {
		display: 'flex',
		flexWrap: 'wrap',
		marginLeft: gutter * -1,
		marginRight: gutter * -1,
		...style,
	};
	const __className__ = 'Row' + (className
		? ' ' + className
		: '');

	return (
		<div
			{...incidentalProps}
			className={__className__}
			style={__style__}
		/>
	);
};
Row.propTypes = {
	className: PropTypes.string,
	gutter: PropTypes.number,
	style: PropTypes.string,
};
Row.defaultProps = {
	gutter: 10,
};

module.exports = Row;
