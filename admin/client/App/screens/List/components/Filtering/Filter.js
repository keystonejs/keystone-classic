import React, { Component, PropTypes } from 'react';
import { Filters } from 'FieldTypes';
import { Chip } from '../../../../elemental';

import Popout from '../../../../shared/Popout';
import { setFilter, clearFilter } from '../../actions';
import getFilterLabel from './getFilterLabel';

class Filter extends Component {
	constructor () {
		super();

		this.open = this.open.bind(this);
		this.close = this.close.bind(this);
		this.updateValue = this.updateValue.bind(this);
		this.updateFilter = this.updateFilter.bind(this);
		this.removeFilter = this.removeFilter.bind(this);

		this.state = {
			isOpen: false,
		};
	}
	open () {
		this.setState({
			isOpen: true,
			filterValue: this.props.filter.value,
		});
	}
	close () {
		this.setState({
			isOpen: false,
		});
	}
	updateValue (filterValue) {
		this.setState({
			filterValue: filterValue,
		});
	}
	updateFilter (e) {
		const { dispatch, filter } = this.props;
		dispatch(setFilter(filter.field.path, this.state.filterValue));
		this.close();
		e.preventDefault();
	}
	removeFilter () {
		this.props.dispatch(clearFilter(this.props.filter.field.path));
	}
	render () {
		const { filter } = this.props;
		const filterId = `activeFilter__${filter.field.path}`;
		const FilterComponent = Filters[filter.field.type];

		return (
			<span>
				<Chip
					label={getFilterLabel(filter.field, filter.value)}
					onClick={this.open}
					onClear={this.removeFilter}
					color="primary"
					id={filterId}
				/>
				<Popout isOpen={this.state.isOpen} onCancel={this.close} relativeToID={filterId}>
					<form onSubmit={this.updateFilter}>
						<Popout.Header title="Edit Filter" />
						<Popout.Body>
							<FilterComponent
								field={filter.field}
								filter={this.state.filterValue}
								onChange={this.updateValue}
							/>
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
};

Filter.propTypes = {
	dispatch: PropTypes.func.isRequired,
	filter: PropTypes.shape({
		field: PropTypes.object.isRequired,
		value: PropTypes.object.isRequired,
	}).isRequired,
};

module.exports = Filter;
