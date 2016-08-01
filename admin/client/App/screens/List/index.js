/**
 * The list view is a paginated table of all items in the list. It can show a
 * variety of information about the individual items in columns.
 */

import React from 'react';
import { findDOMNode } from 'react-dom';
import classnames from 'classnames';
import { BlankState, Button, Container, FormInput, InputGroup, Pagination, Spinner } from 'elemental';
import { connect } from 'react-redux';

import ConfirmationDialog from '../../shared/ConfirmationDialog';
import CreateForm from '../../shared/CreateForm';
import FlashMessages from '../../shared/FlashMessages';
import ItemsTable from './components/ItemsTable/ItemsTable';
import ListColumnsForm from './components/ListColumnsForm';
import ListDownloadForm from './components/ListDownloadForm';
import ListFilters from './components/Filtering/ListFilters';
import ListFiltersAdd from './components/Filtering/ListFiltersAdd';
import ListSort from './components/ListSort';
import UpdateForm from './components/UpdateForm';
import { plural } from '../../../utils/string';
import { listsByPath } from '../../../utils/lists';

import {
	deleteItems,
	setActiveColumns,
	setActiveSearch,
	setActiveSort,
	setCurrentPage,
	selectList,
	loadItems,
} from './actions';

import {
	deleteItem,
} from '../Item/actions';

