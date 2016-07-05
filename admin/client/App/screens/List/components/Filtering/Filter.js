import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import { Filters } from 'FieldTypes';
import { Pill } from 'elemental';

import Popout from '../../../../shared/Popout';
import { setFilter, clearFilter } from '../../actions';

const DATE_FORMAT = 'D MMM YYYY';
const DATETIME_FORMAT = 'D MMM YYYY h:mm:ss';

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
	getFilterLabel () {
		const { field, value } = this.props.filter;

		console.log('field', field);
		console.log('value', value);

		switch (field.type) {
			// BOOLEAN
			case 'boolean': {
				return value.value
					? field.label
					: `NOT ${field.label}`;
			}

			// DATE
			case 'date': {
				const joiner = value.inverted ? 'is NOT' : 'is';
				const mode = value.mode === 'on' ? '' : value.mode;
				const formattedValue = value.mode === 'between'
					? `${moment(value.after).format(DATE_FORMAT)} and ${moment(value.before).format(DATE_FORMAT)}`
					: moment(value.value).format(DATE_FORMAT);

				return `${field.label} ${joiner} ${mode} ${formattedValue}`;
			}

			// DATETIME
			case 'datetime': {
				const joiner = value.inverted ? 'is NOT' : 'is';
				const mode = value.mode === 'on' ? '' : value.mode;
				const formattedValue = value.mode === 'between'
					? `${moment(value.after).format(DATETIME_FORMAT)} and ${moment(value.before).format(DATETIME_FORMAT)}`
					: moment(value.value).format(DATETIME_FORMAT);

				return `${field.label} ${joiner} ${mode} ${formattedValue}`;
			}

			// LOCATION
			case 'location': {
				const joiner = value.inverted ? 'does NOT match' : 'matches';

				// Remove undefined values before rendering the template literal
				const formattedValue = [
					value.street,
					value.city,
					value.state,
					value.code,
					value.country,
				].join(' ').trim();

				return `${field.label} ${joiner} "${formattedValue}"`;
			}

			// NUMBER & MONEY
			case 'number':
			case 'money': {
				let mode;
				if (value.mode === 'equals') mode = 'is';
				else if (value.mode === 'gt') mode = 'is greater than';
				else if (value.mode === 'lt') mode = 'is less than';
				else if (value.mode === 'between') mode = '';
				const formattedValue = value.mode === 'between'
					? `is between ${value.value.min} and ${value.value.max}`
					: value.value;

				return `${field.label} ${mode} ${formattedValue}`;
			}

			// RELATIONSHIP
			// TODO populate relationship
			case 'relationship': {
				let joiner = value.inverted ? 'is NOT' : 'is';
				let formattedValue = (value.value.length > 1)
					? value.value.join(', or ')
					: value.value[0];

				return `${field.label} ${joiner} ${formattedValue}`;
			}

			// SELECT
			case 'select': {
				let joiner = value.inverted ? 'is NOT' : 'is';
				let formattedValue = (value.value.length > 1)
					? value.value.join(', or ')
					: value.value[0];

				return `${field.label} ${joiner} ${formattedValue}`;
			}

			// TEXT
			// Code, Color, Email, HTML, Key, Markdown, Name, Textarea, Url
			default: {
				let mode = '';
				if (value.mode && value.mode === 'beginsWith') {
					mode = value.inverted
						? 'does NOT begin with'
						: 'begins with';
				} else if (value.mode && value.mode === 'endsWith') {
					mode = value.inverted
						? 'does NOT end with'
						: 'ends with';
				} else if (value.mode && value.mode === 'exactly') {
					mode = value.inverted
						? 'is NOT exactly'
						: 'is exactly';
				} else if (value.mode && value.mode === 'contains') {
					mode = value.inverted
						? 'does NOT contain'
						: 'contains';
				}

				return `${field.label} ${mode} "${value.value}"`;
			}
		}
	}
	render () {
		const { filter } = this.props;
		const filterId = `activeFilter__${filter.field.path}`;
		const FilterComponent = Filters[filter.field.type];

		return (
			<span>
				<Pill
					label={this.getFilterLabel()}
					onClick={this.open}
					onClear={this.removeFilter}
					type="primary"
					id={filterId}
					showClearButton
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
