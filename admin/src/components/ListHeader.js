var React = require('react');
var classNames = require('classnames');
var utils = require('keystone-utils');

var ListFilters = require('./ListFilters');
var ListFiltersAdd = require('./ListFiltersAdd');

var Button = require('elemental').Button;
var Dropdown = require('elemental').Dropdown;
var FormInput = require('elemental').FormInput;
var InputGroup = require('elemental').InputGroup;
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
		console.log('Sort selected: ', selected);
	},
	
	renderTitle: function() {
		return (
			<h2 className="ListHeader__title">7287 Events <span className="text-muted">sorted by name</span></h2>
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
	renderPagination: function() {
		return (
			<div className="ListHeader__pagination">
				<div className="count">Showing 1 to 50 of 933</div>
				<ul className="Pagination"><li className="active"><a href="/keystone/listings/1">1</a></li><li><a href="/keystone/listings/2">2</a></li><li><a href="/keystone/listings/3">3</a></li><li><a href="/keystone/listings/4">4</a></li><li><a href="/keystone/listings/5">5</a></li><li><a href="/keystone/listings/6">6</a></li><li><a href="/keystone/listings/7">7</a></li><li><a href="/keystone/listings/8">8</a></li><li><a href="/keystone/listings/9">9</a></li><li><a href="/keystone/listings/10">10</a></li><li><a href="/keystone/listings/19">...</a></li></ul>
			</div>
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
					{this.renderPagination()}
				</div>
			</div>
		);
	}
	
});

module.exports = ListHeader;