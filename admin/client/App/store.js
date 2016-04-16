import { routerReducer, routerMiddleware, push, replace } from 'react-router-redux';
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { browserHistory } from 'react-router';
import thunk from 'redux-thunk';

import ListsReducer from './screens/List/reducers/main';
import ActiveReducer from './screens/List/reducers/active';
import { loadItems } from './screens/List/actions';

// Combine the reducers to one state
const reducers = combineReducers({
	lists: ListsReducer,
	active: ActiveReducer,
	routing: routerReducer,
});

// Create the store
const store = createStore(
	reducers,
	compose(
		applyMiddleware(
			// Support thunked actions and react-router-redux
			thunk,
			routerMiddleware(browserHistory)
		),
		// Support the Chrome DevTools extension
		window.devToolsExtension ? window.devToolsExtension() : f => f
	)
);

let cachedColumns = '';
let cachedSearch = '';
let cachedSort = '';
let cachedPage = 0;
// Sync the state to the URL parameters. The parameters are:
// - columns: column1,column2,...
// - search: somestring
// - sort: -somestring
// - page: 1
store.subscribe(() => {
	// Get all the necessary data
	const state = store.getState();
	const list = state.lists.currentList;
	const items = state.lists.items;
	// If we aren't on a list, or haven't loaded any items yet don't do anything
	if (!list || items.count < 1) return;
	const search = state.active.search;
	const location = state.routing.locationBeforeTransitions;

	let columns = state.active.columns;
	let sort = state.active.sort.rawInput;
	let page = state.lists.page.index;

	// Make the column data ready to be turned into a URL
	if (columns) {
		// Turns [{ path: 'someColumn' }, { path: 'someOtherColumn' }]
		// into ['someColumn', 'someOtherColumn']
		columns = columns.map((column) => column.path);
		// Turns that array into 'someColumn,someOtherColumn'
		if (Array.isArray(columns)) columns = columns.join(',');
		// If that is the same as the default columns, don't set the query param
		if (columns === list.defaultColumnPaths) columns = undefined;
	}

	// TODO: Starting or clearing a search pushes a new history state, but updating
	// the current search replaces it for nicer history navigation support

	// Sorting
	if (sort === list.defaultSort) sort = undefined;

	// Pagination
	if (page === 1) page = undefined;

	// If at least one value is different from the cached value, change the query
	// parameter
	// This check is important because updateQueryParams dispatches an action
	// so this would be an endless loop if we didn't check this
	if (page !== cachedPage
		|| columns !== cachedColumns
		|| sort !== cachedSort
		|| search !== cachedSearch) {
		// Cache the new values
		cachedPage = page;
		cachedColumns = columns;
		cachedSort = sort;
		cachedSearch = search;
		// Update the query params
		updateQueryParams({
			page,
			columns,
			sort,
			search,
		}, false, location);
		// After we've updated the query params, load the changed items
		store.dispatch(loadItems());
	}
});

/**
 * Updates the query parameters with the ones passed as the first argument
 *
 * @param  {Object} params         The new parameters to be added
 * @param  {Boolean} shouldReplace If history should use push() or replace()
 * @param  {Object} location       The current location object
 */
function updateQueryParams (params, shouldReplace, location) {
	if (!location) return;
	const newParams = Object.assign({}, location.query);
	// Stringify nested objects inside the parameters
	Object.keys(params).forEach(i => {
		if (params[i]) {
			newParams[i] = params[i];
			if (typeof newParams[i] === 'object') {
				newParams[i] = JSON.stringify(newParams[i]);
			}
		} else {
			delete newParams[i];
		}
	});
	// If we want to replace in the history, dispatch the react-router-redux
	// replace action with the new query
	if (shouldReplace) {
		store.dispatch(replace({
			pathname: location.pathname,
			query: newParams,
		}));
	// Otherwise dispatch the react-router-redux push action
	} else {
		store.dispatch(push({
			pathname: location.pathname,
			query: newParams,
		}));
	}
}

export default store;
