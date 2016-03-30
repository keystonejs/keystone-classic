'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import classnames from 'classnames';
import CurrentListStore from '../stores/CurrentListStore';
import Columns from '../columns';
import ConfirmationDialog from '../components/Forms/ConfirmationDialog';
import CreateForm from '../components/Forms/CreateForm';
import FlashMessages from '../components/FlashMessages';
import Footer from '../components/Footer';
import ItemsTable from '../components/ItemsTable/ItemsTable';
import ListColumnsForm from '../components/List/ListColumnsForm';
import ListControl from '../components/List/ListControl';
import ListDownloadForm from '../components/List/ListDownloadForm';
import ListFilters from '../components/List/ListFilters';
import ListFiltersAdd from '../components/List/ListFiltersAdd';
import ListSort from '../components/List/ListSort';
import MobileNavigation from '../components/Navigation/MobileNavigation';
import PrimaryNavigation from '../components/Navigation/PrimaryNavigation';
import SecondaryNavigation from '../components/Navigation/SecondaryNavigation';
import UpdateForm from '../components/Forms/UpdateForm';
import { BlankState, Button, Container, FormInput, InputGroup, Pagination, Spinner } from 'elemental';
import { plural } from '../utils';

const TABLE_CONTROL_COLUMN_WIDTH = 26;  // icon + padding

