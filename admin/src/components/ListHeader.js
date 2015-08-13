var classNames = require('classnames');
var React = require('react');
var utils = require('../utils.js');

var CurrentListStore = require('../stores/CurrentListStore');

var CreateForm = require('./CreateForm');
var ListFilters = require('./ListFilters');
var ListFiltersAdd = require('./ListFiltersAdd');
var ListColumnsForm = require('./ListColumnsForm');
var ListDownloadForm = require('./ListDownloadForm');

var { Button, Dropdown, FormInput, InputGroup, Pagination } = require('elemental');

var ListHeader = React.createClass({

	displayName: 'ListHeader',

	getInitialState () {
		return {
			createIsOpen: Keystone.showCreateForm,
			searchString: ''
		};
	},
	
	toggleCreateModal (visible) {
		this.setState({
			createIsOpen: visible
		});
	},

	handleSearch (e) {
		this.setState({
			searchString: e.target.value
		});
	},

	handleSearchClear (e) {
		this.setState({
			searchString: ''
		});
		React.findDOMNode(this.refs.listSearchInput).focus();
	},

	handleFilterSelect (selected) {
		console.log('Filter selected: ', selected);
	},

	handleColumnSelect (selected) {
		console.log('Column selected: ', selected);
	},

	handleSortSelect (selected) {
		console.log('Sort selected: ', utils.camelcase(selected));
	},

	handlePageSelect (selected) {
		var pagination = Keystone.items;
		var page = selected.target.innerText;

		// TODO: fix me
		if (page === '...') {
			page = (pagination.next ? pagination.totalPages : 1);
		}

		location.href = '/keystone/' + Keystone.list.path + '/' + page;
	},
	
	toggleDownloadModal (visible) {
		this.setState({
			downloadIsOpen: visible
		});
	},

	renderTitle () {
		var sort = Keystone.sort ? (
			<span className="text-muted"> sorted by <a href="javascript:;">{Keystone.sort}</a></span>
		) : null;
		return (
			<h2 className="ListHeader__title">
				{utils.plural(Keystone.items.total, ('* ' + Keystone.list.singular), ('* ' + Keystone.list.plural))}
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
				<FormInput ref="listSearchInput" value={this.state.searchString} onChange={this.handleSearch} placeholder="Search" className="ListHeader__searchbar-input" />
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
		if (Keystone.list.autocreate) {
			props.href = '?new' + Keystone.csrf.query;
		} else {
			props.onClick = this.toggleCreateModal.bind(this, true);
		}
		return (
			<InputGroup.Section style={{ borderLeft: '1px solid rgba(0,0,0,0.1)', marginLeft: '.75em', paddingLeft: '.75em' }}>
				<Button {...props}>
					<span className="octicon octicon-plus" />
					Create {Keystone.list.singular}
				</Button>
			</InputGroup.Section>
		);
	},
	
	renderCreateForm () {
		return <CreateForm list={Keystone.list} isOpen={this.state.createIsOpen} onCancel={this.toggleCreateModal.bind(this, false)} values={Keystone.createFormData} err={Keystone.createFormErrors} />;
	},

	render () {
		return (
			<div className="ListHeader">
				<div className="container">
					{this.renderTitle()}
					<InputGroup contiguous={false} className="ListHeader__searchbar">
						{this.renderSearch()}
						<ListFiltersAdd />
						<ListColumnsForm />
						<ListDownloadForm />
						{this.renderCreateButton()}
					</InputGroup>
					<ListFilters />
					<Pagination pagination={Keystone.items} onClick={this.handlePageSelect} className="ListHeader__pagination" />
				</div>
				{this.renderCreateForm()}
			</div>
		);
	}

});

module.exports = ListHeader;
