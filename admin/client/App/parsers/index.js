import { filtersParser, filterParser } from './filters.js';

function columnsParser (columns, currentList) {
	if (!columns) return currentList.expandColumns(currentList.defaultColumns);
	if (!currentList) {
		console.warn('No currentList is selected');
		return;
	}
	return currentList.expandColumns(columns);
};

function sortParser (path, currentList) {
	if (!path) return currentList.expandSort(currentList.defaultSort);
	if (!currentList) {
		console.warn('No currentList is selected');
		return;
	}
	return currentList.expandSort(path);
}

export {
	filtersParser,
	filterParser,
	sortParser,
	columnsParser,
};
