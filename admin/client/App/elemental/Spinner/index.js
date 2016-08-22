import React, { PropTypes } from 'react';
import { css, StyleSheet } from 'aphrodite/no-important';
import styles from './styles';
import ScreenReaderOnly from '../ScreenReaderOnly';
import colors from './colors';
import sizes from './sizes';

function Spinner ({ className, size, color, ...props }) {
	props.className = css(
		classes.base,
		classes[size],
		className
	);

	return (
		<div {...props}>
			<span className={`${css(classes.dot, classes['size__' + size], classes['color__' + color], classes.dot__first)}`} />
			<span className={`${css(classes.dot, classes['size__' + size], classes['color__' + color], classes.dot__second)}`} />
			<span className={`${css(classes.dot, classes['size__' + size], classes['color__' + color], classes.dot__third)}`} />
			<ScreenReaderOnly>Loading...</ScreenReaderOnly>
		</div>
	);
};

Spinner.propTypes = {
	color: PropTypes.oneOf(colors),
	size: PropTypes.oneOf(sizes),
};
Spinner.defaultProps = {
	size: 'medium',
	color: 'default',
};

const classes = StyleSheet.create(styles);

module.exports = Spinner;
