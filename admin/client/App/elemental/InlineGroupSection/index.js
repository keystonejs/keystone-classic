import React, { cloneElement, PropTypes } from 'react';

// NOTE: Inline Group Section accepts a single child

function InlineGroupSection ({
	children,
	className,
	contiguous,
	grow,
	padLeft,
	style,
	...props,
}) {
	// A `contiguous` section must manipulate it's child directly
	// A separate (default) section just wraps the child
	return contiguous ? cloneElement(children, {
		style: {
			flex: grow ? '1 1 0' : '0 1 0',
			...style,
		},
		...props,
	}) : (
		<div style={{
			flex: grow ? '1 1 0' : '0 1 0',
			paddingLeft: padLeft ? '0.75em' : 0,
			...style,
		}} {...props}>
			{children}
		</div>
	);
};

InlineGroupSection.propTypes = {
	children: PropTypes.element.isRequired,
	contiguous: PropTypes.bool,
	grow: PropTypes.bool,
	padLeft: PropTypes.bool,
};

module.exports = InlineGroupSection;
