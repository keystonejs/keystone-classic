var classNames = require('classnames');
var React = require('react');
var utils = require('../utils.js');

var CurrentListStore = require('../stores/CurrentListStore');

var CreateForm = require('./CreateForm');
var ListFilters = require('./ListFilters');
var ListFiltersAdd = require('./ListFiltersAdd');
var ListColumnsForm = require('./ListColumnsForm');
var ListDownloadForm = require('./ListDownloadForm');
var ListSortForm = require('./ListSortForm');

var { Button, Dropdown, FormInput, InputGroup, Pagination } = require('elemental');

var ListHeader = React.createClass({
	displayName: 'ListHeader',
	getInitialState () {
		return {
			createIsOpen: Keystone.showCreateForm,
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
			searchString: CurrentListStore.getActiveSearch(),
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
	updateSearch (e) {
		clearTimeout(this._searchTimeout);
		this.setState({
			searchString: e.target.value
		});
		this._searchTimeout = setTimeout(() => {
			CurrentListStore.setActiveSearch(this.state.searchString);
		}, 200);
	},
	handleSearchClear () {
		CurrentListStore.setActiveSearch('');
		React.findDOMNode(this.refs.listSearchInput).focus();
	},
	handleSearchKey (e) {
		// clear on esc
		if (e.which === 27) {
			this.handleSearchClear ();
		}
	},
	handlePageSelect (selected) {
		// TODO
		// location.href = '/keystone/' + this.state.list.path + '/' + page;
	},
	toggleDownloadModal (visible) {
		this.setState({
			downloadIsOpen: visible
		});
	},
	renderTitle () {
		if (!this.state.ready) {
			return <h2 className="ListHeader__title">Loading...</h2>;
		}
		var sort = Keystone.sort ? (
			<ListSortForm isOpen />
		) : null;
		return (
			<h2 className="ListHeader__title">
				{utils.plural(this.state.items.count, ('* ' + this.state.list.singular), ('* ' + this.state.list.plural))}
				{sort}
			</h2>
		);
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
		return (
			<div className="ListHeader">
				<div className="container">
					{this.renderTitle()}
					<InputGroup contiguous={false} className="ListHeader__searchbar">
						{this.renderSearch()}
						<ListFiltersAdd isOpen={this.state.lastKeyPressed === 'F'} />
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
