
export function filtersParser (filters, currentList) {
	if (!filters) return [];

	if (typeof filters === 'string') {
		try {
			filters = JSON.parse(filters);
		} catch (e) {
			console.log('invalid filters provided');
			return;
		}
	}

	const assembledFilters = filters.map(filter => {
		const path = filter.path;
		const value = Object.assign({}, filter);
		delete value.path;
		return createFilterObject(path, value, currentList.fields);
	});

	filters = assembledFilters.filter(filter => filter);

	return filters;
}

export function filterParser ({ path, value }, activeFilters, currentList) {
	let filter = activeFilters.filter(i => i.field.path === path)[0];
	console.log(path, value);
	console.log(filter);
	if (filter) {
		filter.value = value;
	} else {
		filter = createFilterObject(path, value, currentList.fields);
		if (!filter) {
			return;
		}
	}
	return filter;
}

/*
* This method is a util, but has such a specific use that it is being left within
* the file that uses it.
*/

function createFilterObject (path, value, currentListFields) {
	const field = currentListFields[path];
	if (!field) {
		console.warn('Invalid Filter path specified:', path);
		return;
	}
	return {
		field,
		value,
	};
}
