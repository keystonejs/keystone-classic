import React, { PropTypes } from 'react';
import { css, StyleSheet } from 'aphrodite/no-important';
import styles from './styles';
import colors from './colors';

const classes = StyleSheet.create(styles);

function SegmentedControl ({
	className,
	color,
	cropText,
	equalWidthSegments,
	inline,
	onChange,
	options,
	value,
	...props
}) {
	props.className = css(
		classes.control,
		inline ? classes.control__inline : null,
		className
	);

	return (
		<div {...props}>
			{options.map((opt) => {
				const buttonClassName = css(
					classes.button,
					opt.disabled ? classes.button__disabled : null,
					opt.value === value ? classes['button__' + color] : null,
					cropText ? classes.button__cropText : null,
					equalWidthSegments ? classes.button__equalWidth : null
				);

				return (
					<button
						className={buttonClassName}
						key={opt.value}
						onClick={!opt.disabled && (() => onChange(opt.value))}
						type="button"
						title={cropText ? opt.label : null}
						tabIndex={opt.disabled ? '-1' : ''}
						>
						{opt.label}
					</button>
				);
			})}
		</div>);
};

const valuePropShape = [
	PropTypes.bool,
	PropTypes.number,
	PropTypes.string,
];

SegmentedControl.propTypes = {
	color: PropTypes.oneOf(Object.keys(colors)),
	cropText: PropTypes.bool, // when `inline && equalWidthSegments` crops to the next largest option length
	equalWidthSegments: PropTypes.bool, // only relevant when `inline === false`
	inline: PropTypes.bool,
	onChange: PropTypes.func.isRequired,
	options: PropTypes.arrayOf(
		PropTypes.shape({
			disabled: PropTypes.bool,
			label: PropTypes.string,
			value: PropTypes.oneOfType(valuePropShape),
		})
	).isRequired,
	value: PropTypes.oneOfType(valuePropShape),
};
SegmentedControl.defaultProps = {
	color: 'default',
};

module.exports = SegmentedControl;
