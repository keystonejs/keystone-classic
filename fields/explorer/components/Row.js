import React, { Component, PropTypes } from 'react';

class ExplorerRow extends Component {
	getChildContext () {
		return {
			isCollapsed: this.props.isCollapsed,
		};
	}
	render () {
		const { className, gutter, isCollapsed, style = {}, ...incidentalProps } = this.props;
		const __style__ = isCollapsed ? style : {
			display: 'flex',
			flexWrap: 'wrap',
			marginLeft: gutter * -1,
			marginRight: gutter * -1,
			...style,
		};
		const __className__ = 'ExplorerRow' + (className
			? ' ' + className
			: '');

		return (
			<div
				{...incidentalProps}
				className={__className__}
				style={__style__}
			/>
		);
	}
};
ExplorerRow.childContextTypes = {
	isCollapsed: PropTypes.bool,
};
ExplorerRow.propTypes = {
	className: PropTypes.string,
	gutter: PropTypes.number,
	style: PropTypes.string,
};
ExplorerRow.defaultProps = {
	gutter: 10,
};

module.exports = ExplorerRow;
