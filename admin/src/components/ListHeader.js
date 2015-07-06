var React = require('react');
var classNames = require('classnames');
var utils = require('../utils.js');

var ListFilters = require('./ListFilters');
var ListFiltersAdd = require('./ListFiltersAdd');

var Button = require('elemental').Button;
var Dropdown = require('elemental').Dropdown;
var FormInput = require('elemental').FormInput;
var InputGroup = require('elemental').InputGroup;
var Pagination = require('elemental').Pagination;
var Tag = require('elemental').Tag;

const CURRENT_FILTERS = [
	'Created Date between 21/08/2014 and 21/09/2014',
	'Email contains "@gmail"',
	'Is NOT Admin'
];

const COLUMNS = Keystone.list.uiElements.map(function(col,i) {
	return {
		type:  col.type === 'heading' ? 'header' : 'item',
		label: col.type === 'heading' ? col.content : utils.titlecase(col.field)
	}
});

var ListHeader = React.createClass({
	
	displayName: 'ListHeader',
	
	getInitialState: function() {
		return {
			searchString: ''
		};
	},
	componentDidMount: function() {
		console.log('Items:', Keystone.items);
		console.log('List:',  Keystone.list);
		console.log('Sort:',  Keystone.sort);
	},
	
	handleSearch: function(e) {
		this.setState({
			searchString: e.target.value
		});
	},
	handleSearchClear: function(e) {
		this.setState({
			searchString: ''
		});
		React.findDOMNode(this.refs.listSearchInput).focus();
	},
	handleFilterSelect: function(selected) {
		console.log('Filter selected: ', selected);
	},
	handleColumnSelect: function(selected) {
		console.log('Column selected: ', selected);
	},
	handleSortSelect: function(selected) {
		console.log('Sort selected: ', utils.camelcase(selected));
	},
	handlePageSelect: function(selected) {
		var pagination = Keystone.items;
		var page = selected.target.innerText;

		// TODO: fix me
		if (page === '...') {
			page = (pagination.next ? pagination.totalPages : 1);
		}

		location.href = '/keystone/' + Keystone.list.path + '/' + page;
	},
	
	renderTitle: function() {
		var sort = Keystone.sort ? <span className="text-muted"> sorted by {Keystone.sort}</span> : null;
		return (
			<h2 className="ListHeader__title">
				{utils.plural(Keystone.items.total, ('* ' + Keystone.list.singular), ('* ' + Keystone.list.plural))} 
				{sort}
			</h2>
		);
	},
	renderRecentFilters: function() {
		return (
			<InputGroup.Section>
				<Dropdown items={[{ label: 'Listing state matches "published"' },{ label: 'Email matches "gmail"' }]}>
					<Button title="Recent Filters">
						<span className="octicon octicon-clock" />
						<span className="disclosure-arrow" />
					</Button>
				</Dropdown>
			</InputGroup.Section>
		);
	},
	renderSearch: function() {
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
	renderColumnsButton: function() {
		return (
			<InputGroup.Section>
				<Dropdown alignRight items={COLUMNS} onSelect={this.handleColumnSelect}>
					<Button>
						Columns
						<span className="disclosure-arrow" />
					</Button>
				</Dropdown>
			</InputGroup.Section>
		);
	},
	renderSortButton: function() {
		return (
			<InputGroup.Section>
				<Dropdown alignRight items={COLUMNS} onSelect={this.handleSortSelect}>
					<Button>
						Sort
						<span className="disclosure-arrow" />
					</Button>
				</Dropdown>
			</InputGroup.Section>
		);
	},
	
	render: function() {
		return (
			<div className="ListHeader">
				<div className="container">
					{this.renderTitle()}
					<InputGroup contiguous={false} className="ListHeader__searchbar">
						{this.renderRecentFilters()}
						{this.renderSearch()}
						<ListFiltersAdd key="listFilters__add" />
						{this.renderColumnsButton()}
						{this.renderSortButton()}
					</InputGroup>
					<ListFilters filters={CURRENT_FILTERS} />
					<Pagination pagination={Keystone.items} onClick={this.handlePageSelect} className="ListHeader__pagination" />
				</div>
			</div>
		);
	}
	
});

module.exports = ListHeader;
