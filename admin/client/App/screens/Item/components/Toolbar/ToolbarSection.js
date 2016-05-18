import React, { PropTypes } from 'react';
import classNames from 'classnames';

const ToolbarSection = (props) => {
	const className = classNames('Toolbar__section', {
		'Toolbar__section--left': props.left,
		'Toolbar__section--right': props.right,
	}, props.className);

	return <div {...props} className={className} />;
};

ToolbarSection.displayName = 'ToolbarSection';
ToolbarSection.propTypes = {
	children: PropTypes.node.isRequired,
	className: PropTypes.string,
	left: PropTypes.bool,
	right: PropTypes.bool,
};

module.exports = ToolbarSection;