const ListView = React.createClass({
	contextTypes: {
		router: React.PropTypes.object.isRequired,
	},
	getInitialState () {
		return {
			confirmationDialog: {
				isOpen: false,
			},
			checkedItems: {},
			constrainTableWidth: true,
			manageMode: false,
			searchString: '',
			showCreateForm: this.props.location.search === '?create' || Keystone.createFormErrors,
			showUpdateForm: false,
		};
	},
	componentDidMount () {
		// When we directly navigate to a list without coming from another client
		// side routed page before, we need to initialize the list and parse
		// possibly specified query parameters
		this.initializeList(this.props.params.listId);
		this.parseQueryParams();
		this.loadItems();
	},
	componentWillReceiveProps (nextProps) {
		// We'nve opened a new list from the client side routing, so initialize
		// again with the new list id
		if (nextProps.params.listId !== this.props.params.listId) {
			this.initializeList(nextProps.params.listId);
			this.loadItems();
		}
	},
	initializeList (listId) {
		this.props.dispatch(selectList(listId));
	},
	loadItems () {
		this.props.dispatch(loadItems());
	},
	/**
	 * Parse the current query parameters and change the state accordingly
	 * Only called when directly opening a list
	 */
	parseQueryParams () {
		const query = this.props.location.query;
		Object.keys(query).forEach((key) => {
			switch (key) {
				case 'columns':
					this.props.dispatch(setActiveColumns(query[key]));
					break;
				case 'page':
					this.props.dispatch(setCurrentPage(query[key]));
					break;
				case 'search':
					// Fill the search input field with the current search
					this.setState({
						searchString: query[key],
					});
					this.props.dispatch(setActiveSearch(query[key]));
					break;
				case 'sort':
					this.props.dispatch(setActiveSort(query[key]));
					break;
			}
		});
	},

	// ==============================
	// HEADER
	// ==============================
	// Called when a new item is created
	onCreate (item) {
		// Hide the create form
		this.setState({
			showCreateForm: false,
		});
		// Redirect to newly created item path
		const list = this.props.currentList;
		this.context.router.push(`${Keystone.adminPath}/${list.path}/${item.id}`);
	},
	createAutocreate () {
		const list = this.props.currentList;
		list.createItem(null, (err, data) => {
			if (err) {
				// TODO Proper error handling
				alert('Something went wrong, please try again!');
				console.log(err);
			} else {
				this.context.router.push(`${Keystone.adminPath}/${list.path}/${data.id}`);
			}
		});
	},
	updateSearch (e) {
		clearTimeout(this._searchTimeout);
		this.setState({
			searchString: e.target.value,
		});
		var delay = e.target.value.length > 1 ? 150 : 0;
		this._searchTimeout = setTimeout(() => {
			delete this._searchTimeout;
			this.props.dispatch(setActiveSearch(this.state.searchString));
		}, delay);
	},
	handleSearchClear () {
		this.props.dispatch(setActiveSearch(''));
		this.setState({ searchString: '' });
		findDOMNode(this.refs.listSearchInput).focus();
	},
	handleSearchKey (e) {
		// clear on esc
		if (e.which === 27) {
			this.handleSearchClear();
		}
	},
	handlePageSelect (i) {
		this.props.dispatch(setCurrentPage(i));
	},
	toggleManageMode (filter = !this.state.manageMode) {
		this.setState({
			manageMode: filter,
			checkedItems: {},
		});
	},
	toggleUpdateModal (filter = !this.state.showUpdateForm) {
		this.setState({
			showUpdateForm: filter,
		});
	},
	massUpdate () {
		// TODO: Implement update multi-item
		console.log('Update ALL the things!');
	},
	massDelete () {
		const { checkedItems } = this.state;
		const list = this.props.currentList;
		const itemCount = plural(checkedItems, ('* ' + list.singular.toLowerCase()), ('* ' + list.plural.toLowerCase()));
		const itemIds = Object.keys(checkedItems);

		this.setState({
			confirmationDialog: {
				isOpen: true,
				label: 'Delete',
				body: `Are you sure you want to delete ${itemCount}?<br /><br />This cannot be undone.`,
				onConfirmation: () => {
					this.props.dispatch(deleteItems(itemIds));
					this.toggleManageMode();
					this.removeConfirmationDialog();
				},
			},
		});
	},
	handleManagementSelect (selection) {
		if (selection === 'all') this.checkAllTableItems();
		if (selection === 'none') this.uncheckAllTableItems();
		if (selection === 'visible') this.checkAllTableItems();
		return false;
	},
	renderSearch () {
		var searchClearIcon = classnames('ListHeader__search__icon octicon', {
			'is-search octicon-search': !this.state.searchString.length,
			'is-clear octicon-x': this.state.searchString.length,
		});
		return (
			<InputGroup.Section grow className="ListHeader__search">
				<FormInput
					ref="listSearchInput"
					value={this.state.searchString}
					onChange={this.updateSearch}
					onKeyUp={this.handleSearchKey}
					placeholder="Search"
					className="ListHeader__searchbar-input"
				/>
				<button
					ref="listSearchClear"
					type="button"
					title="Clear search query"
					onClick={this.handleSearchClear}
					disabled={!this.state.searchString.length} className={searchClearIcon} />
			</InputGroup.Section>
		);
	},
	renderCreateButton () {
		if (this.props.currentList.nocreate) return null;
		var props = { type: 'success' };
		if (this.props.currentList.autocreate) {
			props.onClick = () => this.createAutocreate();
		} else {
			props.onClick = () => this.toggleCreateModal(true);
		}
		return (
			<InputGroup.Section className="ListHeader__create">
				<Button {...props} title={'Create ' + this.props.currentList.singular}>
					<span className="ListHeader__create__icon octicon octicon-plus" />
					<span className="ListHeader__create__label">
						Create
					</span>
					<span className="ListHeader__create__label--lg">
						Create {this.props.currentList.singular}
					</span>
				</Button>
			</InputGroup.Section>
		);
	},
	renderConfirmationDialog () {
		const props = this.state.confirmationDialog;
		return (
			<ConfirmationDialog
				isOpen={props.isOpen}
				body={props.body}
				confirmationLabel={props.label}
				onCancel={this.removeConfirmationDialog}
				onConfirmation={props.onConfirmation}
			/>
		);
	},
	renderManagement () {
		// WIP: Management mode currently under development, so the UI is disabled
		// unless the KEYSTONE_DEV environment variable is set
		if (!Keystone.devMode) return;

		const { checkedItems, manageMode } = this.state;
		const pageSize = this.props.lists.page.size;
		const items = this.props.items;
		const list = this.props.currentList;
		if (!items.count || (list.nodelete && list.noedit)) return;

		const checkedItemCount = Object.keys(checkedItems).length;
		const buttonNoteStyles = { color: '#999', fontWeight: 'normal' };
		const groupStyles = { marginBottom: 0 };

		// action buttons
		const actionUpdateButton = !list.noedit ? (
			<InputGroup.Section>
				<Button onClick={this.toggleUpdateModal} disabled={!checkedItemCount}>Update</Button>
			</InputGroup.Section>
		) : null;
		const actionDeleteButton = !list.nodelete ? (
			<InputGroup.Section>
				<Button onClick={this.massDelete} disabled={!checkedItemCount}>Delete</Button>
			</InputGroup.Section>
		) : null;
		const actionButtons = manageMode ? (
			<InputGroup.Section>
				<InputGroup style={groupStyles} contiguous>
					{actionUpdateButton}
					{actionDeleteButton}
				</InputGroup>
			</InputGroup.Section>
		) : null;

		// select buttons
		const selectAllButton = items.count > pageSize ? (
			<InputGroup.Section>
				<Button onClick={() => this.handleManagementSelect('all')} title="Select all rows (including those not visible)">All <small style={buttonNoteStyles}>({items.count})</small></Button>
			</InputGroup.Section>
		) : null;
		const selectButtons = manageMode ? (
			<InputGroup.Section>
				<InputGroup style={groupStyles} contiguous>
					{selectAllButton}
					<InputGroup.Section>
						<Button onClick={() => this.handleManagementSelect('visible')} title="Select all rows">{items.count > pageSize ? 'Page' : 'All'} <small style={buttonNoteStyles}>({items.results.length})</small></Button>
					</InputGroup.Section>
					<InputGroup.Section>
						<Button onClick={() => this.handleManagementSelect('none')} title="Deselect all rows">None</Button>
					</InputGroup.Section>
				</InputGroup>
			</InputGroup.Section>
		) : null;

		// selected count text
		const selectedCountText = manageMode ? (
			<InputGroup.Section grow>
				<span style={{ color: '#666', display: 'inline-block', lineHeight: '2.4em', margin: 1 }}>{checkedItemCount} selected</span>
			</InputGroup.Section>
		) : null;

		// put it all together
		return (
			<InputGroup style={{ float: 'left', marginRight: '.75em', marginBottom: 0 }}>
				<InputGroup.Section>
					<Button isActive={manageMode} onClick={() => this.toggleManageMode(!manageMode)}>Manage</Button>
				</InputGroup.Section>
				{selectButtons}
				{actionButtons}
				{selectedCountText}
			</InputGroup>
		);
	},
	renderPagination () {
		const items = this.props.items;
		if (this.state.manageMode || !items.count) return;

		const list = this.props.currentList;
		const currentPage = this.props.lists.page.index;
		const pageSize = this.props.lists.page.size;

		return (
			<Pagination
				className="ListHeader__pagination"
				currentPage={currentPage}
				onPageSelect={this.handlePageSelect}
				pageSize={pageSize}
				plural={list.plural}
				singular={list.singular}
				style={{ marginBottom: 0 }}
				total={items.count}
				limit={10}
			/>
		);
	},
	renderHeader () {
		const items = this.props.items;
		const list = this.props.currentList;
		return (
			<div className="ListHeader">
				<Container>
					<h2 className="ListHeader__title">
						{plural(items.count, ('* ' + list.singular), ('* ' + list.plural))}
						<ListSort
							activeSort={this.props.active.sort}
							availableColumns={this.props.currentList.columns}
							handleSortSelect={this.handleSortSelect}
						/>
					</h2>
					<InputGroup className="ListHeader__bar">
						{this.renderSearch()}
						<ListFiltersAdd
							dispatch={this.props.dispatch}
							activeFilters={this.props.active.filters}
							availableFilters={this.props.currentList.columns.filter((col) => (
								col.field && col.field.hasFilterMethod) || col.type === 'heading'
							)}
							className="ListHeader__filter"
						/>
						<ListColumnsForm
							availableColumns={this.props.currentList.columns}
							activeColumns={this.props.active.columns}
							dispatch={this.props.dispatch}
							className="ListHeader__columns"
						/>
						<ListDownloadForm
							dispatch={this.props.dispatch}
							activeColumns={this.props.active.columns}
							list={listsByPath[this.props.params.listId]}
							className="ListHeader__download"
						/>
						<InputGroup.Section className="ListHeader__expand">
							<Button
								isActive={!this.state.constrainTableWidth}
								onClick={this.toggleTableWidth}
								title="Expand table width"
							>
								<span className="octicon octicon-mirror" />
							</Button>
						</InputGroup.Section>
						{this.renderCreateButton()}
					</InputGroup>
					<ListFilters
						dispatch={this.props.dispatch}
						filters={this.props.active.filters}
					/>
					<div style={{ height: 35, marginBottom: '1em' }}>
						{this.renderManagement()}
						{this.renderPagination()}
						<span style={{ clear: 'both', display: 'table' }} />
					</div>
				</Container>
			</div>
		);
	},

	// ==============================
	// TABLE
	// ==============================

	checkTableItem (item, e) {
		e.preventDefault();
		const newCheckedItems = { ...this.state.checkedItems };
		const itemId = item.id;
		if (this.state.checkedItems[itemId]) {
			delete newCheckedItems[itemId];
		} else {
			newCheckedItems[itemId] = true;
		}
		this.setState({
			checkedItems: newCheckedItems,
		});
	},
	checkAllTableItems () {
		const checkedItems = {};
		this.props.items.results.forEach(item => {
			checkedItems[item.id] = true;
		});
		this.setState({
			checkedItems: checkedItems,
		});
	},
	uncheckAllTableItems () {
		this.setState({
			checkedItems: {},
		});
	},
	deleteTableItem (item, e) {
		if (e.altKey) {
			this.props.dispatch(deleteItem(item.id));
			return;
		}

		e.preventDefault();

		this.setState({
			confirmationDialog: {
				isOpen: true,
				label: 'Delete',
				body: `Are you sure you want to delete <strong>${item.name}</strong>?<br /><br />This cannot be undone.`,
				onConfirmation: () => {
					this.props.dispatch(deleteItem(item.id));
					this.removeConfirmationDialog();
				},
			},
		});
	},
	removeConfirmationDialog () {
		this.setState({
			confirmationDialog: {
				isOpen: false,
			},
		});
	},
	toggleTableWidth () {
		this.setState({
			constrainTableWidth: !this.state.constrainTableWidth,
		});
	},

	// ==============================
	// COMMON
	// ==============================

	handleSortSelect (path, inverted) {
		if (inverted) path = '-' + path;
		this.props.dispatch(setActiveSort(path));
	},
	toggleCreateModal (visible) {
		this.setState({
			showCreateForm: visible,
		});
	},
	renderBlankStateCreateButton () {
		var props = { type: 'success' };
		const list = this.props.currentList;
		if (list.nocreate) return null;
		if (list.autocreate) {
			props.onClick = () => this.createAutocreate();
		} else {
			props.onClick = () => this.toggleCreateModal(true);
		}
		return (
			<Button {...props}>
				<span className="octicon octicon-plus" /> Create {list.singular}
			</Button>
		);
	},
	showBlankState () {
		return !this.props.loading
				&& !this.props.items.results.length
				&& !this.props.active.search
				&& !this.props.active.filters.length;
	},
	renderBlankState () {
		if (!this.showBlankState()) return null;
		return (
			<Container>
				{(this.props.error) ? (
					<FlashMessages
						messages={{ error: [{
							title: "There is a problem with the network, we're trying to reconnect...",
						}] }}
					/>
				) : null}
				<BlankState style={{ marginTop: 40 }}>
					<BlankState.Heading>No {this.props.currentList.plural.toLowerCase()} found&hellip;</BlankState.Heading>
					{this.renderBlankStateCreateButton()}
				</BlankState>
			</Container>
		);
	},
	renderActiveState () {
		if (this.showBlankState()) return null;

		const containerStyle = {
			transition: 'max-width 160ms ease-out',
			msTransition: 'max-width 160ms ease-out',
			MozTransition: 'max-width 160ms ease-out',
			WebkitTransition: 'max-width 160ms ease-out',
		};
		if (!this.state.constrainTableWidth) {
			containerStyle.maxWidth = '100%';
		}
		return (
			<div>
				{this.renderHeader()}
				<Container style={containerStyle}>
					{(this.props.error) ? (
						<FlashMessages
							messages={{ error: [{
								title: "There is a problem with the network, we're trying to reconnect..",
							}] }}
						/>
					) : null}
					{(this.props.loading) ? (
						<div className="centered-loading-indicator">
							<Spinner size="md" />
						</div>
					) : (
						<div>
							<ItemsTable
								activeSort={this.props.active.sort}
								checkedItems={this.state.checkedItems}
								checkTableItem={this.checkTableItem}
								columns={this.props.active.columns}
								deleteTableItem={this.deleteTableItem}
								handleSortSelect={this.handleSortSelect}
								items={this.props.items}
								list={this.props.currentList}
								manageMode={this.state.manageMode}
								rowAlert={this.props.rowAlert}
								currentPage={this.props.lists.page.index}
								pageSize={this.props.lists.page.size}
								drag={this.props.lists.drag}
								dispatch={this.props.dispatch}
							/>
							{this.renderNoSearchResults()}
						</div>
					)}
				</Container>
			</div>
		);
	},
	renderNoSearchResults () {
		if (this.props.items.results.length) return null;
		let matching = this.props.active.search;
		if (this.props.active.filters.length) {
			matching += (matching ? ' and ' : '') + plural(this.props.active.filters.length, '* filter', '* filters');
		}
		matching = matching ? ' found matching ' + matching : '.';
		return (
			<BlankState style={{ marginTop: 20, marginBottom: 20 }}>
				<span className="octicon octicon-search" style={{ fontSize: 32, marginBottom: 20 }} />
				<BlankState.Heading>No {this.props.currentList.plural.toLowerCase()}{matching}</BlankState.Heading>
			</BlankState>
		);
	},
	render () {
		if (!this.props.ready) {
			return (
				<div className="centered-loading-indicator" data-screen-id="list">
					<Spinner size="md" />
				</div>
			);
		}
		return (
			<div data-screen-id="list">
				{this.renderBlankState()}
				{this.renderActiveState()}
				<CreateForm
					err={Keystone.createFormErrors}
					isOpen={this.state.showCreateForm}
					list={this.props.currentList}
					onCancel={() => this.toggleCreateModal(false)}
					onCreate={this.onCreate}
				/>
				<UpdateForm
					isOpen={this.state.showUpdateForm}
					itemIds={Object.keys(this.state.checkedItems)}
					list={this.props.currentList}
					onCancel={() => this.toggleUpdateModal(false)}
				/>
				{this.renderConfirmationDialog()}
			</div>
		);
	},
});

module.exports = connect((state) => {
	return {
		lists: state.lists,
		loading: state.lists.loading,
		error: state.lists.error,
		currentList: state.lists.currentList,
		items: state.lists.items,
		page: state.lists.page,
		ready: state.lists.ready,
		rowAlert: state.lists.rowAlert,
		active: state.active,
	};
})(ListView);
