import React, { PropTypes } from 'react';
import classNames from 'classnames';

function ToolbarSection ({ className, left, right, ...props }) {
	props.className = classNames('Toolbar__section', {
		'Toolbar__section--left': props.left,
		'Toolbar__section--right': props.right,
	}, className);

	return <div {...props} />;
};

ToolbarSection.propTypes = {
	left: PropTypes.bool,
	right: PropTypes.bool,
};

module.exports = ToolbarSection;
