var React = require('react');
var classNames = require('classnames');

var CurrentListStore = require('../stores/CurrentListStore');

var { Pill } = require('elemental');

var ListFilters = React.createClass({
	getInitialState () {
		return this.getStateFromStore();
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
		return {
			filters: CurrentListStore.getActiveFilters()
		};
	},
	handleFilterClick (filter) {
		return console.log('clicked:', filter);
	},
	handleFilterClear (filter) {
		CurrentListStore.removeFilter(filter);
	},
	render () {
		if (!this.state.filters.length) return <div />;

		var currentFilters = this.state.filters.map((filter, i) => {
			return (
				<Pill key={'f' + i} label={filter.field.label} onClick={this.handleFilterClick.bind(this, filter)} onClear={this.handleFilterClear.bind(this, filter)} type="primary" showClearButton />
			);
		});

		// append the clear button
		if (currentFilters.length > 1) {
			currentFilters.push(<Pill key="listFilters__clear" label="Clear All" onClick={this.handleFilterClick.bind(this, 'Clear All')} />);
		}
		return (
			<div className="ListFilters mb-2">
				{currentFilters}
			</div>
		);
	}
});

module.exports = ListFilters;
