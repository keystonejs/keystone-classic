import React from 'react';
import { rhythm } from 'utils/typography';
import theme from '../theme';

const styles = {
	container: {
		marginLeft: 'auto',
		marginRight: 'auto',
		maxWidth: theme.container.large,
		padding: `${rhythm(1 / 2)} ${rhythm(1)}`,
	},
};

export default ({ style, ...props }) => (
	<div style={Object.assign({}, styles.container, style)} {...props} />
);
