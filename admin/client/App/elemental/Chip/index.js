import { css, StyleSheet } from 'aphrodite/no-important';
import React, { PropTypes } from 'react';
import styles from './styles';
import colors from './colors';

const classes = StyleSheet.create(styles);

function Chip ({
	className,
	children,
	color,
	inverted,
	label,
	onClear,
	onClick,
	...props
}) {
	props.className = css(
		classes.chip,
		className
	);
	const labelClassName = css(
		classes.button,
		classes.label,
		classes['button__' + color + (inverted ? '__inverted' : '')]
	);
	const clearClassName = css(
		classes.button,
		classes.clear,
		classes['button__' + color + (inverted ? '__inverted' : '')]
	);

	return (
		<div {...props}>
			<button type="button" onClick={onClick} className={labelClassName}>
				{label}
				{children}
			</button>
			{!!onClear && (
				<button type="button" onClick={onClear} className={clearClassName}>
					&times;
				</button>
			)}
		</div>
	);
};

Chip.propTypes = {
	color: PropTypes.oneOf(Object.keys(colors)).isRequired,
	inverted: PropTypes.bool,
	label: React.PropTypes.string.isRequired,
	onClear: React.PropTypes.func,
	onClick: React.PropTypes.func,
};
Chip.defaultProps = {
	color: 'default',
};

module.exports = Chip;
