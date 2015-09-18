import classNames from 'classnames';
import React from 'react';
import utils from '../utils.js';
import { Button, Container, Dropdown, FormInput, InputGroup, Pagination } from 'elemental';

import CreateForm from './CreateForm';
import ListColumnsForm from './ListColumnsForm';
import ListDownloadForm from './ListDownloadForm';
import ListFilters from './ListFilters';
import ListFiltersAdd from './ListFiltersAdd';
import ListSort from './ListSort';

import CurrentListStore from '../stores/CurrentListStore';

var ListHeader = React.createClass({
	displayName: 'ListHeader',
	getInitialState () {
		return {
			createIsOpen: Keystone.showCreateForm,
			manageIsOpen: false,
			searchString: '',
			...this.getStateFromStore()
		};
	},
	componentDidMount () {
		CurrentListStore.addChangeListener(this.updateStateFromStore);
	},
	componentWillUnmount () {
		clearTimeout(this._searchTimeout);
		CurrentListStore.removeChangeListener(this.updateStateFromStore);
	},
	getStateFromStore () {
		return {
			activeColumns: CurrentListStore.getActiveColumns(),
			activeFilters: CurrentListStore.getActiveFilters(),
			availableColumns: CurrentListStore.getAvailableColumns(),
			currentPage: CurrentListStore.getCurrentPage(),
			items: CurrentListStore.getItems(),
			list: CurrentListStore.getList(),
			pageSize: CurrentListStore.getPageSize(),
			ready: CurrentListStore.isReady()
		};
	},
	updateStateFromStore () {
		this.setState(this.getStateFromStore());
	},
	toggleCreateModal (visible) {
		this.setState({
			createIsOpen: visible
		});
	},
	toggleDownloadModal (visible) {
		this.setState({
			downloadIsOpen: visible
		});
	},
	toggleManageOpen (filter = !this.state.manageIsOpen) {
		this.setState({
			manageIsOpen: filter
		});
	},
	updateSearch (e) {
		clearTimeout(this._searchTimeout);
		this.setState({
			searchString: e.target.value
		});
		var delay = e.target.value.length > 1 ? 250 : 0;
		this._searchTimeout = setTimeout(() => {
			CurrentListStore.setActiveSearch(this.state.searchString);
		}, delay);
	},
	handleSearchClear () {
		CurrentListStore.setActiveSearch('');
		this.setState({ searchString: '' });
		React.findDOMNode(this.refs.listSearchInput).focus();
	},
	handleSearchKey (e) {
		// clear on esc
		if (e.which === 27) {
			this.handleSearchClear ();
		}
	},
	handlePageSelect (i) {
		CurrentListStore.setCurrentPage(i);
	},
	renderSearch () {
		var searchClearIcon = classNames('ListHeader__search__icon octicon', {
			'is-search octicon-search': !this.state.searchString.length,
			'is-clear octicon-x': this.state.searchString.length
		});
		return (
			<InputGroup.Section grow className="ListHeader__search">
				<FormInput ref="listSearchInput" value={this.state.searchString} onChange={this.updateSearch} onKeyUp={this.handleSearchKey} placeholder="Search" className="ListHeader__searchbar-input" />
				<button ref="listSearchClear" type="button" onClick={this.handleSearchClear} disabled={!this.state.searchString.length} className={searchClearIcon} />
			</InputGroup.Section>
		);
	},
	renderDownloadButton () {
		return (
			<InputGroup.Section>
				<Button>
					Download
					<span className="disclosure-arrow" />
				</Button>
			</InputGroup.Section>
		);
	},
	renderCreateButton () {
		var props = { type: 'success' };
		if (this.state.list.autocreate) {
			props.href = '?new' + Keystone.csrf.query;
		} else {
			props.onClick = this.toggleCreateModal.bind(this, true);
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
	renderCreateForm () {
		return <CreateForm list={this.state.list} isOpen={this.state.createIsOpen} onCancel={this.toggleCreateModal.bind(this, false)} values={Keystone.createFormData} err={Keystone.createFormErrors} />;
	},
	renderManagement () {
		let { items, manageIsOpen } = this.state;
		if (!items.count) return;

		let manageUI = manageIsOpen ? (
			<div style={{ float: 'left', marginRight: 10 }}>
				<InputGroup contiguous style={{ display: 'inline-flex', marginBottom: 0 }}>
					<InputGroup.Section>
						<Button>Select all</Button>
					</InputGroup.Section>
					<InputGroup.Section>
						<Button>Select none</Button>
					</InputGroup.Section>
				</InputGroup>
				<InputGroup contiguous style={{ display: 'inline-flex', marginBottom: 0, marginLeft: '.5em' }}>
					<InputGroup.Section>
						<Button>Update</Button>
					</InputGroup.Section>
					<InputGroup.Section>
						<Button>Delete</Button>
					</InputGroup.Section>
				</InputGroup>
				<Button type="link-cancel" onClick={this.toggleManageOpen.bind(this, false)}>Cancel</Button>
			</div>
		) : (
			<Button onClick={this.toggleManageOpen.bind(this, true)} style={{ float: 'left', marginRight: 10 }}>Manage</Button>
		);

		return manageUI;
	},
	renderPagination () {
		let { currentPage, items, list, manageIsOpen, pageSize } = this.state;
		if (manageIsOpen || !items.count) return;

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
				/>
		);
	},
	render () {
		let { currentPage, items, list, pageSize } = this.state;
		return (
			<div className="ListHeader">
				<Container>
					<h2 className="ListHeader__title">
						{utils.plural(items.count, ('* ' + list.singular), ('* ' + list.plural))}
						<ListSort />
					</h2>
					<InputGroup className="ListHeader__bar">
						{this.renderSearch()}
						<ListFiltersAdd className="ListHeader__filter" />
						<ListColumnsForm className="ListHeader__columns" />
						<ListDownloadForm className="ListHeader__download" />
						<InputGroup.Section className="ListHeader__expand">
							<Button isActive={this.props.tableIsExpanded} onClick={this.props.toggleTableWidth} title="Expand table width">
								<span className="octicon octicon-mirror" />
							</Button>
						</InputGroup.Section>
						{this.renderCreateButton()}
					</InputGroup>
					<ListFilters />
					<div style={{ height: 32, marginBottom: '2em' }}>
						{this.renderManagement()}
						{this.renderPagination()}
						<span style={{ clear: 'both', display: 'table' }} />
					</div>
				</Container>
				{this.renderCreateForm()}
			</div>
		);
	}

});

module.exports = ListHeader;
