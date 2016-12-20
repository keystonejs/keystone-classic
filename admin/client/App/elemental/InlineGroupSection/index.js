import { css, StyleSheet } from 'aphrodite/no-important';
import React, { cloneElement, PropTypes } from 'react';
import styles from './styles';

const classes = StyleSheet.create(styles);

// NOTE: Inline Group Section accepts a single child

function InlineGroupSection ({
	active,
	aphroditeStyles,
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
		aphroditeStyles: [
			classes.contiguous,
			classes['contiguous__' + position],
			active ? classes.active : null,
			grow ? classes.grow : null,
			aphroditeStyles,
		],
		...props,
	}) : (
		<div className={css(
			!!grow && classes.grow,
			!!separate && classes.separate,
			aphroditeStyles
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
