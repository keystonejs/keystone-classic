import React from 'react';

const Row = (props) => {
	const styles = {
		display: 'flex',
		flexWrap: 'wrap',
		marginLeft: -10,
		marginRight: -10,
		...props.style,
	};

	return (
		<div
			{...props}
			className={props.className || 'Row'}
			style={styles}
			/>
	);
};

module.exports = Row;
