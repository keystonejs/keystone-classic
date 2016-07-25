import React, { PropTypes } from 'react';

const Col = (props) => {
	const { className, gutter, style, width, ...incidentalProps } = props;
	const __style__ = {
		flex: width ? null : '1 1 0',
		minHeight: 1,
		paddingLeft: gutter,
		paddingRight: gutter,
		width: width || '100%',
		...style,
	};
	const __className__ = 'Col' + (className
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
Col.propTypes = {
	className: PropTypes.string,
	gutter: PropTypes.number,
	style: PropTypes.string,
	width: PropTypes.number,
};
Col.defaultProps = {
	gutter: 10,
};

module.exports = Col;
