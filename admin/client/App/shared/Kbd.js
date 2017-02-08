import React from 'react';
import { css } from 'glamor';
import theme from '../../theme';
import { darken, lighten } from '../../utils/color';

function Kbd ({ className, ...props }) {
	props.className = css(classes.kbd);

	return <kbd {...props} />;
};

const classes = {
	kbd: {
		backgroundColor: theme.color.body,
		borderRadius: 3,
		border: `1px solid #ccc`,
		borderBottomColor: darken('#ccc', 4),
		borderTopColor: lighten('#ccc', 4),
		boxShadow: `0 1px 1px rgba(0, 0, 0, 0.12), 0 2px 0 0 rgba(255, 255, 255, 0.7) inset`,
		display: 'inline-block',
		fontFamily: 'Consolas, "Liberation Mono", Courier, monospace',
		fontSize: '0.85em',
		fontWeight: 700,
		lineHeight: 'inherit',
		padding: '1px 4px',
		whiteSpace: 'nowrap',

		// little hack to tweak "visual-middle" alignment
		position: 'relative',
		top: -1,
	},
};

module.exports = Kbd;
