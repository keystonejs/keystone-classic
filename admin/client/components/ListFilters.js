import React from 'react';
import filterComponents from '../filters';
import CurrentListStore from '../stores/CurrentListStore';
import Popout from './Popout';
import { Pill } from 'elemental';

const Filter = React.createClass({
	propTypes: {
		filter: React.PropTypes.object.isRequired,
	},
	getInitialState () {
		return {
			isOpen: false,
		};
	},
	open () {
		this.setState({
			isOpen: true,
			filterValue: this.props.filter.value,
		});
	},
	close () {
		this.setState({
			isOpen: false,
		});
	},
	updateValue (filterValue) {
		this.setState({
			filterValue: filterValue,
		});
	},
	updateFilter (e) {
		CurrentListStore.setFilter(this.props.filter.field.path, this.state.filterValue);
		this.close();
		e.preventDefault();
	},
	removeFilter () {
		CurrentListStore.clearFilter(this.props.filter.field.path);
	},
	render () {
		let { filter } = this.props;
		let filterId = `activeFilter__${filter.field.path}`;
		let FilterComponent = filterComponents[filter.field.type];
		return (
			<span>
				<Pill label={filter.field.label} onClick={this.open} onClear={this.removeFilter} type="primary" id={filterId} showClearButton />
				<Popout isOpen={this.state.isOpen} onCancel={this.close} relativeToID={filterId}>
					<form onSubmit={this.updateFilter}>
						<Popout.Header title="Edit Filter" />
						<Popout.Body>
							<FilterComponent field={filter.field} filter={this.state.filterValue} onChange={this.updateValue} />
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
	},
});

const ListFilters = React.createClass({
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
		let filters = CurrentListStore.getActiveFilters();
		return { filters };
	},
	clearAllFilters () {
		CurrentListStore.clearAllFilters();
	},
	render () {
		if (!this.state.filters.length) return <div />;

		let currentFilters = this.state.filters.map((filter, i) => {
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
	},
});

module.exports = ListFilters;
