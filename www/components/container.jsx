import React from 'react';
import theme from '../theme';

const styles = {
	container: {
		marginLeft: 'auto',
		marginRight: 'auto',
		maxWidth: theme.container.large,
		paddingLeft: '1em',
		paddingRight: '1em',
	},
};

export default ({ style, ...props }) => (
	<div css={[styles.container, style]} {...props} />
);
