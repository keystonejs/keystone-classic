import isPlainObject from 'lodash/isPlainObject';
import isArray from 'lodash/isArray';
import isObject from 'lodash/isObject';

/**
 * Returns an array of expanded filter objects,
 * given (a string representation | an array of filters) and a currentList object.
 *
 * @param { String|Array } Either a string representation of an array of filter objects, or an array of filter objects.
 * @param { Object } the current instantiation of the List prototype used for the <List/> scene
 * @return { Array } of { Objects } as an expanded representation of the filters passed in.
 **/

export function filtersParser (filters, currentList) {
	if (typeof filters === 'string') {
		try {
			filters = JSON.parse(filters);
		} catch (e) {
			console.warn('Invalid filters provided', filters);
			filters = void 0;
		}
	}

	if (!filters) return [];

	const assembledFilters = filters.map(filter => {
		const path = filter.path;
		const value = Object.assign({}, filter);
		delete value.path;
		return createFilterObject(path, value, currentList.fields);
	});

	filters = assembledFilters.filter(filter => filter);
	return filters;
}

/**
 * Returns an array of expanded filter objects,
 * given (a string representation | an array of filters) and a currentList object.
 *
 * @param { Object } Filter object  containing the following key value pairs {path} and {value}.
 * @param { Array } of { Objects } an array of the currently active filters.
 * @param { Object } the current instantiation of the List prototype used for the <List/> scene
 * @return { Object } an expanded representation of the passed in filter { Object }.
 **/


export function filterParser ({ path, value }, activeFilters, currentList) {
	if (!activeFilters || !isArray(activeFilters)) {
		throw new Error('activeFilters must be an array');
	}
	if (!currentList) {
		throw new Error('No currentList selected');
	}

	if (!isObject(currentList) || isArray(currentList)) {
		throw new Error('currentList is expected to be an { Object }', currentList);
	}

	let filter = activeFilters.filter(i => i.field.path === path)[0];
	if (filter) {
		filter.value = value;
	} else {
		filter = createFilterObject(path, value, currentList.fields);
		if (!filter) {
			return void 0;
		}
	}
	return filter;
}

/*
* This method is a util, but has such a specific use that it is being left within
* the file that uses it.
*/

/**
 * Returns a filter object
 * given a path, a value, and the fields within an instance of the List prototype.
 *
 * @param { String } filter path
 * @param { Object } of filter values.
 * @param { Object } of fields from the current instance of the List prototype.
 * @return { Object } a filter comprised of the:filters.js
 *	- corresponding field value within the current List,
 *	- and the passed in value { Object }.
 **/

export function createFilterObject (path, value, currentListFields) {
	if (!currentListFields || !isPlainObject(currentListFields)) {
		console.warn('currentListFields must be a plain object', currentListFields);
		return;
	}

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
