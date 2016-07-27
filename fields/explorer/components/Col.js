import React, { PropTypes } from 'react';

const ExplorerCol = (props, context) => {
	const { className, gutter, style = {}, width, ...incidentalProps } = props;
	const { isCollapsed } = context;
	const __style__ = isCollapsed ? style : {
		flex: width ? null : '1 1 0',
		minHeight: 1,
		paddingLeft: gutter,
		paddingRight: gutter,
		width: width || '100%',
		...style,
	};
	const __className__ = 'ExplorerCol' + (className
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
ExplorerCol.contextTypes = {
	isCollapsed: PropTypes.bool,
};
ExplorerCol.propTypes = {
	className: PropTypes.string,
	gutter: PropTypes.number,
	style: PropTypes.string,
	width: PropTypes.number,
};
ExplorerCol.defaultProps = {
	gutter: 10,
};

module.exports = ExplorerCol;
