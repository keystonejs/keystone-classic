import { css, StyleSheet } from 'aphrodite/no-important';
import React, { cloneElement, PropTypes } from 'react';
import styles from './styles';

const classes = StyleSheet.create(styles);

// NOTE: Inline Group Section accepts a single child

function InlineGroupSection ({
	active,
	children,
	className,
	contiguous,
	grow,
	position,
	...props,
}) {
	// evaluate position
	const separate = position === 'last' || position === 'middle';

	// A `contiguous` section must manipulate it's child directly
	// A separate (default) section just wraps the child
	return contiguous ? cloneElement(children, {
		className: [
			classes.contiguous,
			classes['contiguous__' + position],
			!!active && classes.active,
			!!grow && classes.grow,
			className,
		],
		...props,
	}) : (
		<div className={css(
			!!grow && classes.grow,
			!!separate && classes.separate,
			className
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
