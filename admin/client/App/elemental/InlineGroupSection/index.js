import { css } from 'glamor';
import React, { cloneElement, PropTypes } from 'react';
import classes from './styles';

// NOTE: Inline Group Section accepts a single child

function InlineGroupSection ({
	active,
	cssStyles,
	children,
	className,
	contiguous,
	grow,
	position,
	...props
}) {
	// evaluate position
	const separate = position === 'last' || position === 'middle';

	// A `contiguous` section must manipulate it's child directly
	// A separate (default) section just wraps the child
	return contiguous ? cloneElement(children, {
		cssStyles: [
			classes.contiguous,
			classes['contiguous__' + position],
			active ? classes.active : null,
			grow ? classes.grow : null,
			cssStyles,
		],
		...props,
	}) : (
		<div className={css(
			!!grow && classes.grow,
			!!separate && classes.separate,
			cssStyles
		)} {...props}>
			{children}
		</div>
	);
};

InlineGroupSection.propTypes = {
	active: PropTypes.bool, // buttons only
	children: PropTypes.element.isRequired,
	contiguous: PropTypes.bool,
	grow: PropTypes.bool,
	position: PropTypes.oneOf(['first', 'last', 'middle', 'only']),
};

module.exports = InlineGroupSection;
