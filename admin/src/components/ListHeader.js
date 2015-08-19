import classNames from 'classnames';
import React from 'react';
import utils from '../utils.js';
import { Button, Dropdown, FormInput, InputGroup, Pagination } from 'elemental';

import CreateForm from './CreateForm';
import ListColumnsForm from './ListColumnsForm';
import ListDownloadForm from './ListDownloadForm';
import ListFilters from './ListFilters';
import ListFiltersAdd from './ListFiltersAdd';
import ListHeaderTitle from './ListHeaderTitle';
import ListSortForm from './ListSortForm';

import CurrentListStore from '../stores/CurrentListStore';

var ListHeader = React.createClass({
	displayName: 'ListHeader',
	getInitialState () {
		return {
			createIsOpen: Keystone.showCreateForm,
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
			availableColumns: CurrentListStore.getAvailableColumns(),
			activeColumns: CurrentListStore.getActiveColumns(),
			availableFilters: CurrentListStore.getAvailableFilters(),
			activeFilters: CurrentListStore.getActiveFilters(),
			activeSort: CurrentListStore.getListSort(),
			items: CurrentListStore.getItems(),
			list: CurrentListStore.getList(),
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
	toggleSortPopout (visible) {
		this.setState({
			sortPopoutIsOpen: visible
		});
	},
	toggleDownloadModal (visible) {
		this.setState({
			downloadIsOpen: visible
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
	handleSortSelect (path) {
		this.setState({
			activeSort: path,
			// 	invertSort: this.state.selectedColumn === path ? !this.state.invertSort : false
		});
		this.toggleSortPopout(false);
	},
	handlePageSelect (selected) {
		// TODO
		// location.href = '/keystone/' + this.state.list.path + '/' + page;
	},
	renderSearch () {
		var searchClearIcon = classNames('ListHeader__searchbar-field__icon octicon', {
			'is-search octicon-search': !this.state.searchString.length,
			'is-clear octicon-x': this.state.searchString.length
		});
		return (
			<InputGroup.Section grow className="ListHeader__searchbar-field">
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
	renderPagination () {
		return null;
		// TODO: Paginations needs to be updated...
		if (!this.state.ready) return null;
		return <Pagination pagination={this.state.items} onPageSelect={this.handlePageSelect} className="ListHeader__pagination" />;
	},
	renderCreateButton () {
		var props = { type: 'success' };
		if (this.state.list.autocreate) {
			props.href = '?new' + Keystone.csrf.query;
		} else {
			props.onClick = this.toggleCreateModal.bind(this, true);
		}
		return (
			<InputGroup.Section style={{ borderLeft: '1px solid rgba(0,0,0,0.1)', marginLeft: '.75em', paddingLeft: '.75em' }}>
				<Button {...props}>
					<span className="octicon octicon-plus" />
					Create {this.state.list.singular}
				</Button>
			</InputGroup.Section>
		);
	},
	renderCreateForm () {
		return <CreateForm list={this.state.list} isOpen={this.state.createIsOpen} onCancel={this.toggleCreateModal.bind(this, false)} values={Keystone.createFormData} err={Keystone.createFormErrors} />;
	},
	render () {
		// console.log(this.state.list.defaultSort);
		return (
			<div className="ListHeader">
				<div className="container">
					<ListHeaderTitle
						activeSort={this.state.list.fields[this.state.activeSort]}
						invertSort={this.state.invertSort}
						popoutIsOpen={this.state.sortPopoutIsOpen}
						title={utils.plural(this.state.items.count, ('* ' + this.state.list.singular), ('* ' + this.state.list.plural))}
						onColumnSelect={this.handleSortSelect}
						closePopout={this.toggleSortPopout.bind(this, false)}
						openPopout={this.toggleSortPopout.bind(this, true)}
						/>
					<InputGroup contiguous={false} className="ListHeader__searchbar">
						{this.renderSearch()}
						<ListFiltersAdd />
						<ListColumnsForm />
						<ListDownloadForm />
						{this.renderCreateButton()}
					</InputGroup>
					<ListFilters />
					{this.renderPagination()}
				</div>
				{this.renderCreateForm()}
			</div>
		);
	}

});

module.exports = ListHeader;
