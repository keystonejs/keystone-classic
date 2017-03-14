import React from 'react';
import { rhythm } from 'utils/typography';

export default ({ className, style, children, ...otherProps }) => {
	if (!className) {
		className = '';
	}
	return (
		<div
			style={{
				padding: `${rhythm(1 / 2)} ${rhythm(1)}`,
				...style,
			}}
			{...otherProps}
		>
			{ children }
		</div>
	);
};
