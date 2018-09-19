import React, { PropTypes } from 'react';
import theme from '../theme';

const styles = {
	container: {
		boxSizing: 'border-box',
		marginLeft: 'auto',
		marginRight: 'auto',
		paddingLeft: '2rem',
		paddingRight: '2rem',
		position: 'relative',

		[theme.breakpoint.mediumUp]: {
			paddingLeft: '2rem',
			paddingRight: '2rem',
		},
	},
};

export default function Container ({ width, ...props }) {
	const size = !isNaN ? width : theme.container[width];

	return (
		<div
			css={[styles.container, { maxWidth: size }]}
			{...props}
		/>
	);
};

Container.propTypes = {
	width: PropTypes.oneOfType([
		PropTypes.number,
		PropTypes.oneOf(['small', 'medium', 'large']),
	]),
};
Container.defaultProps = {
	width: 'large',
};
