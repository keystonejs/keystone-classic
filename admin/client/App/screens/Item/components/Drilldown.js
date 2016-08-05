import { StyleSheet } from 'aphrodite/no-important';
import React, { PropTypes } from 'react';
import DrilldownItem from './DrilldownItem';

import cssClassNames from '../../../../utils/cssClassNames';

function Drilldown ({ className, items, ...props }) {
	props.className = cssClassNames([
		classes.drilldown,
	], className);

	return (
		<ul {...props}>
			{items.map((item, idx) => (
				<DrilldownItem
					key={idx}
					separate={idx < items.length - 1}
					{...item}
				/>
			))}
		</ul>
	);
};

Drilldown.propTypes = {
	children: PropTypes.arrayOf(
		PropTypes.instanceOf(DrilldownItem)
	).isRequired,
};

const classes = StyleSheet.create({
	drilldown: {
		display: 'inline-block',
		listStyle: 'none',
		margin: 0,
		padding: 0,
	},
});

module.exports = Drilldown;
