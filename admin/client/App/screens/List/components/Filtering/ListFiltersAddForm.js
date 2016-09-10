import React from 'react';
import { findDOMNode } from 'react-dom';
import Popout from '../../../../shared/Popout';

import { Filters } from 'FieldTypes';

var ListFiltersAddForm = React.createClass({
	propTypes: {
		field: React.PropTypes.object.isRequired,
		maxHeight: React.PropTypes.number,
		onApply: React.PropTypes.func,
		onCancel: React.PropTypes.func,
		onHeightChange: React.PropTypes.func,
	},
	getInitialState () {
		const filterComponent = Filters[this.props.field.type];
		let filterValue = this.props.activeFilters.filter(i => i.field.path === this.props.field.path)[0];
		if (filterValue) {
			filterValue = filterValue.value;
		} else {
			filterValue = filterComponent && filterComponent.getDefaultValue ? filterComponent.getDefaultValue() : {};
		}
		return {
			filterComponent: filterComponent,
			filterValue: filterValue,
		};
	},
	updateHeight (bodyHeight) {
		bodyHeight += 40; // TODO: remove magic number, currently accounts for padding
		const footerHeight = findDOMNode(this.refs.footer).offsetHeight;
		const maxBodyHeight = this.props.maxHeight - footerHeight;
		const newHeight = bodyHeight + footerHeight;
		// console.log(bodyHeight, maxBodyHeight, '|', newHeight, this.props.maxHeight);
		this.setState({
			bodyHeight: Math.min(bodyHeight, maxBodyHeight),
		}, () => {
			this.props.onHeightChange(Math.min(newHeight, this.props.maxHeight));
		});
	},
	updateValue (filterValue) {
		this.setState({
			filterValue: filterValue,
		});
	},
	handleFormSubmit (e) {
		e.preventDefault();
		this.props.onApply(this.state.filterValue);
	},
	renderInvalidFilter () {
		return (
			<div>Error: type {this.props.field.type} has no filter UI.</div>
		);
	},
	render () {
		var FilterComponent = this.state.filterComponent;
		return (
			<form onSubmit={this.handleFormSubmit}>
				<Popout.Body ref="body" scrollable style={{ height: this.state.bodyHeight }}>
					{FilterComponent ? <FilterComponent field={this.props.field} filter={this.state.filterValue} onChange={this.updateValue} onHeightChange={this.updateHeight} /> : this.renderInvalidFilter()}
				</Popout.Body>
				<Popout.Footer
					ref="footer"
					primaryButtonIsSubmit
					primaryButtonLabel="Apply"
					secondaryButtonAction={this.props.onCancel}
					secondaryButtonLabel="Cancel" />
			</form>
		);
	},
});

module.exports = ListFiltersAddForm;
