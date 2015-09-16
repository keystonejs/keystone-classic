var React = require('react');
var classNames = require('classnames');

var CurrentListStore = require('../stores/CurrentListStore');

var Popout = require('./Popout');
var { Pill } = require('elemental');

var Filter = React.createClass({
	propTypes: {
		filter: React.PropTypes.object
	},
	getInitialState () {
		return {
			isOpen: false
		}
	},
	open () {
		this.setState({
			isOpen: true
		});
	},
	close () {
		this.setState({
			isOpen: false
		});
	},
	updateFilter (e) {
		console.log('UPDATING FILTER');
		this.close();
		e.preventDefault();
	},
	removeFilter () {
		CurrentListStore.removeFilter(this.props.filter);
	},
	render () {
		let { filter } = this.props;
		let filterId = 'activeFilter__' + filter.field.path;
		return (
			<span>
				<Pill label={filter.field.label} onClick={this.open} onClear={this.removeFilter} type="primary" id={filterId} showClearButton />
				<Popout isOpen={this.state.isOpen} onCancel={this.close} relativeToID={filterId}>
					<form onSubmit={this.updateFilter}>
						<Popout.Header title="Edit Filter" />
						<Popout.Body>
							Filter form goes here
						</Popout.Body>
						<Popout.Footer
							ref="footer"
							primaryButtonIsSubmit
							primaryButtonLabel="Apply"
							secondaryButtonAction={this.close}
							secondaryButtonLabel="Cancel" />
					</form>
				</Popout>
			</span>
		);
	}
});

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
	clearAllFilters () {
		// TODO
	},
	render () {
		if (!this.state.filters.length) return <div />;

		var currentFilters = this.state.filters.map((filter, i) => {
			return (
				<Filter key={'f' + i} filter={filter} />
			);
		});

		// append the clear button
		if (currentFilters.length > 1) {
			currentFilters.push(<Pill key="listFilters__clear" label="Clear All" onClick={this.clearAllFilters} />);
		}
		return (
			<div className="ListFilters mb-2">
				{currentFilters}
			</div>
		);
	}
});

module.exports = ListFilters;
