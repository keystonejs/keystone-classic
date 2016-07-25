import React, { PropTypes } from 'react';

const Row = (props) => {
	const { className, gutter, style, ...incidentalProps } = props;
	const styles = {
		display: 'flex',
		flexWrap: 'wrap',
		marginLeft: gutter * -1,
		marginRight: gutter * -1,
		...style,
	};
	const klass = 'Row' + (className
		? ' ' + className
		: '');

	return (
		<div
			{...incidentalProps}
			className={klass}
			style={styles}
		/>
	);
};
Row.propTypes = {
	className: PropTypes.string,
	gutter: PropTypes.number,
	style: PropTypes.string,
};
Row.defaultProps = {
	gutter: 10,
};

module.exports = Row;