const ListView = React.createClass({
	getInitialState () {
		return {
			confirmationDialog: {
				isOpen: false,
			},
			checkedItems: {},
			constrainTableWidth: true,
			manageMode: false,
			searchString: '',
			showCreateForm: window.location.search === '?create' || Keystone.createFormErrors,
			showUpdateForm: false,
			...this.getStateFromStore(),
		};
	},
	componentDidMount () {
		CurrentListStore.addChangeListener(this.updateStateFromStore);
	},
	componentWillUnmount () {
		CurrentListStore.removeChangeListener(this.updateStateFromStore);
	},
	updateStateFromStore () {
		this.setState(this.getStateFromStore());
	},
	getStateFromStore () {
		var state = {
			columns: CurrentListStore.getActiveColumns(),
			currentPage: CurrentListStore.getCurrentPage(),
			filters: CurrentListStore.getActiveFilters(),
			items: CurrentListStore.getItems(),
			list: CurrentListStore.getList(),
			loading: CurrentListStore.isLoading(),
			pageSize: CurrentListStore.getPageSize(),
			ready: CurrentListStore.isReady(),
			search: CurrentListStore.getActiveSearch(),
			rowAlert: CurrentListStore.rowAlert(),
		};
		if (!this._searchTimeout) {
			state.searchString = state.search;
		}
		state.showBlankState = (state.ready && !state.loading && !state.items.results.length && !state.search && !state.filters.length);
		return state;
	},

	// ==============================
	// HEADER
	// ==============================

	updateSearch (e) {
		clearTimeout(this._searchTimeout);
		this.setState({
			searchString: e.target.value,
		});
		var delay = e.target.value.length > 1 ? 150 : 0;
		this._searchTimeout = setTimeout(() => {
			delete this._searchTimeout;
			CurrentListStore.setActiveSearch(this.state.searchString);
		}, delay);
	},
	handleSearchClear () {
		CurrentListStore.setActiveSearch('');
		this.setState({ searchString: '' });
		ReactDOM.findDOMNode(this.refs.listSearchInput).focus();
	},
	handleSearchKey (e) {
		// clear on esc
		if (e.which === 27) {
			this.handleSearchClear();
		}
	},
	handlePageSelect (i) {
		CurrentListStore.setCurrentPage(i);
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
		const { checkedItems, list } = this.state;
		const itemCount = plural(checkedItems, ('* ' + list.singular.toLowerCase()), ('* ' + list.plural.toLowerCase()));
		const itemIds = Object.keys(checkedItems);

		this.setState({
			confirmationDialog: {
				isOpen: true,
				label: 'Delete',
				body: `Are you sure you want to delete ${itemCount}?<br /><br />This cannot be undone.`,
				onConfirmation: () => {
					CurrentListStore.deleteItems(itemIds);
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
				<FormInput ref="listSearchInput" value={this.state.searchString} onChange={this.updateSearch} onKeyUp={this.handleSearchKey} placeholder="Search" className="ListHeader__searchbar-input" />
				<button ref="listSearchClear" type="button" title="Clear search query" onClick={this.handleSearchClear} disabled={!this.state.searchString.length} className={searchClearIcon} />
			</InputGroup.Section>
		);
	},
	renderCreateButton () {
		if (this.state.list.nocreate) return null;
		var props = { type: 'success' };
		if (this.state.list.autocreate) {
			props.href = '?new' + Keystone.csrf.query;
		} else {
			props.onClick = () => this.toggleCreateModal(true);
		}
		return (
			<InputGroup.Section className="ListHeader__create">
				<Button {...props} title={'Create ' + this.state.list.singular}>
					<span className="ListHeader__create__icon octicon octicon-plus" />
					<span className="ListHeader__create__label">
						Create
					</span>
					<span className="ListHeader__create__label--lg">
						Create {this.state.list.singular}
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

		const { checkedItems, items, list, manageMode, pageSize } = this.state;
		if (!items.count || (list.nodelete && list.noedit)) return;

		const checkedItemCount = Object.keys(checkedItems).length;
		const buttonNoteStyles = { color: '#999', fontWeight: 'normal' };

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
				<InputGroup contiguous>
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
				<InputGroup contiguous>
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
			<InputGroup style={{ float: 'left', marginRight: '.75em' }}>
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
		const { currentPage, items, list, manageMode, pageSize } = this.state;
		if (manageMode || !items.count) return;

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
		const { items, list } = this.state;
		return (
			<div className="ListHeader">
				<Container>
					<h2 className="ListHeader__title">
						{plural(items.count, ('* ' + list.singular), ('* ' + list.plural))}
						<ListSort />
					</h2>
					<InputGroup className="ListHeader__bar">
						{this.renderSearch()}
						<ListFiltersAdd className="ListHeader__filter" />
						<ListColumnsForm className="ListHeader__columns" />
						<ListDownloadForm className="ListHeader__download" />
						<InputGroup.Section className="ListHeader__expand">
							<Button isActive={!this.state.constrainTableWidth} onClick={this.toggleTableWidth} title="Expand table width">
								<span className="octicon octicon-mirror" />
							</Button>
						</InputGroup.Section>
						{this.renderCreateButton()}
					</InputGroup>
					<ListFilters />
					<div style={{ height: 34, marginBottom: '2em' }}>
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
		this.state.items.results.forEach(item => {
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
			return CurrentListStore.deleteItem(item.id);
		}

		e.preventDefault();

		this.setState({
			confirmationDialog: {
				isOpen: true,
				label: 'Delete',
				body: `Are you sure you want to delete <strong>${item.name}</strong>?<br /><br />This cannot be undone.`,
				onConfirmation: () => {
					CurrentListStore.deleteItem(item.id);
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

	toggleCreateModal (visible) {
		this.setState({
			showCreateForm: visible,
		});
	},
	renderBlankStateCreateButton () {
		var props = { type: 'success' };
		if (this.state.list.nocreate) return null;
		if (this.state.list.autocreate) {
			props.href = '?new' + this.props.csrfQuery;
		} else {
			props.onClick = () => this.toggleCreateModal(true);
		}
		return (
			<Button {...props}>
				<span className="octicon octicon-plus" />
				Create {this.state.list.singular}
			</Button>
		);
	},
	renderBlankState () {
		if (!this.state.showBlankState) return null;
		return (
			<Container>
				<FlashMessages messages={this.props.messages} />
				<BlankState style={{ marginTop: 40 }}>
					<BlankState.Heading>No {this.state.list.plural.toLowerCase()} found&hellip;</BlankState.Heading>
					{this.renderBlankStateCreateButton()}
				</BlankState>
			</Container>
		);
	},
	renderActiveState () {
		if (this.state.showBlankState) return null;

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
					<FlashMessages messages={this.props.messages} />
					<ItemsTable
						deleteTableItem={this.deleteTableItem}
						list={this.state.list}
						columns={this.state.columns}
						items={this.state.items}
						manageMode={this.state.manageMode}
						checkedItems={this.state.checkedItems}
						rowAlert={this.state.rowAlert}
						checkTableItem={this.checkTableItem}
					/>
					{this.renderNoSearchResults()}
				</Container>
			</div>
		);
	},
	renderNoSearchResults () {
		if (this.state.items.results.length) return null;
		let matching = this.state.search;
		if (this.state.filters.length) {
			matching += (matching ? ' and ' : '') + plural(this.state.filters.length, '* filter', '* filters');
		}
		matching = matching ? ' found matching ' + matching : '.';
		return (
			<BlankState style={{ marginTop: 20, marginBottom: 20 }}>
				<span className="octicon octicon-search" style={{ fontSize: 32, marginBottom: 20 }} />
				<BlankState.Heading>No {this.state.list.plural.toLowerCase()}{matching}</BlankState.Heading>
			</BlankState>
		);
	},
	render () {
		return !this.state.ready ? (
			<div className="view-loading-indicator"><Spinner size="md" /></div>
		) : (
			<div className="keystone-wrapper">
				<header className="keystone-header">
					<MobileNavigation
						brand={this.props.brand}
						currentListKey={this.state.list.path}
						currentSectionKey={this.props.nav.currentSection.key}
						sections={this.props.nav.sections}
						signoutUrl={this.props.signoutUrl}
						/>
					<PrimaryNavigation
						brand={this.props.brand}
						currentSectionKey={this.props.nav.currentSection.key}
						sections={this.props.nav.sections}
						signoutUrl={this.props.signoutUrl} />
					<SecondaryNavigation
						currentListKey={this.state.list.path}
						lists={this.props.nav.currentSection.lists} />
				</header>
				<div className="keystone-body">
					{this.renderBlankState()}
					{this.renderActiveState()}
				</div>
				<Footer
					appversion={this.props.appversion}
					backUrl={this.props.backUrl}
					brand={this.props.brand}
					User={this.props.User}
					user={this.props.user}
					version={this.props.version} />
				<CreateForm
					err={this.props.createFormErrors}
					isOpen={this.state.showCreateForm}
					list={this.state.list}
					onCancel={() => this.toggleCreateModal(false)}
					values={this.props.createFormData} />
				<UpdateForm
					isOpen={this.state.showUpdateForm}
					itemIds={Object.keys(this.state.checkedItems)}
					list={this.state.list}
					onCancel={() => this.toggleUpdateModal(false)} />
				{this.renderConfirmationDialog()}
			</div>
		);
	},
});

ReactDOM.render(
	<ListView
		appversion={Keystone.appversion}
		backUrl={Keystone.backUrl}
		brand={Keystone.brand}
		createFormData={Keystone.createFormData}
		createFormErrors={Keystone.createFormErrors}
		csrfQuery={Keystone.csrf.query}
		messages={Keystone.messages}
		nav={Keystone.nav}
		signoutUrl={Keystone.signoutUrl}
		user={Keystone.user}
		User={Keystone.User}
		version={Keystone.version}
	/>,
	document.getElementById('list-view')
);
