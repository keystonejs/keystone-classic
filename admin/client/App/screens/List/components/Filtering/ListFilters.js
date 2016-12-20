import React, { PropTypes } from 'react';
import { Chip } from '../../../../elemental';
import Filter from './Filter';

import { clearAllFilters } from '../../actions';

const ListFilters = ({ dispatch, filters }) => {

	if (!filters.length) return <div />;

	const dispatchClearAllFilters = function () {
		dispatch(clearAllFilters());
	};

	// Generate the list of filter pills
	const currentFilters = filters.map((filter, i) => (
		<Filter
			key={'f' + i}
			filter={filter}
			dispatch={dispatch}
		/>
	));

	// When more than 1, append the clear button
	if (currentFilters.length > 1) {
		currentFilters.push(
			<Chip
				key="listFilters__clear"
				label="Clear All"
				onClick={dispatchClearAllFilters}
			/>
		);
	}

	const styles = {
		marginBottom: '1em',
		marginTop: '1em',
	};

	return (
		<div style={styles}>
			{currentFilters}
		</div>
	);
};

ListFilters.propTypes = {
	dispatch: PropTypes.func.isRequired,
	filters: PropTypes.array.isRequired,
};

module.exports = ListFilters;
