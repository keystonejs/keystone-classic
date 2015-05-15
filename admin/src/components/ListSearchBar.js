var React = require('react');

var Button = require('elemental').Button;
var Dropdown = require('elemental').Dropdown;
var FormInput = require('elemental').FormInput;
var InputGroup = require('elemental').InputGroup;

const CURRENT_FILTERS = [
	'Created Date between 21/08/2014 and 21/09/2014',
	'Email contains "@gmail"',
	'Is NOT Admin',
	'School: Surry Hills Primary School'
];

const SORT_OPTIONS = [
	{ label: 'Name' },
	{ label: 'Listing Type' },
	{ label: 'Place' },
	{ label: 'Listing State' },
	{ label: 'Created At' }
];

var ListSearchBar = React.createClass({
	
	displayName: 'ListSearchBar',
	
	getInitialState: function() {
		return {
			something: false
		};
	},
	
	renderPagination: function() {
		return (
			<div className="ListFilter-pagination-bar clearfix">
				<div className="list-pagination pull-left">
					<div className="count">Showing 1 to 50 of 933</div>
					<ul className="pagination"><li className="active"><a href="/keystone/listings/1">1</a></li><li><a href="/keystone/listings/2">2</a></li><li><a href="/keystone/listings/3">3</a></li><li><a href="/keystone/listings/4">4</a></li><li><a href="/keystone/listings/5">5</a></li><li><a href="/keystone/listings/6">6</a></li><li><a href="/keystone/listings/7">7</a></li><li><a href="/keystone/listings/8">8</a></li><li><a href="/keystone/listings/9">9</a></li><li><a href="/keystone/listings/10">10</a></li><li><a href="/keystone/listings/19">...</a></li></ul>
				</div>
			</div>
		);
	},
	
	renderFilters: function() {
		var currentFilters = CURRENT_FILTERS.map(function(filter, i) {
			return (
				<div className="list-filter">
					<span className="list-filter__label">{filter}</span>
					<span className="list-filter__close">&times;</span>
				</div>
			);
		});
		return (
			<div className="ListFilter-filters mb-1">
				{currentFilters}
			</div>
		);
	},
	
	render: function() {
		return (
			<div className="ListFilter">
				<div className="container">
					<h2 className="ListFilter__header">7287 Events sorted by name</h2>
					<InputGroup contiguous={false}>
						<InputGroup.Section>
							<Dropdown items={[{ label: 'Listing state matches "published"' },{ label: 'Email matches "gmail"' }]}>
								<Button title="Recent Filters">
									<span className="octicon octicon-clock" />
								</Button>
							</Dropdown>
						</InputGroup.Section>
						<InputGroup.Section grow>
							<FormInput placeholder="Search" />
						</InputGroup.Section>
						<InputGroup.Section>
							<Button type="primary">
								<span className="octicon octicon-settings" />
								<span className="hidden-xs">Add Filter</span>
							</Button>
						</InputGroup.Section>
						<InputGroup.Section>
							<Button>
								<span className="octicon octicon-mirror" />
								<span className="hidden-xs">Columns</span>
							</Button>
						</InputGroup.Section>
						<InputGroup.Section>
							<Dropdown alignRight items={SORT_OPTIONS}>
								<Button>
									<span className="octicon octicon-list-ordered" />
									<span className="hidden-xs">Sort</span>
								</Button>
							</Dropdown>
						</InputGroup.Section>
					</InputGroup>
					{this.renderFilters()}
					{this.renderPagination()}
				</div>
			</div>
		);
	}
	
});

module.exports = ListSearchBar;