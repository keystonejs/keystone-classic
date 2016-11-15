import { css, StyleSheet } from 'aphrodite/no-important';
import React, { PropTypes } from 'react';
import styles from './styles';

const classes = StyleSheet.create(styles);

function LabelledControl ({
	className,
	inline,
	label,
	title,
	...props
}) {
	const labelClassName = css(
		classes.wrapper,
		inline && classes.wrapper__inline,
		className
	);

	return (
		<label title={title} className={labelClassName}>
			<input {...props} className={css(classes.control)} />
			<span className={css(classes.label)}>{label}</span>
		</label>
	);
};

LabelledControl.propTypes = {
	inline: PropTypes.bool,
	title: PropTypes.string,
	type: PropTypes.oneOf(['checkbox', 'radio']).isRequired,
};

module.exports = LabelledControl;
