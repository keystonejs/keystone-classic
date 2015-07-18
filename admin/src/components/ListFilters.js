var React = require('react');
var classNames = require('classnames');

var ListFiltersAdd = require('./ListFiltersAdd');

var { Pill } = require('elemental');

var ListFilters = React.createClass({
	
	displayName: 'ListFilters',

	handleFilterClick: function(filter) {
		return console.log('clicked:', filter);
	},
	handleFilterClear: function(filter) {
		return console.log('cleared:', filter);
	},
	
	render: function() {
		var self = this;

		var currentFilters = this.props.filters.map(function(filter, i) {
			return (
				<Pill key={filter} label={filter} onClick={self.handleFilterClick.bind(self, filter)} onClear={self.handleFilterClear.bind(self, filter)} type="primary" showClearButton />
			);
		});

		// append the clear button
		if (currentFilters.length > 1) {
			currentFilters.push(<Pill key="listFilters__clear" label="Clear All" onClick={self.handleFilterClick.bind(self, 'Clear All')} />);
		}
		return (
			<div className="ListFilters mb-2">
				{currentFilters}
			</div>
		);
	}
	
});

module.exports = ListFilters;