import { css, StyleSheet } from 'aphrodite/no-important';
import React, { PropTypes } from 'react';
import theme from '../../../../theme';

import ListSort from './ListSort';

function ListHeaderTitle ({
	activeSort,
	availableColumns,
	handleSortSelect,
	title,
	...props
}) {
	return (
		<h2 className={css(classes.heading)} {...props}>
			{title}
			<ListSort
				activeSort={activeSort}
				availableColumns={availableColumns}
				handleSortSelect={handleSortSelect}
			/>
		</h2>
	);
};

ListHeaderTitle.propTypes = {
	activeSort: PropTypes.object,
	availableColumns: PropTypes.arrayOf(PropTypes.object),
	handleSortSelect: PropTypes.func.isRequired,
	title: PropTypes.string,
};

const classes = StyleSheet.create({
	heading: {
		[`@media (max-width: ${theme.breakpoint.mobileMax})`]: {
			fontSize: '1.25em',
			fontWeight: 500,
		},
	},
});

module.exports = ListHeaderTitle;
