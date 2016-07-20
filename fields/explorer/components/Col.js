import React from 'react';

const Col = (props) => {
	const styles = {
		flex: props.width ? null : '1 1 0',
		minHeight: 1,
		paddingLeft: 10,
		paddingRight: 10,
		width: props.width || '100%',
		...props.style,
	};

	return (
		<div
			{...props}
			className={props.className || 'Col'}
			style={styles}
			/>
	);
};

module.exports = Col;
